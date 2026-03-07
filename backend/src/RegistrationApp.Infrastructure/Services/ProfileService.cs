using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using RegistrationApp.Contracts.Profile;
using RegistrationApp.Core.Common;
using RegistrationApp.Core.Entities;
using RegistrationApp.Core.Interfaces;
using RegistrationApp.Infrastructure.Data;

namespace RegistrationApp.Infrastructure.Services;

public class ProfileService(AppDbContext dbContext) : IProfileService
{
    private static readonly Error ProfileNotFound = new("Profile.NotFound", "Profile not found.");
    private static readonly Error EducationNotFound = new("Education.NotFound", "Education entry not found.");
    private static readonly Error InvalidFileType = new("Diploma.InvalidType", "Only jpg, jpeg, png, webp, pdf files are allowed.");
    private static readonly Error FileTooLarge = new("Diploma.TooLarge", "File size exceeds 10 MB.");

    private static readonly HashSet<string> AllowedDiplomaExtensions = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];
    private static readonly HashSet<string> AllowedDiplomaMimeTypes =
        ["image/jpeg", "image/png", "image/webp", "application/pdf"];

    public async Task<Result<UserProfileDto>> GetProfileAsync(string userId, CancellationToken ct = default)
    {
        var profile = await dbContext.UserProfiles
            .Include(p => p.User)
            .Include(p => p.EducationEntries)
            .Include(p => p.Ratings)
            .FirstOrDefaultAsync(p => p.UserId == userId, ct)
            .ConfigureAwait(false);

        if (profile is null)
            return ProfileNotFound;

        return MapToDto(profile);
    }

    public async Task<Result<UserProfileDto>> UpdateProfileAsync(
        string userId, UpdateProfileRequest request, CancellationToken ct = default)
    {
        var profile = await dbContext.UserProfiles
            .Include(p => p.User)
            .Include(p => p.EducationEntries)
            .Include(p => p.Ratings)
            .FirstOrDefaultAsync(p => p.UserId == userId, ct)
            .ConfigureAwait(false);

        if (profile is null)
            return ProfileNotFound;

        profile.FirstName = request.FirstName;
        profile.LastName = request.LastName;
        profile.MiddleName = request.MiddleName;
        profile.Phone = request.Phone;
        profile.DateOfBirth = request.DateOfBirth;
        profile.Address = request.Address;
        profile.Education = request.Education;
        profile.Workplace = request.Workplace;
        profile.Bio = request.Bio;
        profile.UpdatedAt = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(ct).ConfigureAwait(false);

        return MapToDto(profile);
    }

    public async Task<Result<List<UserListItemDto>>> GetAllUsersAsync(CancellationToken ct = default)
    {
        var users = await dbContext.UserProfiles
            .Include(p => p.User)
            .Select(p => new UserListItemDto(
                p.UserId,
                p.MemberNumber,
                p.User.Email!,
                p.FirstName,
                p.LastName,
                p.User.CreatedAt))
            .ToListAsync(ct)
            .ConfigureAwait(false);

        return users;
    }

    public async Task<Result<UserProfileDto>> GetUserProfileByIdAsync(string userId, CancellationToken ct = default)
    {
        return await GetProfileAsync(userId, ct).ConfigureAwait(false);
    }

    public async Task<Result<EducationEntryDto>> AddEducationAsync(
        string userId, AddEducationRequest request, CancellationToken ct = default)
    {
        var profile = await dbContext.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId, ct)
            .ConfigureAwait(false);

        if (profile is null)
            return ProfileNotFound;

        var entry = new EducationEntry
        {
            Id = Guid.NewGuid(),
            UserProfileId = profile.Id,
            InstitutionName = request.InstitutionName,
            Specialty = request.Specialty,
            GraduationYear = request.GraduationYear,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.EducationEntries.Add(entry);
        await dbContext.SaveChangesAsync(ct).ConfigureAwait(false);

        return MapEducationDto(entry);
    }

    public async Task<Result<bool>> DeleteEducationAsync(
        string userId, Guid educationId, CancellationToken ct = default)
    {
        var profile = await dbContext.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId, ct)
            .ConfigureAwait(false);

        if (profile is null)
            return ProfileNotFound;

        var entry = await dbContext.EducationEntries
            .FirstOrDefaultAsync(e => e.Id == educationId && e.UserProfileId == profile.Id, ct)
            .ConfigureAwait(false);

        if (entry is null)
            return EducationNotFound;

        if (!string.IsNullOrEmpty(entry.DiplomaUrl))
        {
            try
            {
                var filePath = Path.Combine("wwwroot", entry.DiplomaUrl.TrimStart('/'));
                if (File.Exists(filePath))
                    File.Delete(filePath);
            }
            catch (IOException) { /* best effort cleanup */ }
        }

        dbContext.EducationEntries.Remove(entry);
        await dbContext.SaveChangesAsync(ct).ConfigureAwait(false);

        return true;
    }

    public async Task<Result<string>> UploadDiplomaAsync(
        string userId, Guid educationId, IFormFile file, CancellationToken ct = default)
    {
        if (file.Length > 10_485_760)
            return FileTooLarge;

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedDiplomaExtensions.Contains(extension) || !AllowedDiplomaMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
            return InvalidFileType;

        var profile = await dbContext.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId, ct)
            .ConfigureAwait(false);

        if (profile is null)
            return ProfileNotFound;

        var entry = await dbContext.EducationEntries
            .FirstOrDefaultAsync(e => e.Id == educationId && e.UserProfileId == profile.Id, ct)
            .ConfigureAwait(false);

        if (entry is null)
            return EducationNotFound;

        var uploadPath = "wwwroot/uploads/diplomas";
        Directory.CreateDirectory(uploadPath);

        if (!string.IsNullOrEmpty(entry.DiplomaUrl))
        {
            try
            {
                var oldPath = Path.Combine("wwwroot", entry.DiplomaUrl.TrimStart('/'));
                if (File.Exists(oldPath))
                    File.Delete(oldPath);
            }
            catch (IOException) { /* best effort cleanup */ }
        }

        var fileName = $"{userId}_{educationId}_{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadPath, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream, ct).ConfigureAwait(false);

        var relativeUrl = $"/uploads/diplomas/{fileName}";
        entry.DiplomaUrl = relativeUrl;
        await dbContext.SaveChangesAsync(ct).ConfigureAwait(false);

        return relativeUrl;
    }

    public async Task<Result<List<UserProfileDto>>> SearchSpecialistsAsync(
        string? query, CancellationToken ct = default)
    {
        // Require a search query — never return the full list
        if (string.IsNullOrWhiteSpace(query) || query.Trim().Length < 2)
            return new List<UserProfileDto>();

        // Load all profiles into memory first because SQLite's lower() does not handle Cyrillic.
        // Client-side filtering with StringComparison.OrdinalIgnoreCase works correctly for all Unicode.
        var allProfiles = await dbContext.UserProfiles
            .Include(p => p.User)
            .Include(p => p.EducationEntries)
            .Include(p => p.Ratings)
            .OrderBy(p => p.MemberNumber)
            .ToListAsync(ct)
            .ConfigureAwait(false);

        var q = query.Trim();
        var numericQuery = q.TrimStart('#');
        var isNumeric = int.TryParse(numericQuery, out var memberNum);

        allProfiles = allProfiles.Where(p =>
            (isNumeric && p.MemberNumber == memberNum) ||
            Contains(p.FirstName, q) ||
            Contains(p.LastName, q) ||
            Contains(p.MiddleName, q) ||
            Contains(p.Education, q) ||
            Contains(p.Workplace, q) ||
            Contains(p.User.Email, q))
            .ToList();

        return allProfiles.Take(50).Select(MapToDto).ToList();
    }

    private static bool Contains(string? source, string value) =>
        source is not null && source.Contains(value, StringComparison.OrdinalIgnoreCase);

    public async Task<Result<RatingDto>> AddRatingAsync(
        string specialistUserId, string reviewerUserId, AddRatingRequest request, CancellationToken ct = default)
    {
        var profile = await dbContext.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == specialistUserId, ct)
            .ConfigureAwait(false);

        if (profile is null)
            return ProfileNotFound;

        // Check if already rated
        var existing = await dbContext.Ratings
            .FirstOrDefaultAsync(r => r.UserProfileId == profile.Id && r.ReviewerUserId == reviewerUserId, ct)
            .ConfigureAwait(false);

        if (existing is not null)
        {
            existing.Score = request.Score;
            existing.Comment = request.Comment;
            existing.CreatedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync(ct).ConfigureAwait(false);
            return new RatingDto(existing.Id, existing.Score, existing.Comment, existing.CreatedAt);
        }

        var rating = new Rating
        {
            Id = Guid.NewGuid(),
            UserProfileId = profile.Id,
            ReviewerUserId = reviewerUserId,
            Score = request.Score,
            Comment = request.Comment,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Ratings.Add(rating);
        await dbContext.SaveChangesAsync(ct).ConfigureAwait(false);

        return new RatingDto(rating.Id, rating.Score, rating.Comment, rating.CreatedAt);
    }

    private static UserProfileDto MapToDto(UserProfile profile)
    {
        var ratings = profile.Ratings ?? [];
        var avg = ratings.Count > 0 ? Math.Round(ratings.Average(r => r.Score), 1) : 0;

        return new(
            profile.UserId,
            profile.MemberNumber,
            profile.User.Email!,
            profile.FirstName,
            profile.LastName,
            profile.MiddleName,
            profile.Phone,
            profile.DateOfBirth,
            profile.PhotoUrl,
            profile.Address,
            profile.Education,
            profile.Workplace,
            profile.Bio,
            profile.EducationEntries.Select(MapEducationDto).ToList(),
            avg,
            ratings.Count,
            ratings.Select(r => new RatingDto(r.Id, r.Score, r.Comment, r.CreatedAt)).ToList());
    }

    private static EducationEntryDto MapEducationDto(EducationEntry entry) =>
        new(entry.Id, entry.InstitutionName, entry.Specialty, entry.GraduationYear, entry.DiplomaUrl, entry.CreatedAt);
}
