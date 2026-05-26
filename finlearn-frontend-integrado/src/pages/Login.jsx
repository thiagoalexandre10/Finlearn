import { Link, useNavigate } from 'react-router-dom';
import { Lock, Shield, User, Eye, Wallet, TrendingUp, PieChart } from 'lucide-react';
import Logo from '../components/Logo';

export default function Login() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate('/');
  }

  return (
    <main className="auth-page login-page">
      <section className="auth-hero">
        <Logo />
        <span className="secure-badge"><Shield size={14} /> Plataforma segura e confiável</span>
        <h1>Seu controle financeiro inteligente</h1>
        <p>Uma plataforma completa para você organizar, investir e alcançar seus objetivos financeiros com mais clareza e segurança.</p>

        <div className="auth-benefits">
          <div><Wallet /><strong>Acompanhe saldo e transações</strong><span>Visualize sua movimentação em tempo real e tenha tudo sob controle.</span></div>
          <div><TrendingUp /><strong>Invista com metas e recompensas</strong><span>Defina metas, invista com inteligência e acumule pontos.</span></div>
          <div><PieChart /><strong>Entenda seus relatórios com facilidade</strong><span>Relatórios claros e gráficos intuitivos para decisões mais seguras.</span></div>
        </div>

        <div className="finance-illustration" />
      </section>

      <section className="auth-content">
        <a className="help-link" href="#">Precisa de ajuda?</a>
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-icon"><Logo compact /></div>
          <h2>Entrar</h2>
          <p>Que bom ter você de volta! Faça login para continuar.</p>

          <label>CPF ou e-mail<div className="input-icon"><User size={18} /><input required placeholder="Digite seu CPF ou e-mail" /></div></label>
          <label>Senha<div className="input-icon"><Lock size={18} /><input required type="password" placeholder="Digite sua senha" /><Eye size={18} /></div></label>

          <div className="auth-row">
            <label className="checkbox-label"><input type="checkbox" defaultChecked /> Lembrar de mim</label>
            <Link to="/esqueci-senha">Esqueci minha senha</Link>
          </div>

          <button className="btn btn-primary auth-submit" type="submit"><Lock size={18} /> Entrar</button>
          <div className="separator"><span>ou</span></div>
          <Link className="btn btn-outline" to="/registrar"><User size={18} /> Criar conta</Link>

          <div className="safe-note"><Shield size={22} /> Seus dados estão protegidos com criptografia de ponta a ponta e não compartilhamos suas informações com terceiros.</div>
        </form>
      </section>
    </main>
  );
}
