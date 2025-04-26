using System.ComponentModel.DataAnnotations;

public class UpgradeRequestDto
{
    [Required]
    public string PaymentMethod { get; set; } = null!;

    [Required]
    [Range(1000000000000000, 9999999999999999)]
    public string CardNumber { get; set; } = null!;

    [Required]
    [Range(100, 9999)] // usualmente 3 o 4 dígitos
    public int SecurityNumber { get; set; }
}
