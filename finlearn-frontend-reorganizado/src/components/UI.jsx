import { X } from 'lucide-react';

export function Card({ children, className = '' }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function StatCard({ icon: Icon, label, value, hint, tone = 'green' }) {
  return (
    <Card className="stat-card">
      {Icon && (
        <div className={`stat-icon ${tone}`}>
          <Icon size={22} />
        </div>
      )}
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {hint && <small>{hint}</small>}
      </div>
    </Card>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} type="button" {...props}>
      {children}
    </button>
  );
}

export function Modal({ title, subtitle, isOpen, onClose, children, width = 'md' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className={`modal-card modal-${width}`} role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function EmptyState({ message }) {
  return <div className="empty-state">{message}</div>;
}
