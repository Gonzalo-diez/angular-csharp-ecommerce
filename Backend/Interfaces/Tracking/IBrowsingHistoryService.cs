using Backend.Models;

namespace Backend.Services.Interfaces
{
    public interface IBrowsingHistoryService
    {
        Task AddToHistoryAsync(int? userId, int productId);
        Task<List<BrowsingHistory>> GetUserHistoryAsync(int userId);
        Task ClearUserHistoryAsync(int userId);
    }
}
