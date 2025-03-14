using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class AddProductDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Brand { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative.")]
        public int Stock { get; set; }

        [Required]
        public ProductCategory Category { get; set; }

        [Required]
        public ProductSubCategory SubCategory { get; set; }

        [Required]
        public ProductStatus Status { get; set; } = ProductStatus.Enable;

        public int? OwnerId { get; set; }
    }
}