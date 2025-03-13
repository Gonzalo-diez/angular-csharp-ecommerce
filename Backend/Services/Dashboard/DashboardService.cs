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
                TotalProducts = await _repository.GetTotalProducts(),
                TotalPurchases = await _repository.GetTotalPurchases(),
                TotalRevenue = await _repository.GetTotalRevenue()
            };
        }
    }
}