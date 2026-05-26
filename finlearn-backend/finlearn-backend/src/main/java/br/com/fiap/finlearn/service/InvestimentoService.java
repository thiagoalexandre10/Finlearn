package br.com.fiap.finlearn.service;

import br.com.fiap.finlearn.exception.RecursoNaoEncontradoException;
import br.com.fiap.finlearn.exception.RegraNegocioException;
import br.com.fiap.finlearn.model.Investimento;
import br.com.fiap.finlearn.repository.InvestimentoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class InvestimentoService {

    private final InvestimentoRepository repository;
    private final UsuarioService usuarioService;

    public InvestimentoService(InvestimentoRepository repository, UsuarioService usuarioService) {
        this.repository = repository;
        this.usuarioService = usuarioService;
    }

    public List<Investimento> listarTodos() { return repository.findAll(); }

    public Investimento buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Investimento não encontrado"));
    }

    public Investimento criar(Investimento investimento) {
        validar(investimento);
        if (investimento.getDataAplicacao() == null) investimento.setDataAplicacao(LocalDate.now());
        if (investimento.getStatus() == null || investimento.getStatus().isBlank()) investimento.setStatus("ATIVO");
        Investimento salvo = repository.save(investimento);
        usuarioService.adicionarPontos(salvo.getUsuario(), 50);
        return salvo;
    }

    public Investimento atualizar(Long id, Investimento dados) {
        Investimento investimento = buscarPorId(id);
        validar(dados);
        investimento.setTipoInvestimento(dados.getTipoInvestimento());
        investimento.setValor(dados.getValor());
        investimento.setRentabilidade(dados.getRentabilidade());
        investimento.setDataAplicacao(dados.getDataAplicacao());
        investimento.setStatus(dados.getStatus());
        investimento.setUsuario(dados.getUsuario());
        return repository.save(investimento);
    }

    public void deletar(Long id) { repository.delete(buscarPorId(id)); }

    private void validar(Investimento investimento) {
        if (investimento.getTipoInvestimento() == null || investimento.getTipoInvestimento().isBlank()) throw new RegraNegocioException("Tipo de investimento é obrigatório");
        if (investimento.getValor() == null || investimento.getValor().compareTo(BigDecimal.ZERO) <= 0) throw new RegraNegocioException("Valor investido deve ser maior que zero");
    }
}
