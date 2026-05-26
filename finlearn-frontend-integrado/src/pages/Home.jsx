import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CreditCard, Eye, FileText, Landmark, ArrowLeftRight, Target, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import { Button, Card, Modal } from '../components/UI';
import { PixForm, TransactionForm } from '../components/forms';
import { finlearnService, fallbackData } from '../api/finlearnService';
import { usuarioBase } from '../data';
import { formatCurrency, getPercent } from '../utils';

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
    const entradas = data.transacoes.filter((item) => item.tipo === 'ENTRADA').reduce((sum, item) => sum + Number(item.valor || 0), 0) || 6850;
    const saidas = data.transacoes.filter((item) => item.tipo === 'SAIDA').reduce((sum, item) => sum + Number(item.valor || 0), 0) || 2799.1;
    const saldo = data.contas.reduce((sum, conta) => sum + Number(conta.saldo || 0), 0) || 4050.9;
    const investido = data.investimentos.reduce((sum, inv) => sum + Number(inv.valorInvestido || inv.valor || 0), 0) || 3250;
    return { entradas, saidas, saldo, investido };
  }, [data]);

  async function handlePix(payload) {
    await finlearnService.criarPix(payload);
    setNotice('Pix enviado com sucesso. A movimentação foi registrada no backend.');
    setModal(null);
    loadData();
  }

  async function handleTransaction(payload) {
    await finlearnService.criarTransacao(payload);
    setNotice('Transação registrada com sucesso.');
    setModal(null);
    loadData();
  }

  const metaPrincipal = data.metas[0] || fallbackData.metas[0];
  const progressoMeta = getPercent(metaPrincipal.valorAtual, metaPrincipal.valorObjetivo);

  return (
    <>
      <Header title="Bem vindo Thiago" subtitle="Nível 2 · Explorador Financeiro" usuario={data.usuario} />
      <div className="page-content home-page">
        {notice && <div className="success-banner">{notice}</div>}

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
            <div className="level-info"><span>Nível atual</span><h2>Nível 2</h2><p>Explorador Financeiro</p><div className="level-line"><i style={{ width: '62%' }} /></div><small>Próximo nível: 2.000 pontos <b>62%</b></small></div>
          </Card>
        </div>

        <div className="quick-actions">
          <Button onClick={() => setModal('pix')}><ArrowLeftRight size={20} /> Pix</Button>
          <Button onClick={() => setModal('pagar')}><Landmark size={20} /> Pagar</Button>
          <Button onClick={() => setModal('transferir')}><ArrowLeftRight size={20} /> Transferir</Button>
          <Button onClick={() => setModal('extrato')}><FileText size={20} /> Ver extrato</Button>
          <Button onClick={() => setModal('investir')}><BarChart3 size={20} /> Investir</Button>
          <Button onClick={() => setModal('meta')}><Target size={20} /> Criar meta</Button>
        </div>

        <div className="three-grid">
          <Card><div className="card-title-row"><h3>Movimentações recentes</h3><button>Ver todas</button></div><MovementList items={data.transacoes.slice(0, 3)} /></Card>
          <Card><div className="card-title-row"><h3>Meta principal</h3><button>Ver todas</button></div><div className="goal-summary"><span className="goal-icon"><Target /></span><div><h4>{metaPrincipal.titulo}</h4><p>{metaPrincipal.descricao}</p></div></div><div className="progress-line"><i style={{ width: `${progressoMeta}%` }} /></div><div className="progress-values"><span>Atual<br /><b>{formatCurrency(metaPrincipal.valorAtual)}</b></span><strong>{progressoMeta}%</strong><span>Meta<br /><b>{formatCurrency(metaPrincipal.valorObjetivo)}</b></span></div><div className="reward">⭐ +{metaPrincipal.pontosRecompensa || 100} pontos ao concluir</div></Card>
          <Card><div className="card-title-row"><h3>Investimentos</h3><button>Ver todos</button></div><div className="investment-total"><span>Total investido</span><strong>{formatCurrency(resumo.investido)}</strong><small>▲ 8,42%</small></div>{data.investimentos.slice(0, 3).map((item) => <div className="simple-row" key={item.id}><span>{item.nome}</span><b>{formatCurrency(item.valorInvestido || item.valor)}</b></div>)}</Card>
        </div>

        <div className="bottom-grid">
          <Card><div className="card-title-row"><h3>Visão financeira</h3><select><option>Este mês</option></select></div><div className="bar-chart"><div style={{ height: '80%' }}><b>{formatCurrency(resumo.entradas)}</b><i className="bar green" /></div><div style={{ height: '52%' }}><b>{formatCurrency(resumo.saidas)}</b><i className="bar red" /></div><div style={{ height: '60%' }}><b>{formatCurrency(resumo.investido)}</b><i className="bar blue" /></div></div></Card>
          <Card><h3>Desafios em andamento</h3>{['Economizar em compras', 'Investir este mês', 'Evitar gastos por impulso'].map((item, index) => <div className="challenge-row" key={item}><span>{item}<small>Reduza gastos supérfluos</small></span><div className="tiny-progress"><i style={{ width: `${[66, 70, 40][index]}%` }} /></div><b>+{[50, 75, 50][index]} pts</b></div>)}</Card>
          <Card className="ranking-mini"><h3>Seu ranking</h3><strong>10º <span>lugar</span></strong><p>no ranking geral</p><div className="reward">⭐ Continue assim e suba no ranking!</div></Card>
        </div>
      </div>

      <Modal isOpen={modal === 'pix'} onClose={() => setModal(null)} title="Enviar Pix" subtitle="Informe a chave, valor e escolha se deseja usar saldo ou Pix no crédito.">
        <PixForm contas={data.contas} onSubmit={handlePix} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={['pagar', 'transferir'].includes(modal)} onClose={() => setModal(null)} title={modal === 'pagar' ? 'Pagar conta' : 'Transferir valor'} subtitle="Essa ação será registrada como transação no backend.">
        <TransactionForm contas={data.contas} onSubmit={handleTransaction} onCancel={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal === 'extrato'} onClose={() => setModal(null)} title="Extrato recente" subtitle="Últimas movimentações puxadas do backend."><MovementList items={data.transacoes} /></Modal>
      <Modal isOpen={modal === 'investir'} onClose={() => setModal(null)} title="Investir" subtitle="Use a tela de investimentos para cadastrar uma nova aplicação."><p className="modal-text">Clique em “Novo investimento” na tela de investimentos para salvar os dados direto no backend.</p></Modal>
      <Modal isOpen={modal === 'meta'} onClose={() => setModal(null)} title="Criar meta" subtitle="A criação completa está disponível na tela Metas."><p className="modal-text">Acesse Metas para cadastrar, editar e excluir metas financeiras conectadas ao Java.</p></Modal>
    </>
  );
}

function MovementList({ items }) {
  const safeItems = items?.length ? items : fallbackData.transacoes;
  return <div className="movement-list">{safeItems.map((item) => <div className="movement-item" key={item.id}><span className={item.tipo === 'SAIDA' ? 'movement-icon red' : 'movement-icon green'}><CreditCard size={16} /></span><div><strong>{item.descricao}</strong><small>{item.tipo}</small></div><b className={item.tipo === 'SAIDA' ? 'negative-text' : 'positive-text'}>{item.tipo === 'SAIDA' ? '-' : '+'}{formatCurrency(item.valor)}</b></div>)}</div>;
}
