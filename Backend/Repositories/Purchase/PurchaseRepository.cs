using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
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
                        .Where(p => userId != null && p.UserId == userId);
        }

        public async Task<IEnumerable<Purchase>> GetByUserIdAsync(int? userId)
        {
            return await _context.Purchases.Include(p => p.UserId == userId)
                .Include(p => p.Product)
                .ToListAsync();
        }

        public async Task<Purchase> CreateAsync(Purchase purchase)
        {
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
