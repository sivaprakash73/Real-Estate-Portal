// Formatting helpers (Indian numbering: lakhs / crores).

export function formatINR(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

export function formatINRCompact(n) {
  const v = Number(n || 0);
  if (v >= 1e7) return '₹' + trimZero((v / 1e7).toFixed(2)) + ' Cr';
  if (v >= 1e5) return '₹' + trimZero((v / 1e5).toFixed(1)) + ' L';
  return formatINR(v);
}

function trimZero(s) {
  return String(parseFloat(s));
}

export function priceLabel(property) {
  const base = formatINRCompact(property.price);
  return property.listingType === 'rent' ? `${base}/mo` : base;
}

export function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [name, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const LEAD_STATUSES = [
  { value: 'new', label: 'New', badge: 'primary' },
  { value: 'contacted', label: 'Contacted', badge: 'info' },
  { value: 'site-visit', label: 'Site Visit', badge: 'warning' },
  { value: 'negotiation', label: 'Negotiation', badge: 'secondary' },
  { value: 'closed', label: 'Closed (Won)', badge: 'success' },
  { value: 'lost', label: 'Lost', badge: 'danger' },
];

export function leadStatusMeta(value) {
  return LEAD_STATUSES.find((s) => s.value === value) || LEAD_STATUSES[0];
}

export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Independent House', 'Penthouse', 'Plot'];

export const CITIES = ['Chennai', 'Bangalore', 'Coimbatore', 'Hyderabad', 'Kochi', 'Madurai'];

export const PLACEHOLDER_IMG = '/images/placeholder.svg';
