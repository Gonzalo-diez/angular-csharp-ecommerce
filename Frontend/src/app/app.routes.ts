import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: '',
        redirectTo: '/api/product',
        pathMatch: 'full' 
    },
    {
        path: 'api/product',
        loadComponent: () => import('../app/features/product/product-list/product-list.component').then(m => m.ProductListComponent)
    },
    {
        path: 'api/product/:id',
        loadComponent: () => import('../app/features/product/product-item/product-item.component').then(m => m.ProductItemComponent)
    },
    {
        path: 'api/product/add',
        loadComponent: () => import('../app/features/product/product-add/product-add.component').then(m => m.ProductAddComponent)
    },
    {
        path: 'api/product/updateProduct/:id',
        loadComponent: () => import('../app/features/product/product-update/product-update.component').then(m => m.ProductUpdateComponent)
    },
    {
        path: 'api/cart',
        loadComponent: () => import('../app/features/cart/cart.component').then(m => m.CartComponent)
    },
    {
        path: 'api/auth/login',
        loadComponent: () => import('../app/features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'api/auth/register',
        loadComponent: () => import('../app/features/auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'api/dashboard',
        loadComponent: () => import('../app/features/dashboard/dashboard.component').then(m => m.DashboardComponent)
    }
];
