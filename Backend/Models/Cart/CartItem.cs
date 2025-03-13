using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("CartId")]
        public int CartId { get; set; }
        public Cart Cart { get; set; } = null!;

        [ForeignKey("ProductId")]
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int Quantity { get; set; } = 1;

        // ✅ Constructor sin parámetros necesario para EF Core
        public CartItem() { }

        // ✅ Constructor asegurando que CartId y ProductId se inicialicen
        public CartItem(Cart cart, Product product, int quantity = 1)
        {
            Cart = cart;
            CartId = cart.Id; // Se asegura de establecer el ID del carrito
            Product = product;
            ProductId = product.Id; // Se asegura de establecer el ID del producto
            Quantity = quantity;
        }
    }
}
