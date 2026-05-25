import {
  BookOpen,
  Bot,
  CreditCard,
  FileText,
  Home,
  LineChart,
  LogOut,
  Settings,
  Star,
  Target,
  Trophy,
  WalletCards,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';

const items = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/transacoes', label: 'Transações', icon: FileText },
  { to: '/contas', label: 'Contas', icon: CreditCard },
  { to: '/investimentos', label: 'Investimentos', icon: LineChart },
  { to: '/metas', label: 'Metas', icon: Target },
  { to: '/desafios', label: 'Desafios', icon: Trophy },
  { to: '/conquistas', label: 'Conquistas', icon: Star },
  { to: '/ranking', label: 'Ranking', icon: WalletCards },
  { to: '/educacao', label: 'Educação Financeira', icon: BookOpen },
  { to: '/assistente', label: 'Assistente', icon: Bot },
  { to: '/relatorios', label: 'Relatórios', icon: FileText },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Logo />
      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <button className="logout-button" type="button">
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}
