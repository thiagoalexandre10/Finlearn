import { Bell, Star } from 'lucide-react';

export default function PageHeader({ title, subtitle }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="header-actions">
        <div className="points-card">
          <Star size={18} fill="#f6c343" color="#f6c343" />
          <div>
            <strong>1.250</strong>
            <span>pontos</span>
          </div>
        </div>

        <button className="icon-button" type="button" aria-label="Notificações">
          <Bell size={20} />
        </button>

        <div className="user-pill">
          <div className="avatar">T</div>
          <div>
            <strong>Thiago</strong>
            <span>Nível 2 · Explorador Financeiro</span>
          </div>
        </div>
      </div>
    </header>
  );
}
