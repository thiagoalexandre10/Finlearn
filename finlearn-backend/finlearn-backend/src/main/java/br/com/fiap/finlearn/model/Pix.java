package br.com.fiap.finlearn.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "T_FL_PIX")
@SequenceGenerator(name = "pix_seq", sequenceName = "SEQ_FL_PIX", allocationSize = 1)
public class Pix {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pix_seq")
    @Column(name = "id_pix")
    private Long id;

    @Column(name = "valor", nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @Column(name = "tipo_pix", nullable = false, length = 20)
    private String tipoPix;

    @Column(name = "chave_pix", length = 100)
    private String chavePix;

    @Column(name = "conta_origem", length = 50)
    private String contaOrigem;

    @Column(name = "conta_destino", length = 50)
    private String contaDestino;

    @Column(name = "data_pix")
    private LocalDate dataPix;

    @Column(name = "status", length = 30)
    private String status;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    public Pix() {
        this.dataPix = LocalDate.now();
        this.status = "CONCLUIDO";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getChavePix() {
        return chavePix;
    }

    public void setChavePix(String chavePix) {
        this.chavePix = chavePix;
    }

    public String getTipoPix() {
        return tipoPix;
    }

    public void setTipoPix(String tipoPix) {
        this.tipoPix = tipoPix;
    }

    public String getContaOrigem() {
        return contaOrigem;
    }

    public void setContaOrigem(String contaOrigem) {
        this.contaOrigem = contaOrigem;
    }

    public String getContaDestino() {
        return contaDestino;
    }

    public void setContaDestino(String contaDestino) {
        this.contaDestino = contaDestino;
    }

    public LocalDate getDataPix() {
        return dataPix;
    }

    public void setDataPix(LocalDate dataPix) {
        this.dataPix = dataPix;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}


