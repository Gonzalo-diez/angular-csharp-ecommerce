using Backend.Models;

namespace Backend.Interfaces
{
    public interface IPurchaseService
    {
        Task<IEnumerable<Purchase>> GetAllPurchasesAsync();
        Task<Purchase?> GetPurchaseByIdAsync(int id);
        Task<IEnumerable<Purchase>> GetPurchasesByUserIdAsync(int? userId);
        Task<Purchase> CreatePurchaseAsync(int? userId, Product product, int quantity);
        Task<bool> DeletePurchaseAsync(int id);
    }
}
