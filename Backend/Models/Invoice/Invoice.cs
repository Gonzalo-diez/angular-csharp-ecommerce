using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Invoice
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int? UserId { get; set; }
        public Auth? User { get; set; } 

        [ForeignKey("CheckoutRequest")]
        public int CheckoutRequestId { get; set; }
        public CheckoutRequest CheckoutRequest { get; set; } = null!;

        public decimal Total { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;

        public List<InvoiceDetail> Details { get; set; } = new List<InvoiceDetail>();

        public Invoice() {}

        public Invoice(Auth user, CheckoutRequest checkoutRequest, decimal total)
        {
            User = user;
            UserId = user.Id;
            CheckoutRequest = checkoutRequest;
            CheckoutRequestId = checkoutRequest.Id;
            Total = total;
        }
    }
}
