import { useEffect, useState } from 'react';
import { CheckCircle, MoreVertical, Plus, Star, Target, Wallet } from 'lucide-react';
import Header from '../components/Header';
import { Button, Card, Modal, StatCard } from '../components/UI';
import { GoalDepositForm, GoalForm } from '../components/forms';
import { finlearnService, fallbackData } from '../api/finlearnService';
import { usuarioBase } from '../data';
import { formatCurrency, formatDate, getPercent } from '../utils';

export default function Goals() {
  const [data, setData] = useState({ metas: [], contas: [], usuario: usuarioBase });
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [notice, setNotice] = useState('');

  async function loadData() {
    const dashboard = await finlearnService.carregarDashboard();
    setData(dashboard);
  }

  useEffect(() => { loadData(); }, []);

  const safeMetas = data.metas.length ? data.metas : fallbackData.metas;
  const total = safeMetas.reduce((sum, meta) => sum + Number(meta.valorAtual || 0), 0);
  const concluidas = safeMetas.filter((meta) => meta.status === 'CONCLUIDA').length;
  const pontos = safeMetas.reduce((sum, meta) => sum + Number(meta.pontosRecompensa || 0), 0);
  const principal = safeMetas[0];
  const percent = getPercent(principal?.valorAtual, principal?.valorObjetivo);

  async function save(payload) {
    try {
      if (editing) await finlearnService.atualizarMeta(editing.id, payload);
      else await finlearnService.criarMeta({ ...payload, usuario: data.usuario });
      setNotice(editing ? 'Meta atualizada com sucesso.' : 'Meta criada com sucesso.');
      setEditing(null);
      setModal(null);
      loadData();
    } catch (error) {
      setNotice(error.message || 'Não foi possível salvar a meta.');
    }
  }

  async function deposit({ metaId, valor, contaId }) {
    try {
      await finlearnService.adicionarValorMeta(metaId, valor, contaId);
      setNotice('Valor acrescentado na meta. Se ela bater o objetivo, os pontos serão creditados automaticamente.');
      setModal(null);
      setSelectedGoal(null);
      loadData();
    } catch (error) {
      setNotice(error.message || 'Não foi possível acrescentar valor na meta.');
    }
  }

  async function remove(id) {
    await finlearnService.excluirMeta(id);
    loadData();
  }

  return (
    <>
      <Header title="Metas" subtitle="Planeje seus objetivos, acompanhe seu progresso e conquiste seus sonhos." usuario={data.usuario} />
      <div className="page-content">
        {notice && <div className={notice.includes('Não') || notice.includes('insuficiente') ? 'error-banner' : 'success-banner'}>{notice}</div>}
        <div className="page-action"><Button onClick={() => { setEditing(null); setModal('goal'); }}><Plus /> Nova meta</Button></div>
        <div className="stats-grid four"><StatCard icon={Wallet} label="Total reservado" value={formatCurrency(total)} hint="Em todas as metas" /><StatCard icon={Target} label="Metas ativas" value={safeMetas.length - concluidas} hint="Em andamento" /><StatCard icon={CheckCircle} label="Metas concluídas" value={concluidas} hint="Concluídas até agora" /><StatCard icon={Star} label="Pontos em metas" value={`${pontos} pts`} hint="Potencial acumulado" /></div>
        <div className="goals-layout"><Card><h3>Minhas metas</h3><div className="goal-list">{safeMetas.map((meta) => { const p = getPercent(meta.valorAtual, meta.valorObjetivo); return <div className="goal-row" key={meta.id}><span className="goal-icon"><Target size={20} /></span><div><strong>{meta.titulo}</strong><small>{meta.descricao}</small></div><span><b>{formatCurrency(meta.valorAtual)} / {formatCurrency(meta.valorObjetivo)}</b><div className="tiny-progress"><i style={{ width: `${p}%` }} /></div></span><span>{formatDate(meta.dataLimite)}</span><span className={`tag ${meta.status === 'CONCLUIDA' ? 'success' : meta.status === 'NAO_CUMPRIDA' ? 'danger' : 'blue'}`}>{meta.status === 'CONCLUIDA' ? 'Concluída' : meta.status === 'NAO_CUMPRIDA' ? 'Não cumprida' : 'Em andamento'}</span><b className={meta.status === 'NAO_CUMPRIDA' ? 'negative-text' : 'positive-text'}>{meta.status === 'NAO_CUMPRIDA' ? `-${meta.pontosPerda || 40}` : `+${meta.pontosRecompensa || 100}`} pts</b><Button variant="outline" onClick={() => { setSelectedGoal(meta); setModal('deposit'); }}>Acrescentar</Button><button className="mini-menu" onClick={() => { setEditing(meta); setModal('goal'); }}><MoreVertical size={18} /></button><button className="text-danger" onClick={() => remove(meta.id)}>Excluir</button></div>; })}</div></Card><aside className="side-stack"><Card><div className="card-title-row"><h3>Meta principal</h3><span>⭐ Destaque</span></div><div className="goal-feature"><div className="donut progress-donut"><strong>{percent}%</strong></div><div><h3>{principal?.titulo}</h3><p>{principal?.descricao}</p><div className="reward">+{principal?.pontosRecompensa || 100} pts</div></div></div><div className="triple-info"><span>Valor atual<b>{formatCurrency(principal?.valorAtual)}</b></span><span>Valor objetivo<b>{formatCurrency(principal?.valorObjetivo)}</b></span><span>Data limite<b>{formatDate(principal?.dataLimite)}</b></span></div><Button onClick={() => { setSelectedGoal(principal); setModal('deposit'); }}>Acrescentar valor</Button></Card><Card><h3>Regras automáticas</h3><div className="simple-row"><span>🏆 Bateu a meta</span><b>Ganha pontos</b></div><div className="simple-row"><span>⏳ Prazo venceu sem atingir</span><b className="negative-text">Perde pontos</b></div><div className="simple-row"><span>📈 Ranking</span><b>Atualiza junto</b></div></Card></aside></div>
      </div>
      <Modal isOpen={modal === 'goal'} onClose={() => setModal(null)} title={editing ? 'Editar meta' : 'Nova meta'} subtitle="Salve a meta financeira conectada ao backend."><GoalForm initialData={editing} onSubmit={save} onCancel={() => setModal(null)} /></Modal>
      <Modal isOpen={modal === 'deposit'} onClose={() => setModal(null)} title="Acrescentar dinheiro na meta" subtitle="O valor sai da conta e aumenta o progresso da meta."><GoalDepositForm meta={selectedGoal || principal} contas={data.contas} onSubmit={deposit} onCancel={() => setModal(null)} /></Modal>
    </>
  );
}
