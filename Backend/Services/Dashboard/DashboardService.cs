using Backend.DTOs;
using Backend.Interfaces;

namespace Backend.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _repository;

        public DashboardService(IDashboardRepository repository)
        {
            _repository = repository;
        }

        public async Task<DashboardDTO> GetDashboardData()
        {
            return new DashboardDTO
            {
                TotalUsers = await _repository.GetTotalUsers(),
                Users = await _repository.GetUsers(),
                TotalProducts = await _repository.GetTotalProducts(),
                Products = await _repository.GetProducts(),
                ProductsByCategory = await _repository.GetProductsByCategory(),
                TotalPurchases = await _repository.GetTotalPurchases(),
                TotalRevenue = await _repository.GetTotalRevenue(),
                CategorySales = await _repository.GetSoldProductsByCategoryPercentage(),
                SubcategorySales = await _repository.GetSoldProductsBySubcategoryPercentage()
            };
        }
    }
}