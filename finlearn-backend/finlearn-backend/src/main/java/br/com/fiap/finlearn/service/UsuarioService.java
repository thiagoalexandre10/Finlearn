package br.com.fiap.finlearn.service;

import br.com.fiap.finlearn.exception.RecursoNaoEncontradoException;
import br.com.fiap.finlearn.exception.RegraNegocioException;
import br.com.fiap.finlearn.model.Usuario;
import br.com.fiap.finlearn.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> listarTodos() { return repository.findAll(); }

    public Usuario buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));
    }

    public Usuario criar(Usuario usuario) {
        if (usuario.getNome() == null || usuario.getNome().isBlank()) throw new RegraNegocioException("Nome é obrigatório");
        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) throw new RegraNegocioException("E-mail é obrigatório");
        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) throw new RegraNegocioException("Senha é obrigatória");
        if (repository.findByEmail(usuario.getEmail()).isPresent()) throw new RegraNegocioException("E-mail já cadastrado");
        if (usuario.getCpf() != null && repository.findByCpf(usuario.getCpf()).isPresent()) throw new RegraNegocioException("CPF já cadastrado");
        if (usuario.getDataCadastro() == null) usuario.setDataCadastro(LocalDate.now());
        if (usuario.getPontos() == null) usuario.setPontos(0);
        if (usuario.getNivel() == null || usuario.getNivel().isBlank()) usuario.setNivel("Explorador Financeiro");
        return repository.save(usuario);
    }

    public Usuario atualizar(Long id, Usuario dados) {
        Usuario usuario = buscarPorId(id);
        usuario.setNome(dados.getNome());
        usuario.setCpf(dados.getCpf());
        usuario.setEmail(dados.getEmail());
        usuario.setSenha(dados.getSenha());
        usuario.setTelefone(dados.getTelefone());
        usuario.setPontos(dados.getPontos());
        usuario.setNivel(dados.getNivel());
        return repository.save(usuario);
    }

    public void deletar(Long id) { repository.delete(buscarPorId(id)); }

    public void adicionarPontos(Usuario usuario, int pontos) {
        if (usuario == null || usuario.getId() == null) return;
        Usuario salvo = buscarPorId(usuario.getId());
        if (salvo.getPontos() == null) salvo.setPontos(0);
        salvo.setPontos(salvo.getPontos() + pontos);
        if (salvo.getPontos() >= 1000) salvo.setNivel("Investidor Avançado");
        else if (salvo.getPontos() >= 500) salvo.setNivel("Investidor Intermediário");
        else salvo.setNivel("Explorador Financeiro");
        repository.save(salvo);
    }
}
