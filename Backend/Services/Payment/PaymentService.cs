using MercadoPago.Client.Preference;
using MercadoPago.Resource.Preference;
using Stripe;
using Stripe.Checkout;
using Backend.Models;
using Backend.Interfaces;

namespace Backend.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly string _stripeSecretKey;
        private readonly string _mercadoPagoAccessToken;
        private readonly string _webUrl;
        private readonly string _mobileUrl;

        public PaymentService(IConfiguration configuration)
        {
            _stripeSecretKey = configuration["Stripe:SecretKey"] ?? throw new Exception("Stripe secret key is not set.");
            _mercadoPagoAccessToken = configuration["MercadoPago:AccessToken"] ?? throw new Exception("The Mercado Pago Access Token is not configured.");

            _webUrl = configuration["Frontend:WebUrl"]!;
            _mobileUrl = configuration["Mobile:MobileUrl"]!;

            // Configurar Stripe API Key una vez en el constructor
            StripeConfiguration.ApiKey = _stripeSecretKey;
        }

        // 🔹 Método para Stripe
        public async Task<string> CreateStripePaymentSessionAsync(List<CartItem> cartItems, bool isMobileClient = false)
        {
            var baseUrl = isMobileClient ? _mobileUrl : _webUrl;

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = cartItems.Select(item => new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = item.Product.Name,
                        },
                        UnitAmount = (long)(item.Product.Price * 100),
                    },
                    Quantity = item.Quantity,
                }).ToList(),
                Mode = "payment",
                SuccessUrl = $"{baseUrl}/success?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{baseUrl}/cancel",
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);
            return session.Url;
        }

        // 🔹 Método para Mercado Pago
        public async Task<string> CreateMercadoPagoPreferenceAsync(List<CartItem> cartItems, bool isMobileClient = false)
        {
            if (cartItems == null || !cartItems.Any())
            {
                throw new ArgumentException("No se han proporcionado productos en el carrito.");
            }

            MercadoPago.Config.MercadoPagoConfig.AccessToken = _mercadoPagoAccessToken;
            var baseUrl = isMobileClient ? _mobileUrl : _webUrl;

            var client = new PreferenceClient();
            var preferenceRequest = new PreferenceRequest
            {
                Items = cartItems.Select(item => new PreferenceItemRequest
                {
                    Title = item.Product.Name,
                    Quantity = item.Quantity,
                    CurrencyId = "ARS",
                    UnitPrice = item.Product.Price
                }).ToList(),
                BackUrls = new PreferenceBackUrlsRequest
                {
                    Success = $"{baseUrl}/success",
                    Failure = $"{baseUrl}/failure",
                    Pending = $"{baseUrl}/pending"
                },
                AutoReturn = "approved",
            };

            try
            {
                Preference preference = await client.CreateAsync(preferenceRequest);
                return preference.InitPoint;  // URL de pago
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear la preferencia de MercadoPago.", ex);
            }
        }
    }
}