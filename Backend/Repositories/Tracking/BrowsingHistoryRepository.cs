using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class BrowsingHistoryRepository : IBrowsingHistoryRepository
    {
        private readonly AppDbContext _context;
        public BrowsingHistoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(BrowsingHistory history)
        {
            await _context.BrowsingHistories.AddAsync(history);
            await _context.SaveChangesAsync();
        }

        public async Task<List<BrowsingHistory>> GetByUserIdAsync(int userId)
        {
            return await _context.BrowsingHistories
                .Where(h => h.UserId == userId)
                .Include(h => h.Product)
                .OrderByDescending(h => h.DateTime)
                .ToListAsync();
        }

        public async Task DeleteByUserIdAsync(int userId)
        {
            var history = await _context.BrowsingHistories.Where(h => h.UserId == userId).ToListAsync();
            _context.BrowsingHistories.RemoveRange(history);
            await _context.SaveChangesAsync();
        }
    }
}
