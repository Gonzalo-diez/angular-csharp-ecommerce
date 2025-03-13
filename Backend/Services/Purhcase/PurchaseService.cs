using Backend.Interfaces;
using Backend.Models;
using Backend.Repositories.Interfaces;

namespace Backend.Services
{
    public class PurchaseService : IPurchaseService
    {
        private readonly IPurchaseRepository _purchaseRepository;

        public PurchaseService(IPurchaseRepository purchaseRepository)
        {
            _purchaseRepository = purchaseRepository;
        }

        public async Task<IEnumerable<Purchase>> GetAllPurchasesAsync()
        {
            return await _purchaseRepository.GetAllAsync();
        }

        public async Task<Purchase?> GetPurchaseByIdAsync(int id)
        {
            return await _purchaseRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Purchase>> GetPurchasesByUserIdOrSessionIdAsync(int? userId, string? sessionId)
        {
            return await _purchaseRepository.GetByUserIdOrSessionIdAsync(userId, sessionId);
        }

        public async Task<Purchase> CreatePurchaseAsync(int? userId, string? sessionId, Product product, int quantity)
        {   
            var purchase = new Purchase
            {
                UserId = userId,
                SessionId = sessionId,
                ProductId = product.Id,
                Product = product,
                Quantity = quantity
            };

            return await _purchaseRepository.CreateAsync(purchase, sessionId);
        }

        public async Task<bool> DeletePurchaseAsync(int id)
        {
            return await _purchaseRepository.DeleteAsync(id);
        }
    }
}
