using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Purchase
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int? UserId { get; set; }
        public Auth? User { get; set; } 

        [ForeignKey("Product")]
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int Quantity { get; set; }
        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;

        public Purchase() {}

        public Purchase(Auth user, Product product, int quantity)
        {
            User = user;
            UserId = user.Id;
            Product = product;
            ProductId = product.Id;
            Quantity = quantity;
        }
    }
}
