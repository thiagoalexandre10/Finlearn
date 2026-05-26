package br.com.fiap.finlearn.service;

import br.com.fiap.finlearn.exception.RecursoNaoEncontradoException;
import br.com.fiap.finlearn.exception.RegraNegocioException;
import br.com.fiap.finlearn.model.MetaFinanceira;
import br.com.fiap.finlearn.repository.MetaFinanceiraRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MetaFinanceiraService {

    private final MetaFinanceiraRepository repository;
    private final UsuarioService usuarioService;

    public MetaFinanceiraService(MetaFinanceiraRepository repository, UsuarioService usuarioService) {
        this.repository = repository;
        this.usuarioService = usuarioService;
    }

    public List<MetaFinanceira> listarTodas() { return repository.findAll(); }

    public MetaFinanceira buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Meta financeira não encontrada"));
    }

    public MetaFinanceira criar(MetaFinanceira meta) {
        validar(meta);
        if (meta.getValorAtual() == null) meta.setValorAtual(BigDecimal.ZERO);
        if (meta.getStatus() == null || meta.getStatus().isBlank()) meta.setStatus("EM_ANDAMENTO");
        if (meta.getPontosRecompensa() == null) meta.setPontosRecompensa(100);
        return repository.save(meta);
    }

    public MetaFinanceira atualizar(Long id, MetaFinanceira dados) {
        MetaFinanceira meta = buscarPorId(id);
        validar(dados);
        meta.setTitulo(dados.getTitulo());
        meta.setDescricao(dados.getDescricao());
        meta.setValorObjetivo(dados.getValorObjetivo());
        meta.setValorAtual(dados.getValorAtual());
        meta.setDataLimite(dados.getDataLimite());
        meta.setStatus(dados.getStatus());
        meta.setPontosRecompensa(dados.getPontosRecompensa());
        meta.setUsuario(dados.getUsuario());
        return repository.save(meta);
    }

    public MetaFinanceira adicionarValor(Long id, BigDecimal valor) {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) throw new RegraNegocioException("Valor adicionado deve ser maior que zero");
        MetaFinanceira meta = buscarPorId(id);
        if (meta.getValorAtual() == null) meta.setValorAtual(BigDecimal.ZERO);
        meta.setValorAtual(meta.getValorAtual().add(valor));
        if (meta.getValorAtual().compareTo(meta.getValorObjetivo()) >= 0) {
            meta.setStatus("CONCLUIDA");
            usuarioService.adicionarPontos(meta.getUsuario(), meta.getPontosRecompensa() == null ? 100 : meta.getPontosRecompensa());
        }
        return repository.save(meta);
    }

    public void deletar(Long id) { repository.delete(buscarPorId(id)); }

    private void validar(MetaFinanceira meta) {
        if (meta.getTitulo() == null || meta.getTitulo().isBlank()) throw new RegraNegocioException("Título da meta é obrigatório");
        if (meta.getValorObjetivo() == null || meta.getValorObjetivo().compareTo(BigDecimal.ZERO) <= 0) throw new RegraNegocioException("Valor objetivo deve ser maior que zero");
    }
}
