import { api, endpoints } from './api';

const usuarioPadrao = {
  id: 1,
  nome: 'Thiago',
  cpf: '1234563312188',
  email: 'thiago3312188@finlearn.com',
  telefone: '11999999999',
  pontos: 1250,
  nivel: 'Explorador Financeiro',
};

export const fallbackData = {
  usuario: usuarioPadrao,
  contas: [
    { id: 1, nome: 'Conta Corrente', tipo: 'CORRENTE', banco: 'Banco FinLearn', saldo: 2850.9, agencia: '0001', numero: '1024-6', limite: 500, usuario: usuarioPadrao },
    { id: 2, nome: 'Conta Poupança', tipo: 'POUPANCA', banco: 'Banco FinLearn', saldo: 1200, agencia: '0001', numero: '2048-3', rendimentoMes: 6, usuario: usuarioPadrao },
    { id: 3, nome: 'Cartão de Crédito', tipo: 'CARTAO_CREDITO', banco: 'Banco FinLearn', saldo: 0, limite: 1550, usuario: usuarioPadrao },
  ],
  transacoes: [
    { id: 1, descricao: 'Salário', tipo: 'ENTRADA', valor: 4500, data: '2026-05-24', status: 'CONCLUIDA', origem: 'Empresa', destino: 'Conta Corrente' },
    { id: 2, descricao: 'Mercado', tipo: 'SAIDA', valor: 356.8, data: '2026-05-23', status: 'CONCLUIDA', origem: 'Conta Corrente', destino: 'Supermercado' },
    { id: 3, descricao: 'Pix recebido', tipo: 'PIX', valor: 450, data: '2026-05-22', status: 'CONCLUIDA', origem: 'Banco externo', destino: 'Conta Corrente' },
  ],
  investimentos: [
    { id: 1, nome: 'Tesouro Direto', tipo: 'Renda Fixa', valorInvestido: 5000, rentabilidade: 12.5, dataAplicacao: '2026-05-24', status: 'ATIVO' },
    { id: 2, nome: 'CDB Nubank', tipo: 'Renda Fixa', valorInvestido: 3000, rentabilidade: 13.2, dataAplicacao: '2026-05-24', status: 'ATIVO' },
    { id: 3, nome: 'Fundo Imobiliário', tipo: 'Fundos', valorInvestido: 2000, rentabilidade: 8.7, dataAplicacao: '2026-05-24', status: 'ATIVO' },
  ],
  metas: [
    { id: 1, titulo: 'Reserva de emergência', descricao: 'Guardar dinheiro para emergências', valorObjetivo: 5000, valorAtual: 1200, dataLimite: '2026-12-31', status: 'EM_ANDAMENTO', pontosRecompensa: 100, usuario: usuarioPadrao },
  ],
  pix: [],
};

async function safeGet(path, fallback) {
  try {
    const data = await api.get(path);
    return Array.isArray(data) ? data : fallback;
  } catch (error) {
    console.warn(`Falha ao carregar ${path}. Usando dados locais.`, error);
    return fallback;
  }
}

async function safeAction(action, fallbackMessage) {
  try {
    return await action();
  } catch (error) {
    console.error(fallbackMessage, error);
    throw error;
  }
}

export const finlearnService = {
  carregarDashboard: async () => {
    const [contas, transacoes, investimentos, metas] = await Promise.all([
      safeGet(endpoints.contas, fallbackData.contas),
      safeGet(endpoints.transacoes, fallbackData.transacoes),
      safeGet(endpoints.investimentos, fallbackData.investimentos),
      safeGet(endpoints.metas, fallbackData.metas),
    ]);

    return { contas, transacoes, investimentos, metas, usuario: fallbackData.usuario };
  },

  listarContas: () => safeGet(endpoints.contas, fallbackData.contas),
  listarTransacoes: () => safeGet(endpoints.transacoes, fallbackData.transacoes),
  listarInvestimentos: () => safeGet(endpoints.investimentos, fallbackData.investimentos),
  listarMetas: () => safeGet(endpoints.metas, fallbackData.metas),
  listarPix: () => safeGet(endpoints.pix, fallbackData.pix),

  criarConta: (payload) => safeAction(() => api.post(endpoints.contas, payload), 'Erro ao criar conta'),
  criarTransacao: (payload) => safeAction(() => api.post(endpoints.transacoes, payload), 'Erro ao criar transação'),
  criarInvestimento: (payload) => safeAction(() => api.post(endpoints.investimentos, payload), 'Erro ao criar investimento'),
  criarMeta: (payload) => safeAction(() => api.post(endpoints.metas, payload), 'Erro ao criar meta'),
  criarPix: (payload) => safeAction(() => api.post(endpoints.pix, payload), 'Erro ao criar Pix'),

  atualizarUsuario: (id, payload) => safeAction(() => api.put(`${endpoints.usuarios}/${id}`, payload), 'Erro ao atualizar usuário'),
  atualizarMeta: (id, payload) => safeAction(() => api.put(`${endpoints.metas}/${id}`, payload), 'Erro ao atualizar meta'),
  excluirMeta: (id) => safeAction(() => api.delete(`${endpoints.metas}/${id}`), 'Erro ao excluir meta'),
};
