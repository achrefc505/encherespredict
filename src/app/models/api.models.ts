// DTOs correspondant exactement au backend C# .NET 8

export interface AuctionListItem {
  id: string;
  title: string;
  tribunal: string;
  city: string;
  region: string;
  surface: number;
  rooms: number;
  type: string;
  startPrice: number;
  aiEstimate: number;
  confidence: number;
  roi: number;
  badge: string;
  status: string;
  auctionDate: string;
}

export interface AiAnalysisDto {
  pricePerSqm: number;
  marketTrend: string;
  renovationCost: number;
  netYield: number;
  grossYield: number;
  potentialResalePrice: number;
  riskFactors: string[];
  strengths: string[];
  modelVersion: string;
  analyzedAt: string;
}

export interface DocumentDto {
  id: string;
  name: string;
  type: string;
  size: string;
  available: boolean;
}

export interface AuctionDetail {
  id: string;
  title: string;
  tribunal: string;
  city: string;
  region: string;
  address: string;
  surface: number;
  rooms: number;
  type: string;
  description: string;
  startPrice: number;
  aiEstimate: number;
  confidence: number;
  roi: number;
  badge: string;
  status: string;
  auctionDate: string;
  aiAnalysis: AiAnalysisDto | null;
  documents: DocumentDto[];
}

export interface AuctionsResult {
  items: AuctionListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BadgeCounts {
  tresBonneAffaire: number;
  bonneAffaire: number;
  neutre: number;
  risque: number;
}

export interface ChartPoint {
  title: string;
  startPrice: number;
  aiEstimate: number;
  roi: number;
}

export interface DashboardStats {
  totalAuctions: number;
  avgRoi: number;
  avgConfidence: number;
  totalOpportunities: number;
  byBadge: BadgeCounts;
  chartData: ChartPoint[];
}

export interface AlertDto {
  id: string;
  auctionId: string | null;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
