import { useEffect, useMemo, useState } from 'react';
import { CreditCard, Plus, Shield, TrendingUp, Wallet } from 'lucide-react';
import Header from '../components/Header';
import { Button, Card, Field, Modal, StatCard } from '../components/UI';
import { finlearnService, fallbackData } from '../api/finlearnService';
import { usuarioBase } from '../data';
import { formatCurrency } from '../utils';

export default function Accounts() {
  const [contas, setContas] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nome: '', tipo: 'CORRENTE', banco: 'Banco FinLearn', saldo: '', agencia: '0001', numero: '' });

  async function loadData() { setContas(await finlearnService.listarContas()); }
  useEffect(() => { loadData(); }, []);

  const safeContas = contas.length ? contas : fallbackData.contas;
  const saldoTotal = useMemo(() => safeContas.reduce((sum, conta) => sum + Number(conta.saldo || 0), 0), [safeContas]);

  async function saveAccount(event) {
    event.preventDefault();
    await finlearnService.criarConta({ ...form, saldo: Number(form.saldo), usuario: usuarioBase });
    setModal(false);
    loadData();
  }

  return (
    <>
      <Header title="Contas" subtitle="Acompanhe saldos, limites e rendimentos em um só lugar." usuario={usuarioBase} />
      <div className="page-content">
        <div className="page-action"><Button onClick={() => setModal(true)}><Plus /> Nova conta</Button></div>
        <div className="stats-grid four">
          <StatCard icon={Wallet} label="Saldo total" value={formatCurrency(saldoTotal)} hint="Em todas as contas" />
          <StatCard icon={TrendingUp} label="Conta corrente" value={formatCurrency(safeContas.find((c) => c.tipo === 'CORRENTE')?.saldo || 2850.9)} hint="Disponível" />
          <StatCard icon={CreditCard} label="Conta poupança" value={formatCurrency(safeContas.find((c) => c.tipo === 'POUPANCA')?.saldo || 1200)} hint="Disponível" />
          <StatCard icon={TrendingUp} label="Rendimentos (mês)" value={formatCurrency(6)} hint="Total nas contas" />
        </div>

        <div className="accounts-layout">
          <section>
            <h2 className="section-title">Minhas contas</h2>
            <div className="account-list">
              {safeContas.map((conta) => (
                <Card key={conta.id} className="account-card">
                  <div className="account-main"><span className="account-icon"><CreditCard /></span><div><h3>{conta.nome || conta.tipo}</h3><p>{conta.banco || 'Banco FinLearn'}</p><span>Agência {conta.agencia || '0001'} · Conta {conta.numero || conta.id}</span></div><strong>{formatCurrency(conta.saldo)}</strong></div>
                  <div className="account-details"><span>Limite disponível<br /><b>{formatCurrency(conta.limite || 500)}</b></span><span>Utilizado<br /><b>{formatCurrency(0)}</b></span><span>Rendimento (mês)<br /><b>{formatCurrency(conta.rendimentoMes || 0)}</b></span></div>
                </Card>
              ))}
            </div>
          </section>
          <aside className="side-stack"><Card><h3>Distribuição dos saldos</h3><div className="donut" /><div className="simple-row"><span>Conta Corrente</span><b>70,4%</b></div><div className="simple-row"><span>Conta Poupança</span><b>29,6%</b></div></Card><Card><h3>Resumo do mês</h3><div className="simple-row"><span>Entradas</span><b className="positive-text">R$ 4.500,00</b></div><div className="simple-row"><span>Saídas</span><b className="negative-text">- R$ 2.050,00</b></div><hr /><div className="simple-row"><strong>Saldo do mês</strong><b className="positive-text">R$ 2.450,00</b></div></Card><Card className="security-card"><Shield /><div><h3>Suas contas estão seguras</h3><p>Utilizamos criptografia e monitoramento 24h para proteger seu dinheiro.</p></div></Card></aside>
        </div>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Nova conta" subtitle="Cadastre uma conta conectada ao backend.">
        <form className="form-grid" onSubmit={saveAccount}>
          <Field label="Nome"><input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></Field>
          <Field label="Tipo"><select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}><option value="CORRENTE">Conta Corrente</option><option value="POUPANCA">Poupança</option><option value="CARTAO_CREDITO">Cartão de Crédito</option></select></Field>
          <Field label="Saldo"><input type="number" required value={form.saldo} onChange={(e) => setForm({ ...form, saldo: e.target.value })} /></Field>
          <Field label="Número"><input value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} /></Field>
          <div className="form-actions"><Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button><Button type="submit">Salvar conta</Button></div>
        </form>
      </Modal>
    </>
  );
}
