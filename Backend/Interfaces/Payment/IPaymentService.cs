using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IPaymentService
    {
        // Método para crear una sesión de pago con Stripe.
        Task<string> CreateStripePaymentSessionAsync(List<CartItem> cartItems, bool isMobileClient);
        
        // Método para crear una preferencia de pago con MercadoPago.
        Task<string> CreateMercadoPagoPreferenceAsync(List<CartItem> cartItems, bool isMobileClient);

        // Método para crear una preferencia de pago para tener rol premium con Stripe.
        Task<string> CreateStripeUpgradeSessionAsync(int userId, bool isMobileClient);

        // Método para crear una preferencia de pago para tener rol premium con MercadoPago.
        Task<string> CreateMercadoPagoUpgradePreferenceAsync(int userId, bool isMobileClient);
    }
}