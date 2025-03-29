using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class InvoiceDetail
    {
        [Key]
        public int Id { get; set; }

        public int InvoiceId { get; set; }
        public Invoice Invoice { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        public InvoiceDetail() {}

        public InvoiceDetail(Invoice invoice, Product product, int quantity, decimal unitPrice)
        {
            Invoice = invoice;
            InvoiceId = invoice.Id;
            Product = product;
            ProductId = product.Id;
            Quantity = quantity;
            UnitPrice = unitPrice;
        }
    }
}
