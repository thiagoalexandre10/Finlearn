import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Card, SectionTitle } from '../components/Card';
import { pixService } from '../api/finlearnService';
import { formatCurrency, formatDate } from '../utils/formatters';

const emptyPix = {
  chaveDestino: '',
  nomeDestino: '',
  valor: '',
  descricao: '',
  data: new Date().toISOString().slice(0, 10),
  status: 'CONCLUIDO',
  contaId: 1,
  usuarioId: 1,
};

export default function Pix() {
  const [pixList, setPixList] = useState([]);
  const [form, setForm] = useState(emptyPix);
  const [erro, setErro] = useState('');

  async function carregarPix() {
    try {
      const dados = await pixService.listar();
      setPixList(Array.isArray(dados) ? dados : []);
      setErro('');
    } catch (error) {
      console.error(error);
      setErro('Não foi possível carregar os Pix do backend.');
    }
  }

  useEffect(() => {
    carregarPix();
  }, []);

  async function enviarPix(event) {
    event.preventDefault();

    const payload = {
      chaveDestino: form.chaveDestino,
      nomeDestino: form.nomeDestino,
      valor: Number(form.valor || 0),
      descricao: form.descricao,
      data: form.data,
      status: form.status,
      conta: { id: Number(form.contaId || 1) },
      usuario: { id: Number(form.usuarioId || 1) },
    };

    try {
      await pixService.criar(payload);
      setForm(emptyPix);
      await carregarPix();
      alert('Pix enviado com sucesso.');
    } catch (error) {
      console.error(error);
      alert('Não foi possível enviar o Pix. Confira os campos esperados pelo backend.');
    }
  }

  return (
    <>
      <PageHeader title="Pix" subtitle="Faça transferências rápidas e acompanhe seus pagamentos." />
      <div className="page-container dashboard-split">
        <Card>
          <SectionTitle title="Novo Pix" />
          <form className="form-grid" onSubmit={enviarPix}>
            <Field label="Chave destino" value={form.chaveDestino} onChange={(v) => setForm({ ...form, chaveDestino: v })} required />
            <Field label="Nome destino" value={form.nomeDestino} onChange={(v) => setForm({ ...form, nomeDestino: v })} required />
            <Field label="Valor" type="number" value={form.valor} onChange={(v) => setForm({ ...form, valor: v })} required />
            <Field label="Descrição" value={form.descricao} onChange={(v) => setForm({ ...form, descricao: v })} />
            <Field label="Data" type="date" value={form.data} onChange={(v) => setForm({ ...form, data: v })} required />
            <Field label="ID da conta" type="number" value={form.contaId} onChange={(v) => setForm({ ...form, contaId: v })} required />
            <Field label="ID do usuário" type="number" value={form.usuarioId} onChange={(v) => setForm({ ...form, usuarioId: v })} required />
            <button className="primary-button full" type="submit">Enviar Pix</button>
          </form>
        </Card>

        <Card>
          <SectionTitle title="Pix recentes" />
          {erro && <p className="text-red">{erro}</p>}
          <div className="responsive-table">
            <table>
              <thead>
                <tr><th>Destino</th><th>Valor</th><th>Data</th><th>Status</th></tr>
              </thead>
              <tbody>
                {pixList.map((pix) => (
                  <tr key={pix.id}>
                    <td>{pix.nomeDestino || pix.chaveDestino || '-'}</td>
                    <td>{formatCurrency(pix.valor)}</td>
                    <td>{formatDate(pix.data)}</td>
                    <td><span className="tag green">{pix.status || '-'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

function Field({ label, type = 'text', value, onChange, required }) {
  return (
    <label>
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  );
}
