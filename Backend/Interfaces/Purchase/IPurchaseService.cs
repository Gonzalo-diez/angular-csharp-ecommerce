using Backend.Models;

namespace Backend.Interfaces
{
    public interface IPurchaseService
    {
        Task<IEnumerable<Purchase>> GetAllPurchasesAsync();
        Task<Purchase?> GetPurchaseByIdAsync(int id);
        Task<IEnumerable<Purchase>> GetPurchasesByUserIdOrSessionIdAsync(int? userId, string? sessionId);
        Task<Purchase> CreatePurchaseAsync(int? userId, string? sessionId, Product product, int quantity);
        Task<bool> DeletePurchaseAsync(int id);
    }
}
