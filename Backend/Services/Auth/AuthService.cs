using Backend.Models;
using Backend.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Newtonsoft.Json;
using Microsoft.AspNetCore.SignalR;
using Backend.Hubs;

namespace Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<AuthHub> _authHub;

        public AuthService(IAuthRepository authRepository, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IHubContext<AuthHub> authHub)
        {
            _authRepository = authRepository;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _authHub = authHub;
        }

        public async Task<Auth?> GetCurrentUser()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null || !user.Identity?.IsAuthenticated == true)
                return null;

            var userIdClaim = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                Console.WriteLine("Error: User ID not found in the claims.");
                return null;
            }

            Console.WriteLine($"🧑 Usuario autenticado: {userIdClaim}");

            return await _authRepository.GetUserByIdAsync(int.Parse(userIdClaim));
        }

        public async Task<Auth?> GetUserByIdAsync(int id)
        {
            return await _authRepository.GetUserByIdAsync(id);
        }

        public async Task<string?> LoginAsync(string email, string password)
        {
            var user = await _authRepository.GetUserByEmailAsync(email);
            if (user == null || string.IsNullOrEmpty(user.Password) || !user.VerifyPassword(password))
                return null;

            await _authHub.Clients.All.SendAsync("UserLoggedIn", new
            {
                UserId = user.Id,
                Email = user.Email
            });

            return GenerateJwtToken(user);
        }

        public async Task<(Auth User, string Token)> RegisterAsync(Auth user, string password)
        {
            user.Password = password; // ✅ Se hashea automáticamente en el setter
            var createdUser = await _authRepository.CreateUserAsync(user);

            string token = GenerateJwtToken(createdUser);

            await _authHub.Clients.All.SendAsync("UserRegistered", new
            {
                UserId = createdUser.Id,
                Email = createdUser.Email
            });


            return (createdUser, token);
        }

        public async Task<bool> LogOutUserAsync(int? userId)
        {
            if (userId == null)
            {
                throw new ArgumentNullException(nameof(userId), "UserId cant be null");
            }

            await _authHub.Clients.All.SendAsync("UserLoggedOut", new
            {
                UserId = userId
            });


            return await _authRepository.LogOutUserAsync(userId);
        }

        public async Task<Auth?> DeleteUserByIdAsync(int userId)
        {
            return await _authRepository.DeleteUserByIdAsync(userId);
        }

        public async Task<bool> ConfirmStripePayment(UpgradeRequestDto upgradeRequest)
        {
            // Simula una validación o conectá con Stripe SDK real
            // Podés agregar lógica para verificar el `upgradeRequest.StripeSessionId` por ejemplo
            return await Task.FromResult(true); // o false si falla
        }

        public async Task<bool> ConfirmMercadoPagoPayment(UpgradeRequestDto upgradeRequest)
        {
            // Validación con MercadoPago si aplicás la integración
            return await Task.FromResult(true);
        }

        public async Task<Auth> UpgradeUserToPremium(int userId)
        {
            var user = await _authRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("Usuario no encontrado para upgrade.");
            }

            if (user.Role == AuthRole.Premium) {
                throw new Exception("Este usuario ya es premium.");
            }

            user.Role = AuthRole.Premium; 
            await _authRepository.UpdateAsync(user);
            return user;
        }


        private string GenerateJwtToken(Auth user)
        {
            // Obtener valores de configuración y verificar si son nulos
            var jwtSettings = _configuration.GetSection("Jwt");
            var secret = jwtSettings["Key"];

            if (string.IsNullOrWhiteSpace(secret))
            {
                throw new InvalidOperationException("JWT_SECRET no está configurado en appsettings.json o en las variables de entorno.");
            }

            // Convertir el usuario completo a JSON
            var userJson = JsonConvert.SerializeObject(new
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role
            });

            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.FirstName),
        new Claim(ClaimTypes.Role, user.Role.ToString()),

        // Agregar usuario completo como JSON en un claim personalizado
        new Claim("user", userJson)
    };

            var key = Encoding.UTF8.GetBytes(secret);
            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
