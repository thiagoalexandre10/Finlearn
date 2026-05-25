import EntityPage from '../components/EntityPage';
import { investimentoService } from '../api/finlearnService';
import { formatCurrency, formatDate } from '../utils/formatters';

const fields = [
  { name: 'nome', label: 'Nome do investimento', required: true },
  { name: 'tipo', label: 'Tipo', required: true, options: [
    { value: 'RENDA_FIXA', label: 'Renda fixa' },
    { value: 'FUNDOS', label: 'Fundos' },
    { value: 'ACOES', label: 'Ações' },
    { value: 'CRIPTO', label: 'Cripto' },
  ] },
  { name: 'valorInvestido', label: 'Valor investido', type: 'number', required: true },
  { name: 'rentabilidade', label: 'Rentabilidade (%)', type: 'number', required: true },
  { name: 'dataAplicacao', label: 'Data da aplicação', type: 'date', required: true },
  { name: 'status', label: 'Status', defaultValue: 'ATIVO', options: [
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'RESGATADO', label: 'Resgatado' },
    { value: 'VOLATIL', label: 'Volátil' },
  ] },
  { name: 'usuarioId', label: 'ID do usuário', type: 'number', defaultValue: 1, required: true },
];

const columns = [
  { key: 'nome', label: 'Ativo' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'valorInvestido', label: 'Valor investido' },
  { key: 'rentabilidade', label: 'Rentabilidade' },
  { key: 'dataAplicacao', label: 'Data' },
  { key: 'status', label: 'Status' },
];

function normalize(investimento) {
  return {
    id: investimento.id,
    nome: investimento.nome || investimento.titulo || 'Investimento',
    tipo: investimento.tipo || '-',
    valorInvestido: formatCurrency(investimento.valorInvestido || investimento.valor),
    rentabilidade: `${investimento.rentabilidade || 0}%`,
    dataAplicacao: formatDate(investimento.dataAplicacao || investimento.data),
    status: investimento.status || '-',
    original: investimento,
  };
}

function payloadMapper(form) {
  const { usuarioId, ...payload } = form;
  return {
    ...payload,
    usuario: { id: Number(usuarioId || 1) },
  };
}

export default function Investments() {
  return (
    <EntityPage
      title="Investimentos"
      subtitle="Acompanhe sua carteira, performance e evolução dos seus rendimentos."
      service={investimentoService}
      fields={fields}
      columns={columns}
      normalize={normalize}
      payloadMapper={payloadMapper}
      emptyMessage="Nenhum investimento cadastrado no backend."
      createButtonLabel="Novo investimento"
    />
  );
}
