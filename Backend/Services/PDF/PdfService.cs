using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Kernel.Font;
using iText.IO.Font.Constants;
using Backend.Models;
using Backend.Interfaces;
using iText.Layout.Properties;
using System.Globalization;

namespace Backend.Services
{
    public class PdfService : IPdfService
    {
        public async Task<byte[]> GenerateInvoicePdfAsync(Invoice invoice)
        {
            try
            {

                return await Task.Run(() =>
                {
                    using var memoryStream = new MemoryStream();
                    using var writer = new PdfWriter(memoryStream);
                    using var pdf = new PdfDocument(writer);
                    var document = new Document(pdf);

                    var boldFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
                    var normalFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);

                    document.Add(new Paragraph("Factura de Compra")
                        .SetFont(boldFont)
                        .SetFontSize(18));

                    document.Add(new Paragraph($"Usuario ID: {invoice.UserId}").SetFont(normalFont));
                    document.Add(new Paragraph($"Fecha: {invoice.Date:dd/MM/yyyy}").SetFont(normalFont));
                    document.Add(new Paragraph($"Método de Pago: {invoice.CheckoutRequest.PaymentMethod}").SetFont(normalFont));

                    var table = new Table(UnitValue.CreatePercentArray(4)).UseAllAvailableWidth();
                    table.AddHeaderCell(new Cell().Add(new Paragraph("Producto").SetFont(boldFont)));
                    table.AddHeaderCell(new Cell().Add(new Paragraph("Cantidad").SetFont(boldFont)));
                    table.AddHeaderCell(new Cell().Add(new Paragraph("Precio Unitario").SetFont(boldFont)));
                    table.AddHeaderCell(new Cell().Add(new Paragraph("Subtotal").SetFont(boldFont)));

                    foreach (var detail in invoice.Details)
                    {
                        table.AddCell(new Cell().Add(new Paragraph(detail.Product.Name).SetFont(normalFont)));
                        table.AddCell(new Cell().Add(new Paragraph(detail.Quantity.ToString()).SetFont(normalFont)));
                        table.AddCell(new Cell().Add(new Paragraph($"${detail.UnitPrice:0.00}").SetFont(normalFont)));
                        table.AddCell(new Cell().Add(new Paragraph($"${(detail.Quantity * detail.UnitPrice):0.00}").SetFont(normalFont)));
                    }

                    document.Add(table);
                    document.Add(new Paragraph($"Total: ${invoice.Total:0.00}")
                        .SetFont(boldFont)
                        .SetFontSize(14));

                    document.Close();
                    return memoryStream.ToArray();
                });
            }
            catch (IOException ex)
            {
                Console.WriteLine("❌ Error de I/O al generar el PDF: " + ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error inesperado: " + ex.Message);
                throw;
            }
        }

    }
}
