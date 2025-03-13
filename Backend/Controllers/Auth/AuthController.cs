using Backend.Models;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Backend.Identity;

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
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = new Auth
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email
            };

            var (createdUser, token) = await _authService.RegisterAsync(user, request.Password);

            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, new
            {
                User = createdUser,
                Token = token
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var token = await _authService.LoginAsync(request.Email, request.Password);
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
    }

    public class RegisterRequest
    {
        public required string Email { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Password { get; set; }
    }

    public class LoginRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
