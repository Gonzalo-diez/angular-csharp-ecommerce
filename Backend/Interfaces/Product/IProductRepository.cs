using Backend.Models;

namespace Backend.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllProducts(decimal? minPrice, decimal? maxPrice, ProductCategory? productCategory, ProductSubCategory? productSubCategory);
        Task<Product?> GetProductById(int id);
        Task<List<Product>> GetProductsByCategory(ProductCategory? productCategory, decimal? minPrice, decimal? maxPrice, ProductSubCategory? productSubCategory);
        Task<List<Product>> GetProductsBySubCategory(ProductCategory? productCategory, ProductSubCategory? productSubCategory, decimal? minPrice, decimal? maxPrice);
        Task<Product> AddProduct(Product product);
        Task<bool?> UpdateProduct(int id, Product updatedProduct, int userId);
        Task<bool?> UpdateProductPurchase(int id, Product updatedProduct, int? userId, string? sessionId);
        Task<bool> DeleteProduct(int id, int userId);
    }
}
