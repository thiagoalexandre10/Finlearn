package br.com.fiap.finlearn.service;

import br.com.fiap.finlearn.exception.RecursoNaoEncontradoException;
import br.com.fiap.finlearn.exception.RegraNegocioException;
import br.com.fiap.finlearn.model.Conta;
import br.com.fiap.finlearn.repository.ContaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ContaService {

    private final ContaRepository repository;

    public ContaService(ContaRepository repository) { this.repository = repository; }

    public List<Conta> listarTodas() { return repository.findAll(); }

    public Conta buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Conta não encontrada"));
    }

    public Conta criar(Conta conta) {
        if (conta.getNumeroConta() == null) throw new RegraNegocioException("Número da conta é obrigatório");
        if (conta.getTipoConta() == null || conta.getTipoConta().isBlank()) throw new RegraNegocioException("Tipo de conta é obrigatório");
        if (conta.getSaldo() == null) conta.setSaldo(BigDecimal.ZERO);
        if (conta.getLimite() == null) conta.setLimite(BigDecimal.ZERO);
        if (conta.getRendimento() == null) conta.setRendimento(BigDecimal.ZERO);
        return repository.save(conta);
    }

    public Conta atualizar(Long id, Conta dados) {
        Conta conta = buscarPorId(id);
        conta.setNumeroConta(dados.getNumeroConta());
        conta.setSaldo(dados.getSaldo());
        conta.setTipoConta(dados.getTipoConta());
        conta.setLimite(dados.getLimite());
        conta.setRendimento(dados.getRendimento());
        conta.setUsuario(dados.getUsuario());
        return repository.save(conta);
    }

    public void deletar(Long id) { repository.delete(buscarPorId(id)); }
}
