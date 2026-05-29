import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    loadComponent: () => import('./screens/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./screens/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./screens/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'onboarding',
    canActivate: [authGuard],
    loadComponent: () => import('./screens/onboarding/onboarding.component').then(m => m.OnboardingComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./screens/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'auctions',
    canActivate: [authGuard],
    loadComponent: () => import('./screens/auction-list/auction-list.component').then(m => m.AuctionListComponent)
  },
  {
    path: 'auctions/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./screens/property-detail/property-detail.component').then(m => m.PropertyDetailComponent)
  },
  {
    path: 'profitability/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./screens/property-detail/property-detail.component').then(m => m.PropertyDetailComponent),
    data: { defaultTab: 'rentabilite' }
  },
  { path: '**', redirectTo: 'landing' }
];
