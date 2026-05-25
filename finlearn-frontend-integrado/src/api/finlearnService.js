import { apiRequest } from './api';

function crudService(resource) {
  return {
    listar: () => apiRequest(`/${resource}`),
    buscarPorId: (id) => apiRequest(`/${resource}/${id}`),
    criar: (payload) => apiRequest(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    atualizar: (id, payload) => apiRequest(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
    remover: (id) => apiRequest(`/${resource}/${id}`, {
      method: 'DELETE',
    }),
  };
}

export const usuarioService = crudService('usuarios');
export const contaService = crudService('contas');
export const transacaoService = crudService('transacoes');
export const investimentoService = crudService('investimentos');
export const metaService = crudService('metas');
export const pixService = crudService('pix');
