using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class InvoiceDetail
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("invoiceId")]
        public int invoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;

        [ForeignKey("ProductId")]
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
