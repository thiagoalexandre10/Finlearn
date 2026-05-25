import { useEffect, useState } from 'react';
import SimplePage from './SimplePage';
import { Card } from '../components/Card';
import { contaService, investimentoService, transacaoService } from '../api/finlearnService';
import { formatCurrency } from '../utils/formatters';

export default function Reports() {
  const [summary, setSummary] = useState({ entradas: 0, saidas: 0, investido: 0, saldo: 0 });

  useEffect(() => {
    async function load() {
      const [transacoes, investimentos, contas] = await Promise.all([transacaoService.listar(), investimentoService.listar(), contaService.listar()]);
      setSummary({
        entradas: transacoes.filter((t) => t.tipo === 'ENTRADA').reduce((t, i) => t + Number(i.valor || 0), 0),
        saidas: transacoes.filter((t) => t.tipo === 'SAIDA').reduce((t, i) => t + Number(i.valor || 0), 0),
        investido: investimentos.reduce((t, i) => t + Number(i.valorInvestido || i.valor || 0), 0),
        saldo: contas.reduce((t, i) => t + Number(i.saldo || 0), 0),
      });
    }
    load().catch(console.error);
  }, []);

  return (
    <SimplePage title="Relatórios" subtitle="Acompanhe entradas, saídas, investimentos e evolução financeira.">
      <section className="stats-grid four"><Card><p>Receitas</p><h2>{formatCurrency(summary.entradas)}</h2></Card><Card><p>Despesas</p><h2>{formatCurrency(summary.saidas)}</h2></Card><Card><p>Investido</p><h2>{formatCurrency(summary.investido)}</h2></Card><Card><p>Saldo</p><h2>{formatCurrency(summary.saldo)}</h2></Card></section>
    </SimplePage>
  );
}
