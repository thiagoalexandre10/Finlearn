import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, FileText, LineChart, Target, WalletCards } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Card, SectionTitle } from '../components/Card';
import { contaService, investimentoService, metaService, transacaoService } from '../api/finlearnService';
import { calculateProgress, formatCurrency } from '../utils/formatters';

export default function Home() {
  const [contas, setContas] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [investimentos, setInvestimentos] = useState([]);
  const [metas, setMetas] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarResumo() {
      try {
        const [contasData, transacoesData, investimentosData, metasData] = await Promise.all([
          contaService.listar(),
          transacaoService.listar(),
          investimentoService.listar(),
          metaService.listar(),
        ]);
        setContas(Array.isArray(contasData) ? contasData : []);
        setTransacoes(Array.isArray(transacoesData) ? transacoesData : []);
        setInvestimentos(Array.isArray(investimentosData) ? investimentosData : []);
        setMetas(Array.isArray(metasData) ? metasData : []);
        setErro('');
      } catch (error) {
        console.error(error);
        setErro('Alguns dados não puderam ser carregados do backend.');
      }
    }

    carregarResumo();
  }, []);

  const saldoTotal = contas.reduce((total, conta) => total + Number(conta.saldo || 0), 0);
  const totalInvestido = investimentos.reduce((total, inv) => total + Number(inv.valorInvestido || inv.valor || 0), 0);
  const entradas = transacoes.filter((t) => t.tipo === 'ENTRADA').reduce((total, t) => total + Number(t.valor || 0), 0);
  const saidas = transacoes.filter((t) => t.tipo === 'SAIDA').reduce((total, t) => total + Number(t.valor || 0), 0);
  const metaPrincipal = metas[0];
  const progressoMeta = metaPrincipal ? calculateProgress(metaPrincipal.valorAtual, metaPrincipal.valorObjetivo) : 0;

  const movimentos = useMemo(() => transacoes.slice(0, 3), [transacoes]);

  return (
    <>
      <PageHeader title="Bem vindo Thiago" subtitle="Nível 2 · Explorador Financeiro" />
      <div className="page-container">
        {erro && <Card><p className="text-red">{erro}</p></Card>}

        <section className="home-hero-grid">
          <Card className="balance-card">
            <div className="balance-top">
              <span>Saldo disponível</span>
              <Eye size={18} />
            </div>
            <strong>{formatCurrency(saldoTotal)}</strong>
            <div className="balance-summary">
              <span>Entradas <b>{formatCurrency(entradas)}</b></span>
              <span>Saídas <b>{formatCurrency(saidas)}</b></span>
              <span>Investido <b>{formatCurrency(totalInvestido)}</b></span>
            </div>
          </Card>

          <Card className="level-card">
            <div className="level-illustration">▲</div>
            <div>
              <span>Nível atual</span>
              <h2>Nível 2</h2>
              <p>Explorador Financeiro</p>
              <div className="progress-bar"><span style={{ width: '62%' }} /></div>
            </div>
          </Card>
        </section>

        <section className="quick-actions">
          <Link to="/pix"><WalletCards size={18} />Pix</Link>
          <Link to="/transacoes"><FileText size={18} />Pagar</Link>
          <Link to="/transacoes"><FileText size={18} />Transferir</Link>
          <Link to="/transacoes"><FileText size={18} />Ver extrato</Link>
          <Link to="/investimentos"><LineChart size={18} />Investir</Link>
          <Link to="/metas"><Target size={18} />Criar meta</Link>
        </section>

        <section className="three-column-grid">
          <Card>
            <SectionTitle title="Movimentações recentes" action="Ver todas" />
            {movimentos.length === 0 && <p>Nenhuma transação cadastrada.</p>}
            {movimentos.map((item) => (
              <div className="list-row" key={item.id}>
                <span className="circle-icon"><FileText size={18} /></span>
                <div><strong>{item.descricao}</strong><small>{item.tipo}</small></div>
                <strong className={item.tipo === 'SAIDA' ? 'text-red' : 'text-green'}>{formatCurrency(item.valor)}</strong>
              </div>
            ))}
          </Card>

          <Card>
            <SectionTitle title="Meta principal" action="Ver todas" />
            {metaPrincipal ? (
              <>
                <div className="list-row">
                  <span className="circle-icon"><Target size={18} /></span>
                  <div><strong>{metaPrincipal.titulo}</strong><small>{metaPrincipal.descricao}</small></div>
                  <strong className="text-green">{progressoMeta}%</strong>
                </div>
                <div className="progress-bar"><span style={{ width: `${progressoMeta}%` }} /></div>
              </>
            ) : <p>Nenhuma meta cadastrada.</p>}
          </Card>

          <Card>
            <SectionTitle title="Investimentos" action="Ver todos" />
            <div className="soft-box">
              <span>Total investido</span>
              <strong>{formatCurrency(totalInvestido)}</strong>
            </div>
            {investimentos.slice(0, 3).map((item) => (
              <div className="mini-line" key={item.id}>
                <span>{item.nome || item.tipo}</span>
                <strong>{formatCurrency(item.valorInvestido || item.valor)}</strong>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </>
  );
}
