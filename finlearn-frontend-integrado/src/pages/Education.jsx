import SimplePage from './SimplePage';
import { Card } from '../components/Card';

export default function Education() {
  return (
    <SimplePage title="Educação Financeira" subtitle="Aprenda a cuidar melhor do seu dinheiro com conteúdos práticos.">
      <Card className="education-hero"><h2>Controle Financeiro Inteligente</h2><p>Aprenda a organizar gastos, criar metas realistas e tomar melhores decisões.</p><div className="progress-bar"><span style={{ width: '68%' }} /></div></Card>
      <section className="stats-grid four"><Card><h3>Orçamento Pessoal</h3><p>75%</p></Card><Card><h3>Como funciona o Pix</h3><p>100%</p></Card><Card><h3>Primeiros investimentos</h3><p>40%</p></Card><Card><h3>Criando metas</h3><p>60%</p></Card></section>
    </SimplePage>
  );
}
