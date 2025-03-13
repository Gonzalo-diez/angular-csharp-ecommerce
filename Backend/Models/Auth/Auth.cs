using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    [Index(nameof(Email), IsUnique = true)]
    public class Auth
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "varchar(20)")]
        public AuthRole Role { get; set; } = AuthRole.User;

        public List<Product>? Products { get; set; }

        [Required]
        public List<Purchase> Purchases { get; set; }

        // Constructor sin parámetros para evitar errores
        public Auth()
        {
            Purchases = new List<Purchase>();
        }

        // Constructor con lista de compras
        public Auth(List<Purchase> purchases)
        {
            Purchases = purchases ?? throw new ArgumentNullException(nameof(purchases));
        }

        private string _password = string.Empty;

        [Required]
        public string Password
        {
            get => _password; // Devuelve el valor almacenado (hasheado)
            set => _password = BCrypt.Net.BCrypt.HashPassword(value); // Se hashea automáticamente al asignar
        }

        // Método para verificar la contraseña
        public bool VerifyPassword(string password)
        {
            return BCrypt.Net.BCrypt.Verify(password, _password);
        }
    }
}