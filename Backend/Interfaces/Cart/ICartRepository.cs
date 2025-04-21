using Backend.Models;

public interface ICartRepository
{
    // Obtener el carrito de un usuario por su UserId
    Task<Cart?> GetCartByUserIdAsync(int? userId);

    // Crear el carrito
    Task CreateAsync(Cart cart);

    // Agregar un nuevo carrito
    Task AddAsync(Cart cart);

    // Actualizar un carrito
    Task UpdateAsync(Cart cart);

    // Eliminar un carrito por UserId
    Task DeleteByUserIdAsync(int? userId);
}
