using Xunit;
using Moq;
using Backend.Interfaces;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.SignalR;
using Backend.Hubs;

public class ProductUnitTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<IAuthRepository> _authRepositoryMock;
    private readonly Mock<IEmailService> _emailServiceMock;
    private readonly Mock<IHubContext<ProductHub>> _productHubMock;
    private readonly Mock<IClientProxy> _clientProxyMock;
    private readonly ProductService _productService;

    public ProductUnitTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _authRepositoryMock = new Mock<IAuthRepository>();
        _emailServiceMock = new Mock<IEmailService>();
        _productHubMock = new Mock<IHubContext<ProductHub>>();
        _clientProxyMock = new Mock<IClientProxy>();

        var clientsMock = new Mock<IHubClients>();
        clientsMock.Setup(c => c.All).Returns(_clientProxyMock.Object);
        _productHubMock.Setup(h => h.Clients).Returns(clientsMock.Object);

        _productService = new ProductService(
            _productRepositoryMock.Object,
            _authRepositoryMock.Object,
            _emailServiceMock.Object,
            _productHubMock.Object
        );
    }

    [Fact]
    public async Task GetProductById_ReturnsProduct_WhenExists()
    {
        // Arrange
        var product = new Product { Id = 1, Name = "Test Product" };
        _productRepositoryMock.Setup(repo => repo.GetProductById(1)).ReturnsAsync(product);

        // Act
        var result = await _productService.GetProductById(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("Test Product", result.Name);
    }

    [Fact]
    public async Task AddProduct_SendsNotification_AndReturnsProduct()
    {
        // Arrange
        var product = new Product { Id = 1, Name = "New Product" };
        _productRepositoryMock.Setup(repo => repo.AddProduct(It.IsAny<Product>())).ReturnsAsync(product);

        // Act
        var result = await _productService.AddProduct(product);

        // Assert
        _productRepositoryMock.Verify(r => r.AddProduct(It.IsAny<Product>()), Times.Once);
        _clientProxyMock.Verify(c => c.SendCoreAsync("ProductAdded", 
            It.Is<object[]>(o => ((Product)o[0]).Id == product.Id), default), Times.Once);

        Assert.Equal(product, result);
    }

    [Fact]
    public async Task DeleteProduct_SendsNotification_AndReturnsTrue_WhenDeleted()
    {
        // Arrange
        _productRepositoryMock.Setup(r => r.DeleteProduct(1, null)).ReturnsAsync(true);

        // Act
        var result = await _productService.DeleteProduct(1, null);

        // Assert
        Assert.True(result);
        _clientProxyMock.Verify(c => c.SendCoreAsync("ProductDeleted", 
            It.Is<object[]>(o => (int)o[0] == 1), default), Times.Once);
    }

    [Fact]
    public async Task NotifyOwnerLowStock_SendsEmail_WhenOwnerExists()
    {
        // Arrange
        var owner = new Auth { Id = 1, FirstName = "Gonza", Email = "gonza@example.com" };
        var product = new Product { Id = 1, Name = "Test Product", Stock = 2 };

        _authRepositoryMock.Setup(a => a.GetUserByIdAsync(1)).ReturnsAsync(owner);

        // Act
        await _productService.NotifyOwnerLowStock(1, product);

        // Assert
        _emailServiceMock.Verify(e => e.SendEmail(
            "gonza@example.com",
            "Stock bajo en tu producto",
            It.Is<string>(s => s.Contains("Test Product") && s.Contains("2 unidades"))),
            Times.Once);
    }

    [Fact]
    public async Task UpdateProduct_SendsNotification_WhenUpdated()
    {
        // Arrange
        var product = new Product { Id = 1, Name = "Test Product", Stock = 5 };
        _productRepositoryMock.Setup(r => r.UpdateProduct(1, product, 10)).ReturnsAsync(true);

        // Act
        var result = await _productService.UpdateProduct(1, product, 10);

        // Assert
        Assert.True(result);
        _clientProxyMock.Verify(c => c.SendCoreAsync("ProductUpdated",
            It.Is<object[]>(o => ((Product)o[0]).Id == product.Id), default), Times.Once);
    }
}
