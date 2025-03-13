using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Backend.Interfaces;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmail(string toEmail, string subject, string message)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("FakeCommerce", "noreply@fakecommerce.com"));
        email.To.Add(new MailboxAddress("", toEmail));
        email.Subject = subject;
        email.Body = new TextPart("plain") { Text = message };

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync("smtp.example.com", 587, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync("your-email@example.com", "your-password");
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}
