import { CreditCard } from 'lucide-react';
import EntityPage from '../components/EntityPage';
import { contaService } from '../api/finlearnService';
import { formatCurrency } from '../utils/formatters';

const fields = [
  { name: 'tipo', label: 'Tipo da conta', required: true, options: [
    { value: 'CONTA_CORRENTE', label: 'Conta corrente' },
    { value: 'CONTA_POUPANCA', label: 'Conta poupança' },
    { value: 'CARTAO', label: 'Cartão' },
  ] },
  { name: 'nome', label: 'Nome da conta', required: true },
  { name: 'banco', label: 'Banco', defaultValue: 'Banco FinLearn' },
  { name: 'agencia', label: 'Agência', defaultValue: '0001' },
  { name: 'numero', label: 'Número da conta', required: true },
  { name: 'saldo', label: 'Saldo', type: 'number', required: true },
  { name: 'limite', label: 'Limite', type: 'number', defaultValue: 0 },
  { name: 'rendimentoMensal', label: 'Rendimento mensal', type: 'number', defaultValue: 0 },
  { name: 'usuarioId', label: 'ID do usuário', type: 'number', defaultValue: 1, required: true },
];

const columns = [
  { key: 'nome', label: 'Conta' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'banco', label: 'Banco' },
  { key: 'numero', label: 'Número' },
  { key: 'saldo', label: 'Saldo' },
  { key: 'limite', label: 'Limite' },
];

function normalize(conta) {
  return {
    id: conta.id,
    nome: conta.nome || conta.tipo || 'Conta',
    tipo: conta.tipo || '-',
    banco: conta.banco || 'Banco FinLearn',
    numero: conta.numero || conta.numeroConta || '-',
    saldo: formatCurrency(conta.saldo),
    limite: formatCurrency(conta.limite),
    original: conta,
  };
}

function payloadMapper(form) {
  const { usuarioId, ...payload } = form;
  return {
    ...payload,
    usuario: { id: Number(usuarioId || 1) },
  };
}

export default function Accounts() {
  return (
    <EntityPage
      title="Contas"
      subtitle="Acompanhe saldos, limites e rendimentos em um só lugar."
      service={contaService}
      fields={fields}
      columns={columns}
      normalize={normalize}
      payloadMapper={payloadMapper}
      emptyMessage="Nenhuma conta cadastrada no backend."
      createButtonLabel="Nova conta"
      icon={CreditCard}
    />
  );
}
