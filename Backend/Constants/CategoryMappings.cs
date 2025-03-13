namespace Backend.Constants
{
    public static class CategoryMappings
    {
        public static readonly Dictionary<ProductCategory, List<ProductSubCategory>> SubCategories =
            new Dictionary<ProductCategory, List<ProductSubCategory>>
            {
                { ProductCategory.Technology, new List<ProductSubCategory> { ProductSubCategory.PC, ProductSubCategory.Console } },
                { ProductCategory.Clothing, new List<ProductSubCategory> { ProductSubCategory.Men, ProductSubCategory.Women } },
                { ProductCategory.Home, new List<ProductSubCategory> { ProductSubCategory.Kitchen, ProductSubCategory.Furniture } }
            };
    }
}