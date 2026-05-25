import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Login() {
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    navigate('/');
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <Logo />
        <span className="secure-badge">Plataforma segura e confiável</span>
        <h1>Seu controle financeiro inteligente</h1>
        <p>Uma plataforma completa para organizar, investir e alcançar seus objetivos financeiros.</p>
        <div className="auth-feature"><strong>Acompanhe saldo e transações</strong><span>Visualize sua movimentação em tempo real.</span></div>
        <div className="auth-feature"><strong>Invista com metas e recompensas</strong><span>Defina metas e acumule pontos.</span></div>
        <div className="auth-feature"><strong>Entenda seus relatórios</strong><span>Relatórios claros para decisões mais seguras.</span></div>
      </section>

      <section className="auth-form-area">
        <form className="auth-card" onSubmit={handleLogin}>
          <div className="auth-icon">●</div>
          <h2>Entrar</h2>
          <p>Que bom ter você de volta! Faça login para continuar.</p>
          <label><span>CPF ou e-mail</span><input placeholder="Digite seu CPF ou e-mail" required /></label>
          <label><span>Senha</span><input type="password" placeholder="Digite sua senha" required /></label>
          <div className="auth-line"><label className="inline-check"><input type="checkbox" defaultChecked />Lembrar de mim</label><Link to="/esqueci-senha">Esqueci minha senha</Link></div>
          <button className="primary-button full" type="submit">Entrar</button>
          <div className="divider">ou</div>
          <Link className="secondary-button full center" to="/registrar">Criar conta</Link>
          <p className="security-note">Seus dados estão protegidos com criptografia de ponta a ponta.</p>
        </form>
      </section>
    </main>
  );
}
