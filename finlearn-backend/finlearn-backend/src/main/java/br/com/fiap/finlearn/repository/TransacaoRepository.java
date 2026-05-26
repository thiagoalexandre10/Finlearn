package br.com.fiap.finlearn.repository;

import br.com.fiap.finlearn.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByUsuarioId(Long idUsuario);
    List<Transacao> findByOrigem(String origem);
    List<Transacao> findByTipoTransacao(String tipoTransacao);
}
