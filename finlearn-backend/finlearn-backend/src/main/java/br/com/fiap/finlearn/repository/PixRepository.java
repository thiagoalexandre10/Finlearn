package br.com.fiap.finlearn.repository;

import br.com.fiap.finlearn.model.Pix;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PixRepository extends JpaRepository<Pix, Long> {
    List<Pix> findByUsuarioId(Long idUsuario);
    List<Pix> findByChavePix(String chavePix);
}
