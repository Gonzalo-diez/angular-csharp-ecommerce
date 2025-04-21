using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<Auth?> GetUserByEmailAsync(string email);
        Task<Auth> CreateUserAsync(Auth user);
        Task<Auth?> GetUserByIdAsync(int id);
        Task<bool> LogOutUserAsync(int? userId);
        Task<Auth?> DeleteUserByIdAsync(int userId);
        Task UpdateAsync(Auth user);

    }
}
