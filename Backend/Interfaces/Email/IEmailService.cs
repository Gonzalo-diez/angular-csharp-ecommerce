namespace Backend.Interfaces
{
    public interface IEmailService
    {
        Task SendEmail(string toEmail, string subject, string message);
    }
}