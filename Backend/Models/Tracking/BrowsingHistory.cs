using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class BrowsingHistory
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("UserId")]
        public int? UserId { get; set; }
        public Auth? User { get; set; } = null!;

        public string? SessionId { get; set; } 

        [ForeignKey("ProductId")]
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public DateTime DateTime { get; set; } = DateTime.UtcNow;
    }
}