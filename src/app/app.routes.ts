import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    loadComponent: () => import('./screens/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./screens/onboarding/onboarding.component').then(m => m.OnboardingComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./screens/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'auctions',
    loadComponent: () => import('./screens/auction-list/auction-list.component').then(m => m.AuctionListComponent)
  },
  {
    path: 'auctions/:id',
    loadComponent: () => import('./screens/property-detail/property-detail.component').then(m => m.PropertyDetailComponent)
  },
  {
    path: 'profitability/:id',
    loadComponent: () => import('./screens/property-detail/property-detail.component').then(m => m.PropertyDetailComponent),
    data: { defaultTab: 'rentabilite' }
  },
  { path: '**', redirectTo: 'landing' }
];
