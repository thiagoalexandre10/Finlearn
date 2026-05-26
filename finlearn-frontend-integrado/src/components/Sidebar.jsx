import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Logo from './Logo';
import { navItems } from '../data';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo />
      </div>

      <nav className="sidebar-nav" aria-label="Menu principal">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} end={path === '/'} className="nav-item">
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" type="button">
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}
