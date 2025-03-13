namespace Backend.Interfaces
{
    public interface IDashboardRepository
    {
        Task<int> GetTotalUsers();
        Task<int> GetTotalProducts();
        Task<int> GetTotalPurchases();
        Task<decimal> GetTotalRevenue();
    }
}
