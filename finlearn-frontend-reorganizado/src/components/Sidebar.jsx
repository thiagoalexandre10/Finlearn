import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Logo from './Logo';
import { navItems } from '../data';

export default function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('finlearn-auth-user');
    navigate('/login', { replace: true });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo />
      </div>

      <nav className="sidebar-nav" aria-label="Menu principal">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} end={path === '/home'} className="nav-item">
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" type="button" onClick={logout}>
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}
