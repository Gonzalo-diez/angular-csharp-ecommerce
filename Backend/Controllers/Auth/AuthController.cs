using Backend.Models;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Backend.Identity;
using Backend.DTOs;

namespace Backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _authService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(user);
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterDto registerDto, IFormFile image)
        {
            var user = new Auth
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email
            };

            if (image != null) {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/avatar");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(image.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }

                user.ImageAvatar = $"/avatar/{uniqueFileName}";
            }

            var (createdUser, token) = await _authService.RegisterAsync(user, registerDto.Password);

            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, new
            {
                User = createdUser,
                Token = token
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var token = await _authService.LoginAsync(loginDto.Email, loginDto.Password);
            if (token == null)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(new { Token = token });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> LogOut()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int id))
            {
                return Unauthorized(new { message = "No se pudo identificar al usuario." });
            }

            var result = await _authService.LogOutUserAsync(id);
            if (!result)
            {
                return BadRequest(new { message = "No se pudo cerrar sesión." });
            }

            return Ok(new { message = "Sesión cerrada exitosamente." });
        }

        [Authorize(Policy = IdentityRoles.Admin)]
        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> DeleteUserByIdAsync(int userId)
        {
            var deleteUser = await _authService.DeleteUserByIdAsync(userId);

            if (deleteUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new { message = "User deleted successfully", user = deleteUser });
        }

        [Authorize]
        [HttpPost("upgrade")]
        public async Task<IActionResult> UpgradeRole([FromQuery] int userId, [FromBody] UpgradeRequestDto upgradeRequest)
        {
            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            switch (upgradeRequest.PaymentMethod.ToLowerInvariant())
            {
                case "stripe":
                    if (!await _authService.ConfirmStripePayment(upgradeRequest))
                        return BadRequest(new { message = "Pago con Stripe fallido" });
                    break;

                case "mercadopago":
                    if (!await _authService.ConfirmMercadoPagoPayment(upgradeRequest))
                        return BadRequest(new { message = "Pago con MercadoPago fallido" });
                    break;

                default:
                    return BadRequest(new { message = "Método de pago no soportado" });
            }

            // Actualiza el rol
            var upgradedUser = await _authService.UpgradeUserToPremium(userId);

            return Ok(new
            {
                message = "Upgrade a premium exitoso",
                user = new
                {
                    upgradedUser.Id,
                    upgradedUser.Email,
                    upgradedUser.Role
                }
            });
        }
    }
}
