import SimplePage from './SimplePage';
import { Card } from '../components/Card';

export default function Ranking() {
  const users = ['Mariana Costa', 'Lucas Lima', 'Ana Souza', 'Thiago'];
  return (
    <SimplePage title="Ranking" subtitle="Veja sua posição e acompanhe os usuários com melhor desempenho financeiro.">
      <Card>
        <h2>Classificação geral</h2>
        {users.map((user, index) => <div className="ranking-row" key={user}><strong>{index + 1}º</strong><span>{user}</span><b>{index === 3 ? '1.250 pts' : `${2350 - index * 400} pts`}</b></div>)}
      </Card>
    </SimplePage>
  );
}
