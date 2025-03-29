using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class CartItem
    {
        [Key]
        public int Id { get; set; }

        public int CartId { get; set; }
        public Cart Cart { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int Quantity { get; set; } = 1;

        // Constructor sin parámetros para EF Core
        public CartItem() {}

        // Constructor asegurando que Cart y Product se asignen correctamente
        public CartItem(Cart cart, Product product, int quantity = 1)
        {
            Cart = cart;
            CartId = cart.Id;
            Product = product;
            ProductId = product.Id;
            Quantity = quantity;
        }
    }
}
