package br.com.fiap.finlearn.repository;

import br.com.fiap.finlearn.model.MetaFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MetaFinanceiraRepository extends JpaRepository<MetaFinanceira, Long> {
    List<MetaFinanceira> findByUsuarioId(Long idUsuario);
    List<MetaFinanceira> findByStatus(String status);
}
