using System.ComponentModel.DataAnnotations;

namespace RegistrationApp.Contracts.Auth;

public record ResetPasswordRequest(
    [Required, EmailAddress] string Email,
    [Required] string Token,
    [Required, MinLength(6)] string NewPassword);
