import { useEffect, useMemo, useState } from 'react';
import { Eye, PieChart, Plus, RotateCcw, TrendingUp, Wallet } from 'lucide-react';
import Header from '../components/Header';
import { Button, Card, Modal, StatCard } from '../components/UI';
import { InvestmentForm } from '../components/forms';
import { finlearnService, fallbackData } from '../api/finlearnService';
import { usuarioBase } from '../data';
import { formatCurrency, formatDate } from '../utils';

export default function Investments() {
  const [data, setData] = useState({ investimentos: [], contas: [], usuario: usuarioBase });
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState('');

  async function loadData() {
    const dashboard = await finlearnService.carregarDashboard();
    setData(dashboard);
  }

  useEffect(() => { loadData(); }, []);

  const safeItems = data.investimentos.length ? data.investimentos : fallbackData.investimentos;
  const ativos = safeItems.filter((item) => item.status !== 'RESGATADO');
  const total = useMemo(() => ativos.reduce((sum, item) => sum + Number(item.valorInvestido || item.valor || 0), 0), [ativos]);
  const rendimentoMes = ativos.reduce((sum, item) => sum + (Number(item.valorInvestido || 0) * (Number(item.rentabilidade || 0) / 100 / 12)), 0);

  async function save(payload) {
    try {
      await finlearnService.criarInvestimento(payload);
      setNotice('Investimento realizado. O saldo atual foi reduzido e a carteira foi atualizada.');
      setModal(false);
      loadData();
    } catch (error) {
      setNotice(error.message || 'Não foi possível realizar o investimento.');
    }
  }

  async function redeem(id) {
    try {
      await finlearnService.resgatarInvestimento(id);
      setNotice('Investimento resgatado. O valor retornou para o saldo e gerou notificação.');
      loadData();
    } catch (error) {
      setNotice(error.message || 'Não foi possível resgatar o investimento.');
    }
  }

  return (
    <>
      <Header title="Investimentos" subtitle="Acompanhe sua carteira, performance e evolução dos seus rendimentos." usuario={data.usuario} />
      <div className="page-content">
        {notice && <div className={notice.includes('Não') || notice.includes('insuficiente') ? 'error-banner' : 'success-banner'}>{notice}</div>}
        <div className="page-action"><Button onClick={() => setModal(true)}><Plus /> Novo investimento</Button></div>

        <div className="stats-grid four">
          <StatCard icon={Wallet} label="Total investido" value={formatCurrency(total)} hint="Em todos os ativos" />
          <StatCard icon={TrendingUp} label="Rentabilidade média" value="12,5% a.a." hint="Média ponderada" />
          <StatCard icon={Wallet} label="Rendimento do mês" value={formatCurrency(rendimentoMes)} hint="Rendimento simulado" />
          <StatCard icon={PieChart} label="Investimentos ativos" value={`${ativos.length} ativos`} hint="Distribuídos na carteira" />
        </div>

        <div className="invest-layout">
          <Card>
            <div className="card-title-row"><h3>Minha carteira</h3><Button variant="outline"><Eye size={15} /> Ver detalhes da carteira</Button></div>
            <div className="asset-list">
              {safeItems.map((item) => (
                <div className="asset-row" key={item.id}>
                  <span className="asset-logo">{String(item.nome || '?').slice(0, 2)}</span>
                  <div><strong>{item.nome}</strong><small>{item.tipo}</small></div>
                  <span><small>Valor investido</small><b>{formatCurrency(item.valorInvestido || item.valor)}</b></span>
                  <span><small>Rentabilidade</small><b className="positive-text">{item.rentabilidade || 8.7}% a.a.</b></span>
                  <span><small>Data da aplicação</small><b>{formatDate(item.dataAplicacao)}</b></span>
                  <span className={`tag ${item.status === 'RESGATADO' ? 'danger' : 'success'}`}>{item.status || 'ATIVO'}</span>
                  {item.status !== 'RESGATADO' && <Button variant="outline" onClick={() => redeem(item.id)}><RotateCcw size={15} /> Resgatar</Button>}
                </div>
              ))}
            </div>
          </Card>

          <aside className="side-stack">
            <Card><h3>Distribuição da carteira</h3><div className="donut" /><div className="simple-row"><span>Renda fixa</span><b>65,0%</b></div><div className="simple-row"><span>Fundos</span><b>16,3%</b></div><div className="simple-row"><span>Ações</span><b>12,2%</b></div></Card>
            <Card><h3>Resumo do mês</h3><div className="simple-row"><span>Aporte do mês</span><b>{formatCurrency(total)}</b></div><div className="simple-row"><span>Rendimento acumulado</span><b>{formatCurrency(rendimentoMes)}</b></div><hr /><div className="simple-row"><strong>Patrimônio projetado</strong><b>{formatCurrency(total + rendimentoMes)}</b></div></Card>
          </aside>
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Novo investimento" subtitle="O tipo e a rentabilidade são automáticos; o valor sai do saldo atual.">
        <InvestmentForm contas={data.contas} onSubmit={save} onCancel={() => setModal(false)} />
      </Modal>
    </>
  );
}
