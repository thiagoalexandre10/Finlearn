import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeOff, Lock, Mail, Shield, UserPlus } from 'lucide-react';
import Logo from '../components/Logo';
import { finlearnService } from '../api/finlearnService';

export default function Forgot() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ cpf: '', email: '', novaSenha: '', confirmarSenha: '' });
  const [error, setError] = useState('');

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.novaSenha !== form.confirmarSenha) {
      setError('As senhas não conferem.');
      return;
    }

    try {
      await finlearnService.redefinirSenha(form);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Não foi possível redefinir a senha.');
    }
  }

  return (
    <main className="auth-page forgot-page compact-auth">
      <section className="auth-hero rounded-hero">
        <Logo />
        <span className="secure-badge"><Shield size={14} /> Sua segurança é nossa prioridade</span>
        <h1>Recupere o acesso à sua conta com tranquilidade</h1>
        <p>Informe seus dados e escolha uma nova senha segura para continuar cuidando do seu futuro financeiro.</p>
        <div className="lock-illustration" />
      </section>
      <section className="auth-content">
        <form className="auth-card forgot-card" onSubmit={handleSubmit}>
          <div className="auth-title-row"><div className="auth-icon"><Lock /></div><div><h2>Esqueci minha senha</h2><p>Preencha os campos abaixo para criar uma nova senha e recuperar o acesso à sua conta.</p></div></div>
          {error && <div className="error-banner">{error}</div>}
          <label>CPF<input required value={form.cpf} onChange={(e) => update('cpf', e.target.value)} placeholder="000.000.000-00" /></label>
          <label>E-mail<div className="input-icon"><input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="seu@email.com" /><Mail size={18} /></div></label>
          <label>Nova senha<div className="input-icon"><input required type="password" value={form.novaSenha} onChange={(e) => update('novaSenha', e.target.value)} placeholder="Crie uma nova senha" /><EyeOff size={18} /></div></label>
          <label>Confirmar nova senha<div className="input-icon"><input required type="password" value={form.confirmarSenha} onChange={(e) => update('confirmarSenha', e.target.value)} placeholder="Confirme sua nova senha" /><EyeOff size={18} /></div></label>
          <button className="btn btn-primary auth-submit" type="submit"><Lock size={18} /> Redefinir senha</button>
          <div className="auth-row"><Link to="/login">← Voltar para login</Link><Link to="/registrar"><UserPlus size={14} /> Criar conta</Link></div>
          <div className="safe-note"><Shield size={24} /><div><strong>Usamos seus dados para validar sua conta com segurança</strong><span>Verificaremos suas informações para garantir que você é o titular da conta.</span></div></div>
        </form>
      </section>
    </main>
  );
}
