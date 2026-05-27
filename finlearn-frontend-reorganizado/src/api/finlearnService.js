import { api, endpoints } from './api';

const STORAGE_KEY = 'finlearn-local-cache-v4';
const AUTH_KEY = 'finlearn-auth-user';

const today = () => new Date().toISOString().slice(0, 10);

const usuarioPadrao = {
  id: 1,
  nome: 'Thiago',
  nomeCompleto: 'Thiago Santos',
  cpf: '1234563312188',
  dataNascimento: '1998-05-15',
  email: 'thiago3312188@finlearn.com',
  senha: '123456',
  telefone: '11999999999',
  pontos: 1250,
  nivel: 'Explorador Financeiro',
};

export const fallbackData = {
  usuario: usuarioPadrao,
  usuarios: [usuarioPadrao],
  contas: [
    { id: 1, nome: 'Conta Corrente', tipo: 'CORRENTE', banco: 'Banco FinLearn', saldo: 2850.9, agencia: '0001', numero: '1024-6', limite: 500, usuario: usuarioPadrao },
    { id: 2, nome: 'Conta Poupança', tipo: 'POUPANCA', banco: 'Banco FinLearn', saldo: 1200, agencia: '0001', numero: '2048-3', rendimentoMes: 6, usuario: usuarioPadrao },
    { id: 3, nome: 'Cartão de Crédito', tipo: 'CARTAO_CREDITO', banco: 'Banco FinLearn', saldo: 0, limite: 1550, limiteDisponivel: 1550, ocultarNaTelaContas: true, usuario: usuarioPadrao },
  ],
  transacoes: [
    { id: 1, descricao: 'Salário', tipo: 'ENTRADA', valor: 4500, data: '2026-05-24', status: 'CONCLUIDA', origem: 'Empresa', destino: 'Conta Corrente', categoria: 'Receita' },
    { id: 2, descricao: 'Mercado', tipo: 'SAIDA', valor: 356.8, data: '2026-05-23', status: 'CONCLUIDA', origem: 'Conta Corrente', destino: 'Supermercado', categoria: 'Mercado' },
    { id: 3, descricao: 'Pix recebido', tipo: 'PIX_RECEBIDO', valor: 450, data: '2026-05-22', status: 'CONCLUIDA', origem: 'Banco externo', destino: 'Conta Corrente', categoria: 'Pix' },
  ],
  investimentos: [
    { id: 1, nome: 'Tesouro Direto', tipo: 'Renda Fixa', valorInvestido: 5000, rentabilidade: 12.5, dataAplicacao: '2026-05-24', status: 'ATIVO' },
    { id: 2, nome: 'CDB Nubank', tipo: 'Renda Fixa', valorInvestido: 3000, rentabilidade: 13.2, dataAplicacao: '2026-05-24', status: 'ATIVO' },
    { id: 3, nome: 'Fundo Imobiliário', tipo: 'Fundos', valorInvestido: 2000, rentabilidade: 8.7, dataAplicacao: '2026-05-24', status: 'ATIVO' },
  ],
  metas: [
    { id: 1, titulo: 'Reserva de emergência', descricao: 'Guardar dinheiro para emergências', valorObjetivo: 5000, valorAtual: 1200, dataLimite: '2026-12-31', status: 'EM_ANDAMENTO', pontosRecompensa: 100, pontosPerda: 40, pontosCreditados: false, usuario: usuarioPadrao },
  ],
  pix: [],
  desafios: [
    { id: 1, titulo: 'Reserva de emergência', descricao: 'Deposite dinheiro até bater a meta principal.', categoria: 'Metas', metaId: 1, pontosGanho: 150, pontosPerda: 40, progresso: 24, status: 'EM_ANDAMENTO', dataLimite: '2026-12-31' },
    { id: 2, titulo: 'Investir este mês', descricao: 'Faça pelo menos um aporte de investimento no mês.', categoria: 'Investimentos', pontosGanho: 75, pontosPerda: 25, progresso: 70, status: 'EM_ANDAMENTO', dataLimite: '2026-05-31' },
    { id: 3, titulo: 'Controlar saídas', descricao: 'Mantenha as saídas abaixo de R$ 3.000,00 no mês.', categoria: 'Consistência', pontosGanho: 50, pontosPerda: 20, progresso: 40, status: 'EM_ANDAMENTO', dataLimite: '2026-05-31' },
  ],
  notificacoes: [
    { id: 1, titulo: 'Meta em andamento', mensagem: 'Sua reserva de emergência está com 24% de progresso.', lida: false, canal: 'app', data: '2026-05-24' },
    { id: 2, titulo: 'Pix recebido', mensagem: 'Você recebeu R$ 450,00 via Pix.', lida: false, canal: 'app', data: '2026-05-22' },
  ],
  rankingHistorico: [13, 12, 11, 13, 10],
};

export const investmentCatalog = [
  { nome: 'Tesouro Direto', tipo: 'Renda Fixa', rentabilidade: 12.5 },
  { nome: 'CDB Nubank', tipo: 'Renda Fixa', rentabilidade: 13.2 },
  { nome: 'CDB Banco X', tipo: 'Renda Fixa', rentabilidade: 9.36 },
  { nome: 'Fundo Imobiliário', tipo: 'Fundos', rentabilidade: 8.7 },
  { nome: 'Ações PETR4', tipo: 'Ações', rentabilidade: 15.0 },
  { nome: 'Bitcoin', tipo: 'Cripto', rentabilidade: 40.0 },
];


function sanitizeData(data) {
  const blockedPatterns = [
    /bucet/i,
    /com[eé]dia/i,
  ];

  const isBlocked = (value) => blockedPatterns.some((pattern) => pattern.test(String(value || '')));

  return {
    ...data,
    metas: (data.metas || []).filter((meta) => !isBlocked(meta.titulo) && !isBlocked(meta.descricao)),
    desafios: (data.desafios || []).filter((desafio) => !isBlocked(desafio.titulo) && !isBlocked(desafio.descricao)),
    transacoes: (data.transacoes || []).filter((transacao) => !isBlocked(transacao.descricao) && !isBlocked(transacao.destino) && !isBlocked(transacao.origem)),
    notificacoes: (data.notificacoes || []).filter((notificacao) => !isBlocked(notificacao.titulo) && !isBlocked(notificacao.mensagem)),
  };
}

function normalize(data) {
  const merged = sanitizeData({ ...fallbackData, ...data });
  return { ...merged, contas: normalizeAccounts(merged.contas) };
}

export function loadLocal() {
  try {
    const cache = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return cache ? saveLocal(normalize(cache)) : fallbackData;
  } catch {
    return fallbackData;
  }
}

function saveLocal(nextData) {
  const normalized = normalize(nextData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

function nextId(list = []) {
  return Math.max(0, ...list.map((item) => Number(item.id) || 0)) + 1;
}

function mergeById(localItems = [], backendItems = []) {
  const map = new Map();
  backendItems.forEach((item, index) => {
    const id = item.id ?? item.idConta ?? item.idTransacao ?? item.idInvestimento ?? item.idMeta ?? `backend-${index}`;
    map.set(String(id), { ...item, id });
  });
  localItems.forEach((item, index) => {
    const id = item.id ?? `local-${index}`;
    map.set(String(id), { ...map.get(String(id)), ...item, id });
  });
  return Array.from(map.values());
}

function isOut(tipo) {
  return ['SAIDA', 'PIX_ENVIADO', 'TRANSFERENCIA_ENVIADA', 'INVESTIMENTO', 'PAGAMENTO'].includes(String(tipo));
}

function isIn(tipo) {
  return ['ENTRADA', 'PIX_RECEBIDO', 'TRANSFERENCIA_RECEBIDA', 'RESGATE_INVESTIMENTO'].includes(String(tipo));
}

function addNotification(local, titulo, mensagem) {
  return [
    { id: nextId(local.notificacoes), titulo, mensagem, lida: false, canal: 'app', data: today() },
    ...local.notificacoes,
  ];
}

function updateAccountBalance(contas, contaId, delta) {
  return contas.map((conta) => Number(conta.id) === Number(contaId)
    ? { ...conta, saldo: Number(conta.saldo || 0) + Number(delta || 0) }
    : conta
  );
}

function getAccount(contas, contaId) {
  return contas.find((conta) => Number(conta.id) === Number(contaId));
}

function getMainAccount(contas) {
  return contas.find((conta) => !String(conta.tipo).includes('CARTAO')) || contas[0];
}

function getSpendableAccounts(contas = []) {
  return contas.filter((conta) => !String(conta.tipo || '').includes('CARTAO'));
}

function getAvailableBalance(contas = []) {
  return getSpendableAccounts(contas).reduce((sum, conta) => sum + Number(conta.saldo || 0), 0);
}

function debitFromAccounts(contas = [], contaId, amount) {
  let remaining = Number(amount || 0);
  const selectedId = Number(contaId || getMainAccount(contas)?.id);
  const selected = contas.find((conta) => Number(conta.id) === selectedId);

  if (selected && Number(selected.saldo || 0) >= remaining) {
    return updateAccountBalance(contas, selectedId, -remaining);
  }

  return contas.map((conta) => {
    if (String(conta.tipo || '').includes('CARTAO') || remaining <= 0) return conta;
    const saldo = Number(conta.saldo || 0);
    const debit = Math.min(saldo, remaining);
    remaining -= debit;
    return { ...conta, saldo: Number((saldo - debit).toFixed(2)) };
  });
}

function buildUnifiedAccount(contas = []) {
  const main = getMainAccount(contas) || { id: 1, nome: 'Conta principal', tipo: 'CORRENTE' };
  return {
    ...main,
    id: main.id,
    nome: 'Saldo disponível',
    tipo: 'CONTA_PRINCIPAL',
    saldo: Number(getAvailableBalance(contas).toFixed(2)),
  };
}

function normalizeAccounts(contas = []) {
  const valid = (contas || []).filter(Boolean);
  const cartao = valid.find((conta) => String(conta.tipo || '').includes('CARTAO'));
  const corrente = valid.filter((conta) => String(conta.tipo || '').includes('CORRENTE'));
  const poupanca = valid.filter((conta) => String(conta.tipo || '').includes('POUPANCA'));

  const merge = (items, fallback, nome) => {
    if (!items.length) return fallback;
    const base = items[0];
    return {
      ...base,
      nome,
      saldo: Number(items.reduce((sum, item) => sum + Number(item.saldo || 0), 0).toFixed(2)),
    };
  };

  const result = [
    merge(corrente, fallbackData.contas[0], 'Conta Corrente'),
    merge(poupanca, fallbackData.contas[1], 'Conta Poupança'),
  ].filter(Boolean);

  if (cartao) result.push(cartao);
  return result;
}

function addPoints(local, delta, reason) {
  const usuario = { ...local.usuario, pontos: Math.max(0, Number(local.usuario.pontos || 0) + Number(delta || 0)) };
  localStorage.setItem(AUTH_KEY, JSON.stringify(usuario));
  return {
    ...local,
    usuario,
    usuarios: local.usuarios.map((user) => Number(user.id) === Number(usuario.id) ? usuario : user),
    notificacoes: addNotification(local, delta >= 0 ? 'Pontos ganhos' : 'Pontos perdidos', `${delta >= 0 ? 'Você ganhou' : 'Você perdeu'} ${Math.abs(delta)} pontos. ${reason}`),
  };
}

function completeChallenge(local, matcher, reason) {
  let next = { ...local };
  let awarded = false;

  const desafios = (next.desafios || []).map((desafio) => {
    const matches = typeof matcher === 'function' ? matcher(desafio) : false;

    if (!matches || desafio.status === 'CONCLUIDO' || desafio.pontosCreditados) {
      return desafio;
    }

    awarded = true;
    return {
      ...desafio,
      progresso: 100,
      status: 'CONCLUIDO',
      pontosCreditados: true,
      dataConclusao: today(),
    };
  });

  next = { ...next, desafios };

  if (awarded) {
    const desafioConcluido = desafios.find((desafio) => desafio.dataConclusao === today() && desafio.pontosCreditados && (typeof matcher === 'function' ? matcher(desafio) : false));
    const pontos = Number(desafioConcluido?.pontosGanho || 0);

    if (pontos > 0) {
      next = addPoints(next, pontos, reason || `Desafio “${desafioConcluido.titulo}” concluído.`);
    }

    next.notificacoes = addNotification(
      next,
      'Desafio concluído',
      `Você concluiu o desafio “${desafioConcluido?.titulo || 'Financeiro'}”.`
    );
  }

  return next;
}

function evaluateGoalsAndChallenges(local) {
  let next = normalize(local);
  const now = today();
  let metas = [...next.metas];
  let desafios = [...next.desafios];

  metas = metas.map((meta) => {
    const atual = Number(meta.valorAtual || 0);
    const objetivo = Number(meta.valorObjetivo || 0);
    const vencida = meta.dataLimite && meta.dataLimite < now;

    if (objetivo > 0 && atual >= objetivo && meta.status !== 'CONCLUIDA') {
      const pontos = Number(meta.pontosRecompensa || 100);
      next = addPoints(next, pontos, `Meta “${meta.titulo}” concluída.`);
      return { ...meta, status: 'CONCLUIDA', pontosCreditados: true };
    }

    if (vencida && atual < objetivo && meta.status !== 'NAO_CUMPRIDA') {
      const perda = Number(meta.pontosPerda || 40);
      next = addPoints(next, -perda, `Meta “${meta.titulo}” venceu sem ser concluída.`);
      return { ...meta, status: 'NAO_CUMPRIDA', pontosDebitados: true };
    }

    return meta;
  });

  desafios = desafios.map((desafio) => {
    const linkedMeta = desafio.metaId ? metas.find((meta) => Number(meta.id) === Number(desafio.metaId)) : null;
    const progressoMeta = linkedMeta ? Math.min(100, Math.round((Number(linkedMeta.valorAtual || 0) / Number(linkedMeta.valorObjetivo || 1)) * 100)) : desafio.progresso;
    const vencido = desafio.dataLimite && desafio.dataLimite < now;

    if (linkedMeta?.status === 'CONCLUIDA') {
      return {
        ...desafio,
        progresso: 100,
        status: 'CONCLUIDO',
        pontosCreditados: desafio.pontosCreditados || false,
      };
    }

    if (linkedMeta?.status === 'NAO_CUMPRIDA' || (vencido && Number(progressoMeta) < 100)) {
      return { ...desafio, progresso: progressoMeta, status: 'NAO_CUMPRIDO' };
    }

    return { ...desafio, progresso: progressoMeta, status: desafio.status === 'CONCLUIDO' ? 'CONCLUIDO' : 'EM_ANDAMENTO' };
  });

  next = { ...next, metas, desafios };

  next = completeChallenge(
    next,
    (desafio) => desafio.metaId && metas.some((meta) => Number(meta.id) === Number(desafio.metaId) && meta.status === 'CONCLUIDA'),
    'Desafio de reserva de emergência concluído pela meta.'
  );

  return saveLocal(next);
}

async function safeGet(path, key) {
  let local = evaluateGoalsAndChallenges(loadLocal());
  try {
    const data = await api.get(path);
    if (Array.isArray(data) && data.length) {
      const merged = mergeById(local[key], data);
      local = saveLocal({ ...local, [key]: merged });
      return local[key];
    }
    return local[key];
  } catch (error) {
    console.warn(`Falha ao carregar ${path}. Usando cache local.`, error);
    return local[key];
  }
}

async function postBestEffort(path, payload) {
  try { return await api.post(path, payload); } catch (error) { console.warn(`Backend indisponível em ${path}. Operação salva localmente.`, error); return null; }
}

async function putBestEffort(path, payload) {
  try { return await api.put(path, payload); } catch (error) { console.warn(`Backend indisponível em ${path}. Operação atualizada localmente.`, error); return null; }
}

export const finlearnService = {
  carregarDashboard: async () => {
    await Promise.all([
      safeGet(endpoints.contas, 'contas'),
      safeGet(endpoints.transacoes, 'transacoes'),
      safeGet(endpoints.investimentos, 'investimentos'),
      safeGet(endpoints.metas, 'metas'),
    ]);
    const local = evaluateGoalsAndChallenges(loadLocal());
    const usuario = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null') || local.usuario;
    return { ...local, usuario };
  },

  listarContas: () => safeGet(endpoints.contas, 'contas'),
  listarTransacoes: () => safeGet(endpoints.transacoes, 'transacoes'),
  listarInvestimentos: () => safeGet(endpoints.investimentos, 'investimentos'),
  listarMetas: () => safeGet(endpoints.metas, 'metas'),
  listarPix: () => safeGet(endpoints.pix, 'pix'),
  listarDesafios: async () => evaluateGoalsAndChallenges(loadLocal()).desafios,
  listarNotificacoes: async () => evaluateGoalsAndChallenges(loadLocal()).notificacoes,
  obterDadosLocais: async () => evaluateGoalsAndChallenges(loadLocal()),

  criarConta: async (payload) => {
    const local = loadLocal();
    const item = { ...payload, id: nextId(local.contas) };
    saveLocal({ ...local, contas: [...local.contas, item], notificacoes: addNotification(local, 'Conta criada', `A conta “${item.nome}” foi cadastrada.`) });
    await postBestEffort(endpoints.contas, item);
    return item;
  },

  criarTransacao: async (payload) => {
    const local = loadLocal();
    const valor = Number(payload.valor || 0);
    const contaId = Number(payload.contaId || payload.contaOrigemId || getMainAccount(local.contas)?.id);
    const conta = getAccount(local.contas, contaId);
    const tipo = payload.tipo || 'SAIDA';

    if (isOut(tipo) && getAvailableBalance(local.contas) < valor) throw new Error('Saldo insuficiente. Não é possível realizar a transação.');

    const transacao = {
      id: nextId(local.transacoes),
      descricao: payload.descricao || 'Movimentação',
      tipo,
      valor,
      data: payload.data || today(),
      status: 'CONCLUIDA',
      origem: payload.origem || conta?.nome || 'Conta Corrente',
      destino: payload.destino || 'Destino informado',
      categoria: payload.categoria || (tipo.includes('PIX') ? 'Pix' : 'Geral'),
    };
    const delta = isIn(tipo) ? valor : isOut(tipo) ? -valor : 0;
    const contas = delta < 0 ? debitFromAccounts(local.contas, contaId, valor) : delta > 0 ? updateAccountBalance(local.contas, contaId, valor) : local.contas;
    const notificacoes = addNotification(local, 'Movimentação registrada', `${transacao.descricao}: ${delta < 0 ? '-' : '+'}R$ ${valor.toFixed(2).replace('.', ',')}.`);
    saveLocal({ ...local, contas, transacoes: [transacao, ...local.transacoes], notificacoes });
    await postBestEffort(endpoints.transacoes, transacao);
    return transacao;
  },

  enviarPix: async (payload) => {
    const local = loadLocal();
    const valor = Number(payload.valor || 0);
    const contaId = Number(payload.contaOrigemId || getMainAccount(local.contas)?.id);
    const conta = getAccount(local.contas, contaId);
    const cartao = local.contas.find((item) => String(item.tipo).includes('CARTAO'));

    if (getAvailableBalance(local.contas) < valor) throw new Error('Saldo insuficiente. Não é possível realizar Pix.');

    const pix = { ...payload, id: nextId(local.pix), valor, data: today(), status: 'CONCLUIDO' };
    const transacao = {
      id: nextId(local.transacoes),
      descricao: 'Pix enviado',
      tipo: 'PIX_ENVIADO',
      valor,
      data: today(),
      status: 'CONCLUIDA',
      origem: 'Saldo disponível',
      destino: payload.chaveDestino,
      categoria: 'Pix',
    };

    let contas = debitFromAccounts(local.contas, contaId, valor);

    const notificacoes = addNotification(local, 'Pix enviado', `Pix de R$ ${valor.toFixed(2).replace('.', ',')} enviado para ${payload.chaveDestino}.`);
    saveLocal({ ...local, contas, pix: [pix, ...local.pix], transacoes: [transacao, ...local.transacoes], notificacoes });

    await postBestEffort(`${endpoints.pix}/enviar`, {
      usuarioId: local.usuario.id,
      contaId,
      chavePix: payload.chaveDestino,
      valor,
      descricao: payload.descricao || 'Pix enviado',
      pixCredito: Boolean(payload.usarCredito),
    });
    await postBestEffort(endpoints.transacoes, transacao);
    return pix;
  },

  receberPix: async (payload) => {
    const local = loadLocal();
    const valor = Number(payload.valor || 0);
    const contaId = Number(payload.contaDestinoId || getMainAccount(local.contas)?.id);
    const transacao = {
      id: nextId(local.transacoes),
      descricao: 'Pix recebido',
      tipo: 'PIX_RECEBIDO',
      valor,
      data: today(),
      status: 'CONCLUIDA',
      origem: payload.origem || 'Banco externo',
      destino: getAccount(local.contas, contaId)?.nome || 'Conta Corrente',
      categoria: 'Pix',
    };
    const contas = updateAccountBalance(local.contas, contaId, valor);
    const notificacoes = addNotification(local, 'Pix recebido', `Você recebeu R$ ${valor.toFixed(2).replace('.', ',')} via Pix.`);
    saveLocal({ ...local, contas, transacoes: [transacao, ...local.transacoes], notificacoes });
    await postBestEffort(endpoints.transacoes, transacao);
    return transacao;
  },

  criarInvestimento: async (payload) => {
    const local = loadLocal();
    const valor = Number(payload.valorInvestido || payload.valor || 0);
    const contaId = Number(payload.contaOrigemId || getMainAccount(local.contas)?.id);
    const conta = getAccount(local.contas, contaId);
    if (getAvailableBalance(local.contas) < valor) throw new Error('Saldo insuficiente. Não é possível realizar investimento.');

    const catalog = investmentCatalog.find((item) => item.nome === payload.nome) || investmentCatalog[0];
    const investimento = { ...payload, ...catalog, id: nextId(local.investimentos), valorInvestido: valor, dataAplicacao: payload.dataAplicacao || today(), status: 'ATIVO' };
    const transacao = { id: nextId(local.transacoes), descricao: `Investimento ${investimento.nome}`, tipo: 'INVESTIMENTO', valor, data: today(), status: 'CONCLUIDA', origem: conta?.nome || 'Conta Corrente', destino: investimento.nome, categoria: 'Investimentos' };
    let next = { ...local, contas: debitFromAccounts(local.contas, contaId, valor), investimentos: [investimento, ...local.investimentos], transacoes: [transacao, ...local.transacoes], notificacoes: addNotification(local, 'Investimento realizado', `Você investiu R$ ${valor.toFixed(2).replace('.', ',')} em ${investimento.nome}.`) };
    next = completeChallenge(
      next,
      (desafio) => String(desafio.categoria || '').toLowerCase().includes('investimento'),
      'Desafio de investimento concluído com seu primeiro aporte.'
    );
    saveLocal(next);
    await postBestEffort(endpoints.investimentos, investimento);
    await postBestEffort(endpoints.transacoes, transacao);
    return investimento;
  },

  resgatarInvestimento: async (id) => {
    const local = loadLocal();
    const investimento = local.investimentos.find((item) => Number(item.id) === Number(id));
    if (!investimento || investimento.status === 'RESGATADO') throw new Error('Investimento não encontrado ou já resgatado.');
    const valorBase = Number(investimento.valorInvestido || investimento.valor || 0);
    const rendimento = valorBase * (Number(investimento.rentabilidade || 0) / 100 / 12);
    const valorResgate = Number((valorBase + rendimento).toFixed(2));
    const conta = getMainAccount(local.contas);
    const atualizado = { ...investimento, status: 'RESGATADO', dataResgate: today(), valorResgate };
    const transacao = { id: nextId(local.transacoes), descricao: `Resgate ${investimento.nome}`, tipo: 'RESGATE_INVESTIMENTO', valor: valorResgate, data: today(), status: 'CONCLUIDA', origem: investimento.nome, destino: conta?.nome || 'Conta Corrente', categoria: 'Investimentos' };
    const notificacoes = addNotification(local, 'Investimento resgatado', `Resgate de R$ ${valorResgate.toFixed(2).replace('.', ',')} adicionado ao saldo.`);
    saveLocal({ ...local, contas: updateAccountBalance(local.contas, conta?.id, valorResgate), investimentos: local.investimentos.map((item) => Number(item.id) === Number(id) ? atualizado : item), transacoes: [transacao, ...local.transacoes], notificacoes });
    await putBestEffort(`${endpoints.investimentos}/${id}`, atualizado);
    await postBestEffort(endpoints.transacoes, transacao);
    return atualizado;
  },

  criarMeta: async (payload) => {
    const local = loadLocal();
    const valorObjetivo = Number(payload.valorObjetivo || 0);
    const valorAtual = Number(payload.valorAtual || 0);
    const conta = getMainAccount(local.contas);

    if (!payload.titulo || !String(payload.titulo).trim()) throw new Error('Informe o nome da meta.');
    if (!payload.dataLimite || payload.dataLimite < today()) throw new Error('Não é possível criar meta com data que já passou.');
    if (valorObjetivo <= 0) throw new Error('Informe um valor objetivo válido.');
    if (valorAtual < 0) throw new Error('O valor inicial não pode ser negativo.');
    if (valorAtual > getAvailableBalance(local.contas)) throw new Error('Saldo insuficiente para iniciar essa meta com esse valor.');

    const meta = {
      ...payload,
      id: nextId(local.metas),
      valorObjetivo,
      valorAtual: Math.min(valorAtual, valorObjetivo),
      status: valorAtual >= valorObjetivo ? 'CONCLUIDA' : 'EM_ANDAMENTO',
      pontosCreditados: false,
      pontosPerda: payload.pontosPerda || 40,
      usuario: local.usuario,
    };

    const transacao = valorAtual > 0 ? {
      id: nextId(local.transacoes),
      descricao: `Depósito inicial na meta ${meta.titulo}`,
      tipo: 'SAIDA',
      valor: valorAtual,
      data: today(),
      status: 'CONCLUIDA',
      origem: conta?.nome || 'Conta Corrente',
      destino: meta.titulo,
      categoria: 'Metas',
    } : null;

    const base = {
      ...local,
      contas: valorAtual > 0 ? debitFromAccounts(local.contas, conta.id, valorAtual) : local.contas,
      metas: [meta, ...local.metas],
      transacoes: transacao ? [transacao, ...local.transacoes] : local.transacoes,
      notificacoes: addNotification(local, 'Meta criada', `A meta “${meta.titulo}” foi criada${valorAtual > 0 ? ' e o valor inicial saiu do saldo.' : '.'}`),
    };

    const next = evaluateGoalsAndChallenges(base);
    await postBestEffort(endpoints.metas, meta);
    if (transacao) await postBestEffort(endpoints.transacoes, transacao);
    return meta;
  },

  atualizarMeta: async (id, payload) => {
    const local = loadLocal();
    const atual = local.metas.find((meta) => Number(meta.id) === Number(id));
    const meta = { ...atual, ...payload, id };
    const next = evaluateGoalsAndChallenges({ ...local, metas: local.metas.map((item) => Number(item.id) === Number(id) ? meta : item) });
    await putBestEffort(`${endpoints.metas}/${id}`, meta);
    return next.metas.find((item) => Number(item.id) === Number(id));
  },

  adicionarValorMeta: async (metaId, valor, contaId) => {
    const local = loadLocal();
    const meta = local.metas.find((item) => Number(item.id) === Number(metaId));
    const conta = getAccount(local.contas, contaId || getMainAccount(local.contas)?.id);
    const amount = Number(valor || 0);
    if (!meta) throw new Error('Meta não encontrada.');
    if (meta.dataLimite && meta.dataLimite < today()) throw new Error('Não é possível adicionar dinheiro em uma meta com data que já passou.');
    if (meta.status !== 'EM_ANDAMENTO') throw new Error('Essa meta não está mais em andamento.');
    if (amount <= 0) throw new Error('Informe um valor válido para acrescentar na meta.');
    if (getAvailableBalance(local.contas) < amount) throw new Error('Saldo insuficiente para acrescentar na meta.');
    const restante = Math.max(0, Number(meta.valorObjetivo || 0) - Number(meta.valorAtual || 0));
    if (amount > restante) throw new Error(`O valor ultrapassa o necessário para concluir a meta. Falta apenas R$ ${restante.toFixed(2).replace('.', ',')}.`);
    const updatedMeta = { ...meta, valorAtual: Number(meta.valorAtual || 0) + amount };
    const transacao = { id: nextId(local.transacoes), descricao: `Depósito na meta ${meta.titulo}`, tipo: 'SAIDA', valor: amount, data: today(), status: 'CONCLUIDA', origem: conta?.nome || 'Conta Corrente', destino: meta.titulo, categoria: 'Metas' };
    const next = evaluateGoalsAndChallenges({ ...local, contas: debitFromAccounts(local.contas, conta.id, amount), metas: local.metas.map((item) => Number(item.id) === Number(metaId) ? updatedMeta : item), transacoes: [transacao, ...local.transacoes], notificacoes: addNotification(local, 'Meta atualizada', `Você acrescentou R$ ${amount.toFixed(2).replace('.', ',')} na meta “${meta.titulo}”.`) });
    await putBestEffort(`${endpoints.metas}/${metaId}`, updatedMeta);
    await postBestEffort(endpoints.transacoes, transacao);
    return next;
  },

  excluirMeta: async (id) => {
    const local = loadLocal();
    try { await api.delete(`${endpoints.metas}/${id}`); } catch (error) { console.warn('Excluindo apenas localmente.', error); }
    saveLocal({ ...local, metas: local.metas.filter((meta) => Number(meta.id) !== Number(id)) });
  },

  atualizarUsuario: async (id, payload) => {
    const local = loadLocal();
    const allowed = { email: payload.email, telefone: payload.telefone };
    const usuario = { ...local.usuario, ...allowed, id };
    saveLocal({ ...local, usuario, usuarios: local.usuarios.map((u) => Number(u.id) === Number(id) ? usuario : u), notificacoes: addNotification(local, 'Dados atualizados', 'E-mail e telefone foram atualizados com segurança.') });
    localStorage.setItem(AUTH_KEY, JSON.stringify(usuario));
    await putBestEffort(`${endpoints.usuarios}/${id}`, usuario);
    return usuario;
  },

  alterarSenha: async ({ senhaAtual, novaSenha }) => {
    const local = loadLocal();
    if (String(local.usuario.senha) !== String(senhaAtual)) throw new Error('Senha atual inválida.');
    const usuario = { ...local.usuario, senha: novaSenha };
    saveLocal({ ...local, usuario, usuarios: local.usuarios.map((u) => Number(u.id) === Number(usuario.id) ? usuario : u), notificacoes: addNotification(local, 'Senha alterada', 'Sua senha foi alterada com sucesso.') });
    localStorage.setItem(AUTH_KEY, JSON.stringify(usuario));
    await putBestEffort(`${endpoints.usuarios}/${usuario.id}`, usuario);
    return usuario;
  },

  marcarNotificacoesComoLidas: async () => {
    const local = loadLocal();
    saveLocal({ ...local, notificacoes: local.notificacoes.map((item) => ({ ...item, lida: true })) });
  },

  login: async ({ identificador, senha }) => {
    const local = loadLocal();
    const user = local.usuarios.find((item) => [item.email, item.cpf, item.nome].some((value) => String(value || '').toLowerCase() === String(identificador || '').toLowerCase()));
    if (!user || String(user.senha || '123456') !== String(senha)) throw new Error('CPF/e-mail ou senha inválidos.');
    saveLocal({ ...local, usuario: user });
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  cadastrarUsuario: async (payload) => {
    const local = loadLocal();
    const exists = local.usuarios.some((item) => item.email === payload.email || item.cpf === payload.cpf);
    if (exists) throw new Error('Já existe uma conta com este CPF ou e-mail.');
    const usuario = { ...payload, id: nextId(local.usuarios), nome: payload.nomeCompleto?.split(' ')[0] || payload.nome, pontos: 0, nivel: 'Explorador Financeiro' };
    saveLocal({ ...local, usuario, usuarios: [...local.usuarios, usuario], notificacoes: addNotification(local, 'Conta criada', 'Cadastro realizado com sucesso.') });
    localStorage.setItem(AUTH_KEY, JSON.stringify(usuario));
    await postBestEffort(endpoints.usuarios, usuario);
    return usuario;
  },

  redefinirSenha: async ({ cpf, email, novaSenha }) => {
    const local = loadLocal();
    const usuarios = local.usuarios.map((user) => user.cpf === cpf && user.email === email ? { ...user, senha: novaSenha } : user);
    const changed = usuarios.some((user, index) => user.senha !== local.usuarios[index].senha);
    if (!changed) throw new Error('Não encontramos uma conta com esse CPF e e-mail.');
    saveLocal({ ...local, usuarios, notificacoes: addNotification(local, 'Senha redefinida', 'A senha da conta foi redefinida com sucesso.') });
    return true;
  },
};
