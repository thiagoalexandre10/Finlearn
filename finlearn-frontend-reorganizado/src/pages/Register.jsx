import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Gift, Lock, Mail, Phone, Shield, Target, TrendingUp, User } from 'lucide-react';
import Logo from '../components/Logo';
import { finlearnService } from '../api/finlearnService';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ nomeCompleto: '', cpf: '', email: '', telefone: '', senha: '', confirmarSenha: '' });
  const [error, setError] = useState('');

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.senha.length < 8) {
      setError('A senha precisa ter no mínimo 8 caracteres.');
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setError('As senhas não conferem.');
      return;
    }

    try {
      await finlearnService.cadastrarUsuario(form);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Não foi possível criar a conta.');
    }
  }

  return (
    <main className="auth-page register-page">
      <section className="auth-hero">
        <Logo />
        <h1>Comece sua jornada financeira com o <span>FinLearn</span></h1>
        <p>Crie sua conta e tenha tudo que você precisa para organizar, investir e fazer seu dinheiro crescer.</p>
        <div className="auth-benefits">
          <div><Target /><strong>Alcance suas metas</strong><span>Defina objetivos e acompanhe seu progresso de forma simples e visual.</span></div>
          <div><TrendingUp /><strong>Invista com inteligência</strong><span>Descubra oportunidades e invista com confiança e segurança.</span></div>
          <div><Gift /><strong>Ganhe recompensas</strong><span>Conclua desafios e receba recompensas por suas conquistas financeiras.</span></div>
        </div>
        <div className="protected-box"><Shield /> <div><strong>Seus dados estão protegidos</strong><span>Utilizamos criptografia e seguimos altos padrões de segurança.</span></div></div>
      </section>

      <section className="auth-content">
        <form className="auth-card register-card" onSubmit={handleSubmit}>
          <div className="auth-title-row"><div className="auth-icon"><User /></div><div><h2>Criar conta</h2><p>Abra sua conta gratuita e em poucos minutos</p></div></div>
          {error && <div className="error-banner span-2">{error}</div>}
          <div className="form-grid">
            <label>Nome completo<div className="input-icon"><User size={18} /><input required value={form.nomeCompleto} onChange={(e) => update('nomeCompleto', e.target.value)} placeholder="Digite seu nome completo" /></div></label>
            <label>CPF<div className="input-icon"><input required value={form.cpf} onChange={(e) => update('cpf', e.target.value)} placeholder="000.000.000-00" /></div></label>
            <label>E-mail<div className="input-icon"><Mail size={18} /><input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="seu@email.com" /></div></label>
            <label>Telefone<div className="input-icon"><Phone size={18} /><input value={form.telefone} onChange={(e) => update('telefone', e.target.value)} placeholder="(11) 99999-9999" /></div></label>
            <label className="span-2">Senha<div className="input-icon"><Lock size={18} /><input required type={showPassword ? 'text' : 'password'} value={form.senha} onChange={(e) => update('senha', e.target.value)} placeholder="Crie uma senha segura" /><button className="unstyled-button" type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><small>Mínimo de 8 caracteres com letras, números e símbolos.</small></label>
            <label className="span-2">Confirmar senha<div className="input-icon"><Lock size={18} /><input required type={showPassword ? 'text' : 'password'} value={form.confirmarSenha} onChange={(e) => update('confirmarSenha', e.target.value)} placeholder="Digite sua senha novamente" /><Eye size={18} /></div></label>
          </div>
          <label className="checkbox-label terms"><input required type="checkbox" /> Eu concordo com os Termos de Uso e a Política de Privacidade do FinLearn.</label>
          <button className="btn btn-primary auth-submit" type="submit"><Shield size={18} /> Cadastrar</button>
          <p className="center-text">Já tenho conta <Link to="/login">Entrar</Link></p>
          <div className="tiny-note"><Lock size={14} /> Cadastro rápido, gratuito e 100% seguro. Seus dados nunca serão compartilhados.</div>
        </form>
      </section>
    </main>
  );
}
