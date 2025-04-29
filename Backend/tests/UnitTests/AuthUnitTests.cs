using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using Moq;
using Xunit;
using Backend.Services;
using Backend.Interfaces;
using Backend.Models;
using Backend.Hubs;

namespace Backend.Tests
{
    public class AuthUnitTests
    {
        private readonly Mock<IAuthRepository> _authRepositoryMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly Mock<IHubContext<AuthHub>> _hubContextMock;
        private readonly AuthService _authService;

        public AuthUnitTests()
        {
            _authRepositoryMock = new Mock<IAuthRepository>();
            _configurationMock = new Mock<IConfiguration>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _hubContextMock = new Mock<IHubContext<AuthHub>>();

            // Configurar sección JWT para los tests
            var jwtSection = new Mock<IConfigurationSection>();
            jwtSection.Setup(s => s["Key"]).Returns("SuperSecretTestKey123456");

            _configurationMock.Setup(c => c.GetSection("Jwt")).Returns(jwtSection.Object);

            _authService = new AuthService(
                _authRepositoryMock.Object,
                _configurationMock.Object,
                _httpContextAccessorMock.Object,
                _hubContextMock.Object
            );
        }

        [Fact]
        public async Task LoginAsync_ReturnsToken_WhenCredentialsAreValid()
        {
            // Arrange
            var mockRepo = new Mock<IAuthRepository>();
            var mockConfig = new Mock<IConfiguration>();
            var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            var mockHubContext = new Mock<IHubContext<AuthHub>>();
            var mockClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();

            // Setup para evitar NullReference
            mockHubContext.Setup(h => h.Clients).Returns(mockClients.Object);
            mockClients.Setup(c => c.All).Returns(mockClientProxy.Object);
            mockClientProxy.Setup(c => c.SendCoreAsync(It.IsAny<string>(), It.IsAny<object[]>(), default)).Returns(Task.CompletedTask);

            var user = new Auth
            {
                Id = 1,
                Email = "test@example.com",
                FirstName = "Test",
                Password = "123456"
            };

            // Setup de Configuración de JWT
            mockConfig.Setup(c => c.GetSection("Jwt")["Key"]).Returns("S3cr3tJWTK3yForAuth1234567890123456");

            // Setup del Repo
            mockRepo.Setup(r => r.GetUserByEmailAsync(user.Email)).ReturnsAsync(user);

            var authService = new AuthService(mockRepo.Object, mockConfig.Object, mockHttpContextAccessor.Object, mockHubContext.Object);

            // Act
            var result = await authService.LoginAsync(user.Email, "123456");

            // Assert
            Assert.NotNull(result);
            Assert.IsType<string>(result);
        }

        [Fact]
        public async Task GetCurrentUser_ReturnsUser_WhenAuthenticated()
        {
            // Arrange
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "1")
            };

            var identity = new ClaimsIdentity(claims, "TestAuth");
            var claimsPrincipal = new ClaimsPrincipal(identity);

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(h => h.User).Returns(claimsPrincipal);

            _httpContextAccessorMock.Setup(a => a.HttpContext).Returns(httpContextMock.Object);

            var user = new Auth { Id = 1, Email = "test@mail.com" };
            _authRepositoryMock.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(user);

            // Act
            var result = await _authService.GetCurrentUser();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(user.Email, result.Email);
        }

        [Fact]
        public async Task UpgradeUserToPremium_ChangesRole_WhenUserExistsAndIsNotPremium()
        {
            // Arrange
            var user = new Auth { Id = 1, Role = AuthRole.User };
            _authRepositoryMock.Setup(r => r.GetUserByIdAsync(user.Id)).ReturnsAsync(user);

            // Act
            var result = await _authService.UpgradeUserToPremium(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(AuthRole.Premium, result.Role);
            _authRepositoryMock.Verify(r => r.UpdateAsync(user), Times.Once);
        }

        [Fact]
        public async Task UpgradeUserToPremium_ThrowsException_WhenUserAlreadyPremium()
        {
            // Arrange
            var user = new Auth { Id = 1, Role = AuthRole.Premium };
            _authRepositoryMock.Setup(r => r.GetUserByIdAsync(user.Id)).ReturnsAsync(user);

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _authService.UpgradeUserToPremium(user.Id));
        }
    }
}
