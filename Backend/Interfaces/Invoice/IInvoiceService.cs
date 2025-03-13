using Backend.Models;

namespace Backend.Interfaces
{
    public interface IInvoiceService
    {
        Task CreateInvoiceAsync(Invoice invoice);
    }
}
