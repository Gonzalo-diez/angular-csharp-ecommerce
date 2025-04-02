import { ProductCategory } from "../product/product-category";
import { ProductSubCategory } from "../product/product-sub-category";

export interface UserDto {
  id?: number;
  name: string;
  email: string;
}

export interface ProductDto {
  id?: number;
  name: string;
  category: string;
  price: number;
}

export interface CategoryProductCount {
  category: ProductCategory;
  totalProducts: number;
}

export interface CategorySalesDto {
  category: ProductCategory;
  totalSold: number;
  percentageSold: number;
}

export interface SubcategorySalesDto {
  category: ProductCategory;
  subCategory: ProductSubCategory;
  totalSold: number;
  percentageSold: number;
}

export interface DashboardModel {
  totalUsers: number;
  users: UserDto[];
  totalPurchases: number;
  products: ProductDto[];
  totalProducts: number;
  totalRevenue: number;
  productsByCategory: CategoryProductCount[];
  categorySales: CategorySalesDto[];
  subcategorySales: SubcategorySalesDto[];
}
