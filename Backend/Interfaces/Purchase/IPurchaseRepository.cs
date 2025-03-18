using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IPurchaseRepository
    {
        Task<IEnumerable<Purchase>> GetAllAsync();
        Task<Purchase?> GetByIdAsync(int id);
        Task<IEnumerable<Purchase>> GetByUserIdAsync(int? userId);
        Task<Purchase> CreateAsync(Purchase purchase);
        Task<bool> DeleteAsync(int id);
    }
}
