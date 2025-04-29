using Backend.Data;
using Backend.Models;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class PurchaseRepository : IPurchaseRepository
    {
        private readonly AppDbContext _context;

        public PurchaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Purchase>> GetAllAsync()
        {
            return await _context.Purchases
                .Include(p => p.User)
                .Include(p => p.Product)
                .ToListAsync();
        }

        public async Task<Purchase?> GetByIdAsync(int id)
        {
            return await _context.Purchases
                .Include(p => p.User)
                .Include(p => p.Product)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public IQueryable<Purchase> GetPurchases(int? userId)
        {
            return _context.Purchases
                .Where(p => !userId.HasValue || p.UserId == userId);
        }

        public async Task<IEnumerable<Purchase>> GetByUserIdAsync(int? userId)
        {
            return await _context.Purchases
                .Where(p => p.UserId == userId)
                .Include(p => p.User)
                .Include(p => p.Product)
                .ToListAsync();
        }

        public async Task<Purchase> CreateAsync(Purchase purchase)
        {
            var user = await _context.Users.FindAsync(purchase.UserId);
            if (user == null) throw new Exception("El usuario no existe.");

            var product = await _context.Products.FindAsync(purchase.ProductId);
            if (product == null) throw new Exception("El producto no existe.");

            if (product.Stock < purchase.Quantity)
                throw new Exception($"Stock insuficiente para {product.Name}. Disponible: {product.Stock}");

            _context.Purchases.Add(purchase);
            await _context.SaveChangesAsync();

            return purchase;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var purchase = await _context.Purchases.FindAsync(id);
            if (purchase == null) return false;

            _context.Purchases.Remove(purchase);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
