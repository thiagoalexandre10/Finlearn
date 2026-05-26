import { Bell, Star } from 'lucide-react';
import Avatar from './Avatar';

export default function Header({ title, subtitle, usuario }) {
  return (
    <header className="app-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="header-actions">
        <div className="points-pill">
          <Star size={18} fill="currentColor" />
          <div>
            <strong>{usuario?.pontos?.toLocaleString('pt-BR') || '1.250'}</strong>
            <span>pontos</span>
          </div>
        </div>

        <button className="icon-button" type="button" aria-label="Notificações">
          <Bell size={18} />
        </button>

        <div className="user-pill">
          <Avatar size="sm" />
          <div>
            <strong>{usuario?.nome || 'Thiago'}</strong>
            <span>Nível 2 · {usuario?.nivel || 'Explorador Financeiro'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
