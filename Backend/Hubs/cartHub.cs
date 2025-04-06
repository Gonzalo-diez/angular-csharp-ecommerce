using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs
{
    public class CartHub : Hub
    {
        public async Task NotifyCartUpdated(string userId, object cart)
        {
            await Clients.User(userId).SendAsync("CartUpdated", cart);
        }

        public async Task NotifyCartCleared(string userId)
        {
            await Clients.User(userId).SendAsync("CartCleared");
        }
    }
}
