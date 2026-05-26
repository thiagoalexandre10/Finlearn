package br.com.fiap.finlearn.repository;

import br.com.fiap.finlearn.model.Investimento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestimentoRepository extends JpaRepository<Investimento, Long> {
    List<Investimento> findByUsuarioId(Long idUsuario);
    List<Investimento> findByStatus(String status);
}
