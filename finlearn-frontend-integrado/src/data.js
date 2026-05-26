import {
  Home,
  FileText,
  CreditCard,
  TrendingUp,
  Target,
  Trophy,
  Star,
  BarChart3,
  BookOpen,
  Bot,
  Mail,
  Settings,
} from 'lucide-react';

export const navItems = [
  { label: 'Início', path: '/', icon: Home },
  { label: 'Transações', path: '/transacoes', icon: FileText },
  { label: 'Contas', path: '/contas', icon: CreditCard },
  { label: 'Investimentos', path: '/investimentos', icon: TrendingUp },
  { label: 'Metas', path: '/metas', icon: Target },
  { label: 'Desafios', path: '/desafios', icon: Trophy },
  { label: 'Conquistas', path: '/conquistas', icon: Star },
  { label: 'Ranking', path: '/ranking', icon: BarChart3 },
  { label: 'Educação Financeira', path: '/educacao', icon: BookOpen },
  { label: 'Assistente', path: '/assistente', icon: Bot },
  { label: 'Relatórios', path: '/relatorios', icon: Mail },
  { label: 'Configurações', path: '/configuracoes', icon: Settings },
];

export const usuarioBase = {
  id: 1,
  nome: 'Thiago',
  nomeCompleto: 'Thiago Santos',
  email: 'thiago@finlearn.com',
  cpf: '123.456.789-00',
  telefone: '(11) 99999-9999',
  pontos: 1250,
  nivel: 'Explorador Financeiro',
};
