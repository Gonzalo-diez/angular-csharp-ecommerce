import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/auth/roles/admin.guard';
import { premiumGuard } from './core/guards/auth/roles/premium.guard';

export const routes: Routes = [
    { 
        path: '',
        redirectTo: 'product',
        pathMatch: 'full' 
    },
    {
        path: 'product',
        loadComponent: () => import('../app/features/product/product-list/product-list.component')
            .then(m => m.ProductListComponent)
    },
    {
        path: 'product/add',
        loadComponent: () => import('../app/features/product/product-add/product-add.component')
            .then(m => m.ProductAddComponent),
        canActivate: [premiumGuard]
    },
    {
        path: 'product/:id',
        loadComponent: () => import('../app/features/product/product-item/product-item.component')
            .then(m => m.ProductItemComponent)
    },
    {
        path: 'product/category/:category',
        loadComponent: () => import('../app/features/product/product-category/product-category.component')
            .then(m => m.ProductCategoryComponent)
    },
    {
        path: 'product/category/:category/subcategory/:subcategory',
        loadComponent: () => import('../app/features/product/product-subcategory/product-subcategory.component')
            .then(m => m.ProductSubcategoryComponent)
    },
    {
        path: 'product/update/:id',
        loadComponent: () => import('../app/features/product/product-update/product-update.component')
            .then(m => m.ProductUpdateComponent)
    },
    {
        path: 'cart',
        loadComponent: () => import('../app/features/cart/cart.component')
            .then(m => m.CartComponent)
    },
    {
        path: 'auth/login',
        loadComponent: () => import('../app/features/auth/login/login.component')
            .then(m => m.LoginComponent)
    },
    {
        path: 'auth/register',
        loadComponent: () => import('../app/features/auth/register/register.component')
            .then(m => m.RegisterComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('../app/features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
        canActivate: [adminGuard]
    }
];
