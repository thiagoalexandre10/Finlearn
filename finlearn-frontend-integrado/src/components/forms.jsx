import { useEffect, useState } from 'react';
import { Button, Field } from './UI';

export function PixForm({ contas, onSubmit, onCancel }) {
  const temCartao = contas.some((conta) => String(conta.tipo).includes('CARTAO'));
  const [form, setForm] = useState({
    chaveDestino: '',
    valor: '',
    descricao: 'Pix enviado',
    origem: contas[0]?.id || '',
    usarCredito: false,
    parcelas: 1,
  });

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({
      chaveDestino: form.chaveDestino,
      valor: Number(form.valor),
      descricao: form.descricao,
      contaOrigemId: Number(form.origem),
      usarCredito: Boolean(form.usarCredito),
      parcelas: Number(form.parcelas),
      data: new Date().toISOString().slice(0, 10),
      status: 'CONCLUIDO',
    });
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <Field label="Chave Pix de destino">
        <input required value={form.chaveDestino} onChange={(e) => update('chaveDestino', e.target.value)} placeholder="CPF, e-mail, telefone ou chave aleatória" />
      </Field>
      <Field label="Valor">
        <input required type="number" min="1" step="0.01" value={form.valor} onChange={(e) => update('valor', e.target.value)} placeholder="R$ 0,00" />
      </Field>
      <Field label="Conta de origem">
        <select value={form.origem} onChange={(e) => update('origem', e.target.value)}>
          {contas.map((conta) => (
            <option key={conta.id} value={conta.id}>{conta.nome || conta.tipo}</option>
          ))}
        </select>
      </Field>
      <Field label="Descrição">
        <input value={form.descricao} onChange={(e) => update('descricao', e.target.value)} />
      </Field>

      {temCartao && (
        <div className="credit-option">
          <label>
            <input type="checkbox" checked={form.usarCredito} onChange={(e) => update('usarCredito', e.target.checked)} />
            <span>Usar Pix no crédito</span>
          </label>
          {form.usarCredito && (
            <select value={form.parcelas} onChange={(e) => update('parcelas', e.target.value)}>
              {[1, 2, 3, 4, 5, 6].map((parcela) => (
                <option key={parcela} value={parcela}>{parcela}x</option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="form-actions">
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Enviar Pix</Button>
      </div>
    </form>
  );
}

export function TransactionForm({ contas, onSubmit, onCancel }) {
  const [form, setForm] = useState({ descricao: '', tipo: 'SAIDA', valor: '', contaId: contas[0]?.id || '', destino: '' });
  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <form className="form-grid" onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, valor: Number(form.valor), data: new Date().toISOString().slice(0, 10), status: 'CONCLUIDA' }); }}>
      <Field label="Descrição"><input required value={form.descricao} onChange={(e) => update('descricao', e.target.value)} placeholder="Ex.: Mercado" /></Field>
      <Field label="Tipo"><select value={form.tipo} onChange={(e) => update('tipo', e.target.value)}><option>ENTRADA</option><option>SAIDA</option><option>TRANSFERENCIA</option></select></Field>
      <Field label="Valor"><input required type="number" min="1" step="0.01" value={form.valor} onChange={(e) => update('valor', e.target.value)} /></Field>
      <Field label="Conta"><select value={form.contaId} onChange={(e) => update('contaId', e.target.value)}>{contas.map((conta) => <option key={conta.id} value={conta.id}>{conta.nome}</option>)}</select></Field>
      <Field label="Destino"><input value={form.destino} onChange={(e) => update('destino', e.target.value)} placeholder="Opcional" /></Field>
      <div className="form-actions"><Button variant="ghost" onClick={onCancel}>Cancelar</Button><Button type="submit">Salvar</Button></div>
    </form>
  );
}

export function GoalForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({ titulo: '', descricao: '', valorObjetivo: '', valorAtual: '', dataLimite: '', pontosRecompensa: 100 });
  useEffect(() => { if (initialData) setForm({ ...form, ...initialData }); }, [initialData]);
  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <form className="form-grid" onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, valorObjetivo: Number(form.valorObjetivo), valorAtual: Number(form.valorAtual), pontosRecompensa: Number(form.pontosRecompensa), status: form.status || 'EM_ANDAMENTO' }); }}>
      <Field label="Título"><input required value={form.titulo} onChange={(e) => update('titulo', e.target.value)} /></Field>
      <Field label="Descrição"><input value={form.descricao} onChange={(e) => update('descricao', e.target.value)} /></Field>
      <Field label="Valor atual"><input required type="number" value={form.valorAtual} onChange={(e) => update('valorAtual', e.target.value)} /></Field>
      <Field label="Valor objetivo"><input required type="number" value={form.valorObjetivo} onChange={(e) => update('valorObjetivo', e.target.value)} /></Field>
      <Field label="Data limite"><input required type="date" value={form.dataLimite} onChange={(e) => update('dataLimite', e.target.value)} /></Field>
      <Field label="Pontos"><input type="number" value={form.pontosRecompensa} onChange={(e) => update('pontosRecompensa', e.target.value)} /></Field>
      <div className="form-actions"><Button variant="ghost" onClick={onCancel}>Cancelar</Button><Button type="submit">Salvar meta</Button></div>
    </form>
  );
}

export function InvestmentForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ nome: '', tipo: 'Renda Fixa', valorInvestido: '', rentabilidade: '', dataAplicacao: new Date().toISOString().slice(0, 10), status: 'ATIVO' });
  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <form className="form-grid" onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, valorInvestido: Number(form.valorInvestido), rentabilidade: Number(form.rentabilidade) }); }}>
      <Field label="Nome"><input required value={form.nome} onChange={(e) => update('nome', e.target.value)} placeholder="Ex.: CDB Banco X" /></Field>
      <Field label="Tipo"><select value={form.tipo} onChange={(e) => update('tipo', e.target.value)}><option>Renda Fixa</option><option>Fundos</option><option>Ações</option><option>Cripto</option></select></Field>
      <Field label="Valor investido"><input required type="number" value={form.valorInvestido} onChange={(e) => update('valorInvestido', e.target.value)} /></Field>
      <Field label="Rentabilidade %"><input required type="number" step="0.01" value={form.rentabilidade} onChange={(e) => update('rentabilidade', e.target.value)} /></Field>
      <div className="form-actions"><Button variant="ghost" onClick={onCancel}>Cancelar</Button><Button type="submit">Salvar investimento</Button></div>
    </form>
  );
}
