using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs
{
    public class ProductHub : Hub
    {
        // Notificar cuando se agrega un producto
        public async Task NotifyProductAdded(object product)
        {
            await Clients.All.SendAsync("ProductAdded", product);
        }

        // Notificar cuando se actualiza un producto
        public async Task NotifyProductUpdated(object product)
        {
            await Clients.All.SendAsync("ProductUpdated", product);
        }

        // Notificar cuando se elimina un producto
        public async Task NotifyProductDeleted(int productId)
        {
            await Clients.All.SendAsync("ProductDeleted", productId);
        }
    }
}