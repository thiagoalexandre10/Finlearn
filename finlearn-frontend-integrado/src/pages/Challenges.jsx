import SimplePage from './SimplePage';
import { Card } from '../components/Card';

export default function Challenges() {
  return (
    <SimplePage title="Desafios" subtitle="Complete missões financeiras e ganhe pontos.">
      <section className="stats-grid three">
        <Card><h3>Economizar em compras</h3><div className="progress-bar"><span style={{ width: '66%' }} /></div><p>+50 pts</p></Card>
        <Card><h3>Investir este mês</h3><div className="progress-bar"><span style={{ width: '70%' }} /></div><p>+75 pts</p></Card>
        <Card><h3>Evitar gastos por impulso</h3><div className="progress-bar"><span style={{ width: '40%' }} /></div><p>+50 pts</p></Card>
      </section>
    </SimplePage>
  );
}
