package br.com.fiap.finlearn.controller;

import br.com.fiap.finlearn.model.MetaFinanceira;
import br.com.fiap.finlearn.service.MetaFinanceiraService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

import java.util.List;

@RestController
@RequestMapping("/metas")
@CrossOrigin(origins = "*")
public class MetaFinanceiraController {

    private final MetaFinanceiraService service;

    public MetaFinanceiraController(MetaFinanceiraService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<MetaFinanceira>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MetaFinanceira> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<MetaFinanceira> criar(@RequestBody MetaFinanceira meta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(meta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MetaFinanceira> atualizar(@PathVariable Long id, @RequestBody MetaFinanceira meta) {
        return ResponseEntity.ok(service.atualizar(id, meta));
    }


    @PutMapping("/{id}/adicionar-valor")
    public ResponseEntity<MetaFinanceira> adicionarValor(@PathVariable Long id, @RequestParam BigDecimal valor) {
        return ResponseEntity.ok(service.adicionarValor(id, valor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
