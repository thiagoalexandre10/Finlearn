package br.com.fiap.finlearn.controller;

import br.com.fiap.finlearn.model.Pix;
import br.com.fiap.finlearn.service.PixService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pix")
@CrossOrigin(origins = "*")
public class PixController {

    private final PixService service;

    public PixController(PixService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Pix>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pix> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Pix> criar(@RequestBody Pix pix) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(pix));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pix> atualizar(@PathVariable Long id, @RequestBody Pix pix) {
        return ResponseEntity.ok(service.atualizar(id, pix));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
