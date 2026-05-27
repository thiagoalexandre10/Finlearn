import { useEffect, useMemo, useState } from 'react';
import { CreditCard, Shield, TrendingUp, Wallet } from 'lucide-react';
import Header from '../components/Header';
import { Card, StatCard } from '../components/UI';
import { finlearnService, fallbackData } from '../api/finlearnService';
import { usuarioBase } from '../data';
import { formatCurrency } from '../utils';

function isVisibleAccount(conta) {
  const tipo = String(conta.tipo || conta.tipoConta || '').toUpperCase();
  return tipo === 'CORRENTE' || tipo === 'POUPANCA' || tipo.includes('CORRENTE') || tipo.includes('POUPANCA');
}

export default function Accounts() {
  const [contas, setContas] = useState([]);

  async function loadData() {
    const items = await finlearnService.listarContas();
    setContas(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  const safeContas = (contas.length ? contas : fallbackData.contas).filter(isVisibleAccount).slice(0, 2);
  const corrente = safeContas.find((c) => String(c.tipo).toUpperCase().includes('CORRENTE')) || safeContas[0];
  const poupanca = safeContas.find((c) => String(c.tipo).toUpperCase().includes('POUPANCA')) || safeContas[1];
  const saldoTotal = useMemo(() => safeContas.reduce((sum, conta) => sum + Number(conta.saldo || 0), 0), [safeContas]);

  return (
    <>
      <Header title="Contas" subtitle="Acompanhe sua conta corrente e sua poupança em um só lugar." usuario={usuarioBase} />
      <div className="page-content">
        <div className="stats-grid four">
          <StatCard icon={Wallet} label="Saldo total" value={formatCurrency(saldoTotal)} hint="Conta corrente + poupança" />
          <StatCard icon={TrendingUp} label="Conta corrente" value={formatCurrency(corrente?.saldo || 0)} hint="Disponível" />
          <StatCard icon={CreditCard} label="Conta poupança" value={formatCurrency(poupanca?.saldo || 0)} hint="Disponível" />
          <StatCard icon={TrendingUp} label="Rendimentos (mês)" value={formatCurrency(poupanca?.rendimentoMes || 6)} hint="Total nas contas" />
        </div>

        <div className="accounts-layout">
          <section>
            <h2 className="section-title">Minhas contas</h2>
            <div className="account-list">
              {safeContas.map((conta) => (
                <Card key={conta.id} className="account-card">
                  <div className="account-main">
                    <span className="account-icon"><CreditCard /></span>
                    <div>
                      <h3>{conta.nome || (String(conta.tipo).includes('POUPANCA') ? 'Conta Poupança' : 'Conta Corrente')}</h3>
                      <p>{conta.banco || 'Banco FinLearn'}</p>
                      <span>Agência {conta.agencia || '0001'} · Conta {conta.numero || conta.numeroConta || conta.id}</span>
                    </div>
                    <strong>{formatCurrency(conta.saldo)}</strong>
                  </div>
                  <div className="account-details">
                    <span>Limite disponível<br /><b>{formatCurrency(conta.limite || 500)}</b></span>
                    <span>Utilizado<br /><b>{formatCurrency(0)}</b></span>
                    <span>Rendimento (mês)<br /><b>{formatCurrency(conta.rendimentoMes || conta.rendimento || 0)}</b></span>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <aside className="side-stack">
            <Card>
              <h3>Distribuição dos saldos</h3>
              <div className="donut" />
              <div className="simple-row"><span>Conta Corrente</span><b>{saldoTotal ? Math.round((Number(corrente?.saldo || 0) / saldoTotal) * 100) : 0}%</b></div>
              <div className="simple-row"><span>Conta Poupança</span><b>{saldoTotal ? Math.round((Number(poupanca?.saldo || 0) / saldoTotal) * 100) : 0}%</b></div>
            </Card>
            <Card>
              <h3>Resumo do mês</h3>
              <div className="simple-row"><span>Entradas</span><b className="positive-text">R$ 4.500,00</b></div>
              <div className="simple-row"><span>Saídas</span><b className="negative-text">- R$ 2.050,00</b></div>
              <hr />
              <div className="simple-row"><strong>Saldo do mês</strong><b className="positive-text">{formatCurrency(Math.max(0, saldoTotal - 2050))}</b></div>
            </Card>
            <Card className="security-card"><Shield /><div><h3>Suas contas estão seguras</h3><p>Utilizamos criptografia e monitoramento para proteger sua experiência financeira.</p></div></Card>
          </aside>
        </div>
      </div>
    </>
  );
}
