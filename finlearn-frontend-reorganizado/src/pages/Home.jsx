import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CreditCard, Eye, FileText, Landmark, ArrowLeftRight, Target, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import { Button, Card, Modal } from '../components/UI';
import { GoalForm, InvestmentForm, PixForm, TransactionForm } from '../components/forms';
import { finlearnService, fallbackData } from '../api/finlearnService';
import { usuarioBase } from '../data';
import { formatCurrency, getPercent } from '../utils';

function isNegative(tipo) {
  return ['SAIDA', 'PIX_ENVIADO', 'TRANSFERENCIA_ENVIADA', 'INVESTIMENTO', 'PAGAMENTO'].includes(String(tipo));
}

export default function Home() {
  const [data, setData] = useState({ contas: [], transacoes: [], investimentos: [], metas: [], usuario: usuarioBase });
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState('');

  async function loadData() {
    const dashboard = await finlearnService.carregarDashboard();
    setData(dashboard);
  }

  useEffect(() => {
    loadData();
  }, []);

  const resumo = useMemo(() => {
    const entradas = data.transacoes.filter((item) => !isNegative(item.tipo)).reduce((sum, item) => sum + Number(item.valor || 0), 0) || 6850;
    const saidas = data.transacoes.filter((item) => isNegative(item.tipo)).reduce((sum, item) => sum + Number(item.valor || 0), 0) || 2799.1;
    const saldo = data.contas.filter((conta) => !String(conta.tipo).includes('CARTAO')).reduce((sum, conta) => sum + Number(conta.saldo || 0), 0) || 4050.9;
    const investido = data.investimentos.filter((item) => item.status !== 'RESGATADO').reduce((sum, inv) => sum + Number(inv.valorInvestido || inv.valor || 0), 0) || 3250;
    return { entradas, saidas, saldo, investido };
  }, [data]);

  async function execute(action, successMessage, fallbackMessage) {
    try {
      await action();
      setNotice(successMessage);
      setModal(null);
      await loadData();
    } catch (error) {
      setNotice(error.message || fallbackMessage);
    }
  }

  const metaPrincipal = data.metas[0] || fallbackData.metas[0];
  const progressoMeta = getPercent(metaPrincipal.valorAtual, metaPrincipal.valorObjetivo);
  const desafios = data.desafios || fallbackData.desafios;

  return (
    <>
      <Header title={`Bem vindo ${data.usuario?.nome || 'Thiago'}`} subtitle="Nível 2 · Explorador Financeiro" usuario={data.usuario} />
      <div className="page-content home-page">
        {notice && <div className={notice.includes('insuficiente') || notice.includes('Não') ? 'error-banner' : 'success-banner'}>{notice}</div>}

        <div className="home-top-grid">
          <Card className="balance-card">
            <div className="balance-top"><span>Saldo disponível</span><Eye size={18} /></div>
            <strong>{formatCurrency(resumo.saldo)}</strong>
            <div className="mini-line" />
            <div className="balance-metrics">
              <div><span className="circle-icon positive"><TrendingUp size={18} /></span><small>Entradas</small><strong>{formatCurrency(resumo.entradas)}</strong></div>
              <div><span className="circle-icon negative"><ArrowLeftRight size={18} /></span><small>Saídas</small><strong>-{formatCurrency(resumo.saidas)}</strong></div>
              <div><span className="circle-icon positive"><Target size={18} /></span><small>Investido</small><strong>{formatCurrency(resumo.investido)}</strong></div>
            </div>
          </Card>

          <Card className="level-card">
            <div className="level-badge"><div className="mountain" /></div>
            <div className="level-info">
              <span>Nível atual</span>
              <h2>Nível 2</h2>
              <p>Explorador Financeiro</p>
              <div className="level-line"><i style={{ width: `${Math.min(100, Math.round((Number(data.usuario?.pontos || 0) / 2000) * 100))}%` }} /></div>
              <small>Próximo nível: 2.000 pontos <b>{Math.min(100, Math.round((Number(data.usuario?.pontos || 0) / 2000) * 100))}%</b></small>
            </div>
          </Card>
        </div>

        <div className="quick-actions quick-actions-seven">
          <Button onClick={() => setModal('pix')}><ArrowLeftRight size={20} /> Pix</Button>
          <Button onClick={() => setModal('pixRecebido')}><TrendingUp size={20} /> Pix recebido</Button>
          <Button onClick={() => setModal('pagar')}><Landmark size={20} /> Pagar</Button>
          <Button onClick={() => setModal('transferir')}><ArrowLeftRight size={20} /> Transferir</Button>
          <Button onClick={() => setModal('extrato')}><FileText size={20} /> Ver extrato</Button>
          <Button onClick={() => setModal('investir')}><BarChart3 size={20} /> Investir</Button>
          <Button onClick={() => setModal('meta')}><Target size={20} /> Criar meta</Button>
        </div>

        <div className="three-grid">
          <Card><div className="card-title-row"><h3>Movimentações recentes</h3><button onClick={() => setModal('extrato')}>Ver todas</button></div><MovementList items={data.transacoes.slice(0, 4)} /></Card>
          <Card><div className="card-title-row"><h3>Meta principal</h3><button onClick={() => setModal('meta')}>Criar meta</button></div><div className="goal-summary"><span className="goal-icon"><Target /></span><div><h4>{metaPrincipal.titulo}</h4><p>{metaPrincipal.descricao}</p></div></div><div className="progress-line"><i style={{ width: `${progressoMeta}%` }} /></div><div className="progress-values"><span>Atual<br /><b>{formatCurrency(metaPrincipal.valorAtual)}</b></span><strong>{progressoMeta}%</strong><span>Meta<br /><b>{formatCurrency(metaPrincipal.valorObjetivo)}</b></span></div><div className="reward">⭐ +{metaPrincipal.pontosRecompensa || 100} pontos ao concluir</div></Card>
          <Card><div className="card-title-row"><h3>Investimentos</h3><button onClick={() => setModal('investir')}>Novo</button></div><div className="investment-total"><span>Total investido</span><strong>{formatCurrency(resumo.investido)}</strong><small>▲ 8,42%</small></div>{data.investimentos.slice(0, 3).map((item) => <div className="simple-row" key={item.id}><span>{item.nome}</span><b>{formatCurrency(item.valorInvestido || item.valor)}</b></div>)}</Card>
        </div>

        <div className="bottom-grid">
          <Card><div className="card-title-row"><h3>Visão financeira</h3><select><option>Este mês</option></select></div><div className="bar-chart"><div style={{ height: '80%' }}><b>{formatCurrency(resumo.entradas)}</b><i className="bar green" /></div><div style={{ height: '52%' }}><b>{formatCurrency(resumo.saidas)}</b><i className="bar red" /></div><div style={{ height: '60%' }}><b>{formatCurrency(resumo.investido)}</b><i className="bar blue" /></div></div></Card>
          <Card><h3>Desafios em andamento</h3>{desafios.slice(0, 3).map((item) => <div className="challenge-row" key={item.id}><span>{item.titulo}<small>{item.descricao}</small></span><div className="tiny-progress"><i style={{ width: `${item.progresso}%` }} /></div><b>{item.status === 'NAO_CUMPRIDO' ? `-${item.pontosPerda}` : `+${item.pontosGanho}`} pts</b></div>)}</Card>
          <Card className="ranking-mini">
            <h3>Seu ranking</h3>

            <strong>
              {(() => {
                const pontosUsuario = Number(data.usuario?.pontos || 0);

                const rankingBase = [
                  { nome: "Mariana Costa", pontos: 2350 },
                  { nome: "Lucas Lima", pontos: 1520 },
                  { nome: "Ana Souza", pontos: 1380 },
                  { nome: "Rafael Oliveira", pontos: 1180 },
                  { nome: "Beatriz Almeida", pontos: 1120 },
                  { nome: "Gabriel Martins", pontos: 1050 },
                  { nome: data.usuario?.nome || "Você", pontos: pontosUsuario },
                ];

                const rankingOrdenado = rankingBase.sort((a, b) => b.pontos - a.pontos);

                const posicaoUsuario =
                  rankingOrdenado.findIndex(
                    (item) => item.nome === (data.usuario?.nome || "Você")
                  ) + 1;

                return `${posicaoUsuario}º`;
              })()}{" "}
              <span>lugar</span>
            </strong>

            <p>no ranking geral</p>

            <div className="reward">
              ⭐ Pontos atualizados em tempo real!
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={modal === 'pix'} onClose={() => setModal(null)} title="Enviar Pix" subtitle="Informe a chave, valor e escolha se deseja usar saldo ou Pix no crédito.">
        <PixForm contas={data.contas} onSubmit={(payload) => execute(() => finlearnService.enviarPix(payload), 'Pix enviado com sucesso. O saldo, movimentações e extrato foram atualizados.', 'Não foi possível realizar o Pix.')} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal === 'pixRecebido'} onClose={() => setModal(null)} title="Registrar Pix recebido" subtitle="Simule a entrada de um Pix e atualize o saldo, notificações e relatórios.">
        <PixForm mode="receive" contas={data.contas} onSubmit={(payload) => execute(() => finlearnService.receberPix(payload), 'Pix recebido registrado. O saldo aumentou e a movimentação entrou no extrato.', 'Não foi possível registrar o Pix recebido.')} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={['pagar', 'transferir'].includes(modal)} onClose={() => setModal(null)} title={modal === 'pagar' ? 'Pagar conta' : 'Transferir valor'} subtitle="Essa ação será registrada e vai alterar o saldo.">
        <TransactionForm fixedType={modal === 'transferir' ? 'TRANSFERENCIA_ENVIADA' : 'PAGAMENTO'} contas={data.contas} onSubmit={(payload) => execute(() => finlearnService.criarTransacao(payload), 'Transação registrada. O saldo e o extrato foram atualizados.', 'Não foi possível registrar a transação.')} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal === 'extrato'} onClose={() => setModal(null)} title="Extrato recente" subtitle="Últimas movimentações de Pix, pagamentos, investimentos e metas." width="lg"><MovementList items={data.transacoes} /></Modal>
      <Modal isOpen={modal === 'investir'} onClose={() => setModal(null)} title="Investir" subtitle="Escolha o investimento. O tipo e o rendimento são preenchidos automaticamente.">
        <InvestmentForm contas={data.contas} onSubmit={(payload) => execute(() => finlearnService.criarInvestimento(payload), 'Investimento realizado. O valor saiu do saldo e entrou na carteira.', 'Não foi possível investir.')} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal === 'meta'} onClose={() => setModal(null)} title="Criar meta" subtitle="Cadastre uma meta conectada ao backend e ao sistema de pontos.">
        <GoalForm onSubmit={(payload) => execute(() => finlearnService.criarMeta(payload), 'Meta criada com sucesso. Ao atingir o objetivo, ela renderá pontos.', 'Não foi possível criar a meta.')} onCancel={() => setModal(null)} />
      </Modal>
    </>
  );
}

function MovementList({ items }) {
  const safeItems = items?.length ? items : fallbackData.transacoes;
  return (
    <div className="movement-list">
      {safeItems.map((item) => (
        <div className="movement-item" key={item.id}>
          <span className={isNegative(item.tipo) ? 'movement-icon red' : 'movement-icon green'}><CreditCard size={16} /></span>
          <div><strong>{item.descricao}</strong><small>{item.tipo} · {item.data}</small></div>
          <b className={isNegative(item.tipo) ? 'negative-text' : 'positive-text'}>{isNegative(item.tipo) ? '-' : '+'}{formatCurrency(item.valor)}</b>
        </div>
      ))}
    </div>
  );
}
