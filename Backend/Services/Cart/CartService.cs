using Backend.Interfaces;
using Backend.Models;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;

    public CartService(ICartRepository cartRepository, IProductRepository productRepository)
    {
        _cartRepository = cartRepository ?? throw new ArgumentNullException(nameof(cartRepository));
        _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
    }

    // Obtener el carrito de un usuario por su UserId
    public async Task<Cart?> GetCartByUserIdOrSessionIdAsync(int? userId, string? sessionId)
    {
        return await _cartRepository.GetCartByUserIdOrSessionIdAsync(userId, sessionId);
    }

    // Crear un carrito para un usuario si no tiene uno
    public async Task<Cart> CreateCartAsync(Auth? user, string? sessionId)
    {
        int? userId = user?.Id; // Si user es null, userId será null

        var existingCart = await _cartRepository.GetCartByUserIdOrSessionIdAsync(userId, sessionId);
        if (existingCart != null)
        {
            return existingCart; // Si ya tiene un carrito, lo devolvemos
        }

        Cart newCart;
        if (user != null)
        {
            newCart = new Cart(user);
        }
        else if (!string.IsNullOrEmpty(sessionId))
        {
            newCart = new Cart(sessionId);
        }
        else
        {
            throw new ArgumentException("Debe proporcionar un usuario o una sessionId.");
        }

        await _cartRepository.AddAsync(newCart);
        return newCart;
    }

    // Agregar un producto al carrito
    public async Task<Cart?> AddProductToCartAsync(int? userId, string? sessionId, int productId, int quantity)
    {
        var cart = await _cartRepository.GetCartByUserIdOrSessionIdAsync(userId, sessionId);

        // 🔴 SOLUCIÓN: Si el carrito no existe, crearlo correctamente
        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                SessionId = sessionId, // 🟢 Agregar sessionId cuando no hay userId
                Items = new List<CartItem>()
            };

            await _cartRepository.CreateAsync(cart);
        }

        var product = await _productRepository.GetProductById(productId);
        if (product == null)
        {
            throw new ArgumentException("El producto no existe.");
        }

        var existingCartItem = cart.Items.FirstOrDefault(ci => ci.ProductId == productId);
        if (existingCartItem != null)
        {
            existingCartItem.Quantity += quantity;
        }
        else
        {
            var newCartItem = new CartItem(cart, product, quantity);
            cart.Items.Add(newCartItem);
        }

        await _cartRepository.UpdateAsync(cart);
        return cart;
    }

    // Eliminar un producto del carrito
    public async Task<Cart?> RemoveProductFromCartAsync(int? userId, string? sessionId, int productId)
    {
        var cart = await _cartRepository.GetCartByUserIdOrSessionIdAsync(userId, sessionId);
        if (cart == null)
        {
            return null;
        }

        var cartItem = cart.Items.FirstOrDefault(ci => ci.ProductId == productId);
        if (cartItem != null)
        {
            cart.Items.Remove(cartItem);
            await _cartRepository.UpdateAsync(cart);
        }

        return cart;
    }

    // Vaciar el carrito completamente
    public async Task<Cart?> ClearCartAsync(int? userId, string? sessionId)
    {
        var cart = await _cartRepository.GetCartByUserIdOrSessionIdAsync(userId, sessionId);
        if (cart == null)
        {
            return null;
        }

        cart.Items.Clear();
        await _cartRepository.UpdateAsync(cart);
        return cart;
    }
}
