namespace Backend.DTOs
{
    public class CategorySalesDTO
    {
        public string Category { get; set; } = null!;
        public int TotalSold { get; set; }
        public decimal PercentageSold { get; set; }
    }

    public class SubcategorySalesDTO
    {
        public string Category { get; set; } = null!;
        public string SubCategory { get; set; } = null!;
        public int TotalSold { get; set; }
        public decimal PercentageSold { get; set; }
    }

}