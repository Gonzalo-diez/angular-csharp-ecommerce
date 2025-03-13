using Backend.Models;

namespace Backend.Repositories.Interfaces
{
    public interface IBrowsingHistoryRepository
    {
        Task AddAsync(BrowsingHistory history);
        Task<List<BrowsingHistory>> GetByUserIdAsync(int userId);
        Task DeleteByUserIdAsync(int userId);
    }
}
