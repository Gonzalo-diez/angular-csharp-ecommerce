using Backend.DTOs;

namespace Backend.Interfaces
{
    public interface IDashboardRepository
    {
        Task<int> GetTotalUsers();
        Task<int> GetTotalProducts();
        Task<List<CategoryProductCount>> GetProductsByCategory();
        Task<int> GetTotalPurchases();
        Task<decimal> GetTotalRevenue();
    }
}
