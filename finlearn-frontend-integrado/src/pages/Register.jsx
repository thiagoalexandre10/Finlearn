import { Link, useNavigate } from 'react-router-dom';
import { Eye, Gift, Lock, Mail, Phone, Shield, Target, TrendingUp, User } from 'lucide-react';
import Logo from '../components/Logo';

export default function Register() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate('/login');
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
          <div className="form-grid">
            <label>Nome completo<div className="input-icon"><User size={18} /><input required placeholder="Digite seu nome completo" /></div></label>
            <label>CPF<div className="input-icon"><input required placeholder="000.000.000-00" /></div></label>
            <label>E-mail<div className="input-icon"><Mail size={18} /><input required type="email" placeholder="seu@email.com" /></div></label>
            <label>Telefone<div className="input-icon"><Phone size={18} /><input placeholder="(11) 99999-9999" /></div></label>
            <label className="span-2">Senha<div className="input-icon"><Lock size={18} /><input required type="password" placeholder="Crie uma senha segura" /><Eye size={18} /></div><small>Mínimo de 8 caracteres com letras, números e símbolos.</small></label>
            <label className="span-2">Confirmar senha<div className="input-icon"><Lock size={18} /><input required type="password" placeholder="Digite sua senha novamente" /><Eye size={18} /></div></label>
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
