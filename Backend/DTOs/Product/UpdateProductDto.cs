namespace Backend.DTOs
{
    public class UpdateProductDto
    {
        public string? Name { get; set; }
        public string? Brand { get; set; }
        public decimal? Price { get; set; }
        public int? Stock { get; set; }
        public ProductCategory? Category { get; set; }
        public ProductSubCategory? SubCategory { get; set; }
        public ProductStatus? Status { get; set; } = ProductStatus.Enable;
    }

}