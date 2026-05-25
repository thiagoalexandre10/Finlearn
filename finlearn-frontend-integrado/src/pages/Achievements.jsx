import SimplePage from './SimplePage';
import { Card } from '../components/Card';

export default function Achievements() {
  const achievements = ['Primeiro investimento', 'Meta cumprida', 'Controle em dia', 'Poupe todo mês'];
  return (
    <SimplePage title="Conquistas" subtitle="Acompanhe suas medalhas, marcos e recompensas conquistadas.">
      <section className="stats-grid four">
        {achievements.map((item) => <Card key={item} className="achievement-card"><div className="medal">🏅</div><h3>{item}</h3><p>Conquistada</p></Card>)}
      </section>
    </SimplePage>
  );
}
