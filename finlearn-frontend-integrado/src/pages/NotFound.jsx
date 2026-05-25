import { Link } from 'react-router-dom';

export default function NotFound() {
  return <main className="not-found"><h1>404</h1><p>Página não encontrada.</p><Link className="primary-button" to="/">Voltar para início</Link></main>;
}
