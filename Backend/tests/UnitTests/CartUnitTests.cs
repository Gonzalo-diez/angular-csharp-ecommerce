using Xunit;
using Moq;
using Backend.Interfaces;
using Backend.Models;
using Backend.Hubs;
using Microsoft.AspNetCore.SignalR;

public class CartUnitTests
{
    private readonly Mock<ICartRepository> _cartRepoMock;
    private readonly Mock<IProductRepository> _productRepoMock;
    private readonly Mock<IHubContext<CartHub>> _cartHubMock;
    private readonly CartService _cartService;

    public CartUnitTests()
    {
        _cartRepoMock = new Mock<ICartRepository>();
        _productRepoMock = new Mock<IProductRepository>();
        _cartHubMock = new Mock<IHubContext<CartHub>>();

        // Este mock es necesario para evitar null reference en los SendAsync
        var clientsMock = new Mock<IHubClients>();
        var clientProxyMock = new Mock<IClientProxy>();

        clientsMock.Setup(c => c.User(It.IsAny<string>())).Returns(clientProxyMock.Object);
        _cartHubMock.Setup(c => c.Clients).Returns(clientsMock.Object);

        _cartService = new CartService(_cartRepoMock.Object, _productRepoMock.Object, _cartHubMock.Object);
    }

    [Fact]
    public async Task GetCartByUserIdAsync_ReturnsCart_WhenExists()
    {
        // Arrange
        var cart = new Cart { UserId = 1 };
        _cartRepoMock.Setup(r => r.GetCartByUserIdAsync(1)).ReturnsAsync(cart);

        // Act
        var result = await _cartService.GetCartByUserIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result?.UserId);
    }

    [Fact]
    public async Task CreateCartAsync_CreatesCart_WhenNotExists()
    {
        // Arrange
        var user = new Auth { Id = 2 };
        _cartRepoMock.Setup(r => r.GetCartByUserIdAsync(user.Id)).ReturnsAsync((Cart?)null);
        _cartRepoMock.Setup(r => r.AddAsync(It.IsAny<Cart>())).Returns(Task.CompletedTask);

        // Act
        var result = await _cartService.CreateCartAsync(user);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(user.Id, result.UserId);
        _cartRepoMock.Verify(r => r.AddAsync(It.IsAny<Cart>()), Times.Once);
    }

    [Fact]
    public async Task AddProductToCartAsync_AddsProduct_WhenNotInCart()
    {
        // Arrange
        int userId = 1;
        int productId = 5;
        int quantity = 2;

        var cart = new Cart { UserId = userId, Items = new List<CartItem>() };
        var product = new Product { Id = productId, Name = "Test Product" };

        _cartRepoMock.Setup(r => r.GetCartByUserIdAsync(userId)).ReturnsAsync(cart);
        _productRepoMock.Setup(p => p.GetProductById(productId)).ReturnsAsync(product);
        _cartRepoMock.Setup(r => r.UpdateAsync(cart)).Returns(Task.CompletedTask);

        // Act
        var result = await _cartService.AddProductToCartAsync(userId, productId, quantity);

        // Assert
        Assert.Single(result!.Items);
        Assert.Equal(productId, result.Items[0].ProductId);
        Assert.Equal(quantity, result.Items[0].Quantity);
    }

    [Fact]
    public async Task RemoveProductFromCartAsync_RemovesProduct_WhenExists()
    {
        // Arrange
        int userId = 1;
        int productId = 5;
        var cartItem = new CartItem { ProductId = productId, Quantity = 1 };
        var cart = new Cart { UserId = userId, Items = new List<CartItem> { cartItem } };

        _cartRepoMock.Setup(r => r.GetCartByUserIdAsync(userId)).ReturnsAsync(cart);
        _cartRepoMock.Setup(r => r.UpdateAsync(cart)).Returns(Task.CompletedTask);

        // Act
        var result = await _cartService.RemoveProductFromCartAsync(userId, productId);

        // Assert
        Assert.Empty(result!.Items);
        _cartRepoMock.Verify(r => r.UpdateAsync(cart), Times.Once);
    }

    [Fact]
    public async Task ClearCartAsync_RemovesAllItems()
    {
        // Arrange
        int userId = 1;
        var cart = new Cart
        {
            UserId = userId,
            Items = new List<CartItem>
            {
                new CartItem { ProductId = 1, Quantity = 1 },
                new CartItem { ProductId = 2, Quantity = 2 }
            }
        };

        _cartRepoMock.Setup(r => r.GetCartByUserIdAsync(userId)).ReturnsAsync(cart);
        _cartRepoMock.Setup(r => r.UpdateAsync(cart)).Returns(Task.CompletedTask);

        // Act
        var result = await _cartService.ClearCartAsync(userId);

        // Assert
        Assert.Empty(result!.Items);
        _cartRepoMock.Verify(r => r.UpdateAsync(cart), Times.Once);
    }
}
