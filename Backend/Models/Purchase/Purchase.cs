using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Purchase
    {
        [Key]
        public int Id { get; set; }

        // Relación con el usuario que compró
        [ForeignKey("UserId")]
        public int? UserId { get; set; }
        public Auth? User { get; set; } = null!;
        public string? SessionId { get; set; }
        // Relación con el producto comprado
        [ForeignKey("ProductId")]
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int Quantity { get; set; }
        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;

        public Purchase() {}

        public Purchase(Auth user, Product product)
        {
            User = user;
            Product = product;
        }
    }
}
