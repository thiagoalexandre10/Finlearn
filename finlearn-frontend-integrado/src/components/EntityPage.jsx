import { useEffect, useMemo, useState } from 'react';
import { Edit, Plus, RefreshCw, Trash2 } from 'lucide-react';
import PageHeader from './PageHeader';
import { Card, SectionTitle } from './Card';

function getInitialForm(fields, initial = {}) {
  const result = {};
  fields.forEach((field) => {
    result[field.name] = initial[field.name] ?? field.defaultValue ?? '';
  });
  return result;
}

function buildPayload(fields, form) {
  const payload = {};
  fields.forEach((field) => {
    let value = form[field.name];
    if (field.type === 'number') value = Number(value || 0);
    payload[field.name] = value;
  });
  return payload;
}

export default function EntityPage({
  title,
  subtitle,
  service,
  fields,
  columns,
  normalize,
  emptyMessage,
  createButtonLabel,
  payloadMapper,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(() => getInitialForm(fields));

  const rows = useMemo(() => items.map(normalize), [items, normalize]);

  async function loadItems() {
    try {
      setLoading(true);
      const data = await service.listar();
      setItems(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error(err);
      setError(`Não foi possível carregar ${title.toLowerCase()} do backend.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function openCreateModal() {
    setEditingItem(null);
    setForm(getInitialForm(fields));
    setModalOpen(true);
  }

  function openEditModal(row) {
    setEditingItem(row.original);
    setForm(getInitialForm(fields, row.original));
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const rawPayload = buildPayload(fields, form);
    const payload = payloadMapper ? payloadMapper(rawPayload) : rawPayload;

    try {
      if (editingItem?.id) {
        await service.atualizar(editingItem.id, payload);
      } else {
        await service.criar(payload);
      }

      setModalOpen(false);
      await loadItems();
    } catch (err) {
      console.error(err);
      alert('Não foi possível salvar. Confira se o backend aceita os campos enviados.');
    }
  }

  async function handleDelete(item) {
    const confirmed = confirm(`Deseja excluir este registro?`);
    if (!confirmed) return;

    try {
      await service.remover(item.id);
      await loadItems();
    } catch (err) {
      console.error(err);
      alert('Não foi possível excluir. Verifique relacionamentos no backend/banco.');
    }
  }

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

      <div className="page-container">
        <div className="page-action-row">
          <button className="secondary-button" type="button" onClick={loadItems}>
            <RefreshCw size={16} />
            Atualizar
          </button>

          <button className="primary-button" type="button" onClick={openCreateModal}>
            <Plus size={18} />
            {createButtonLabel}
          </button>
        </div>

        {loading && <Card><p>Carregando dados do backend...</p></Card>}
        {error && <Card><p className="text-red">{error}</p></Card>}

        {!loading && !error && (
          <Card>
            <SectionTitle title={`Lista de ${title.toLowerCase()}`} />

            {rows.length === 0 ? (
              <p>{emptyMessage}</p>
            ) : (
              <div className="responsive-table">
                <table>
                  <thead>
                    <tr>
                      {columns.map((column) => <th key={column.key}>{column.label}</th>)}
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        {columns.map((column) => (
                          <td key={column.key}>{row[column.key]}</td>
                        ))}
                        <td>
                          <div className="table-actions">
                            <button type="button" onClick={() => openEditModal(row)}>
                              <Edit size={15} />
                            </button>
                            <button type="button" onClick={() => handleDelete(row.original)} className="danger-button-icon">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop">
          <form className="modal-card" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h2>{editingItem ? `Editar ${title}` : createButtonLabel}</h2>
              <button type="button" onClick={() => setModalOpen(false)}>×</button>
            </div>

            <div className="form-grid">
              {fields.map((field) => (
                <label key={field.name}>
                  <span>{field.label}</span>
                  {field.options ? (
                    <select
                      value={form[field.name] ?? ''}
                      onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                      required={field.required}
                    >
                      <option value="">Selecione</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={form[field.name] ?? ''}
                      onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                      required={field.required}
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button type="submit" className="primary-button">
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
