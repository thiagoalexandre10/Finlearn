import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Forgot() {
  function handleSubmit(event) {
    event.preventDefault();
    alert('Validação de recuperação preparada para integrar ao endpoint de usuário.');
  }

  return (
    <main className="auth-page forgot">
      <section className="auth-brand-panel"><Logo /><h1>Recupere o acesso à sua conta com tranquilidade</h1><p>Informe seus dados e escolha uma nova senha segura.</p></section>
      <section className="auth-form-area">
        <form className="auth-card wide" onSubmit={handleSubmit}>
          <h2>Esqueci minha senha</h2><p>Preencha os campos abaixo para criar uma nova senha.</p>
          <label><span>CPF</span><input placeholder="000.000.000-00" required /></label>
          <label><span>E-mail</span><input type="email" placeholder="seu@email.com" required /></label>
          <label><span>Nova senha</span><input type="password" required /></label>
          <label><span>Confirmar nova senha</span><input type="password" required /></label>
          <button className="primary-button full" type="submit">Redefinir senha</button>
          <div className="auth-line"><Link to="/login">Voltar para login</Link><Link to="/registrar">Criar conta</Link></div>
        </form>
      </section>
    </main>
  );
}
