using System.ComponentModel.DataAnnotations;

namespace RegistrationApp.Contracts.Auth;

public record ForgotPasswordRequest([Required, EmailAddress] string Email);
