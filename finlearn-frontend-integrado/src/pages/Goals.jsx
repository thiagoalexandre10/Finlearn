import { useEffect, useMemo, useState } from 'react';
import { Plus, Star, Target, Trophy, WalletCards } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Card, SectionTitle } from '../components/Card';
import { metaService } from '../api/finlearnService';
import { calculateProgress, formatCurrency, formatDate } from '../utils/formatters';

function normalizeMeta(meta) {
  const progresso = calculateProgress(meta.valorAtual, meta.valorObjetivo);
  return {
    id: meta.id,
    nome: meta.titulo,
    descricao: meta.descricao,
    atual: formatCurrency(meta.valorAtual),
    objetivo: formatCurrency(meta.valorObjetivo),
    prazo: formatDate(meta.dataLimite),
    status: meta.status === 'EM_ANDAMENTO' ? 'Em andamento' : meta.status,
    pontos: `+${meta.pontosRecompensa || 0} pts`,
    progresso,
    original: meta,
  };
}

const emptyMeta = {
  titulo: '',
  descricao: '',
  valorObjetivo: '',
  valorAtual: '',
  dataLimite: '',
  status: 'EM_ANDAMENTO',
  pontosRecompensa: '',
  usuarioId: 1,
};

export default function Goals() {
  const [metasBackend, setMetasBackend] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeta, setEditingMeta] = useState(null);
  const [form, setForm] = useState(emptyMeta);

  async function carregarMetas() {
    try {
      setCarregando(true);
      const dados = await metaService.listar();
      setMetasBackend(Array.isArray(dados) ? dados : []);
      setErro('');
    } catch (error) {
      console.error(error);
      setErro('Não foi possível carregar as metas do backend. Confira se o Spring Boot e o Oracle estão rodando.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarMetas();
  }, []);

  const metas = useMemo(() => metasBackend.map(normalizeMeta), [metasBackend]);
  const metaPrincipal = metas[0];
  const totalReservado = metasBackend.reduce((total, meta) => total + Number(meta.valorAtual || 0), 0);
  const metasAtivas = metasBackend.filter((meta) => meta.status === 'EM_ANDAMENTO').length;
  const metasConcluidas = metasBackend.filter((meta) => meta.status === 'CONCLUIDA').length;
  const pontosTotais = metasBackend.reduce((total, meta) => total + Number(meta.pontosRecompensa || 0), 0);

  function openCreateModal() {
    setEditingMeta(null);
    setForm(emptyMeta);
    setModalOpen(true);
  }

  function openEditModal(meta) {
    setEditingMeta(meta.original);
    setForm({
      titulo: meta.original.titulo || '',
      descricao: meta.original.descricao || '',
      valorObjetivo: meta.original.valorObjetivo || '',
      valorAtual: meta.original.valorAtual || '',
      dataLimite: meta.original.dataLimite || '',
      status: meta.original.status || 'EM_ANDAMENTO',
      pontosRecompensa: meta.original.pontosRecompensa || '',
      usuarioId: meta.original.usuario?.id || 1,
    });
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      titulo: form.titulo,
      descricao: form.descricao,
      valorObjetivo: Number(form.valorObjetivo || 0),
      valorAtual: Number(form.valorAtual || 0),
      dataLimite: form.dataLimite,
      status: form.status,
      pontosRecompensa: Number(form.pontosRecompensa || 0),
      usuario: { id: Number(form.usuarioId || 1) },
    };

    try {
      if (editingMeta?.id) await metaService.atualizar(editingMeta.id, payload);
      else await metaService.criar(payload);
      setModalOpen(false);
      await carregarMetas();
    } catch (error) {
      console.error(error);
      alert('Não foi possível salvar a meta. Confira os campos esperados pelo Controller.');
    }
  }

  async function excluirMeta(meta) {
    if (!confirm(`Excluir a meta ${meta.nome}?`)) return;
    try {
      await metaService.remover(meta.id);
      await carregarMetas();
    } catch (error) {
      console.error(error);
      alert('Não foi possível excluir a meta.');
    }
  }

  return (
    <>
      <PageHeader title="Metas" subtitle="Planeje seus objetivos, acompanhe seu progresso e conquiste seus sonhos." />
      <div className="page-container">
        <div className="page-action-row">
          <span />
          <button className="primary-button" type="button" onClick={openCreateModal}>
            <Plus size={18} /> Nova meta
          </button>
        </div>

        {carregando && <Card><p>Carregando metas do backend...</p></Card>}
        {erro && <Card><p className="text-red">{erro}</p></Card>}

        {!carregando && !erro && (
          <>
            <section className="stats-grid four">
              <Info label="Total reservado" value={formatCurrency(totalReservado)} />
              <Info label="Metas ativas" value={metasAtivas} />
              <Info label="Metas concluídas" value={metasConcluidas} />
              <Info label="Pontos em metas" value={`${pontosTotais} pts`} />
            </section>

            <section className="dashboard-split">
              <div className="main-column">
                <Card>
                  <SectionTitle title="Minhas metas" />
                  {metas.length === 0 && <p>Nenhuma meta cadastrada no backend.</p>}
                  {metas.map((meta) => (
                    <GoalRow key={meta.id} meta={meta} onEdit={openEditModal} onDelete={excluirMeta} />
                  ))}
                </Card>

                <Card>
                  <SectionTitle title="Histórico das metas" />
                  <div className="responsive-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Meta</th>
                          <th>Valor atual</th>
                          <th>Data limite</th>
                          <th>Status</th>
                          <th>Progresso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metas.map((meta) => (
                          <tr key={meta.id}>
                            <td>{meta.nome}</td>
                            <td>{meta.atual}</td>
                            <td>{meta.prazo}</td>
                            <td><span className="tag green">{meta.status}</span></td>
                            <td>{meta.progresso}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              <aside className="side-column">
                <Card>
                  <SectionTitle title="Meta principal" action="⭐ Destaque" />
                  {metaPrincipal ? (
                    <>
                      <div className="goal-feature">
                        <div className="circle-progress">{metaPrincipal.progresso}%</div>
                        <div>
                          <h3>{metaPrincipal.nome}</h3>
                          <p>{metaPrincipal.descricao}</p>
                          <span className="reward-box">{metaPrincipal.pontos}</span>
                        </div>
                      </div>
                      <div className="goal-values boxed">
                        <span>Valor atual<strong>{metaPrincipal.atual}</strong></span>
                        <span>Valor objetivo<strong>{metaPrincipal.objetivo}</strong></span>
                        <span>Data limite<strong>{metaPrincipal.prazo}</strong></span>
                      </div>
                      <button className="green-button full" type="button" onClick={() => openEditModal(metaPrincipal)}>
                        Editar meta principal
                      </button>
                    </>
                  ) : <p>Nenhuma meta disponível.</p>}
                </Card>

                <Card>
                  <SectionTitle title="Conquistas das metas" />
                  <MiniAchievement icon={<Trophy size={20} />} title="Meta concluída rende pontos" />
                  <MiniAchievement icon={<Star size={20} />} title="Suba no ranking" />
                  <MiniAchievement icon={<Target size={20} />} title="Desbloqueie conquistas" />
                </Card>
              </aside>
            </section>
          </>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <form className="modal-card" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h2>{editingMeta ? 'Editar meta' : 'Nova meta'}</h2>
              <button type="button" onClick={() => setModalOpen(false)}>×</button>
            </div>
            <div className="form-grid">
              <Field label="Título" value={form.titulo} onChange={(v) => setForm({ ...form, titulo: v })} required />
              <Field label="Descrição" value={form.descricao} onChange={(v) => setForm({ ...form, descricao: v })} required />
              <Field label="Valor objetivo" type="number" value={form.valorObjetivo} onChange={(v) => setForm({ ...form, valorObjetivo: v })} required />
              <Field label="Valor atual" type="number" value={form.valorAtual} onChange={(v) => setForm({ ...form, valorAtual: v })} required />
              <Field label="Data limite" type="date" value={form.dataLimite} onChange={(v) => setForm({ ...form, dataLimite: v })} required />
              <Field label="Pontos" type="number" value={form.pontosRecompensa} onChange={(v) => setForm({ ...form, pontosRecompensa: v })} required />
              <label>
                <span>Status</span>
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                  <option value="EM_ANDAMENTO">Em andamento</option>
                  <option value="CONCLUIDA">Concluída</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>
              </label>
              <Field label="ID do usuário" type="number" value={form.usuarioId} onChange={(v) => setForm({ ...form, usuarioId: v })} required />
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button type="submit" className="primary-button">Salvar</button>
            </div>
          </form>
        </div>
      )}
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

function Info({ label, value }) {
  return (
    <Card className="stat-card compact">
      <span className="circle-icon"><WalletCards size={20} /></span>
      <div><span>{label}</span><strong>{value}</strong></div>
    </Card>
  );
}

function GoalRow({ meta, onEdit, onDelete }) {
  return (
    <div className="goal-row-item">
      <span className="circle-icon"><Target size={20} /></span>
      <div><strong>{meta.nome}</strong><small>{meta.descricao}</small></div>
      <div className="goal-line">
        <span>{meta.atual} / {meta.objetivo}</span>
        <div className="progress-bar"><span style={{ width: `${meta.progresso}%` }} /></div>
      </div>
      <span>{meta.prazo}</span>
      <span className="tag blue">{meta.status}</span>
      <strong className="text-green">{meta.pontos}</strong>
      <div className="table-actions">
        <button type="button" onClick={() => onEdit(meta)}>Editar</button>
        <button type="button" className="danger-button-icon" onClick={() => onDelete(meta)}>Excluir</button>
      </div>
    </div>
  );
}

function MiniAchievement({ icon, title }) {
  return (
    <div className="mini-achievement">
      <span className="circle-icon">{icon}</span>
      <div><strong>{title}</strong><p>Ganhe pontos e evolua no FinLearn.</p></div>
    </div>
  );
}
