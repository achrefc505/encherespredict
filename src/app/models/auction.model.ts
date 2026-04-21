export interface Auction {
  id: number;
  title: string;
  type: string;
  city: string;
  address: string;
  surface: number;
  floor: string;
  rooms: number;
  startPrice: number;
  aiEstimate: number;
  aiLow: number;
  aiHigh: number;
  confidence: number;
  badge: BadgeType;
  tribunal: string;
  date: string;
  roi: number;
  cashflow: number;
  status: 'upcoming' | 'live';
  documents: string[];
  comparables: number;
  marketPricePerM2: number;
  priceHistory: number[];
}

export type BadgeType = 'tres_bonne_affaire' | 'bonne_affaire' | 'neutre' | 'risque' | 'live' | 'upcoming';

export interface BadgeConfig {
  label: string;
  bg: string;
  color: string;
  border: string;
  dot?: string;
}

export const BADGE_CONFIG: Record<string, BadgeConfig> = {
  tres_bonne_affaire: { label: 'Très bonne affaire', bg: 'rgba(16,185,129,0.14)', color: '#34D399', border: 'rgba(16,185,129,0.28)', dot: '#10B981' },
  bonne_affaire:      { label: 'Bonne affaire',      bg: 'rgba(91,95,239,0.14)',  color: '#8B8FF9', border: 'rgba(91,95,239,0.28)',  dot: '#5B5FEF' },
  neutre:             { label: 'Neutre',              bg: 'rgba(148,163,184,0.10)',color: '#94A3B8', border: 'rgba(148,163,184,0.20)',dot: '#64748B' },
  risque:             { label: 'Risqué',              bg: 'rgba(239,68,68,0.14)',  color: '#F87171', border: 'rgba(239,68,68,0.28)',  dot: '#EF4444' },
  live:               { label: '● Live',              bg: 'rgba(239,68,68,0.12)',  color: '#F87171', border: 'rgba(239,68,68,0.25)'  },
  upcoming:           { label: 'À venir',             bg: 'rgba(245,158,11,0.10)', color: '#FCD34D', border: 'rgba(245,158,11,0.20)' },
};
