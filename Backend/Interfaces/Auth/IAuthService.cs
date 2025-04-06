using Backend.Models;

namespace Backend.Interfaces
{
    public interface IAuthService
    {
        Task<Auth?> GetUserByIdAsync(int id);
        Task<string?> LoginAsync(string email, string password);
        Task<(Auth User, string Token)> RegisterAsync(Auth user, string password);
        Task<Auth?> GetCurrentUser();
        Task<bool> LogOutUserAsync(int? userId);
        Task<Auth?> DeleteUserByIdAsync(int userId);
    }
}
