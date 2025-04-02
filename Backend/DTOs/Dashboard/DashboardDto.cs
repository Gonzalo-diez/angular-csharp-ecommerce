namespace Backend.DTOs
{
    public class DashboardDTO
    {
        public int TotalUsers { get; set; }
        public List<UserDTO> Users { get; set; }
        public int TotalProducts { get; set; }
        public List<ProductDTO> Products { get; set; }
        public List<CategoryProductCount> ProductsByCategory { get; set; }
        public int TotalPurchases { get; set; }
        public decimal TotalRevenue { get; set; }
        public List<CategorySalesDTO> CategorySales { get; set; }
        public List<SubcategorySalesDTO> SubcategorySales { get; set; }

        public DashboardDTO()
        {
            ProductsByCategory = new List<CategoryProductCount>();
            Users = new List<UserDTO>();
            Products = new List<ProductDTO>();
            CategorySales = new List<CategorySalesDTO>();
            SubcategorySales = new List<SubcategorySalesDTO>();
        }
    }
}