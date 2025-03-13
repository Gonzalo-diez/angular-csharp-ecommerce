using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("UserId")]
        public int? UserId { get; set; }

        public Auth? User { get; set; } = null!;

        public string? SessionId { get; set; }

        public List<CartItem> Items { get; set; } = new List<CartItem>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ✅ Constructor sin parámetros necesario para EF Core
        public Cart() { }

        // ✅ Constructor asegurando que User y UserId siempre se inicialicen
        public Cart(Auth user)
        {
            User = user;
            UserId = user.Id; // Asegura que UserId también se establezca
            Items = new List<CartItem>();
        }

        public Cart(string sessionId)
        {
            SessionId = sessionId;
            Items = new List<CartItem>();
        }
    }
}
