using Backend.Data;
using Backend.Interfaces;
using Backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly AppDbContext _context;

        public DashboardRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetTotalUsers()
        {
            return await _context.Users.CountAsync();
        }

        public async Task<int> GetTotalProducts()
        {
            return await _context.Products.CountAsync();
        }

        public async Task<List<CategoryProductCount>> GetProductsByCategory()
        {
            return await _context.Products
                .GroupBy(p => p.Category)
                .Select(g => new CategoryProductCount
                {
                    Category = g.Key.ToString(),
                    TotalProducts = g.Count()
                })
                .ToListAsync();
        }

        public async Task<int> GetTotalPurchases()
        {
            return await _context.Purchases.CountAsync();
        }

        public async Task<decimal> GetTotalRevenue()
        {
            return await _context.Purchases
                .Include(p => p.Product)
                .SumAsync(p => p.Quantity * p.Product.Price);
        }
    }
}