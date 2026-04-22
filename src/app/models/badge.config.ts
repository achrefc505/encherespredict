export interface BadgeConfig {
  label: string;
  bg: string;
  color: string;
  border: string;
  dot?: string;
}

export const BADGE_CONFIG: Record<string, BadgeConfig> = {
  // enum BadgeType (PascalCase renvoyé par l'API .NET)
  TresBonneAffaire: { label: 'Très bonne affaire', bg: 'rgba(16,185,129,0.14)', color: '#34D399', border: 'rgba(16,185,129,0.28)', dot: '#10B981' },
  BonneAffaire:     { label: 'Bonne affaire',      bg: 'rgba(91,95,239,0.14)',  color: '#8B8FF9', border: 'rgba(91,95,239,0.28)',  dot: '#5B5FEF' },
  Neutre:           { label: 'Neutre',              bg: 'rgba(148,163,184,0.10)',color: '#94A3B8', border: 'rgba(148,163,184,0.20)',dot: '#64748B' },
  Risque:           { label: 'Risqué',              bg: 'rgba(239,68,68,0.14)',  color: '#F87171', border: 'rgba(239,68,68,0.28)',  dot: '#EF4444' },

  // enum AuctionStatus
  Active:           { label: '● Live',              bg: 'rgba(239,68,68,0.12)',  color: '#F87171', border: 'rgba(239,68,68,0.25)'  },
  Upcoming:         { label: 'À venir',             bg: 'rgba(245,158,11,0.10)', color: '#FCD34D', border: 'rgba(245,158,11,0.20)' },
  Closed:           { label: 'Clôturée',            bg: 'rgba(148,163,184,0.10)',color: '#94A3B8', border: 'rgba(148,163,184,0.20)' },

  // alias snake_case (compat anciens appels)
  tres_bonne_affaire: { label: 'Très bonne affaire', bg: 'rgba(16,185,129,0.14)', color: '#34D399', border: 'rgba(16,185,129,0.28)', dot: '#10B981' },
  bonne_affaire:      { label: 'Bonne affaire',      bg: 'rgba(91,95,239,0.14)',  color: '#8B8FF9', border: 'rgba(91,95,239,0.28)',  dot: '#5B5FEF' },
  neutre:             { label: 'Neutre',              bg: 'rgba(148,163,184,0.10)',color: '#94A3B8', border: 'rgba(148,163,184,0.20)',dot: '#64748B' },
  risque:             { label: 'Risqué',              bg: 'rgba(239,68,68,0.14)',  color: '#F87171', border: 'rgba(239,68,68,0.28)',  dot: '#EF4444' },
  live:               { label: '● Live',              bg: 'rgba(239,68,68,0.12)',  color: '#F87171', border: 'rgba(239,68,68,0.25)'  },
  upcoming:           { label: 'À venir',             bg: 'rgba(245,158,11,0.10)', color: '#FCD34D', border: 'rgba(245,158,11,0.20)' },
};
