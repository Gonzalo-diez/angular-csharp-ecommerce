using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Backend.Constants;

namespace Backend.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Brand { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price should not be lower to 0.")]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock should not be negative stock.")]
        public int Stock { get; set; }

        [Required]
        [Column(TypeName = "varchar(20)")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ProductCategory Category { get; set; }

        [Required]
        [Column(TypeName = "varchar(20)")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ProductStatus Status { get; set; } = ProductStatus.Enable;

        [Required]
        [Column(TypeName = "varchar(20)")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ProductSubCategory SubCategory { get; set; }

        // Constructor vacío (necesario para Entity Framework)
        public Product() { }

        // Constructor con validación de categorías y subcategorías
        public Product(string name, ProductCategory category, ProductSubCategory subCategory)
        {
            if (!CategoryMappings.SubCategories.ContainsKey(category) ||
                !CategoryMappings.SubCategories[category].Contains(subCategory))
            {
                throw new ArgumentException($"La subcategoría '{subCategory}' no es válida para la categoría '{category}'.");
            }

            Name = name;
            Category = category;
            SubCategory = subCategory;
        }

        [ForeignKey("OwnerId")]
        public int? OwnerId { get; set; }
        public Auth? Owner { get; set; }

        // Relación con las compras realizadas
        public List<Purchase>? Purchases { get; set; }

        public string? ImageUrl { get; set; } = null!;
    }
}