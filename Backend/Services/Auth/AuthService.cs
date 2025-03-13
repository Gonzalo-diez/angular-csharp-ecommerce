using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Newtonsoft.Json;

namespace Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(IAuthRepository authRepository, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _authRepository = authRepository;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
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

            return GenerateJwtToken(user);
        }

        public async Task<(Auth User, string Token)> RegisterAsync(Auth user, string password)
        {
            user.Password = password; // ✅ Se hashea automáticamente en el setter
            var createdUser = await _authRepository.CreateUserAsync(user);

            string token = GenerateJwtToken(createdUser);

            return (createdUser, token);
        }

        public async Task<bool> LogOutUserAsync(int userId)
        {
            return await _authRepository.LogOutUserAsync(userId);
        }

        public async Task<Auth?> DeleteUserByIdAsync(int userId)
        {
            return await _authRepository.DeleteUserByIdAsync(userId);
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
