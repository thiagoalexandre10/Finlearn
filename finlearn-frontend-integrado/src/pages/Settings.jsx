import { useEffect, useState } from 'react';
import { Bell, HelpCircle, Lock, Palette, RefreshCw, Save, Shield, User } from 'lucide-react';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import { Button, Card, Field } from '../components/UI';
import { finlearnService } from '../api/finlearnService';
import { usuarioBase } from '../data';

const tabs = [
  { id: 'conta', label: 'Minha conta', icon: User },
  { id: 'aparencia', label: 'Aparência', icon: Palette },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'seguranca', label: 'Privacidade e segurança', icon: Shield },
  { id: 'ajuda', label: 'Ajuda e suporte', icon: HelpCircle },
];

export default function Settings() {
  const [tab, setTab] = useState('conta');
  const [theme, setTheme] = useState(localStorage.getItem('finlearn-theme') || 'light');
  const [accent, setAccent] = useState(localStorage.getItem('finlearn-accent') || '#007a3d');
  const [fontSize, setFontSize] = useState(localStorage.getItem('finlearn-font') || 'medium');
  const [form, setForm] = useState(usuarioBase);
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.dataset.font = fontSize;
    localStorage.setItem('finlearn-theme', theme);
    localStorage.setItem('finlearn-accent', accent);
    localStorage.setItem('finlearn-font', fontSize);
  }, [theme, accent, fontSize]);

  async function saveUser() {
    await finlearnService.atualizarUsuario(form.id, form);
    setMessage('Dados atualizados com sucesso no backend.');
  }

  return <><Header title="Configurações" subtitle="Personalize sua experiência no FinLearn" usuario={form} /><div className="page-content settings-page">{message && <div className="success-banner">{message}</div>}<div className="settings-grid"><Card className="settings-menu">{tabs.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon size={20} />{label}</button>)}</Card><Card className="settings-panel">{tab === 'conta' && <><div className="card-title-row"><div><h2>Minha conta</h2><p>Gerencie suas informações pessoais.</p></div><div className="dual-buttons"><Button variant="outline"><RefreshCw size={16} /> Atualizar dados</Button><Button onClick={saveUser}><Save size={16} /> Salvar alterações</Button></div></div><div className="profile-area"><Avatar size="lg" /><button className="edit-avatar">✎</button></div><div className="form-grid"><Field label="Nome completo"><input value={form.nomeCompleto} onChange={(e) => setForm({ ...form, nomeCompleto: e.target.value })} /></Field><Field label="CPF"><input value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} /></Field><Field label="E-mail"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field><Field label="Telefone"><input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></Field><Field label="Data de cadastro"><input value="24/05/2026" readOnly /></Field><Field label="Nível"><select value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })}><option>Explorador Financeiro</option><option>Investidor Iniciante</option></select></Field></div><Card className="security-strip"><Shield /><div><h3>Segurança da conta</h3><p>Gerencie a segurança e o acesso à sua conta.</p></div><Lock /><span>Alterar senha</span><Shield /><span>Segurança da conta</span></Card></>}{tab === 'aparencia' && <><h2>Aparência</h2><p>Personalize como o FinLearn aparece para você.</p><h4>Modo de exibição</h4><div className="choice-grid"><button className={theme === 'light' ? 'selected' : ''} onClick={() => setTheme('light')}>☀️<span>Claro</span></button><button className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')}>🌙<span>Escuro</span></button><button className={theme === 'auto' ? 'selected' : ''} onClick={() => setTheme('auto')}>💻<span>Automático</span></button></div><h4>Cor principal</h4><div className="color-row">{['#007a3d', '#7c4dff', '#22c55e', '#14b8a6', '#f59e0b', '#ef4444'].map((color) => <button key={color} className={accent === color ? 'selected' : ''} style={{ background: color }} onClick={() => setAccent(color)} />)}</div><h4>Fonte do aplicativo</h4><div className="choice-grid"><button className={fontSize === 'small' ? 'selected' : ''} onClick={() => setFontSize('small')}>A-<span>Pequena</span></button><button className={fontSize === 'medium' ? 'selected' : ''} onClick={() => setFontSize('medium')}>A<span>Média</span></button><button className={fontSize === 'large' ? 'selected' : ''} onClick={() => setFontSize('large')}>A+<span>Grande</span></button></div></>}{tab !== 'conta' && tab !== 'aparencia' && <div className="placeholder-panel"><h2>{tabs.find((item) => item.id === tab)?.label}</h2><p>Área pronta para receber as regras do backend quando o Controller correspondente for criado.</p><Button>Salvar preferências</Button></div>}</Card></div></div></>;
}
