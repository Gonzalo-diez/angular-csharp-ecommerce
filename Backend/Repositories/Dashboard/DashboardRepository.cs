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

        public async Task<List<UserDTO>> GetUsers()
        {
            return await _context.Users
                .Select(u => new UserDTO
                {
                    Id = u.Id,
                    Name = u.FirstName,
                    Email = u.Email
                })
                .ToListAsync();
        }

        public async Task<int> GetTotalProducts()
        {
            return await _context.Products.CountAsync();
        }

        public async Task<List<ProductDTO>> GetProducts()
        {
            return await _context.Products
                .Select(p => new ProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Category = p.Category.ToString(),
                    Price = p.Price
                })
                .ToListAsync();
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

        public async Task<List<CategorySalesDTO>> GetSoldProductsByCategoryPercentage()
        {
            var totalProductsInStock = await _context.Products.SumAsync(p => p.Stock); // Productos no vendidos
            var totalSold = await _context.Purchases.SumAsync(p => p.Quantity); // Productos vendidos
            var totalProducts = totalSold + totalProductsInStock; // Todos los productos

            if (totalProducts == 0) return new List<CategorySalesDTO>();

            return await _context.Purchases
                .Include(p => p.Product)
                .GroupBy(p => p.Product.Category)
                .Select(g => new CategorySalesDTO
                {
                    Category = g.Key.ToString(),
                    TotalSold = g.Sum(p => p.Quantity),
                    PercentageSold = Math.Round(g.Sum(p => p.Quantity) * 100m / totalProducts, 2)
                })
                .OrderByDescending(c => c.PercentageSold)
                .ToListAsync();
        }

        public async Task<List<SubcategorySalesDTO>> GetSoldProductsBySubcategoryPercentage()
        {
            var totalProductsInStock = await _context.Products.SumAsync(p => p.Stock);
            var totalSold = await _context.Purchases.SumAsync(p => p.Quantity);
            var totalProducts = totalSold + totalProductsInStock;

            if (totalProducts == 0) return new List<SubcategorySalesDTO>();

            return await _context.Purchases
                .Include(p => p.Product)
                .GroupBy(p => new { p.Product.Category, p.Product.SubCategory })
                .Select(g => new SubcategorySalesDTO
                {
                    Category = g.Key.Category.ToString(),
                    SubCategory = g.Key.SubCategory.ToString(),
                    TotalSold = g.Sum(p => p.Quantity),
                    PercentageSold = Math.Round(g.Sum(p => p.Quantity) * 100m / totalProducts, 2)
                })
                .OrderByDescending(c => c.PercentageSold)
                .ToListAsync();
        }
    }
}