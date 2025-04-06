using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs
{
    public class AuthHub : Hub
    {
        // Se puede usar para enviar mensajes personalizados
        public async Task NotifyLogin(int userId, string email)
        {
            await Clients.All.SendAsync("UserLoggedIn", new
            {
                UserId = userId,
                Email = email
            });
        }

        public async Task NotifyRegister(int userId, string email)
        {
            await Clients.All.SendAsync("UserRegistered", new
            {
                UserId = userId,
                Email = email
            });
        }

        public async Task NotifyLogout(int userId)
        {
            await Clients.All.SendAsync("UserLoggedOut", new
            {
                UserId = userId
            });
        }
    }
}
