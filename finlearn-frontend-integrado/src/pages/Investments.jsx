import { useEffect, useMemo, useState } from 'react';
import { Eye, PieChart, Plus, TrendingUp, Wallet } from 'lucide-react';
import Header from '../components/Header';
import { Button, Card, Modal, StatCard } from '../components/UI';
import { InvestmentForm } from '../components/forms';
import { finlearnService, fallbackData } from '../api/finlearnService';
import { usuarioBase } from '../data';
import { formatCurrency, formatDate } from '../utils';

export default function Investments() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  async function loadData() { setItems(await finlearnService.listarInvestimentos()); }
  useEffect(() => { loadData(); }, []);
  const safeItems = items.length ? items : fallbackData.investimentos;
  const total = useMemo(() => safeItems.reduce((sum, item) => sum + Number(item.valorInvestido || item.valor || 0), 0), [safeItems]);
  async function save(payload) { await finlearnService.criarInvestimento(payload); setModal(false); loadData(); }

  return <><Header title="Investimentos" subtitle="Acompanhe sua carteira, performance e evolução dos seus rendimentos." usuario={usuarioBase} /><div className="page-content"><div className="page-action"><Button onClick={() => setModal(true)}><Plus /> Novo investimento</Button></div><div className="stats-grid four"><StatCard icon={Wallet} label="Total investido" value={formatCurrency(total)} hint="Em todos os ativos" /><StatCard icon={TrendingUp} label="Rentabilidade média" value="12,5% a.a." hint="Média ponderada" /><StatCard icon={Wallet} label="Rendimento do mês" value={formatCurrency(248.9)} hint="Rendimento acumulado" /><StatCard icon={PieChart} label="Investimentos ativos" value={`${safeItems.length} ativos`} hint="Distribuídos na carteira" /></div><div className="invest-layout"><Card><div className="card-title-row"><h3>Minha carteira</h3><Button variant="outline"><Eye size={15} /> Ver detalhes da carteira</Button></div><div className="asset-list">{safeItems.map((item) => <div className="asset-row" key={item.id}><span className="asset-logo">{String(item.nome || '?').slice(0, 2)}</span><div><strong>{item.nome}</strong><small>{item.tipo}</small></div><span><small>Valor investido</small><b>{formatCurrency(item.valorInvestido || item.valor)}</b></span><span><small>Rentabilidade</small><b className="positive-text">{item.rentabilidade || 8.7}% a.a.</b></span><span><small>Data da aplicação</small><b>{formatDate(item.dataAplicacao)}</b></span><span className="tag success">{item.status || 'ATIVO'}</span></div>)}</div></Card><aside className="side-stack"><Card><h3>Distribuição da carteira</h3><div className="donut" /><div className="simple-row"><span>Renda fixa</span><b>65,0%</b></div><div className="simple-row"><span>Fundos</span><b>16,3%</b></div><div className="simple-row"><span>Ações</span><b>12,2%</b></div></Card><Card><h3>Resumo do mês</h3><div className="simple-row"><span>Aporte do mês</span><b>{formatCurrency(1000)}</b></div><div className="simple-row"><span>Rendimento acumulado</span><b>{formatCurrency(248.9)}</b></div><hr /><div className="simple-row"><strong>Patrimônio projetado</strong><b>{formatCurrency(total + 248.9)}</b></div></Card></aside></div></div><Modal isOpen={modal} onClose={() => setModal(false)} title="Novo investimento" subtitle="Cadastre uma aplicação no backend."><InvestmentForm onSubmit={save} onCancel={() => setModal(false)} /></Modal></>;
}
