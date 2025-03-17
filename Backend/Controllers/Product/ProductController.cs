using Backend.Identity;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.JsonPatch;
using System.Security.Claims;
using Backend.Services.Interfaces;
using Newtonsoft.Json;
using Backend.DTOs;

namespace Backend.Controllers
{

    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        private readonly IBrowsingHistoryService _browsingHistoryService;

        public ProductController(IProductService productService, IBrowsingHistoryService browsingHistoryService)
        {
            _productService = productService;
            _browsingHistoryService = browsingHistoryService;
        }


        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetAllProducts([FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice, [FromQuery] ProductCategory? productCategory, [FromQuery] ProductSubCategory? productSubCategory)
        {
            return Ok(await _productService.GetAllProducts(minPrice, maxPrice, productCategory, productSubCategory));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id, [FromQuery] int? userId, [FromQuery] string? sessionId)
        {
            var product = await _productService.GetProductById(id);
            if (product == null) return NotFound();
            if (userId.HasValue || !string.IsNullOrEmpty(sessionId))
            {
                await _browsingHistoryService.AddToHistoryAsync(userId, sessionId, id);
            }


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
        IFormFile? image)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User ID not found in token.");
            }

            var userId = int.Parse(userIdClaim);

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

                product.ImageUrl = $"/images/{uniqueFileName}"; // Ruta relativa para acceder desde el frontend
            }

            var newProduct = await _productService.AddProduct(product);
            return CreatedAtAction(nameof(GetProductById), new { id = newProduct.Id }, newProduct);
        }


        [Authorize(Policy = IdentityRoles.Premium)]
        [HttpPatch("{id}")]
        public async Task<ActionResult<Product>> UpdateProduct(int id, [FromBody] JsonPatchDocument<Product> patchDoc)
        {
            if (patchDoc == null)
            {
                return BadRequest("Invalid patch document.");
            }

            // Obtener el userId desde los claims del JWT, asegurándose de que se utiliza el claim correcto
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User ID not found in token.");
            }

            var userId = int.Parse(userIdClaim);  // Convertir a int el userId desde el claim

            var product = await _productService.GetProductById(id);
            if (product == null)
            {
                return NotFound();
            }

            if (product.OwnerId != userId)
            {
                return Unauthorized("You are not authorized to update this product.");
            }

            // Aplicamos el parche al producto y registramos errores en ModelState
            patchDoc.ApplyTo(product, ModelState);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var success = await _productService.UpdateProduct(id, product, userId);
            if (success == null || !success.Value)
            {
                return NotFound();
            }


            return Ok(product);
        }


        [Authorize(Policy = "AdminOrPremium")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id, int userId)
        {
            var success = await _productService.DeleteProduct(id, userId);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}