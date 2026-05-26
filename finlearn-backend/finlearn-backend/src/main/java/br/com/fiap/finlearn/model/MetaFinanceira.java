package br.com.fiap.finlearn.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "T_FL_META_FINANCEIRA")
@SequenceGenerator(name = "meta_seq", sequenceName = "SEQ_FL_META", allocationSize = 1)
public class MetaFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "meta_seq")
    @Column(name = "id_meta")
    private Long id;

    @Column(name = "titulo", nullable = false, length = 100)
    private String titulo;

    @Column(name = "descricao", length = 255)
    private String descricao;

    @Column(name = "valor_objetivo", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorObjetivo;

    @Column(name = "valor_atual", precision = 12, scale = 2)
    private BigDecimal valorAtual;

    @Column(name = "data_limite")
    private LocalDate dataLimite;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "pontos_recompensa")
    private Integer pontosRecompensa;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    public MetaFinanceira() {
        this.valorAtual = BigDecimal.ZERO;
        this.status = "EM_ANDAMENTO";
        this.pontosRecompensa = 100;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValorObjetivo() {
        return valorObjetivo;
    }

    public void setValorObjetivo(BigDecimal valorObjetivo) {
        this.valorObjetivo = valorObjetivo;
    }

    public LocalDate getDataLimite() {
        return dataLimite;
    }

    public void setDataLimite(LocalDate dataLimite) {
        this.dataLimite = dataLimite;
    }

    public BigDecimal getValorAtual() {
        return valorAtual;
    }

    public void setValorAtual(BigDecimal valorAtual) {
        this.valorAtual = valorAtual;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getPontosRecompensa() {
        return pontosRecompensa;
    }

    public void setPontosRecompensa(Integer pontosRecompensa) {
        this.pontosRecompensa = pontosRecompensa;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
