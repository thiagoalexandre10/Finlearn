export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function SectionTitle({ title, action }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action && <span>{action}</span>}
    </div>
  );
}
