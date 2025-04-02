using Backend.DTOs;

namespace Backend.Interfaces
{
    public interface IDashboardRepository
    {
        Task<int> GetTotalUsers();
        Task<List<UserDTO>> GetUsers();
        Task<int> GetTotalProducts();
        Task<List<ProductDTO>> GetProducts();
        Task<List<CategoryProductCount>> GetProductsByCategory();
        Task<int> GetTotalPurchases();
        Task<decimal> GetTotalRevenue();
        Task<List<CategorySalesDTO>> GetSoldProductsByCategoryPercentage();
        Task<List<SubcategorySalesDTO>> GetSoldProductsBySubcategoryPercentage();
    }
}
