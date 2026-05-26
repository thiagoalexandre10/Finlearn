import { BookOpen, CheckCircle, Star, Trophy } from 'lucide-react';
import Header from '../components/Header';
import { Button, Card, StatCard } from '../components/UI';
import { usuarioBase } from '../data';

export function Challenges() {
  return <GenericPage title="Desafios" subtitle="Complete desafios financeiros e ganhe pontos." />;
}

export function Achievements() {
  const cards = ['Primeiro investimento', 'Meta cumprida', 'Controle em dia', 'Poupe todo mês', 'Investidor iniciante', 'Estudante financeiro', 'Mestre do Pix', 'Disciplina financeira'];
  return <><Header title="Conquistas" subtitle="Acompanhe suas medalhas, marcos e recompensas conquistadas." usuario={usuarioBase} /><div className="page-content"><div className="stats-grid four"><StatCard icon={Trophy} label="Conquistas desbloqueadas" value="14" hint="de 28 no total" /><StatCard icon={Star} label="Próximas conquistas" value="3" hint="Em andamento" /><StatCard icon={CheckCircle} label="Pontos acumulados" value="1.250 pts" hint="Total conquistado" /><StatCard icon={BookOpen} label="Categorias concluídas" value="4" hint="de 6 categorias" /></div><div className="achievements-grid"><Card><h3>Minhas conquistas</h3><div className="medal-grid">{cards.map((item, index) => <div className="medal-card" key={item}><div className={`medal ${index > 3 ? 'locked' : ''}`}>🏅</div><strong>{item}</strong><small>{index > 3 ? 'Bloqueada' : 'Conquistada'}</small></div>)}</div></Card><Card><h3>Conquista em destaque</h3><div className="featured-medal">🏆</div><h2>Primeiro investimento</h2><p>Realizou seu primeiro investimento com sucesso.</p><div className="reward">+150 pts</div><Button>Ver detalhes</Button></Card></div></div></>;
}

export function Ranking() {
  const users = ['Rafael Oliveira', 'Beatriz Almeida', 'Gabriel Martins', 'Juliana Rocha', 'Felipe Andrade', 'Julia Mendes', 'Thiago'];
  return <><Header title="Ranking" subtitle="Veja sua posição e acompanhe os usuários com melhor desempenho financeiro." usuario={usuarioBase} /><div className="page-content"><div className="stats-grid four"><StatCard icon={Trophy} label="Sua posição" value="10º lugar" hint="entre 1.245 usuários" /><StatCard icon={Star} label="Pontos acumulados" value="1.250 pts" /><StatCard icon={CheckCircle} label="Subiu no ranking" value="+3 posições" /><StatCard icon={Star} label="Próxima meta" value="Top 5" /></div><div className="ranking-layout"><Card><h3>Classificação geral</h3><div className="podium"><div>🥈<strong>Lucas Lima</strong><span>1.520 pts</span></div><div>🥇<strong>Mariana Costa</strong><span>2.350 pts</span></div><div>🥉<strong>Ana Souza</strong><span>1.380 pts</span></div></div><table><tbody>{users.map((user, i) => <tr key={user} className={user === 'Thiago' ? 'selected' : ''}><td>{i + 4}º</td><td>{user}</td><td>Nível {user === 'Thiago' ? 2 : 3}</td><td>{user === 'Thiago' ? '1.250' : 1180 - i * 35} pts</td><td>{user === 'Thiago' ? 'Você' : 'Em alta'}</td></tr>)}</tbody></table></Card><aside className="side-stack"><Card><h3>Seu desempenho</h3><div className="simple-row"><span>Posição atual</span><b>10º</b></div><div className="simple-row"><span>Próxima posição</span><b>9º</b></div><div className="progress-line"><i style={{ width: '72%' }} /></div></Card><Card><h3>Categorias em destaque</h3>{['Investimentos', 'Metas', 'Consistência', 'Educação', 'Pix'].map((item) => <div className="simple-row" key={item}><span>{item}</span><b>Top 10</b></div>)}</Card></aside></div></div></>;
}

export function Education() {
  return <><Header title="Educação Financeira" subtitle="Aprenda a cuidar melhor do seu dinheiro com conteúdos práticos e personalizados." usuario={usuarioBase} /><div className="page-content"><div className="stats-grid four"><StatCard icon={BookOpen} label="Trilha atual" value="Finanças para o dia a dia" /><StatCard icon={Trophy} label="Módulos concluídos" value="12" hint="Continue assim!" /><StatCard icon={CheckCircle} label="Horas de estudo" value="18h" /><StatCard icon={Star} label="Próximo objetivo" value="Orçamento" /></div><Card className="education-hero"><div className="book-illustration">📚</div><div><span className="tag success">Trilha recomendada</span><h2>Controle Financeiro Inteligente</h2><p>Aprenda a organizar seus gastos, criar metas realistas e tomar melhores decisões.</p><div className="progress-line"><i style={{ width: '68%' }} /></div></div><Button>Continuar aprendendo</Button></Card><div className="content-grid">{['Orçamento Pessoal', 'Como funciona o Pix', 'Primeiros passos em Investimentos', 'Criando metas financeiras'].map((item, i) => <Card key={item}><h3>{item}</h3><p>Conteúdo prático para melhorar sua vida financeira.</p><span className="tag">{i === 2 ? 'Intermediário' : 'Iniciante'}</span><div className="progress-line"><i style={{ width: `${[75, 100, 40, 60][i]}%` }} /></div></Card>)}</div></div></>;
}

export function Reports() {
  return <GenericPage title="Relatórios" subtitle="Acompanhe entradas, saídas, investimentos e evolução financeira com clareza." reports />;
}

export function Assistant() {
  return <><Header title="Assistente" subtitle="Tire dúvidas sobre contas, investimentos, metas e relatórios." usuario={usuarioBase} /><div className="page-content"><Card className="chat-card"><div className="chat-messages"><p className="bot-message">Olá, Thiago! Sou seu assistente FinLearn. Posso te ajudar com Pix, contas, relatórios, investimentos e metas.</p><p className="user-message">Como posso melhorar meus gastos?</p><p className="bot-message">Comece analisando as saídas do mês em Relatórios e defina uma meta de economia em Metas.</p></div><div className="chat-input"><input placeholder="Digite sua dúvida financeira..." /><Button>Enviar</Button></div></Card></div></>;
}

export function NotFound() {
  return <><Header title="Página não encontrada" subtitle="A rota acessada não existe." usuario={usuarioBase} /><div className="page-content"><Card><h2>Ops! Não encontramos essa página.</h2><p>Volte para o início ou use o menu lateral.</p></Card></div></>;
}

function GenericPage({ title, subtitle, reports = false }) {
  return <><Header title={title} subtitle={subtitle} usuario={usuarioBase} /><div className="page-content"><div className="stats-grid four"><StatCard icon={Star} label="Receitas" value="R$ 6.850,00" /><StatCard icon={CheckCircle} label="Despesas" value="R$ 2.799,10" tone="red" /><StatCard icon={Trophy} label="Investido" value="R$ 3.250,00" /><StatCard icon={BookOpen} label="Economia" value="R$ 2.800,90" /></div><div className="reports-grid"><Card><h3>Entradas vs Saídas</h3><div className="bar-chart"><div><i className="bar green" /></div><div><i className="bar red" /></div><div><i className="bar green" /></div><div><i className="bar red" /></div></div></Card><Card><h3>Gastos por categoria</h3><div className="donut" /></Card><Card><h3>Evolução</h3><div className="mini-line report-line" /></Card></div>{reports && <Card><h3>Últimos lançamentos</h3><table><tbody><tr><td>15/05/2026</td><td>Salário</td><td className="positive-text">R$ 4.500,00</td><td>Concluído</td></tr><tr><td>14/05/2026</td><td>Pix Mercado</td><td className="negative-text">-R$ 356,80</td><td>Concluído</td></tr></tbody></table></Card>}</div></>;
}
