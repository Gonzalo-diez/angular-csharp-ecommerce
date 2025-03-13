using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services
{
    public class BrowsingHistoryService : IBrowsingHistoryService
    {
        private readonly IBrowsingHistoryRepository _browsingHistoryRepository;

        public BrowsingHistoryService(IBrowsingHistoryRepository browsingHistoryRepository)
        {
            _browsingHistoryRepository = browsingHistoryRepository;
        }

        public async Task AddToHistoryAsync(int? userId, string? sessionId, int productId)
        {
            var history = new BrowsingHistory
            {
                UserId = userId,
                SessionId = sessionId,
                ProductId = productId,
                DateTime = DateTime.UtcNow
            };

            await _browsingHistoryRepository.AddAsync(history);
        }

        public async Task<List<BrowsingHistory>> GetUserHistoryAsync(int userId)
        {
            return await _browsingHistoryRepository.GetByUserIdAsync(userId);
        }

        public async Task ClearUserHistoryAsync(int userId)
        {
            await _browsingHistoryRepository.DeleteByUserIdAsync(userId);
        }
    }
}
