import { useEffect, useMemo, useState } from 'react';
import { CreditCard, Download, ArrowLeftRight, Plus, Search, TrendingDown, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import { Button, Card, Modal, StatCard } from '../components/UI';
import { PixForm, TransactionForm } from '../components/forms';
import { finlearnService, fallbackData } from '../api/finlearnService';
import { formatCurrency, formatDate } from '../utils';

function getText(item) {
  return [item.tipo, item.categoria, item.descricao, item.origem, item.destino, item.status]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getTransactionKind(item) {
  const text = getText(item);
  const rawTipo = String(item.tipo || '').toUpperCase();
  const valor = Number(item.valor || 0);

  if (text.includes('cartao') || text.includes('credito') || text.includes('debito')) {
    return 'CARTAO';
  }

  if (text.includes('pix')) {
    return 'PIX';
  }

  if (
    rawTipo.includes('SAIDA') ||
    rawTipo.includes('PAGAMENTO') ||
    rawTipo.includes('INVESTIMENTO') ||
    rawTipo.includes('TRANSFERENCIA_ENVIADA') ||
    text.includes('pagamento') ||
    text.includes('mercado') ||
    text.includes('investimento') ||
    text.includes('transferencia enviada') ||
    text.includes('saida') ||
    valor < 0
  ) {
    return 'SAIDA';
  }

  return 'ENTRADA';
}

function isTransactionOut(item) {
  const kind = getTransactionKind(item);
  return kind === 'SAIDA' || kind === 'CARTAO';
}

function typeLabel(item) {
  const kind = getTransactionKind(item);
  if (kind === 'PIX') return 'PIX';
  if (kind === 'CARTAO') return 'CARTÃO';
  if (kind === 'SAIDA') return 'SAÍDA';
  return 'ENTRADA';
}

export default function Transactions() {
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);
  const [activeTab, setActiveTab] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');

  async function loadData() {
    const dashboard = await finlearnService.carregarDashboard();
    setTransacoes(dashboard.transacoes);
    setContas(dashboard.contas);
    setUsuario(dashboard.usuario);
  }

  useEffect(() => { loadData(); }, []);

  const resumo = useMemo(() => {
    const entrada = transacoes
      .filter((item) => !isTransactionOut(item))
      .reduce((sum, item) => sum + Math.abs(Number(item.valor || 0)), 0) || 6850;

    const saida = transacoes
      .filter((item) => isTransactionOut(item))
      .reduce((sum, item) => sum + Math.abs(Number(item.valor || 0)), 0) || 2799.1;

    return {
      entrada,
      saida,
      pix: transacoes.filter((item) => getTransactionKind(item) === 'PIX').length || 18,
      saldo: contas
        .filter((conta) => !String(conta.tipo).toUpperCase().includes('CARTAO'))
        .reduce((sum, conta) => sum + Number(conta.saldo || 0), 0),
    };
  }, [transacoes, contas]);

  async function saveTransaction(payload) {
    try {
      await finlearnService.criarTransacao(payload);
      setNotice('Transação salva. Saldo e extrato atualizados.');
      setModal(null);
      loadData();
    } catch (error) {
      setNotice(error.message || 'Não foi possível salvar a transação.');
    }
  }

  async function savePix(payload) {
    try {
      await finlearnService.enviarPix(payload);
      setNotice('Pix enviado. Saldo, notificações e relatório atualizados.');
      setModal(null);
      loadData();
    } catch (error) {
      setNotice(error.message || 'Não foi possível enviar Pix.');
    }
  }

  const rows = useMemo(() => {
    const source = transacoes.length ? transacoes : fallbackData.transacoes;
    const term = searchTerm.trim().toLowerCase();

    return source.filter((item) => {
      const kind = getTransactionKind(item);
      const tipo = String(item.tipo || typeLabel(item)).toLowerCase();
      const categoria = String(item.categoria || '').toLowerCase();
      const descricao = String(item.descricao || '').toLowerCase();
      const origem = String(item.origem || '').toLowerCase();
      const destino = String(item.destino || '').toLowerCase();
      const status = String(item.status || '').toLowerCase();
      const valor = String(item.valor || '').replace('.', ',').toLowerCase();
      const data = String(item.data || '').toLowerCase();

      const matchesTab =
        activeTab === 'TODAS' ||
        (activeTab === 'ENTRADAS' && kind === 'ENTRADA') ||
        (activeTab === 'SAIDAS' && kind === 'SAIDA') ||
        (activeTab === 'PIX' && kind === 'PIX') ||
        (activeTab === 'CARTAO' && kind === 'CARTAO');

      const matchesSearch = !term || [descricao, origem, destino, status, valor, data, tipo, categoria, kind.toLowerCase()]
        .some((field) => field.includes(term));

      return matchesTab && matchesSearch;
    });
  }, [transacoes, activeTab, searchTerm]);

  const tabOptions = [
    { key: 'TODAS', label: 'Todas' },
    { key: 'ENTRADAS', label: 'Entradas' },
    { key: 'SAIDAS', label: 'Saídas' },
    { key: 'PIX', label: 'Pix' },
    { key: 'CARTAO', label: 'Cartão' },
  ];

  return (
    <>
      <Header title="Transações" subtitle="Acompanhe entradas, saídas, Pix e movimentações da sua conta." usuario={usuario} />
      <div className="page-content">
        {notice && <div className={notice.includes('Não') || notice.includes('insuficiente') ? 'error-banner' : 'success-banner'}>{notice}</div>}
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
            <div className="card-title-row"><h3>Histórico de transações</h3><div className="search-box"><Search size={16} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar por descrição, tipo, valor, data..." /></div></div>
            <div className="tabs">
              {tabOptions.map((tab) => (
                <button key={tab.key} className={activeTab === tab.key ? 'active' : ''} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
              ))}
            </div>
            <table>
              <thead><tr><th>Descrição</th><th>Tipo</th><th>Origem</th><th>Destino</th><th>Data</th><th>Status</th><th>Valor</th></tr></thead>
              <tbody>{rows.length ? rows.map((item) => {
                const isOut = isTransactionOut(item);
                return (
                  <tr key={item.id} onClick={() => setSelected(item)} className={selected?.id === item.id ? 'selected' : ''}>
                    <td>{item.descricao}</td>
                    <td><span className="tag">{typeLabel(item)}</span></td>
                    <td>{item.origem || 'Conta Corrente'}</td>
                    <td>{item.destino || '—'}</td>
                    <td>{formatDate(item.data)}</td>
                    <td><span className="tag success">{item.status || 'Concluída'}</span></td>
                    <td className={isOut ? 'negative-text' : 'positive-text'}>
                      {isOut ? '-' : '+'}{formatCurrency(Math.abs(Number(item.valor || 0)))}
                    </td>
                  </tr>
                );
              }) : <tr><td colSpan="7" className="empty-table-cell">Nenhuma transação encontrada para esse filtro.</td></tr>}</tbody>
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
