package br.com.fiap.finlearn.service;

import br.com.fiap.finlearn.exception.RecursoNaoEncontradoException;
import br.com.fiap.finlearn.exception.RegraNegocioException;
import br.com.fiap.finlearn.model.Pix;
import br.com.fiap.finlearn.model.Transacao;
import br.com.fiap.finlearn.repository.PixRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class PixService {

    private final PixRepository repository;
    private final TransacaoService transacaoService;
    private final UsuarioService usuarioService;

    public PixService(PixRepository repository, TransacaoService transacaoService, UsuarioService usuarioService) {
        this.repository = repository;
        this.transacaoService = transacaoService;
        this.usuarioService = usuarioService;
    }

    public List<Pix> listarTodos() { return repository.findAll(); }

    public Pix buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Pix não encontrado"));
    }

    public Pix criar(Pix pix) {
        validar(pix);
        if (pix.getDataPix() == null) pix.setDataPix(LocalDate.now());
        if (pix.getStatus() == null || pix.getStatus().isBlank()) pix.setStatus("CONCLUIDO");
        Pix salvo = repository.save(pix);

        Transacao transacao = new Transacao();
        transacao.setDescricao("Pix " + pix.getTipoPix());
        transacao.setValor(pix.getValor());
        transacao.setTipoTransacao(pix.getTipoPix());
        transacao.setOrigem("Pix");
        transacao.setDataTransacao(pix.getDataPix());
        transacao.setContaOrigem(pix.getContaOrigem());
        transacao.setContaDestino(pix.getContaDestino());
        transacao.setStatus("CONCLUIDA");
        transacao.setUsuario(pix.getUsuario());
        transacaoService.criar(transacao);

        usuarioService.adicionarPontos(salvo.getUsuario(), 10);
        return salvo;
    }

    public Pix atualizar(Long id, Pix dados) {
        Pix pix = buscarPorId(id);
        validar(dados);
        pix.setValor(dados.getValor());
        pix.setTipoPix(dados.getTipoPix());
        pix.setChavePix(dados.getChavePix());
        pix.setContaOrigem(dados.getContaOrigem());
        pix.setContaDestino(dados.getContaDestino());
        pix.setDataPix(dados.getDataPix());
        pix.setStatus(dados.getStatus());
        pix.setUsuario(dados.getUsuario());
        return repository.save(pix);
    }

    public void deletar(Long id) { repository.delete(buscarPorId(id)); }

    private void validar(Pix pix) {
        if (pix.getValor() == null || pix.getValor().compareTo(BigDecimal.ZERO) <= 0) throw new RegraNegocioException("Valor do Pix deve ser maior que zero");
        if (pix.getTipoPix() == null || pix.getTipoPix().isBlank()) throw new RegraNegocioException("Tipo do Pix é obrigatório");
    }
}
