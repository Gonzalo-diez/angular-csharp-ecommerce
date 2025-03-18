using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Invoice
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("UserId")]
        public int? UserId { get; set; }
        public Auth? User { get; set; } = null!;
        public CheckoutRequest CheckoutRequest { get; set; } = null!; 
        public decimal Total { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;

        public List<InvoiceDetail> Details { get; set; } = new List<InvoiceDetail>();
    }
}