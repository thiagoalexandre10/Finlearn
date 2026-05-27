import { useEffect, useState } from 'react';
import { Bell, CheckCircle, HelpCircle, Lock, Mail, Palette, RefreshCw, Save, Shield, Smartphone, User } from 'lucide-react';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import { Button, Card, Field, Modal } from '../components/UI';
import { PasswordForm } from '../components/forms';
import { finlearnService } from '../api/finlearnService';
import { usuarioBase } from '../data';

const tabs = [
  { id: 'conta', label: 'Minha conta', icon: User },
  { id: 'aparencia', label: 'Aparência', icon: Palette },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'seguranca', label: 'Privacidade e segurança', icon: Shield },
  { id: 'ajuda', label: 'Ajuda e suporte', icon: HelpCircle },
];

const accentOptions = [
  { label: 'Verde FinLearn', value: '#007a3d', sidebar: '#003f2a' },
  { label: 'Roxo', value: '#7c4dff', sidebar: '#2b176d' },
  { label: 'Verde claro', value: '#22c55e', sidebar: '#064e3b' },
  { label: 'Turquesa', value: '#14b8a6', sidebar: '#0f3f3a' },
  { label: 'Laranja', value: '#f59e0b', sidebar: '#5c3600' },
  { label: 'Vermelho', value: '#ef4444', sidebar: '#5f1515' },
];

export default function Settings() {
  const [tab, setTab] = useState('conta');
  const [theme, setTheme] = useState(localStorage.getItem('finlearn-theme') || 'light');
  const [accent, setAccent] = useState(localStorage.getItem('finlearn-accent') || '#007a3d');
  const [fontSize, setFontSize] = useState(localStorage.getItem('finlearn-font-size') || 'medium');
  const [usuario, setUsuario] = useState(usuarioBase);
  const [form, setForm] = useState({ email: '', telefone: '' });
  const [notice, setNotice] = useState('');
  const [passwordModal, setPasswordModal] = useState(false);
  const [prefs, setPrefs] = useState({ pix: true, metas: true, pontos: true, relatorios: false, email: true, push: true });

  async function load() {
    const dashboard = await finlearnService.carregarDashboard();
    setUsuario(dashboard.usuario);
    setForm({ email: dashboard.usuario.email || '', telefone: dashboard.usuario.telefone || '' });
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const selectedAccent = accentOptions.find((item) => item.value === accent) || accentOptions[0];
    const selectedTheme = theme === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    document.documentElement.style.setProperty('--accent', selectedAccent.value);
    document.documentElement.style.setProperty('--accent-2', selectedAccent.value);
    document.documentElement.style.setProperty('--accent-3', selectedAccent.sidebar);
    document.documentElement.style.setProperty('--sidebar', selectedAccent.sidebar);
    document.documentElement.style.setProperty('--sidebar-2', selectedAccent.value);
    document.documentElement.dataset.theme = selectedTheme;
    document.documentElement.dataset.font = fontSize;

    localStorage.setItem('finlearn-theme', theme);
    localStorage.setItem('finlearn-accent', accent);
    localStorage.setItem('finlearn-font-size', fontSize);
  }, [theme, accent, fontSize]);

  async function saveAccount(event) {
    event.preventDefault();
    try {
      const updated = await finlearnService.atualizarUsuario(usuario.id, form);
      setUsuario(updated);
      setNotice('Dados atualizados. CPF, nome e data de nascimento permanecem bloqueados por segurança.');
    } catch (error) {
      setNotice(error.message || 'Não foi possível atualizar os dados.');
    }
  }

  async function changePassword(payload) {
    try {
      await finlearnService.alterarSenha(payload);
      setNotice('Senha alterada com sucesso.');
      setPasswordModal(false);
    } catch (error) {
      setNotice(error.message || 'Não foi possível alterar a senha.');
    }
  }

  function togglePref(name) {
    setPrefs((prev) => ({ ...prev, [name]: !prev[name] }));
    setNotice('Preferência de notificação atualizada.');
  }

  return (
    <>
      <Header title="Configurações" subtitle="Personalize sua experiência no FinLearn" usuario={usuario} />
      <div className="page-content settings-page">
        {notice && <div className="success-banner">{notice}</div>}
        <div className="settings-layout">
          <Card className="settings-menu">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
                <Icon size={20} /> {label}
              </button>
            ))}
          </Card>

          <div className="settings-main">
            {tab === 'conta' && (
              <Card>
                <div className="card-title-row"><div><h2>Minha conta</h2><p>Dados principais protegidos. Você pode alterar e-mail, telefone e senha.</p></div><Button onClick={saveAccount}><Save size={16} /> Salvar alterações</Button></div>
                <div className="profile-row"><Avatar size="lg" /><div><strong>{usuario.nomeCompleto}</strong><span>Nível 2 · {usuario.nivel}</span></div></div>
                <form className="form-grid" onSubmit={saveAccount}>
                  <Field label="Nome completo"><input value={usuario.nomeCompleto || ''} disabled /></Field>
                  <Field label="CPF"><input value={usuario.cpf || ''} disabled /></Field>
                  <Field label="Data de nascimento"><input value={usuario.dataNascimento || '15/05/1998'} disabled /></Field>
                  <Field label="E-mail"><input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} /></Field>
                  <Field label="Telefone"><input value={form.telefone} onChange={(e) => setForm((prev) => ({ ...prev, telefone: e.target.value }))} /></Field>
                  <div className="form-actions span-2"><Button variant="outline" onClick={() => load()}><RefreshCw size={16} /> Recarregar dados</Button><Button type="submit"><Save size={16} /> Salvar alterações</Button></div>
                </form>
                <div className="security-shortcuts"><article><Shield /><div><strong>Segurança da conta</strong><span>Dados sensíveis bloqueados para edição.</span></div></article><button onClick={() => setPasswordModal(true)}><Lock /> Alterar senha</button><article><Smartphone /><div><strong>Dispositivos</strong><span>Sessão atual protegida.</span></div></article></div>
              </Card>
            )}

            {tab === 'aparencia' && (
              <Card>
                <h2>Aparência</h2><p>Altere tema, cor principal e tamanho de fonte. A sidebar também muda junto.</p>
                <div className="appearance-section"><h4>Modo de exibição</h4><div className="option-grid"><button className={theme === 'light' ? 'selected' : ''} onClick={() => setTheme('light')}>☀️ Claro</button><button className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')}>🌙 Escuro</button><button className={theme === 'auto' ? 'selected' : ''} onClick={() => setTheme('auto')}>💻 Automático</button></div></div>
                <div className="appearance-section"><h4>Cor principal</h4><div className="color-row">{accentOptions.map((option) => <button key={option.value} className={accent === option.value ? 'active' : ''} style={{ background: option.value }} onClick={() => setAccent(option.value)} title={option.label} />)}</div></div>
                <div className="appearance-section"><h4>Fonte do aplicativo</h4><div className="option-grid"><button className={fontSize === 'small' ? 'selected' : ''} onClick={() => setFontSize('small')}>A- Pequena</button><button className={fontSize === 'medium' ? 'selected' : ''} onClick={() => setFontSize('medium')}>A Média</button><button className={fontSize === 'large' ? 'selected' : ''} onClick={() => setFontSize('large')}>A+ Grande</button></div></div>
              </Card>
            )}

            {tab === 'notificacoes' && (
              <Card>
                <h2>Notificações</h2><p>Controle quais eventos aparecem no sininho e nos avisos do sistema.</p>
                <div className="settings-list">
                  {[
                    ['pix', 'Pix e transferências', 'Receba avisos de Pix enviados, recebidos e transferências.'],
                    ['metas', 'Metas e desafios', 'Avise quando uma meta for concluída ou vencer sem atingir.'],
                    ['pontos', 'Ganhos e perdas de pontos', 'Notifique alterações que impactam o ranking.'],
                    ['relatorios', 'Resumo de relatórios', 'Receba resumo de entradas, saídas e investimentos.'],
                    ['email', 'E-mail', 'Enviar alertas importantes para seu e-mail.'],
                    ['push', 'Push no aplicativo', 'Mostrar avisos diretamente na interface.'],
                  ].map(([key, title, description]) => (
                    <article key={key}><div><strong>{title}</strong><span>{description}</span></div><button className={prefs[key] ? 'switch on' : 'switch'} onClick={() => togglePref(key)}><i /></button></article>
                  ))}
                </div>
              </Card>
            )}

            {tab === 'seguranca' && (
              <Card>
                <h2>Privacidade e segurança</h2><p>Central de proteção de conta, dados e acesso.</p>
                <div className="security-grid"><article><Shield /><strong>Dados sensíveis protegidos</strong><span>CPF, nome e data de nascimento não podem ser alterados nas configurações.</span></article><article><Lock /><strong>Senha</strong><span>Altere a senha quando precisar.</span><Button variant="outline" onClick={() => setPasswordModal(true)}>Alterar senha</Button></article><article><Mail /><strong>Comunicação</strong><span>Seu e-mail é usado para recuperação de senha e avisos importantes.</span></article><article><CheckCircle /><strong>Backend</strong><span>Quando o Spring estiver ativo, as atualizações são enviadas para a API REST.</span></article></div>
              </Card>
            )}

            {tab === 'ajuda' && (
              <Card>
                <h2>Ajuda e suporte</h2><p>Encontre respostas rápidas e canais de suporte.</p>
                <div className="faq-list"><details open><summary>Por que meu saldo muda depois do Pix?</summary><p>Pix enviado diminui saldo; Pix recebido aumenta saldo. Tudo entra em movimentações, extrato, notificações e relatórios.</p></details><details><summary>Como funcionam os pontos?</summary><p>Metas concluídas e investimentos geram pontos. Metas vencidas sem atingir o valor podem gerar perda de pontos.</p></details><details><summary>Por que o backend pode não responder?</summary><p>Se o Oracle/FIAP estiver bloqueado pela rede, o Spring pode cair. O frontend mantém fallback local para testes.</p></details></div>
                <div className="support-card"><HelpCircle /><div><strong>Precisa de ajuda?</strong><span>Envie uma mensagem para suporte@finlearn.com ou use o Assistente no menu lateral.</span></div></div>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)} title="Alterar senha" subtitle="Confirme sua senha atual para criar uma nova.">
        <PasswordForm onSubmit={changePassword} onCancel={() => setPasswordModal(false)} />
      </Modal>
    </>
  );
}
