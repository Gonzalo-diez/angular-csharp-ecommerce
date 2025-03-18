using Backend.Interfaces;
using Backend.Models;
using Backend.Repositories.Interfaces;

namespace Backend.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        private readonly IAuthRepository _authRepository;

        private readonly IEmailService _emailService;

        public ProductService(IProductRepository productRepository, IAuthRepository authRepository, IEmailService emailService)
        {
            _productRepository = productRepository;
            _authRepository = authRepository;
            _emailService = emailService;
        }

        public async Task<List<Product>> GetAllProducts(decimal? minPrice, decimal? maxPrice, ProductCategory? productCategory, ProductSubCategory? productSubCategory)
        {
            return await _productRepository.GetAllProducts(minPrice, maxPrice, productCategory, productSubCategory);
        }

        public async Task<Product?> GetProductById(int id)
        {
            return await _productRepository.GetProductById(id);
        }

        public async Task<List<Product>> GetProductsByCategory(string productCategory, ProductSubCategory? productSubCategory, decimal? minPrice, decimal? maxPrice)
        {
            return await _productRepository.GetProductsByCategory(productCategory, productSubCategory, minPrice, maxPrice);
        }

        public async Task<List<Product>> GetProductsBySubCategory(string productCategory, string productSubCategory, decimal? minPrice, decimal? maxPrice)
        {
            return await _productRepository.GetProductsBySubCategory(productCategory, productSubCategory, minPrice, maxPrice);
        }

        public async Task<Product> AddProduct(Product product)
        {
            return await _productRepository.AddProduct(product);
        }

        public async Task<bool?> UpdateProduct(int id, Product updatedProduct, int userId)
        {
            if (updatedProduct.Stock <= 0)
            {
                updatedProduct.Status = ProductStatus.Out_Of_Stock;
            }

            return await _productRepository.UpdateProduct(id, updatedProduct, userId);
        }

        public async Task<bool?> UpdateProductPurchase(int id, Product updatedProduct, int? userId)
        {
            if (updatedProduct.Stock <= 0)
            {
                updatedProduct.Status = ProductStatus.Out_Of_Stock;
            }

            return await _productRepository.UpdateProductPurchase(id, updatedProduct, userId);
        }

        public async Task NotifyOwnerLowStock(int? ownerId, Product product)
        {
            if (ownerId == null) return;

            // Obtener el usuario dueño del producto
            var owner = await _authRepository.GetUserByIdAsync(ownerId.Value);
            if (owner == null) return;

            string message = $"Hola {owner.FirstName}, tu producto '{product.Name}' tiene bajo stock ({product.Stock} unidades). ¡Reabastece pronto!";

            // Aquí puedes usar un servicio de correo electrónico o notificaciones
            await _emailService.SendEmail(owner.Email, "Stock bajo en tu producto", message);
        }

        public async Task<bool> DeleteProduct(int id, int userId)
        {
            return await _productRepository.DeleteProduct(id, userId);
        }
    }
}