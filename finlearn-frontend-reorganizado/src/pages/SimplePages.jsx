import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle, Send, Shield, Star, Target, Trophy, Wallet } from 'lucide-react';
import Header from '../components/Header';
import { Button, Card, Modal, StatCard } from '../components/UI';
import { finlearnService, fallbackData } from '../api/finlearnService';
import { usuarioBase } from '../data';
import { formatCurrency } from '../utils';

function isNegative(tipo) {
  return ['SAIDA', 'PIX_ENVIADO', 'TRANSFERENCIA_ENVIADA', 'INVESTIMENTO', 'PAGAMENTO'].includes(String(tipo));
}

export function Challenges() {
  const [data, setData] = useState({ desafios: [], metas: [], usuario: usuarioBase });

  async function load() {
    const dashboard = await finlearnService.carregarDashboard();
    setData(dashboard);
  }

  useEffect(() => { load(); }, []);

  const desafios = data.desafios?.length ? data.desafios : fallbackData.desafios;
  const concluidos = desafios.filter((item) => item.status === 'CONCLUIDO').length;
  const perdidos = desafios.filter((item) => item.status === 'NAO_CUMPRIDO').length;
  const pontosPossiveis = desafios.reduce((sum, item) => sum + Number(item.pontosGanho || 0), 0);

  return (
    <>
      <Header title="Desafios" subtitle="Desafios agora acompanham progresso real, metas, investimentos e prazo." usuario={data.usuario} />
      <div className="page-content">
        <div className="stats-grid four">
          <StatCard icon={Trophy} label="Concluídos" value={concluidos} hint="Ganharam pontos" />
          <StatCard icon={Target} label="Em andamento" value={desafios.length - concluidos - perdidos} hint="Acompanhe o prazo" />
          <StatCard icon={Star} label="Pontos possíveis" value={`${pontosPossiveis} pts`} hint="Somando desafios" />
          <StatCard icon={Shield} label="Pontos atuais" value={`${data.usuario?.pontos || 0} pts`} hint="Atualiza ranking" />
        </div>

        <div className="challenges-layout">
          <Card>
            <h3>Progresso dos desafios</h3>
            <p>Não existe mais botão de “atingi” ou “não atingi”. O sistema calcula com base no progresso, prazo, metas e ações feitas no app.</p>
            <div className="challenge-list">
              {desafios.map((desafio) => (
                <article className="challenge-card" key={desafio.id}>
                  <div className="challenge-icon"><Trophy size={20} /></div>
                  <div>
                    <strong>{desafio.titulo}</strong>
                    <p>{desafio.descricao}</p>
                    <div className="challenge-meta">
                      <span>{desafio.categoria}</span>
                      <span>Prazo: {desafio.dataLimite || 'Mensal'}</span>
                      <span className="positive-text">+{desafio.pontosGanho} pts</span>
                      <span className="negative-text">-{desafio.pontosPerda} pts</span>
                    </div>
                    <div className="progress-line"><i style={{ width: `${desafio.progresso}%` }} /></div>
                  </div>
                  <div className="challenge-actions compact">
                    <strong>{desafio.progresso}%</strong>
                    <span className={`tag ${desafio.status === 'CONCLUIDO' ? 'success' : desafio.status === 'NAO_CUMPRIDO' ? 'danger' : 'blue'}`}>{desafio.status.replace('_', ' ')}</span>
                  </div>
                </article>
              ))}
            </div>
          </Card>
          <aside className="side-stack"><Card><h3>Como pontua</h3><div className="rules-list"><div><CheckCircle /> <span>Ao bater uma meta no prazo, os pontos entram automaticamente.</span></div><div><CheckCircle /> <span>Se o prazo passar e o valor não for atingido, perde pontos.</span></div><div><CheckCircle /> <span>Investimentos e Pix atualizam movimentações, relatórios e notificações.</span></div></div></Card><Card><h3>Ranking</h3><strong className="big-points">{data.usuario?.pontos || 0} pts</strong><p>O ranking usa esse saldo de pontos, não apenas texto visual.</p></Card></aside>
        </div>
      </div>
    </>
  );
}

export function Achievements() {
  const [data, setData] = useState({ usuario: usuarioBase });
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  useEffect(() => { finlearnService.carregarDashboard().then(setData); }, []);

  const achievements = [
    { title: 'Primeiro investimento', category: 'Investimentos', points: 150, unlocked: true, description: 'Realizou seu primeiro investimento com sucesso.', requirement: 'Faça pelo menos um aporte em Investimentos.' },
    { title: 'Meta cumprida', category: 'Metas', points: 120, unlocked: true, description: 'Concluiu sua primeira meta financeira.', requirement: 'Complete uma meta até o valor objetivo.' },
    { title: 'Controle em dia', category: 'Gastos', points: 100, unlocked: true, description: 'Registrou despesas por 30 dias seguidos.', requirement: 'Mantenha seus lançamentos atualizados.' },
    { title: 'Poupe todo mês', category: 'Constância', points: 120, unlocked: true, description: 'Poupou dinheiro por meses consecutivos.', requirement: 'Guarde dinheiro em metas ou conta poupança.' },
    { title: 'Investidor iniciante', category: 'Investimentos', points: 150, unlocked: false, description: 'Invista em 3 produtos diferentes.', requirement: 'Tenha 3 investimentos ativos.' },
    { title: 'Estudante financeiro', category: 'Educação', points: 90, unlocked: false, description: 'Conclua 5 conteúdos na Educação Financeira.', requirement: 'Marque conteúdos como estudados.' },
    { title: 'Mestre do Pix', category: 'Pix', points: 80, unlocked: false, description: 'Realize 50 transações via Pix.', requirement: 'Use o Pix com frequência.' },
    { title: 'Disciplina financeira', category: 'Constância', points: 110, unlocked: false, description: 'Mantenha 6 meses sem gastos extras.', requirement: 'Controle suas saídas mensais.' },
  ];

  const unlockedCount = achievements.filter((item) => item.unlocked).length;

  return (
    <>
      <Header title="Conquistas" subtitle="Acompanhe suas medalhas, marcos e recompensas conquistadas." usuario={data.usuario} />
      <div className="page-content">
        <div className="stats-grid four">
          <StatCard icon={Trophy} label="Conquistas desbloqueadas" value={unlockedCount} hint={`de ${achievements.length} no total`} />
          <StatCard icon={Star} label="Próximas conquistas" value={achievements.length - unlockedCount} hint="Em andamento" />
          <StatCard icon={CheckCircle} label="Pontos acumulados" value={`${data.usuario?.pontos || 0} pts`} hint="Total conquistado" />
          <StatCard icon={BookOpen} label="Categorias concluídas" value="4" hint="de 6 categorias" />
        </div>

        <div className="achievements-grid">
          <Card>
            <h3>Minhas conquistas</h3>
            <div className="medal-grid">
              {achievements.map((item) => (
                <div className="medal-card" key={item.title}>
                  <div className={`medal ${!item.unlocked ? 'locked' : ''}`}>{item.unlocked ? '🏅' : '🔒'}</div>
                  <strong>{item.title}</strong>
                  <small>{item.unlocked ? 'Conquistada' : 'Bloqueada'}</small>
                  <Button variant="outline" className="btn-small" onClick={() => setSelectedAchievement(item)}>Ver detalhes</Button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3>Conquista em destaque</h3>
            <div className="featured-medal">🏆</div>
            <h2>Primeiro investimento</h2>
            <p>Realizou seu primeiro investimento com sucesso.</p>
            <div className="reward">+150 pts</div>
            <Button onClick={() => setSelectedAchievement(achievements[0])}>Ver detalhes</Button>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedAchievement)}
        onClose={() => setSelectedAchievement(null)}
        title={selectedAchievement?.title || 'Detalhes da conquista'}
        subtitle={selectedAchievement?.unlocked ? 'Conquista desbloqueada' : 'Conquista em andamento'}
      >
        {selectedAchievement && (
          <div className="achievement-detail">
            <div className={`medal large ${!selectedAchievement.unlocked ? 'locked' : ''}`}>{selectedAchievement.unlocked ? '🏅' : '🔒'}</div>
            <p>{selectedAchievement.description}</p>
            <div className="simple-row"><span>Categoria</span><b>{selectedAchievement.category}</b></div>
            <div className="simple-row"><span>Recompensa</span><b>{selectedAchievement.points} pts</b></div>
            <div className="simple-row"><span>Status</span><b>{selectedAchievement.unlocked ? 'Conquistada' : 'Bloqueada'}</b></div>
            <Card className="soft-card"><strong>Como desbloquear</strong><p>{selectedAchievement.requirement}</p></Card>
          </div>
        )}
      </Modal>
    </>
  );
}

export function Ranking() {
  const [data, setData] = useState({ usuario: usuarioBase });
  useEffect(() => { finlearnService.carregarDashboard().then(setData); }, []);
  const rawUserPoints = Number(data.usuario?.pontos ?? 0);
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('finlearn-auth-user') || 'null'); } catch { return null; }
  })();
  const storedPoints = Number(storedUser?.pontos ?? 0);
  const userPoints = rawUserPoints > 0 ? rawUserPoints : storedPoints > 0 ? storedPoints : 1250;
  const rankingUser = { ...(data.usuario || usuarioBase), pontos: userPoints };
  const baseUsers = [
    { nome: 'Mariana Costa', pontos: 2350 },
    { nome: 'Lucas Lima', pontos: 1520 },
    { nome: 'Ana Souza', pontos: 1380 },
    { nome: rankingUser?.nome || 'Thiago', pontos: userPoints, voce: true },
    { nome: 'Rafael Oliveira', pontos: 1180 },
    { nome: 'Beatriz Almeida', pontos: 1120 },
    { nome: 'Gabriel Martins', pontos: 1050 },
  ].sort((a, b) => b.pontos - a.pontos);
  const pos = baseUsers.findIndex((u) => u.voce) + 1;

  return <><Header title="Ranking" subtitle="Veja sua posição com base nos pontos reais ganhos ou perdidos." usuario={rankingUser} /><div className="page-content"><div className="stats-grid four"><StatCard icon={Trophy} label="Sua posição" value={`${pos}º lugar`} hint="ranking geral" /><StatCard icon={Star} label="Pontos acumulados" value={`${userPoints} pts`} /><StatCard icon={CheckCircle} label="Próxima posição" value={pos > 1 ? `${pos - 1}º` : 'Top 1'} /><StatCard icon={Star} label="Meta de ranking" value="Top 5" /></div><div className="ranking-layout"><Card><h3>Classificação geral</h3><div className="podium"><div>🥈<strong>{baseUsers[1]?.nome}</strong><span>{baseUsers[1]?.pontos} pts</span></div><div>🥇<strong>{baseUsers[0]?.nome}</strong><span>{baseUsers[0]?.pontos} pts</span></div><div>🥉<strong>{baseUsers[2]?.nome}</strong><span>{baseUsers[2]?.pontos} pts</span></div></div><table><tbody>{baseUsers.map((user, i) => <tr key={user.nome} className={user.voce ? 'selected' : ''}><td>{i + 1}º</td><td>{user.nome}</td><td>Nível {user.voce ? 2 : 3}</td><td>{user.pontos} pts</td><td>{user.voce ? 'Você' : 'Em alta'}</td></tr>)}</tbody></table></Card><aside className="side-stack"><Card><h3>Seu desempenho</h3><div className="simple-row"><span>Posição atual</span><b>{pos}º</b></div><div className="simple-row"><span>Pontos atuais</span><b>{userPoints}</b></div><div className="progress-line"><i style={{ width: `${Math.min(100, userPoints / 20)}%` }} /></div></Card><Card><h3>Categorias em destaque</h3>{['Investimentos', 'Metas', 'Consistência', 'Educação', 'Pix'].map((item) => <div className="simple-row" key={item}><span>{item}</span><b>Top 10</b></div>)}</Card></aside></div></div></>;
}

export function Education() {
  const [active, setActive] = useState('Orçamento Pessoal');
  const [studied, setStudied] = useState(() => JSON.parse(localStorage.getItem('finlearn-lessons-studied') || '[]'));
  const [notice, setNotice] = useState('');

  const contents = [
    { title: 'Orçamento Pessoal', text: 'Aprenda a dividir receitas, despesas fixas e objetivos.', progress: 75, level: 'Iniciante' },
    { title: 'Como funciona o Pix', text: 'Entenda chave Pix, saldo, Pix no crédito e segurança.', progress: 100, level: 'Iniciante' },
    { title: 'Primeiros passos em Investimentos', text: 'Compare renda fixa, fundos, ações e cripto.', progress: 40, level: 'Intermediário' },
    { title: 'Criando metas financeiras', text: 'Defina prazo, valor atual, objetivo e recompensa.', progress: 60, level: 'Iniciante' },
  ];

  const current = contents.find((item) => item.title === active) || contents[0];
  const completedCount = new Set(studied).size;

  function continueLearning() {
    const nextLesson = contents.find((item) => !studied.includes(item.title)) || contents[0];
    setActive(nextLesson.title);
    setNotice(`Continuando a trilha em “${nextLesson.title}”.`);
  }

  function markAsStudied() {
    const next = Array.from(new Set([...studied, active]));
    setStudied(next);
    localStorage.setItem('finlearn-lessons-studied', JSON.stringify(next));
    setNotice(`Conteúdo “${active}” marcado como estudado.`);
  }

  return (
    <>
      <Header title="Educação Financeira" subtitle="Aprenda a cuidar melhor do seu dinheiro com conteúdos práticos e personalizados." usuario={usuarioBase} />
      <div className="page-content education-page">
        {notice && <div className="success-banner">{notice}</div>}
        <div className="stats-grid four">
          <StatCard icon={BookOpen} label="Trilha atual" value="Finanças para o dia a dia" />
          <StatCard icon={Trophy} label="Módulos concluídos" value={12 + completedCount} hint="Continue assim!" />
          <StatCard icon={CheckCircle} label="Horas de estudo" value={`${18 + completedCount}h`} />
          <StatCard icon={Star} label="Próximo objetivo" value={current.title.split(' ')[0]} />
        </div>

        <Card className="education-hero">
          <div className="book-illustration">📚</div>
          <div>
            <span className="tag success">Trilha recomendada</span>
            <h2>Controle Financeiro Inteligente</h2>
            <p>Aprenda a organizar seus gastos, usar Pix com segurança, criar metas realistas e decidir melhor seus investimentos.</p>
            <div className="progress-line"><i style={{ width: `${Math.min(100, 68 + completedCount * 8)}%` }} /></div>
          </div>
          <Button onClick={continueLearning}>Continuar aprendendo</Button>
        </Card>

        <div className="education-layout">
          <Card>
            <h3>Conteúdos recomendados</h3>
            <div className="content-grid clean">
              {contents.map((item) => (
                <button className={active === item.title ? 'lesson-card active' : 'lesson-card'} key={item.title} onClick={() => setActive(item.title)}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                  <small>{item.level}</small>
                  {studied.includes(item.title) && <small className="positive-text">Estudado ✓</small>}
                  <div className="progress-line"><i style={{ width: `${studied.includes(item.title) ? 100 : item.progress}%` }} /></div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3>{active}</h3>
            <p>{current.text}</p>
            <div className="lesson-box">
              <strong>Resumo da aula</strong>
              <p>Conteúdo organizado em linguagem simples, com exemplos práticos para o dia a dia financeiro.</p>
              <Button onClick={markAsStudied} disabled={studied.includes(active)}>{studied.includes(active) ? 'Já estudado' : 'Marcar como estudado'}</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export function Reports() {
  const [data, setData] = useState({ transacoes: [], investimentos: [], contas: [], usuario: usuarioBase });
  useEffect(() => { finlearnService.carregarDashboard().then(setData); }, []);

  const transacoes = data.transacoes.length ? data.transacoes : fallbackData.transacoes;
  const investimentos = data.investimentos?.length ? data.investimentos : fallbackData.investimentos;
  const receitas = transacoes.filter((item) => !isNegative(item.tipo)).reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const despesas = transacoes.filter((item) => isNegative(item.tipo)).reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const investido = investimentos.filter((item) => item.status !== 'RESGATADO').reduce((sum, item) => sum + Number(item.valorInvestido || item.valor || 0), 0);
  const pixTotal = transacoes.filter((item) => String(item.tipo).includes('PIX')).reduce((sum, item) => sum + Number(item.valor || 0), 0);

  const investmentEvolution = useMemo(() => {
    const byDate = new Map();

    investimentos.forEach((item) => {
      const date = String(item.dataAplicacao || item.data || '2026-05-24').slice(0, 10);
      const value = Number(item.valorInvestido || item.valor || 0);
      byDate.set(date, (byDate.get(date) || 0) + value);
    });

    transacoes
      .filter((item) => ['INVESTIMENTO', 'RESGATE_INVESTIMENTO'].includes(String(item.tipo)))
      .forEach((item) => {
        const date = String(item.data || '2026-05-24').slice(0, 10);
        const value = Number(item.valor || 0) * (String(item.tipo) === 'RESGATE_INVESTIMENTO' ? -1 : 1);
        byDate.set(date, (byDate.get(date) || 0) + value);
      });

    let running = 0;
    return Array.from(byDate.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .slice(-6)
      .map(([date, value]) => {
        running += value;
        return { date, value: running };
      });
  }, [investimentos, transacoes]);

  const maxEvolution = Math.max(1, ...investmentEvolution.map((item) => item.value));

  return (
    <>
      <Header title="Relatórios" subtitle="Acompanhe Pix, entradas, saídas, investimentos e evolução financeira com clareza." usuario={data.usuario} />
      <div className="page-content">
        <div className="stats-grid four">
          <StatCard icon={Star} label="Receitas" value={formatCurrency(receitas)} />
          <StatCard icon={CheckCircle} label="Despesas" value={formatCurrency(despesas)} tone="red" />
          <StatCard icon={Trophy} label="Investido" value={formatCurrency(investido)} />
          <StatCard icon={BookOpen} label="Movimento Pix" value={formatCurrency(pixTotal)} />
        </div>

        <div className="reports-grid">
          <Card>
            <h3>Entradas vs Saídas</h3>
            <div className="report-bars"><div><b>{formatCurrency(receitas)}</b><i className="bar green" /></div><div><b>{formatCurrency(despesas)}</b><i className="bar red" /></div><div><b>{formatCurrency(investido)}</b><i className="bar blue" /></div></div>
          </Card>

          <Card>
            <h3>Gastos por categoria</h3>
            <div className="donut" />
            <div className="simple-row"><span>Pix</span><b>{formatCurrency(pixTotal)}</b></div>
            <div className="simple-row"><span>Investimentos</span><b>{formatCurrency(investido)}</b></div>
          </Card>

          <Card>
            <h3>Evolução dos investimentos</h3>
            {investmentEvolution.length ? (
              <div className="investment-evolution">
                <div className="evolution-chart">
                  {investmentEvolution.map((item) => (
                    <div className="evolution-item" key={item.date}>
                      <span>{formatCurrency(item.value)}</span>
                      <i style={{ height: `${Math.max(16, (item.value / maxEvolution) * 130)}px` }} />
                      <small>{item.date.slice(5).split('-').reverse().join('/')}</small>
                    </div>
                  ))}
                </div>
                <p>Mostra a evolução acumulada conforme novos aportes e resgates.</p>
              </div>
            ) : (
              <p>Nenhum investimento registrado ainda.</p>
            )}
          </Card>
        </div>

        <Card>
          <h3>Últimos lançamentos</h3>
          <table><tbody>{transacoes.slice(0, 8).map((item) => <tr key={item.id}><td>{item.data}</td><td>{item.descricao}</td><td>{item.tipo}</td><td className={isNegative(item.tipo) ? 'negative-text' : 'positive-text'}>{isNegative(item.tipo) ? '-' : '+'}{formatCurrency(item.valor)}</td><td>{item.status}</td></tr>)}</tbody></table>
        </Card>
      </div>
    </>
  );
}

const botFlows = [
  { keys: ['pix', 'chave'], answer: (ctx) => `Você pode fazer Pix pela Home. Saldo atual disponível: ${formatCurrency(ctx.saldo)}. Se o Pix for maior que o saldo, o sistema bloqueia com “saldo insuficiente”. Se houver cartão, também aparece Pix no crédito.` },
  { keys: ['saldo', 'conta'], answer: (ctx) => `Seu saldo soma ${formatCurrency(ctx.saldo)} nas contas disponíveis. Pix enviado, pagamentos e investimentos diminuem esse valor; Pix recebido e resgates aumentam.` },
  { keys: ['investimento', 'investir', 'rendimento'], answer: (ctx) => `Você tem ${ctx.investimentos.length} investimentos cadastrados. Ao investir, escolha o produto: o tipo e a rentabilidade vêm automáticos. Ao resgatar, o valor volta para o saldo e gera notificação.` },
  { keys: ['meta', 'metas', 'desafio'], answer: (ctx) => `Você possui ${ctx.metas.length} meta(s). Para evoluir, entre em Metas e clique em “Acrescentar”. Quando bater o objetivo no prazo, os pontos entram e o ranking muda.` },
  { keys: ['relatorio', 'relatórios', 'extrato'], answer: () => 'A tela Relatórios agora lê Pix, transações, investimentos e resgates. Tudo que acontece na Home entra no extrato e nos totais.' },
  { keys: ['pontos', 'ranking'], answer: (ctx) => `Você está com ${ctx.usuario?.pontos || 0} pontos. Ganhos e perdas de metas/desafios atualizam a tela Ranking automaticamente.` },
];

export function Assistant() {
  const [context, setContext] = useState(fallbackData);
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Olá! Eu sou o assistente FinLearn. Posso analisar seu saldo, Pix, investimentos, metas, relatórios e pontos usando os dados atuais da aplicação.' }]);
  const [input, setInput] = useState('');

  useEffect(() => { finlearnService.carregarDashboard().then(setContext); }, []);

  const summary = useMemo(() => {
    const saldo = (context.contas || []).filter((conta) => !String(conta.tipo).includes('CARTAO')).reduce((sum, conta) => sum + Number(conta.saldo || 0), 0);
    return { ...context, saldo };
  }, [context]);

  function ask(text = input) {
    const question = text.trim();
    if (!question) return;
    const normalized = question.toLowerCase();
    const match = botFlows.find((item) => item.keys.some((key) => normalized.includes(key)));
    const answer = match ? match.answer(summary) : 'Entendi. Para eu te ajudar melhor, pergunte sobre Pix, saldo, investimentos, metas, relatórios ou pontos. Eu respondo usando os dados atuais do FinLearn.';
    setMessages((prev) => [...prev, { role: 'user', text: question }, { role: 'bot', text: answer }]);
    setInput('');
  }

  return <><Header title="Assistente" subtitle="Tire dúvidas sobre contas, investimentos, metas e relatórios." usuario={context.usuario} /><div className="page-content assistant-page"><Card className="chat-card"><div className="assistant-summary"><span>Saldo: <b>{formatCurrency(summary.saldo)}</b></span><span>Pontos: <b>{context.usuario?.pontos || 0}</b></span><span>Investimentos: <b>{context.investimentos?.length || 0}</b></span></div><div className="chat-suggestions">{['Meu saldo está suficiente para um Pix?', 'Como resgatar investimento?', 'Como ganho pontos?', 'Me explique meus relatórios'].map((item) => <button key={item} onClick={() => ask(item)}>{item}</button>)}</div><div className="chat-messages">{messages.map((message, index) => <p key={`${message.role}-${index}`} className={message.role === 'bot' ? 'bot-message' : 'user-message'}>{message.text}</p>)}</div><form className="chat-input" onSubmit={(event) => { event.preventDefault(); ask(); }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Digite sua dúvida financeira..." /><Button type="submit"><Send size={16} /> Enviar</Button></form></Card></div></>;
}

export function NotFound() {
  return <><Header title="Página não encontrada" subtitle="A rota acessada não existe." usuario={usuarioBase} /><div className="page-content"><Card><h2>Ops! Não encontramos essa página.</h2><p>Volte para o início ou use o menu lateral.</p></Card></div></>;
}
