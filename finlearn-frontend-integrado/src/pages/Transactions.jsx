import EntityPage from '../components/EntityPage';
import { transacaoService } from '../api/finlearnService';
import { formatCurrency, formatDate } from '../utils/formatters';

const fields = [
  { name: 'descricao', label: 'Descrição', required: true },
  { name: 'tipo', label: 'Tipo', required: true, options: [
    { value: 'ENTRADA', label: 'Entrada' },
    { value: 'SAIDA', label: 'Saída' },
    { value: 'PIX', label: 'Pix' },
    { value: 'TRANSFERENCIA', label: 'Transferência' },
  ] },
  { name: 'categoria', label: 'Categoria', defaultValue: 'Geral' },
  { name: 'valor', label: 'Valor', type: 'number', required: true },
  { name: 'data', label: 'Data', type: 'date', required: true },
  { name: 'status', label: 'Status', defaultValue: 'CONCLUIDA', options: [
    { value: 'CONCLUIDA', label: 'Concluída' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'CANCELADA', label: 'Cancelada' },
  ] },
  { name: 'contaId', label: 'ID da conta', type: 'number', defaultValue: 1, required: true },
  { name: 'usuarioId', label: 'ID do usuário', type: 'number', defaultValue: 1, required: true },
];

const columns = [
  { key: 'descricao', label: 'Descrição' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'categoria', label: 'Categoria' },
  { key: 'data', label: 'Data' },
  { key: 'status', label: 'Status' },
  { key: 'valor', label: 'Valor' },
];

function normalize(transacao) {
  return {
    id: transacao.id,
    descricao: transacao.descricao || '-',
    tipo: transacao.tipo || '-',
    categoria: transacao.categoria || '-',
    data: formatDate(transacao.data),
    status: transacao.status || '-',
    valor: formatCurrency(transacao.valor),
    original: transacao,
  };
}

function payloadMapper(form) {
  const { contaId, usuarioId, ...payload } = form;
  return {
    ...payload,
    conta: { id: Number(contaId || 1) },
    usuario: { id: Number(usuarioId || 1) },
  };
}

export default function Transactions() {
  return (
    <EntityPage
      title="Transações"
      subtitle="Acompanhe entradas, saídas, Pix e movimentações da sua conta."
      service={transacaoService}
      fields={fields}
      columns={columns}
      normalize={normalize}
      payloadMapper={payloadMapper}
      emptyMessage="Nenhuma transação cadastrada no backend."
      createButtonLabel="Nova transação"
    />
  );
}
