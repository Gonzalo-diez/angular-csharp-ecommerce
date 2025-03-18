using Backend.Models;

namespace Backend.Interfaces
{
    public interface ICartService
    {
        Task<Cart?> GetCartByUserIdAsync(int? userId);
        Task<Cart> CreateCartAsync(Auth? user);
        Task<Cart?> AddProductToCartAsync(int? userId, int productId, int quantity);
        Task<Cart?> RemoveProductFromCartAsync(int? userId, int productId);
        Task<Cart?> ClearCartAsync(int? userId);
    }
}
