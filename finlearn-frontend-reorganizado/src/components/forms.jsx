import { useEffect, useMemo, useState } from 'react';
import { Button, Field } from './UI';
import { investmentCatalog } from '../api/finlearnService';
import { formatCurrency } from '../utils';

export const investmentOptions = investmentCatalog;

function getSpendableAccounts(contas = []) {
  return contas.filter((conta) => !String(conta.tipo || '').includes('CARTAO'));
}

function getUnifiedAccountOption(contas = []) {
  const spendable = getSpendableAccounts(contas);
  const total = spendable.reduce((sum, conta) => sum + Number(conta.saldo || 0), 0);
  const base = spendable[0] || contas[0] || { id: 1 };
  return [{ ...base, nome: 'Saldo disponível', saldo: Number(total.toFixed(2)) }];
}

export function PixForm({ contas = [], mode = 'send', onSubmit, onCancel }) {
  const contasSaldo = useMemo(() => getUnifiedAccountOption(contas), [contas]);
  const [form, setForm] = useState({
    chaveDestino: '',
    origem: '',
    valor: '',
    descricao: mode === 'receive' ? 'Pix recebido' : 'Pix enviado',
    contaOrigemId: contasSaldo[0]?.id || '',
    contaDestinoId: contasSaldo[0]?.id || '',
    usarCredito: false,
    parcelas: 1,
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      contaOrigemId: prev.contaOrigemId || contasSaldo[0]?.id || '',
      contaDestinoId: prev.contaDestinoId || contasSaldo[0]?.id || '',
    }));
  }, [contasSaldo]);

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (mode === 'receive') {
      onSubmit({
        origem: form.origem,
        contaDestinoId: Number(form.contaDestinoId),
        valor: Number(form.valor),
        descricao: form.descricao,
      });
      return;
    }

    onSubmit({
      chaveDestino: form.chaveDestino,
      valor: Number(form.valor),
      descricao: form.descricao,
      contaOrigemId: Number(form.contaOrigemId),
      usarCredito: Boolean(form.usarCredito),
      parcelas: Number(form.parcelas),
      data: new Date().toISOString().slice(0, 10),
      status: 'CONCLUIDO',
    });
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      {mode === 'receive' ? (
        <>
          <Field label="Origem do Pix">
            <input required value={form.origem} onChange={(e) => update('origem', e.target.value)} placeholder="Nome, banco ou chave de quem enviou" />
          </Field>
          <Field label="Conta de destino">
            <select value={form.contaDestinoId} onChange={(e) => update('contaDestinoId', e.target.value)}>
              {contasSaldo.map((conta) => <option key={conta.id} value={conta.id}>{conta.nome} · saldo {formatCurrency(conta.saldo)}</option>)}
            </select>
          </Field>
        </>
      ) : (
        <>
          <Field label="Chave Pix de destino">
            <input required value={form.chaveDestino} onChange={(e) => update('chaveDestino', e.target.value)} placeholder="CPF, e-mail, telefone ou chave aleatória" />
          </Field>
          <Field label="Conta de origem">
            <select value={form.contaOrigemId} onChange={(e) => update('contaOrigemId', e.target.value)} disabled={form.usarCredito}>
              {contasSaldo.map((conta) => <option key={conta.id} value={conta.id}>{conta.nome} · saldo {formatCurrency(conta.saldo)}</option>)}
            </select>
          </Field>
        </>
      )}

      <Field label="Valor">
        <input required type="number" min="1" step="0.01" value={form.valor} onChange={(e) => update('valor', e.target.value)} placeholder="R$ 0,00" />
      </Field>

      <Field label="Descrição">
        <input value={form.descricao} onChange={(e) => update('descricao', e.target.value)} />
      </Field>



      <div className="form-actions">
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{mode === 'receive' ? 'Registrar Pix recebido' : 'Enviar Pix'}</Button>
      </div>
    </form>
  );
}

export function TransactionForm({ contas = [], onSubmit, onCancel, fixedType }) {
  const contasSaldo = getUnifiedAccountOption(contas);
  const [form, setForm] = useState({ descricao: '', tipo: fixedType || 'SAIDA', valor: '', contaId: contasSaldo[0]?.id || '', destino: '' });
  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <form className="form-grid" onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, valor: Number(form.valor), data: new Date().toISOString().slice(0, 10), status: 'CONCLUIDA' }); }}>
      <Field label="Descrição"><input required value={form.descricao} onChange={(e) => update('descricao', e.target.value)} placeholder="Ex.: Conta de luz" /></Field>
      <Field label="Tipo"><select value={form.tipo} onChange={(e) => update('tipo', e.target.value)} disabled={Boolean(fixedType)}><option value="ENTRADA">Entrada</option><option value="SAIDA">Saída</option><option value="TRANSFERENCIA_ENVIADA">Transferência enviada</option></select></Field>
      <Field label="Valor"><input required type="number" min="1" step="0.01" value={form.valor} onChange={(e) => update('valor', e.target.value)} /></Field>
      <Field label="Conta"><select value={form.contaId} onChange={(e) => update('contaId', e.target.value)}>{contasSaldo.map((conta) => <option key={conta.id} value={conta.id}>{conta.nome} · {formatCurrency(conta.saldo)}</option>)}</select></Field>
      <Field label="Destino"><input value={form.destino} onChange={(e) => update('destino', e.target.value)} placeholder="Favorecido, boleto ou conta" /></Field>
      <div className="form-actions"><Button variant="ghost" onClick={onCancel}>Cancelar</Button><Button type="submit">Salvar</Button></div>
    </form>
  );
}

export function GoalForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({ titulo: '', descricao: '', valorObjetivo: '', valorAtual: '', dataLimite: '', pontosRecompensa: 100, pontosPerda: 40 });

  useEffect(() => {
    if (initialData) setForm((prev) => ({ ...prev, ...initialData }));
  }, [initialData]);

  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  return (
    <form className="form-grid" onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, valorObjetivo: Number(form.valorObjetivo), valorAtual: Number(form.valorAtual), pontosRecompensa: Number(form.pontosRecompensa), pontosPerda: Number(form.pontosPerda), status: form.status || 'EM_ANDAMENTO' }); }}>
      <Field label="Título"><input required value={form.titulo} onChange={(e) => update('titulo', e.target.value)} /></Field>
      <Field label="Descrição"><input value={form.descricao} onChange={(e) => update('descricao', e.target.value)} /></Field>
      <Field label="Valor atual"><input required type="number" min="0" step="0.01" value={form.valorAtual} onChange={(e) => update('valorAtual', e.target.value)} /></Field>
      <Field label="Valor objetivo"><input required type="number" min="1" step="0.01" value={form.valorObjetivo} onChange={(e) => update('valorObjetivo', e.target.value)} /></Field>
      <Field label="Data limite"><input required type="date" min={new Date().toISOString().slice(0, 10)} value={form.dataLimite} onChange={(e) => update('dataLimite', e.target.value)} /></Field>
      <Field label="Pontos ao concluir"><input type="number" value={form.pontosRecompensa} onChange={(e) => update('pontosRecompensa', e.target.value)} /></Field>
      <Field label="Pontos perdidos no prazo"><input type="number" value={form.pontosPerda} onChange={(e) => update('pontosPerda', e.target.value)} /></Field>
      <div className="form-actions"><Button variant="ghost" onClick={onCancel}>Cancelar</Button><Button type="submit">Salvar meta</Button></div>
    </form>
  );
}

export function GoalDepositForm({ meta, contas = [], onSubmit, onCancel }) {
  const contasSaldo = getUnifiedAccountOption(contas);
  const [valor, setValor] = useState('');
  const [contaId, setContaId] = useState(contasSaldo[0]?.id || '');

  return (
    <form className="form-grid" onSubmit={(e) => { e.preventDefault(); onSubmit({ metaId: meta.id, valor: Number(valor), contaId: Number(contaId) }); }}>
      <div className="auto-info span-2">
        Você está acrescentando dinheiro na meta <strong>{meta?.titulo}</strong>. O valor sai do saldo disponível e entra no progresso da meta.
      </div>
      <Field label="Valor para acrescentar"><input required type="number" min="1" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} /></Field>
      <Field label="Conta de origem"><select value={contaId} onChange={(e) => setContaId(e.target.value)}>{contasSaldo.map((conta) => <option key={conta.id} value={conta.id}>{conta.nome} · saldo {formatCurrency(conta.saldo)}</option>)}</select></Field>
      <div className="form-actions"><Button variant="ghost" onClick={onCancel}>Cancelar</Button><Button type="submit">Acrescentar na meta</Button></div>
    </form>
  );
}

export function InvestmentForm({ contas = [], onSubmit, onCancel }) {
  const contasSaldo = getUnifiedAccountOption(contas);
  const [form, setForm] = useState({ produto: investmentOptions[0].nome, valorInvestido: '', contaOrigemId: contasSaldo[0]?.id || '', dataAplicacao: new Date().toISOString().slice(0, 10) });
  const selected = useMemo(() => investmentOptions.find((item) => item.nome === form.produto) || investmentOptions[0], [form.produto]);

  function update(name, value) { setForm((prev) => ({ ...prev, [name]: value })); }

  function submit(event) {
    event.preventDefault();
    onSubmit({ nome: selected.nome, tipo: selected.tipo, rentabilidade: selected.rentabilidade, valorInvestido: Number(form.valorInvestido), contaOrigemId: Number(form.contaOrigemId), dataAplicacao: form.dataAplicacao, status: 'ATIVO' });
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <Field label="Investimento">
        <select value={form.produto} onChange={(e) => update('produto', e.target.value)}>
          {investmentOptions.map((option) => <option key={option.nome}>{option.nome}</option>)}
        </select>
      </Field>
      <Field label="Conta de origem">
        <select value={form.contaOrigemId} onChange={(e) => update('contaOrigemId', e.target.value)}>
          {contasSaldo.map((conta) => <option key={conta.id} value={conta.id}>{conta.nome} · saldo {formatCurrency(conta.saldo)}</option>)}
        </select>
      </Field>
      <Field label="Valor investido"><input required type="number" min="1" step="0.01" value={form.valorInvestido} onChange={(e) => update('valorInvestido', e.target.value)} /></Field>
      <Field label="Tipo automático"><input value={selected.tipo} readOnly /></Field>
      <Field label="Rentabilidade automática"><input value={`${selected.rentabilidade}% a.a.`} readOnly /></Field>
      <Field label="Data da aplicação"><input type="date" max={new Date().toISOString().slice(0, 10)} value={form.dataAplicacao} onChange={(e) => update('dataAplicacao', e.target.value)} /></Field>
      <div className="auto-info span-2">O tipo e a rentabilidade vêm automaticamente do investimento escolhido. Ao investir, o valor sai do saldo atual.</div>
      <div className="form-actions"><Button variant="ghost" onClick={onCancel}>Cancelar</Button><Button type="submit">Investir agora</Button></div>
    </form>
  );
}

export function PasswordForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ senhaAtual: '', novaSenha: '', confirmar: '' });
  const update = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  function submit(event) {
    event.preventDefault();
    if (form.novaSenha !== form.confirmar) return alert('As senhas não conferem.');
    onSubmit({ senhaAtual: form.senhaAtual, novaSenha: form.novaSenha });
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <Field label="Senha atual"><input required type="password" value={form.senhaAtual} onChange={(e) => update('senhaAtual', e.target.value)} /></Field>
      <Field label="Nova senha"><input required type="password" minLength={6} value={form.novaSenha} onChange={(e) => update('novaSenha', e.target.value)} /></Field>
      <Field label="Confirmar nova senha"><input required type="password" minLength={6} value={form.confirmar} onChange={(e) => update('confirmar', e.target.value)} /></Field>
      <div className="form-actions"><Button variant="ghost" onClick={onCancel}>Cancelar</Button><Button type="submit">Alterar senha</Button></div>
    </form>
  );
}
