using Backend.Identity;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Backend.DTOs;

namespace Backend.Controllers
{

    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }


        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetAllProducts([FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice, [FromQuery] ProductCategory? productCategory, [FromQuery] ProductSubCategory? productSubCategory)
        {
            return Ok(await _productService.GetAllProducts(minPrice, maxPrice, productCategory, productSubCategory));
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<Product>>> SearchProducts([FromQuery] string query)
        {
            var products = await _productService.SearchProducts(query);
            if (products == null) return NotFound();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id, [FromQuery] int? userId)
        {
            var product = await _productService.GetProductById(id);
            if (product == null) return NotFound();

            return Ok(product);
        }

        [HttpGet("category/{productCategory}")]
        public async Task<ActionResult<List<Product>>> GetProductsByCategory(string productCategory, [FromQuery] ProductSubCategory? productSubCategory, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice)
        {
            var products = await _productService.GetProductsByCategory(productCategory, productSubCategory, minPrice, maxPrice);

            if (products == null || products.Count == 0)
            {
                return NotFound(new { message = "No products found for this category" });
            }

            return Ok(products);
        }

        [HttpGet("category/{productCategory}/subcategory/{productSubCategory}")]
        public async Task<ActionResult<List<Product>>> GetProductsBySubCategory(string productCategory, string productSubCategory, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice)
        {
            var products = await _productService.GetProductsBySubCategory(productCategory, productSubCategory, minPrice, maxPrice);

            if (products == null || products.Count == 0)
            {
                return NotFound(new { message = "No products found for this category" });
            }

            return Ok(products);
        }

        [Authorize(Policy = IdentityRoles.Premium)]
        [HttpPost("add")]
        public async Task<ActionResult<Product>> AddProduct(
        [FromForm] AddProductDto productDto,
        IFormFile? image,
        [FromQuery] int? userId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User ID not found in token.");
            }

            var product = new Product
            {
                Name = productDto.Name,
                Brand = productDto.Brand,
                Price = productDto.Price,
                Stock = productDto.Stock,
                Category = productDto.Category,
                SubCategory = productDto.SubCategory,
                Status = productDto.Status,
                OwnerId = userId,
            };

            if (image != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(image.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }

                product.ImageUrl = $"/images/{uniqueFileName}";
            }

            var newProduct = await _productService.AddProduct(product);
            return CreatedAtAction(nameof(GetProductById), new { id = newProduct.Id }, newProduct);
        }

        [Authorize(Policy = IdentityRoles.Premium)]
        [HttpPut("{id}")]
        public async Task<ActionResult<Product>> UpdateProduct(
            int id,
            [FromForm] UpdateProductDto productDto,
            IFormFile? image,
            [FromQuery] int? userId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User ID not found in token.");
            }

            var product = await _productService.GetProductById(id);
            if (product == null)
            {
                return NotFound();
            }

            if (product.OwnerId != userId)
            {
                return Unauthorized("You are not authorized to update this product.");
            }

            // Actualizar los campos si los datos están presentes en productDto
            if (!string.IsNullOrEmpty(productDto.Name)) product.Name = productDto.Name;
            if (!string.IsNullOrEmpty(productDto.Brand)) product.Brand = productDto.Brand;
            if (productDto.Price.HasValue) product.Price = productDto.Price.Value;
            if (productDto.Stock.HasValue) product.Stock = productDto.Stock.Value;
            if (productDto.Category.HasValue) product.Category = productDto.Category.Value;
            if (productDto.SubCategory.HasValue) product.SubCategory = productDto.SubCategory.Value;
            if (productDto.Status.HasValue) product.Status = productDto.Status.Value;


            // Procesar la nueva imagen si se proporciona
            if (image != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(image.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }

                product.ImageUrl = $"/images/{uniqueFileName}";
            }

            var updatedProduct = await _productService.UpdateProduct(id, product, userId);
            if (updatedProduct == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [Authorize(Policy = "AdminOrPremium")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id, [FromQuery] int? userId)
        {
            var success = await _productService.DeleteProduct(id, userId);
            if (!success) return NotFound();
            return Ok(new { message = "Product deleted successfully" });
        }
    }
}