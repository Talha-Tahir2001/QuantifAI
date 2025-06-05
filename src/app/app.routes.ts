import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),        
    },
    {
        path: 'detect',
        loadComponent: () => import('./pages/detect/detect.component').then(m => m.DetectComponent),        
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),        
    }
];
