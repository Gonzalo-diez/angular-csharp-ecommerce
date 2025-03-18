using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

public class CartRepository : ICartRepository
{
    private readonly AppDbContext _context;

    public CartRepository(AppDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    // Obtener el carrito de un usuario por su UserId
    public async Task<Cart?> GetCartByUserIdAsync(int? userId)
    {
        if (userId.HasValue)
        {
            return await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

        return null;
    }


    public async Task CreateAsync(Cart cart)
    {
        await _context.Carts.AddAsync(cart);
        await _context.SaveChangesAsync();
    }

    // Agregar un nuevo carrito
    public async Task AddAsync(Cart cart)
    {
        await _context.Carts.AddAsync(cart);
        await _context.SaveChangesAsync();
    }

    // Actualizar un carrito
    public async Task UpdateAsync(Cart cart)
    {
        _context.Carts.Update(cart);
        await _context.SaveChangesAsync();
    }

    // Eliminar un carrito por UserId (opcional)
    public async Task DeleteByUserIdAsync(int? userId)
    {
        var cart = await _context.Carts.FirstOrDefaultAsync(c => userId != null && c.UserId == userId);
        if (cart != null)
        {
            _context.Carts.Remove(cart);
            await _context.SaveChangesAsync();
        }
    }
}
