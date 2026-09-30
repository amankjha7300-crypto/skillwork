export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSecs < 60) return 'Just now';
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
  if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
  return `${Math.floor(diffSecs / 86400)}d ago`;
}

export function getTimeRemaining(expiresAt: string): { minutes: number; seconds: number; isExpired: boolean; formatted: string } {
  if (!expiresAt) return { minutes: 0, seconds: 0, isExpired: false, formatted: '00:00' };
  
  const end = new Date(expiresAt).getTime();
  const now = new Date().getTime();
  const diff = Math.max(0, Math.floor((end - now) / 1000));

  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  const isExpired = diff <= 0;

  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  return { minutes, seconds, isExpired, formatted: `${mm}:${ss}` };
}
