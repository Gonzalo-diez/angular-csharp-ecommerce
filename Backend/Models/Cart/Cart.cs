using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int? UserId { get; set; }
        public Auth? User { get; set; } 

        public List<CartItem> Items { get; set; } = new List<CartItem>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Constructor sin parámetros necesario para EF Core
        public Cart() {}

        // Constructor asegurando que el usuario y su ID se asignen correctamente
        public Cart(Auth user)
        {
            User = user;
            UserId = user.Id;
        }
    }
}
