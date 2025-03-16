namespace Backend.Constants
{
    public static class CategoryMappings
    {
        public static readonly Dictionary<ProductCategory, List<ProductSubCategory>> SubCategories =
    new Dictionary<ProductCategory, List<ProductSubCategory>>
    {
        { ProductCategory.Technology, new List<ProductSubCategory> { ProductSubCategory.PC, ProductSubCategory.Console, ProductSubCategory.Smartphone } },
        { ProductCategory.Clothing, new List<ProductSubCategory> { ProductSubCategory.Men, ProductSubCategory.Women, ProductSubCategory.Kids } },
        { ProductCategory.Home, new List<ProductSubCategory> { ProductSubCategory.Kitchen, ProductSubCategory.Furniture, ProductSubCategory.Decor } }
    };

    }
}