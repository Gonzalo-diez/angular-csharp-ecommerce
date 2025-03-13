using Backend.Models;

public interface ICartRepository
{
    // Obtener el carrito de un usuario por su UserId
    Task<Cart?> GetCartByUserIdOrSessionIdAsync(int? userId, string? sessionId);

    Task CreateAsync(Cart cart);

    // Agregar un nuevo carrito
    Task AddAsync(Cart cart);

    // Actualizar un carrito
    Task UpdateAsync(Cart cart);

    // Eliminar un carrito por UserId
    Task DeleteByUserIdOrSessionIdAsync(int? userId, string? sessionId);
}
