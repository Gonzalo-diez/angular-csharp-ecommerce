using Backend.Models;

namespace Backend.Interfaces
{
    public interface ICartService
    {
        Task<Cart?> GetCartByUserIdOrSessionIdAsync(int? userId, string? sessionId);
        Task<Cart> CreateCartAsync(Auth? user, string? sessionId);
        Task<Cart?> AddProductToCartAsync(int? userId, string? sessionId, int productId, int quantity);
        Task<Cart?> RemoveProductFromCartAsync(int? userId, string? sessionId, int productId);
        Task<Cart?> ClearCartAsync(int? userId, string? sessionId);
    }
}
