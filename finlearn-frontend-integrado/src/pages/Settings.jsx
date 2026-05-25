import EntityPage from '../components/EntityPage';
import { usuarioService } from '../api/finlearnService';

const fields = [
  { name: 'nome', label: 'Nome completo', required: true },
  { name: 'cpf', label: 'CPF', required: true },
  { name: 'email', label: 'E-mail', required: true },
  { name: 'senha', label: 'Senha', required: true },
  { name: 'telefone', label: 'Telefone' },
  { name: 'dataCadastro', label: 'Data de cadastro', type: 'date' },
  { name: 'pontos', label: 'Pontos', type: 'number', defaultValue: 0 },
  { name: 'nivel', label: 'Nível', defaultValue: 'Explorador Financeiro' },
];

const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'cpf', label: 'CPF' },
  { key: 'email', label: 'E-mail' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'pontos', label: 'Pontos' },
  { key: 'nivel', label: 'Nível' },
];

function normalize(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome || '-',
    cpf: usuario.cpf || '-',
    email: usuario.email || '-',
    telefone: usuario.telefone || '-',
    pontos: usuario.pontos || 0,
    nivel: usuario.nivel || '-',
    original: usuario,
  };
}

export default function Settings() {
  return (
    <EntityPage
      title="Configurações"
      subtitle="Gerencie sua conta, preferências e dados pessoais."
      service={usuarioService}
      fields={fields}
      columns={columns}
      normalize={normalize}
      emptyMessage="Nenhum usuário cadastrado no backend."
      createButtonLabel="Novo usuário"
    />
  );
}
