using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class CheckoutRequest
    {
        [Key]
        public int Id { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
    }
}
