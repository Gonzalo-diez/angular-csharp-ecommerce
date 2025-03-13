using Backend.DTOs;

namespace Backend.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardDTO> GetDashboardData();
    }
}
