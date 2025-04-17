using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class CheckoutRequest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;

        [Required]
        public ShippingData ShippingData { get; set; } = new ShippingData();

        public CheckoutRequest() { }

        public CheckoutRequest(string paymentMethod, ShippingData shippingData)
        {
            PaymentMethod = paymentMethod;
            ShippingData = shippingData;
        }
    }

    [Owned]
    public class ShippingData
    {
        [Required]
        [MaxLength(16)]
        [RegularExpression(@"^\d{13,16}$", ErrorMessage = "El número de tarjeta debe tener entre 13 y 16 dígitos.")]
        public string CardNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(3)]
        [RegularExpression(@"^\d{3}$", ErrorMessage = "El código de seguridad debe tener exactamente 3 dígitos.")]
        public string SecurityCode { get; set; } = string.Empty;

        [Required]
        public DateTime ExpirationDate { get; set; } = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);

        [Required]
        [MaxLength(50)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string City { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string ZipCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [RegularExpression(@"^\+?\d{7,20}$", ErrorMessage = "Número de teléfono no válido.")]
        public string Phone { get; set; } = string.Empty;
    }
}
