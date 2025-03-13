using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IPurchaseRepository
    {
        Task<IEnumerable<Purchase>> GetAllAsync();
        Task<Purchase?> GetByIdAsync(int id);
        Task<IEnumerable<Purchase>> GetByUserIdOrSessionIdAsync(int? userId, string? sessionId);
        Task<Purchase> CreateAsync(Purchase purchase, string? sessionId);
        Task<bool> DeleteAsync(int id);
    }
}
