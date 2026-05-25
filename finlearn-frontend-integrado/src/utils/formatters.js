export function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatDate(value) {
  if (!value) return '-';
  const stringValue = String(value);
  if (!stringValue.includes('-')) return stringValue;
  const [year, month, day] = stringValue.split('-');
  return `${day}/${month}/${year}`;
}

export function toInputDate(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

export function calculateProgress(currentValue, targetValue) {
  const current = Number(currentValue || 0);
  const target = Number(targetValue || 0);
  if (target <= 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}
