using Backend.Models;

namespace Backend.Interfaces
{
    public interface IProductService
    {
        Task<List<Product>> GetAllProducts(decimal? minPrice, decimal? maxPrice, ProductCategory? productCategory, ProductSubCategory? productSubCategory);
        Task<Product?> GetProductById(int id);
        Task<Product> AddProduct(Product product);
        Task<bool?> UpdateProduct(int id, Product updatedProduct, int userId);
        Task<bool?> UpdateProductPurchase(int id, Product updatedProduct, int? userId, string? sessionId);
        Task NotifyOwnerLowStock(int? ownerId, Product product);
        Task<bool> DeleteProduct(int id, int userId);
    }
}
