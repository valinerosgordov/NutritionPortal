using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RegistrationApp.Core.Entities;
using RegistrationApp.Core.Interfaces;
using RegistrationApp.Infrastructure.Data;
using RegistrationApp.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// EF Core + SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// ASP.NET Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// JWT Authentication
var jwtSection = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSection["Issuer"],
        ValidAudience = jwtSection["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSection["Secret"]!))
    };
});

// DI Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddScoped<IEmailService, SmtpEmailService>();

// CORS
var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
    ?? ["http://localhost:5173"];
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// Seed roles and admin
await SeedDataAsync(app.Services);

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "RegistrationApp API"));
}

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();
app.MapControllers();

app.Run();

static async Task SeedDataAsync(IServiceProvider services)
{
    using var scope = services.CreateScope();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

    await dbContext.Database.MigrateAsync();

    string[] roles = ["User", "Admin"];
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }

    var adminEmail = configuration["AdminSeed:Email"] ?? "admin@admin.com";
    var adminPassword = configuration["AdminSeed:Password"] ?? "Admin123!";

    if (await userManager.FindByEmailAsync(adminEmail) is null)
    {
        var admin = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            EmailConfirmed = true,
            CreatedAt = DateTime.UtcNow
        };

        var result = await userManager.CreateAsync(admin, adminPassword);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(admin, "Admin");

            dbContext.UserProfiles.Add(new UserProfile
            {
                Id = Guid.NewGuid(),
                UserId = admin.Id,
                FirstName = "Admin",
                LastName = "Admin"
            });
            await dbContext.SaveChangesAsync();
        }
    }

    // Seed demo nutritionists
    await SeedDemoSpecialistsAsync(userManager, dbContext);

    // One-time fix: clear broken seed PhotoUrl paths that reference non-existent files
    var brokenProfiles = await dbContext.UserProfiles
        .Where(p => p.PhotoUrl != null && p.PhotoUrl.StartsWith("/uploads/photos/seed_"))
        .ToListAsync();
    foreach (var p in brokenProfiles)
        p.PhotoUrl = null;
    if (brokenProfiles.Count > 0)
        await dbContext.SaveChangesAsync();
}

static async Task SeedDemoSpecialistsAsync(UserManager<ApplicationUser> userManager, AppDbContext dbContext)
{
    var specialists = new[]
    {
        new
        {
            Email = "ivanova@demo.ru", Password = "Demo1234",
            FirstName = "Елена", LastName = "Иванова", MiddleName = "Сергеевна",
            Phone = "+7 (916) 123-45-67",
            DateOfBirth = new DateOnly(1985, 3, 15),
            Address = "г. Москва, ул. Тверская, д. 12",
            Education = "Нутрициология, диетология",
            Workplace = "Клиника здорового питания «НутриЛайф»",
            PhotoUrl = (string?)null,
            Bio = "Сертифицированный нутрициолог с 12-летним стажем. Специализируюсь на коррекции пищевого поведения, составлении индивидуальных рационов и работе с метаболическим синдромом.",
            Educations = new[]
            {
                new { Institution = "Первый МГМУ им. И.М. Сеченова", Specialty = "Лечебное дело", Year = 2008 },
                new { Institution = "Российская академия народного хозяйства", Specialty = "Нутрициология и диетология", Year = 2010 },
            }
        },
        new
        {
            Email = "petrov@demo.ru", Password = "Demo1234",
            FirstName = "Андрей", LastName = "Петров", MiddleName = "Викторович",
            Phone = "+7 (926) 234-56-78",
            DateOfBirth = new DateOnly(1990, 7, 22),
            Address = "г. Санкт-Петербург, Невский пр-т, д. 45",
            Education = "Спортивная нутрициология",
            Workplace = "Центр спортивной медицины «Олимп»",
            PhotoUrl = (string?)null,
            Bio = "Спортивный нутрициолог, работаю с профессиональными атлетами и любителями фитнеса. Помогаю оптимизировать питание для максимальных результатов в спорте.",
            Educations = new[]
            {
                new { Institution = "НГУ им. Лесгафта", Specialty = "Спортивная медицина", Year = 2013 },
                new { Institution = "FPA (Fitness Professionals Association)", Specialty = "Спортивная нутрициология", Year = 2015 },
            }
        },
        new
        {
            Email = "sokolova@demo.ru", Password = "Demo1234",
            FirstName = "Мария", LastName = "Соколова", MiddleName = "Александровна",
            Phone = "+7 (905) 345-67-89",
            DateOfBirth = new DateOnly(1988, 11, 3),
            Address = "г. Казань, ул. Баумана, д. 78",
            Education = "Клиническая нутрициология",
            Workplace = "Медицинский центр «Здоровье+»",
            PhotoUrl = (string?)null,
            Bio = "Клинический нутрициолог. Работаю с пациентами с заболеваниями ЖКТ, аллергиями и аутоиммунными состояниями. Индивидуальный подход к каждому клиенту.",
            Educations = new[]
            {
                new { Institution = "Казанский государственный медицинский университет", Specialty = "Педиатрия", Year = 2011 },
                new { Institution = "Институт нутрициологии РАМН", Specialty = "Клиническая нутрициология", Year = 2014 },
            }
        },
        new
        {
            Email = "kuznetsov@demo.ru", Password = "Demo1234",
            FirstName = "Дмитрий", LastName = "Кузнецов", MiddleName = "Олегович",
            Phone = "+7 (917) 456-78-90",
            DateOfBirth = new DateOnly(1982, 5, 28),
            Address = "г. Новосибирск, Красный пр-т, д. 100",
            Education = "Превентивная медицина, нутрициология",
            Workplace = "Институт превентивной медицины",
            PhotoUrl = (string?)null,
            Bio = "Врач-нутрициолог, кандидат медицинских наук. 15 лет практики в области превентивной медицины. Автор более 30 научных публикаций по нутрициологии.",
            Educations = new[]
            {
                new { Institution = "Новосибирский государственный медицинский университет", Specialty = "Терапия", Year = 2005 },
                new { Institution = "РУДН", Specialty = "Превентивная медицина и нутрициология", Year = 2008 },
                new { Institution = "НГМУ — аспирантура", Specialty = "Внутренние болезни (к.м.н.)", Year = 2012 },
            }
        },
        new
        {
            Email = "volkova@demo.ru", Password = "Demo1234",
            FirstName = "Анна", LastName = "Волкова", MiddleName = "Дмитриевна",
            Phone = "+7 (903) 567-89-01",
            DateOfBirth = new DateOnly(1993, 9, 10),
            Address = "г. Екатеринбург, ул. Ленина, д. 55",
            Education = "Нутрициология, фитнес-диетология",
            Workplace = "Онлайн-школа нутрициологии «Balance»",
            PhotoUrl = (string?)null,
            Bio = "Нутрициолог и wellness-коуч. Помогаю людям выстроить здоровые отношения с едой. Веду онлайн-программы по интуитивному питанию и нутритивной поддержке.",
            Educations = new[]
            {
                new { Institution = "УрФУ им. Б.Н. Ельцина", Specialty = "Биология", Year = 2015 },
                new { Institution = "Международный институт интегративной нутрициологии", Specialty = "Интегративная нутрициология", Year = 2018 },
            }
        },
    };

    var existingNumbers = await dbContext.UserProfiles
        .Select(p => p.MemberNumber).ToListAsync();
    var rng = Random.Shared;

    foreach (var spec in specialists)
    {
        if (await userManager.FindByEmailAsync(spec.Email) is not null)
            continue;

        var user = new ApplicationUser
        {
            UserName = spec.Email,
            Email = spec.Email,
            EmailConfirmed = true,
            CreatedAt = DateTime.UtcNow
        };

        var result = await userManager.CreateAsync(user, spec.Password);
        if (!result.Succeeded) continue;

        await userManager.AddToRoleAsync(user, "User");

        int memberNumber;
        do { memberNumber = rng.Next(10000, 100000); }
        while (existingNumbers.Contains(memberNumber));
        existingNumbers.Add(memberNumber);

        var profile = new UserProfile
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            MemberNumber = memberNumber,
            FirstName = spec.FirstName,
            LastName = spec.LastName,
            MiddleName = spec.MiddleName,
            Phone = spec.Phone,
            DateOfBirth = spec.DateOfBirth,
            Address = spec.Address,
            Education = spec.Education,
            Workplace = spec.Workplace,
            PhotoUrl = spec.PhotoUrl,
            Bio = spec.Bio,
            UpdatedAt = DateTime.UtcNow
        };

        dbContext.UserProfiles.Add(profile);
        await dbContext.SaveChangesAsync();

        foreach (var edu in spec.Educations)
        {
            dbContext.EducationEntries.Add(new EducationEntry
            {
                Id = Guid.NewGuid(),
                UserProfileId = profile.Id,
                InstitutionName = edu.Institution,
                Specialty = edu.Specialty,
                GraduationYear = edu.Year,
                CreatedAt = DateTime.UtcNow
            });
        }
        await dbContext.SaveChangesAsync();
    }
}
