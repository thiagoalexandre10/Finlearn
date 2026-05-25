import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { usuarioService } from '../api/finlearnService';
import { useState } from 'react';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', cpf: '', email: '', telefone: '', senha: '', confirmar: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.senha !== form.confirmar) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      await usuarioService.criar({
        nome: form.nome,
        cpf: form.cpf,
        email: form.email,
        telefone: form.telefone,
        senha: form.senha,
        dataCadastro: new Date().toISOString().slice(0, 10),
        pontos: 0,
        nivel: 'Explorador Financeiro',
      });
      alert('Conta criada com sucesso.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Não foi possível criar a conta. Confira o backend.');
    }
  }

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  return (
    <main className="auth-page register">
      <section className="auth-brand-panel"><Logo /><h1>Comece sua jornada financeira com o FinLearn</h1><p>Crie sua conta e tenha tudo que precisa para organizar, investir e crescer.</p></section>
      <section className="auth-form-area">
        <form className="auth-card wide" onSubmit={handleSubmit}>
          <h2>Criar conta</h2><p>Abra sua conta gratuita em poucos minutos.</p>
          <div className="form-grid two">
            <Field label="Nome completo" value={form.nome} onChange={(v) => update('nome', v)} required />
            <Field label="CPF" value={form.cpf} onChange={(v) => update('cpf', v)} required />
            <Field label="E-mail" type="email" value={form.email} onChange={(v) => update('email', v)} required />
            <Field label="Telefone" value={form.telefone} onChange={(v) => update('telefone', v)} />
            <Field label="Senha" type="password" value={form.senha} onChange={(v) => update('senha', v)} required />
            <Field label="Confirmar senha" type="password" value={form.confirmar} onChange={(v) => update('confirmar', v)} required />
          </div>
          <button className="primary-button full" type="submit">Cadastrar</button>
          <p className="center-text">Já tenho conta <Link to="/login">Entrar</Link></p>
        </form>
      </section>
    </main>
  );
}

function Field({ label, type = 'text', value, onChange, required }) {
  return <label><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
}
