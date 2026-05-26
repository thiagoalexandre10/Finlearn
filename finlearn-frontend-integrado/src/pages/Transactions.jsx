import { useEffect, useMemo, useState } from 'react';
import { CreditCard, Download, ArrowLeftRight, Plus, Search, TrendingDown, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import { Button, Card, Modal, StatCard } from '../components/UI';
import { PixForm, TransactionForm } from '../components/forms';
import { finlearnService, fallbackData } from '../api/finlearnService';
import { usuarioBase } from '../data';
import { formatCurrency, formatDate } from '../utils';

export default function Transactions() {
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);

  async function loadData() {
    setTransacoes(await finlearnService.listarTransacoes());
    setContas(await finlearnService.listarContas());
  }

  useEffect(() => { loadData(); }, []);

  const resumo = useMemo(() => {
    const entrada = transacoes.filter((item) => item.tipo === 'ENTRADA').reduce((sum, item) => sum + Number(item.valor || 0), 0) || 6850;
    const saida = transacoes.filter((item) => item.tipo === 'SAIDA').reduce((sum, item) => sum + Number(item.valor || 0), 0) || 2799.1;
    return { entrada, saida, pix: transacoes.filter((item) => item.tipo === 'PIX').length || 18, saldo: entrada - saida };
  }, [transacoes]);

  async function saveTransaction(payload) {
    await finlearnService.criarTransacao(payload);
    setModal(null);
    loadData();
  }

  async function savePix(payload) {
    await finlearnService.criarPix(payload);
    setModal(null);
    loadData();
  }

  const rows = transacoes.length ? transacoes : fallbackData.transacoes;

  return (
    <>
      <Header title="Transações" subtitle="Acompanhe entradas, saídas, Pix e movimentações da sua conta." usuario={usuarioBase} />
      <div className="page-content">
        <div className="stats-grid four">
          <StatCard icon={TrendingUp} label="Entradas no mês" value={formatCurrency(resumo.entrada)} tone="green" />
          <StatCard icon={TrendingDown} label="Saídas no mês" value={formatCurrency(resumo.saida)} tone="red" />
          <StatCard icon={ArrowLeftRight} label="Pix realizados" value={resumo.pix} hint="transações" tone="green" />
          <StatCard icon={CreditCard} label="Saldo atual" value={formatCurrency(resumo.saldo)} tone="green" />
        </div>

        <div className="quick-actions compact-actions">
          <Button onClick={() => setModal('transacao')}><Plus /> Nova transação</Button>
          <Button onClick={() => setModal('pix')}><ArrowLeftRight /> Pix</Button>
          <Button onClick={() => setModal('transferir')}><ArrowLeftRight /> Transferir</Button>
          <Button onClick={() => setModal('extrato')}><CreditCard /> Ver extrato</Button>
          <Button onClick={() => window.print()}><Download /> Exportar</Button>
        </div>

        <div className="transactions-layout">
          <Card className="table-card">
            <div className="card-title-row"><h3>Histórico de transações</h3><div className="search-box"><Search size={16} /><input placeholder="Buscar por descrição" /></div></div>
            <div className="tabs"><button className="active">Todas</button><button>Entradas</button><button>Saídas</button><button>Pix</button><button>Cartão</button></div>
            <table>
              <thead><tr><th>Descrição</th><th>Tipo</th><th>Origem</th><th>Destino</th><th>Data</th><th>Status</th><th>Valor</th></tr></thead>
              <tbody>{rows.map((item) => <tr key={item.id} onClick={() => setSelected(item)} className={selected?.id === item.id ? 'selected' : ''}><td>{item.descricao}</td><td><span className="tag">{item.tipo}</span></td><td>{item.origem || 'Conta Corrente'}</td><td>{item.destino || '—'}</td><td>{formatDate(item.data)}</td><td><span className="tag success">{item.status || 'Concluída'}</span></td><td className={item.tipo === 'SAIDA' ? 'negative-text' : 'positive-text'}>{item.tipo === 'SAIDA' ? '-' : '+'}{formatCurrency(item.valor)}</td></tr>)}</tbody>
            </table>
          </Card>

          <aside className="side-stack">
            <Card><h3>Detalhes da movimentação</h3>{selected ? <div className="details-list"><b>{selected.descricao}</b><span>Tipo: {selected.tipo}</span><span>Data: {formatDate(selected.data)}</span><span>Status: {selected.status}</span><strong>{formatCurrency(selected.valor)}</strong><div className="dual-buttons"><Button variant="outline">Editar</Button><Button variant="danger">Excluir</Button></div></div> : <p>Selecione uma transação para visualizar os detalhes.</p>}</Card>
            <Card><h3>Resumo por tipo</h3><div className="donut small-donut" /><div className="simple-row"><span>Entradas</span><b>{formatCurrency(resumo.entrada)}</b></div><div className="simple-row"><span>Saídas</span><b>{formatCurrency(resumo.saida)}</b></div></Card>
          </aside>
        </div>
      </div>

      <Modal isOpen={modal === 'transacao' || modal === 'transferir'} onClose={() => setModal(null)} title="Nova transação" subtitle="Salve uma nova movimentação no backend."><TransactionForm contas={contas} onSubmit={saveTransaction} onCancel={() => setModal(null)} /></Modal>
      <Modal isOpen={modal === 'pix'} onClose={() => setModal(null)} title="Enviar Pix" subtitle="Envie via saldo ou Pix no crédito quando houver cartão."><PixForm contas={contas} onSubmit={savePix} onCancel={() => setModal(null)} /></Modal>
      <Modal isOpen={modal === 'extrato'} onClose={() => setModal(null)} title="Extrato"><div className="details-list">{rows.map((item) => <span key={item.id}>{formatDate(item.data)} · {item.descricao} · {formatCurrency(item.valor)}</span>)}</div></Modal>
    </>
  );
}
