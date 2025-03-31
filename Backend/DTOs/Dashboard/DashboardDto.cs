namespace Backend.DTOs
{
    public class DashboardDTO
    {
        public int TotalUsers { get; set; }
        public int TotalProducts { get; set; }
        public List<CategoryProductCount> ProductsByCategory { get; set; }
        public int TotalPurchases { get; set; }
        public decimal TotalRevenue { get; set; }

        public DashboardDTO()
        {
            ProductsByCategory = new List<CategoryProductCount>();
        }
    }
}