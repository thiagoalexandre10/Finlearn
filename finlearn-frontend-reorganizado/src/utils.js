export function formatCurrency(value = 0) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(value) {
  if (!value) return '—';
  const [year, month, day] = String(value).slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export function getPercent(current = 0, target = 1) {
  if (!target) return 0;
  return Math.min(100, Math.round((Number(current || 0) / Number(target)) * 100));
}
