using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using RegistrationApp.Core.Common;
using RegistrationApp.Core.Interfaces;
using RegistrationApp.Infrastructure.Data;

namespace RegistrationApp.Infrastructure.Services;

public class PhotoService(AppDbContext dbContext, IConfiguration configuration) : IPhotoService
{
    private static readonly Error ProfileNotFound = new("Photo.ProfileNotFound", "Profile not found.");
    private static readonly Error InvalidFileType = new("Photo.InvalidType", "Only jpg, jpeg, png, webp files are allowed.");
    private static readonly Error FileTooLarge = new("Photo.TooLarge", "File size exceeds the maximum allowed (5 MB).");

    private static readonly HashSet<string> AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private static readonly HashSet<string> AllowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    public async Task<Result<string>> UploadPhotoAsync(string userId, IFormFile file, CancellationToken ct = default)
    {
        var maxSize = configuration.GetValue<long>("FileUpload:MaxFileSizeBytes", 5_242_880);
        if (file.Length > maxSize)
            return FileTooLarge;

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension) || !AllowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
            return InvalidFileType;

        var profile = await dbContext.UserProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId, ct)
            .ConfigureAwait(false);

        if (profile is null)
            return ProfileNotFound;

        var uploadPath = configuration["FileUpload:UploadPath"] ?? "wwwroot/uploads/photos";
        Directory.CreateDirectory(uploadPath);

        // Delete old photo if exists
        if (!string.IsNullOrEmpty(profile.PhotoUrl))
        {
            try
            {
                var oldPath = Path.Combine("wwwroot", profile.PhotoUrl.TrimStart('/'));
                if (File.Exists(oldPath))
                    File.Delete(oldPath);
            }
            catch (IOException) { /* best effort cleanup */ }
        }

        var fileName = $"{userId}_{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadPath, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream, ct).ConfigureAwait(false);

        var relativeUrl = $"/uploads/photos/{fileName}";
        profile.PhotoUrl = relativeUrl;
        profile.UpdatedAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync(ct).ConfigureAwait(false);

        return relativeUrl;
    }
}
