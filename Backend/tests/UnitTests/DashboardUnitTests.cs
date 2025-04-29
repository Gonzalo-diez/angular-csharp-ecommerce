using Xunit;
using Moq;
using Backend.Interfaces;
using Backend.Services;
using Backend.DTOs;

namespace Backend.Tests
{
    public class DashboardUnitTests
    {
        [Fact]
        public async Task GetDashboardData_ReturnsCorrectData()
        {
            // Arrange
            var repositoryMock = new Mock<IDashboardRepository>();

            repositoryMock.Setup(r => r.GetTotalUsers()).ReturnsAsync(10);
            repositoryMock.Setup(r => r.GetUsers()).ReturnsAsync(new List<UserDTO>
            {
                new UserDTO { Id = 1, Name = "User1" }
            });
            repositoryMock.Setup(r => r.GetTotalProducts()).ReturnsAsync(20);
            repositoryMock.Setup(r => r.GetProducts()).ReturnsAsync(new List<ProductDTO>
            {
                new ProductDTO { Id = 1, Name = "Product1" }
            });
            repositoryMock.Setup(r => r.GetProductsByCategory()).ReturnsAsync(new List<CategoryProductCount>
            {
                new CategoryProductCount { Category = "Technology", TotalProducts = 5 }
            });
            repositoryMock.Setup(r => r.GetTotalPurchases()).ReturnsAsync(5);
            repositoryMock.Setup(r => r.GetTotalRevenue()).ReturnsAsync(1500m);
            repositoryMock.Setup(r => r.GetSoldProductsByCategoryPercentage()).ReturnsAsync(new List<CategorySalesDTO>
            {
                new CategorySalesDTO { Category = "Technology", PercentageSold = 50 }
            });
            repositoryMock.Setup(r => r.GetSoldProductsBySubcategoryPercentage()).ReturnsAsync(new List<SubcategorySalesDTO>
            {
                new SubcategorySalesDTO { SubCategory = "PC", PercentageSold = 30 }
            });

            var service = new DashboardService(repositoryMock.Object);

            // Act
            var result = await service.GetDashboardData();

            // Assert
            Assert.Equal(10, result.TotalUsers);
            Assert.Single(result.Users);
            Assert.Equal("User1", result.Users[0].Name);
            Assert.Equal(20, result.TotalProducts);
            Assert.Single(result.Products);
            Assert.Equal("Product1", result.Products[0].Name);
            Assert.Single(result.ProductsByCategory);
            Assert.Equal("Technology", result.ProductsByCategory[0].Category);
            Assert.Equal(5, result.TotalPurchases);
            Assert.Equal(1500m, result.TotalRevenue);
            Assert.Single(result.CategorySales);
            Assert.Equal(50, result.CategorySales[0].PercentageSold);
            Assert.Single(result.SubcategorySales);
            Assert.Equal(30, result.SubcategorySales[0].PercentageSold);

            // Verificar llamadas a métodos
            repositoryMock.Verify(r => r.GetTotalUsers(), Times.Once);
            repositoryMock.Verify(r => r.GetUsers(), Times.Once);
            repositoryMock.Verify(r => r.GetTotalProducts(), Times.Once);
            repositoryMock.Verify(r => r.GetProducts(), Times.Once);
            repositoryMock.Verify(r => r.GetProductsByCategory(), Times.Once);
            repositoryMock.Verify(r => r.GetTotalPurchases(), Times.Once);
            repositoryMock.Verify(r => r.GetTotalRevenue(), Times.Once);
            repositoryMock.Verify(r => r.GetSoldProductsByCategoryPercentage(), Times.Once);
            repositoryMock.Verify(r => r.GetSoldProductsBySubcategoryPercentage(), Times.Once);
        }
    }
}