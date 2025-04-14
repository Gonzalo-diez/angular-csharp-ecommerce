using Backend.Data;
using Backend.Interfaces;
using Backend.Models;
using Backend.Constants;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllProducts(decimal? minPrice, decimal? maxPrice, ProductCategory? productCategory, ProductSubCategory? productSubCategory)
        {
            var query = _context.Products
                .Include(p => p.Owner)
                .Include(p => p.Purchases)
                .AsQueryable();

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            if (productCategory.HasValue)
                query = query.Where(p => p.Category == productCategory.Value);

            if (productSubCategory.HasValue)
                query = query.Where(p => p.SubCategory == productSubCategory.Value);

            return await query.ToListAsync();
        }

        public async Task<List<Product>> SearchProducts(string query)
        {
            var loweredQuery = query.ToLower();

            return await _context.Products
                .Where(p => p.Name.ToLower().Contains(loweredQuery) ||
                            p.Brand.ToLower().Contains(loweredQuery))
                .ToListAsync();
        }

        public async Task<Product?> GetProductById(int id)
        {
            return await _context.Products
                .Include(p => p.Owner)
                .Include(p => p.Purchases)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Product>> GetProductsByCategory(
            string productCategory,
            ProductSubCategory? productSubCategory,
            decimal? minPrice,
            decimal? maxPrice)
        {
            var query = _context.Products.AsQueryable();

            // Convertir la categoría de string a enum (si es válida)
            if (Enum.TryParse<ProductCategory>(productCategory, true, out var categoryEnum))
            {
                query = query.Where(p => p.Category == categoryEnum);
            }
            else
            {
                throw new ArgumentException($"La categoría '{productCategory}' no es válida.");
            }

            // Filtrar por subcategoría si se proporciona
            if (productSubCategory.HasValue)
                query = query.Where(p => p.SubCategory == productSubCategory.Value);

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            return await query.ToListAsync();
        }

        public async Task<List<Product>> GetProductsBySubCategory(
            string productCategory,
            string productSubCategory,
            decimal? minPrice,
            decimal? maxPrice)
        {
            var query = _context.Products.AsQueryable();

            // Convertir la categoría de string a enum (si es válida)
            if (Enum.TryParse<ProductCategory>(productCategory, true, out var categoryEnum))
            {
                query = query.Where(p => p.Category == categoryEnum);
            }
            else
            {
                throw new ArgumentException($"La categoría '{productCategory}' no es válida.");
            }

            // Filtrar por subcategoría si se proporciona
            if (Enum.TryParse<ProductSubCategory>(productSubCategory, true, out var subCategoryEnum))
            {
                query = query.Where(p => p.SubCategory == subCategoryEnum);
            }

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            return await query.ToListAsync();
        }

        public async Task<Product> AddProduct(Product product)
        {
            if (!CategoryMappings.SubCategories.ContainsKey(product.Category) ||
                !CategoryMappings.SubCategories[product.Category].Contains(product.SubCategory))
            {
                throw new ArgumentException($"La subcategoría '{product.SubCategory}' no es válida para la categoría '{product.Category}'.");
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool?> UpdateProduct(int id, Product updatedProduct, int? userId)
        {
            var product = await GetProductById(id);
            if (product == null || product.OwnerId != userId)
            {
                return false;
            }

            product.Name = updatedProduct.Name;
            product.Brand = updatedProduct.Brand;
            product.Price = updatedProduct.Price;
            product.Stock = updatedProduct.Stock;
            product.Category = updatedProduct.Category;
            product.SubCategory = updatedProduct.SubCategory;
            product.Status = updatedProduct.Status;
            product.OwnerId = updatedProduct.OwnerId;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool?> UpdateProductPurchase(int id, Product updatedProduct, int? userId)
        {
            var product = await GetProductById(id);
            if (product == null || product.OwnerId != userId)
            {
                return false;
            }

            product.Stock = updatedProduct.Stock;
            product.Status = updatedProduct.Status;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteProduct(int id, int? userId)
        {
            var product = await GetProductById(id);
            if (product == null || (product.OwnerId != userId))
            {
                return false;
            }

            if (product.Purchases != null && product.Purchases.Any())
            {
                throw new InvalidOperationException("No se puede eliminar un producto con compras registradas.");
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
