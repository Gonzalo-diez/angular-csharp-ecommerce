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

        public async Task<IEnumerable<Purchase>> GetPurchasesByUserIdAsync(int? userId)
        {
            return await _purchaseRepository.GetByUserIdAsync(userId);
        }

        public async Task<Purchase> CreatePurchaseAsync(int? userId, Product product, int quantity)
        {
            var purchase = new Purchase
            {
                UserId = userId,
                ProductId = product.Id,
                Quantity = quantity
            };


            return await _purchaseRepository.CreateAsync(purchase);
        }

        public async Task<bool> DeletePurchaseAsync(int id)
        {
            return await _purchaseRepository.DeleteAsync(id);
        }
    }
}
