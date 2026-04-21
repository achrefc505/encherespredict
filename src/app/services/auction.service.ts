import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuctionDetail, AuctionListItem, AuctionsResult, DashboardStats, AlertDto } from '../models/api.models';
import { environment } from '../../environments/environment';

export interface AuctionFilters {
  city?: string;
  type?: string;
  badge?: string;
  region?: string;
  budgetMin?: number;
  budgetMax?: number;
  sort?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class AuctionService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getAuctions(filters: AuctionFilters = {}): Observable<AuctionsResult> {
    let params = new HttpParams();
    if (filters.city)      params = params.set('city', filters.city);
    if (filters.type)      params = params.set('type', filters.type);
    if (filters.badge)     params = params.set('badge', filters.badge);
    if (filters.region)    params = params.set('region', filters.region);
    if (filters.budgetMin) params = params.set('budgetMin', filters.budgetMin);
    if (filters.budgetMax) params = params.set('budgetMax', filters.budgetMax);
    if (filters.sort)      params = params.set('sort', filters.sort);
    if (filters.page)      params = params.set('page', filters.page);
    if (filters.pageSize)  params = params.set('pageSize', filters.pageSize);
    return this.http.get<AuctionsResult>(`${this.base}/auctions`, { params });
  }

  getAuction(id: string): Observable<AuctionDetail> {
    return this.http.get<AuctionDetail>(`${this.base}/auctions/${id}`);
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/auctions/stats`);
  }

  getAlerts(): Observable<AlertDto[]> {
    return this.http.get<AlertDto[]>(`${this.base}/alerts`);
  }

  markAlertRead(id: string): Observable<void> {
    return this.http.patch<void>(`${this.base}/alerts/${id}/read`, {});
  }
}
