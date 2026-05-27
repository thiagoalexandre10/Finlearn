import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Star } from 'lucide-react';
import Avatar from './Avatar';
import { finlearnService } from '../api/finlearnService';

export default function Header({ title, subtitle, usuario }) {
  const [open, setOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);

  async function loadNotifications() {
    setNotificacoes(await finlearnService.listarNotificacoes());
  }

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 2500);
    return () => clearInterval(interval);
  }, []);

  async function markAllRead() {
    await finlearnService.marcarNotificacoesComoLidas();
    loadNotifications();
  }

  const unread = notificacoes.filter((item) => !item.lida).length;

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
            <strong>{Number(usuario?.pontos || 1250).toLocaleString('pt-BR')}</strong>
            <span>pontos</span>
          </div>
        </div>

        <div className="notification-wrap">
          <button className="icon-button" type="button" aria-label="Notificações" onClick={() => setOpen((value) => !value)}>
            <Bell size={18} />
            {unread > 0 && <i className="notification-badge">{unread}</i>}
          </button>

          {open && (
            <div className="notification-menu">
              <div className="notification-head">
                <strong>Notificações</strong>
                <button type="button" onClick={markAllRead}><CheckCheck size={14} /> Marcar lidas</button>
              </div>
              <div className="notification-list">
                {notificacoes.length === 0 && <p>Nenhuma notificação por enquanto.</p>}
                {notificacoes.slice(0, 8).map((item) => (
                  <article key={item.id} className={item.lida ? 'read' : ''}>
                    <strong>{item.titulo}</strong>
                    <span>{item.mensagem}</span>
                    <small>{item.data || 'Hoje'}</small>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

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
