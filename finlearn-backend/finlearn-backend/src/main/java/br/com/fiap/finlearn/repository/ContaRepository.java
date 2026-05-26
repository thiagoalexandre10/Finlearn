package br.com.fiap.finlearn.repository;

import br.com.fiap.finlearn.model.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContaRepository extends JpaRepository<Conta, Long> {
    List<Conta> findByUsuarioId(Long idUsuario);
    List<Conta> findByTipoConta(String tipoConta);
}
