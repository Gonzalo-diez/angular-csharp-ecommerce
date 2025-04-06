using Backend.DTOs;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        private readonly IPurchaseService _purchaseService;

        private readonly IAuthService _authService;

        private readonly IProductService _productService;

        private readonly IPaymentService _paymentService;

        private readonly IInvoiceService _invoiceService;

        private readonly IPdfService _pdfService;

        public CartController(ICartService cartService, IPurchaseService purchaseService, IAuthService authService, IProductService productService, IPaymentService paymentService, IInvoiceService invoiceService, IPdfService pdfService)
        {
            _cartService = cartService;
            _purchaseService = purchaseService;
            _authService = authService;
            _productService = productService;
            _paymentService = paymentService;
            _invoiceService = invoiceService;
            _pdfService = pdfService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart([FromQuery] int? userId)
        {
            try
            {
                var cart = await _cartService.GetCartByUserIdAsync(userId);
                return Ok(cart);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddItem([FromBody] AddProductToCartDto addProductToCartDto, [FromQuery] int? userId)
        {
            try
            {
                await _cartService.AddProductToCartAsync(userId, addProductToCartDto.ProductId, addProductToCartDto.Quantity);
                return Ok(new { message = "Item added to cart" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request, [FromQuery] int? userId)
        {
            try
            {
                if (userId == null)
                {
                    return BadRequest(new { message = "Se requiere un userId válido." });
                }

                // Obtener el carrito del usuario
                var cart = await _cartService.GetCartByUserIdAsync(userId);
                if (cart == null || !cart.Items.Any())
                {
                    return BadRequest(new { message = "El carrito está vacío." });
                }

                // Verificar stock disponible para cada producto
                foreach (var cartItem in cart.Items)
                {
                    var product = await _productService.GetProductById(cartItem.ProductId);
                    if (product == null)
                    {
                        return NotFound(new { message = $"Producto con ID {cartItem.ProductId} no encontrado." });
                    }

                    if (product.Stock < cartItem.Quantity)
                    {
                        return BadRequest(new { message = $"Stock insuficiente para {product.Name}. Disponible: {product.Stock}, requerido: {cartItem.Quantity}." });
                    }

                    if (product.Stock < 5)
                    {
                        await _productService.NotifyOwnerLowStock(product.OwnerId, product);
                    }
                }

                // Procesar compra y actualizar stock
                foreach (var cartItem in cart.Items)
                {
                    var product = await _productService.GetProductById(cartItem.ProductId);
                    if (product is null)
                    {
                        return NotFound(new { message = $"Producto con ID {cartItem.ProductId} no encontrado." });
                    }

                    // Restar stock
                    product.Stock -= cartItem.Quantity;
                    await _productService.UpdateProductPurchase(cartItem.ProductId, product, userId);

                    // Crear compra
                    await _purchaseService.CreatePurchaseAsync(userId, product, cartItem.Quantity);
                }

                // Crear la factura antes de vaciar el carrito
                var invoice = new Invoice
                {
                    UserId = userId,
                    CheckoutRequest = request,
                    Total = cart.Items.Sum(item => item.Product.Price * item.Quantity),
                    Details = cart.Items.Select(item => new InvoiceDetail
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.Product.Price
                    }).ToList()
                };

                // Guardar la factura en la base de datos
                await _invoiceService.CreateInvoiceAsync(invoice);

                // Generar PDF
                var pdfBytes = await _pdfService.GenerateInvoicePdfAsync(invoice);
                var pdfFile = File(pdfBytes, "application/pdf", $"factura{invoice.Id}.pdf");

                // Si el método de pago es Stripe
                if (request.PaymentMethod == "Stripe")
                {
                    var paymentSessionUrl = await _paymentService.CreateStripePaymentSessionAsync(cart.Items);
                    if (!string.IsNullOrEmpty(paymentSessionUrl))
                    {
                        await _cartService.ClearCartAsync(userId);

                        Console.WriteLine("Compra realizada con éxito para el usuario ID: " + userId);

                        return Ok(new { message = "Compra completada con éxito.", paymentUrl = paymentSessionUrl, pdfUrl = pdfFile });
                    }
                    else
                    {
                        return BadRequest(new { message = "Error al procesar el pago con Stripe." });
                    }
                }
                // Si el método de pago es MercadoPago
                else if (request.PaymentMethod == "MercadoPago")
                {
                    try
                    {
                        var paymentUrl = await _paymentService.CreateMercadoPagoPreferenceAsync(cart.Items);
                        if (!string.IsNullOrEmpty(paymentUrl))
                        {
                            await _cartService.ClearCartAsync(userId);

                            Console.WriteLine("Compra realizada con éxito para el usuario ID: " + userId);

                            return Ok(new { message = "Compra completada con éxito.", paymentUrl, pdfUrl = pdfFile });
                        }
                        else
                        {
                            return BadRequest(new { message = "Error al procesar el pago con MercadoPago." });
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Error en Checkout (MercadoPago): " + ex.Message);
                        return BadRequest(new { message = "Error al crear la preferencia de MercadoPago.", error = ex.Message });
                    }
                }
                else
                {
                    return BadRequest(new { message = "Método de pago no soportado." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error en Checkout: " + ex.Message);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("remove/{productId}")]
        public async Task<IActionResult> RemoveItem(int productId, [FromQuery] int? userId)
        {
            try
            {
                var cart = await _cartService.GetCartByUserIdAsync(userId);
                if (cart == null)
                {
                    return NotFound();
                }

                if (cart.UserId != userId)
                {
                    return Unauthorized("You are not authorized to delete this product from this cart.");
                }

                await _cartService.RemoveProductFromCartAsync(userId, productId);
                return Ok(new { message = "Item removed from cart" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart([FromQuery] int? userId)
        {
            try
            {
                var cart = await _cartService.GetCartByUserIdAsync(userId);
                if (cart == null)
                {
                    return NotFound();
                }

                if (cart.UserId != userId)
                {
                    return Unauthorized("You are not authorized to clear this cart.");
                }

                await _cartService.ClearCartAsync(userId);
                return Ok(new { message = "Cart cleared" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }

    public class AddItemRequest
    {
        public required int ProductId { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
