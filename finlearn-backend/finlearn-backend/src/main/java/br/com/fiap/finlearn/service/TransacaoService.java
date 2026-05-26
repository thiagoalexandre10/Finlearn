package br.com.fiap.finlearn.service;

import br.com.fiap.finlearn.exception.RecursoNaoEncontradoException;
import br.com.fiap.finlearn.exception.RegraNegocioException;
import br.com.fiap.finlearn.model.Transacao;
import br.com.fiap.finlearn.repository.TransacaoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransacaoService {

    private final TransacaoRepository repository;
    private final UsuarioService usuarioService;

    public TransacaoService(TransacaoRepository repository, UsuarioService usuarioService) {
        this.repository = repository;
        this.usuarioService = usuarioService;
    }

    public List<Transacao> listarTodas() { return repository.findAll(); }

    public Transacao buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Transação não encontrada"));
    }

    public Transacao criar(Transacao transacao) {
        validar(transacao);
        if (transacao.getDataTransacao() == null) transacao.setDataTransacao(LocalDate.now());
        if (transacao.getStatus() == null || transacao.getStatus().isBlank()) transacao.setStatus("CONCLUIDA");
        Transacao salva = repository.save(transacao);
        usuarioService.adicionarPontos(salva.getUsuario(), 5);
        return salva;
    }

    public Transacao atualizar(Long id, Transacao dados) {
        Transacao transacao = buscarPorId(id);
        validar(dados);
        transacao.setDescricao(dados.getDescricao());
        transacao.setValor(dados.getValor());
        transacao.setTipoTransacao(dados.getTipoTransacao());
        transacao.setOrigem(dados.getOrigem());
        transacao.setDataTransacao(dados.getDataTransacao());
        transacao.setContaOrigem(dados.getContaOrigem());
        transacao.setContaDestino(dados.getContaDestino());
        transacao.setStatus(dados.getStatus());
        transacao.setUsuario(dados.getUsuario());
        return repository.save(transacao);
    }

    public void deletar(Long id) { repository.delete(buscarPorId(id)); }

    private void validar(Transacao transacao) {
        if (transacao.getDescricao() == null || transacao.getDescricao().isBlank()) throw new RegraNegocioException("Descrição é obrigatória");
        if (transacao.getValor() == null || transacao.getValor().compareTo(BigDecimal.ZERO) <= 0) throw new RegraNegocioException("Valor deve ser maior que zero");
        if (transacao.getTipoTransacao() == null || transacao.getTipoTransacao().isBlank()) throw new RegraNegocioException("Tipo é obrigatório");
        if (transacao.getOrigem() == null || transacao.getOrigem().isBlank()) throw new RegraNegocioException("Origem é obrigatória");
    }
}
