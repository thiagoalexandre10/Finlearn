package br.com.fiap.finlearn.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "T_FL_CONTA")
@SequenceGenerator(name = "conta_seq", sequenceName = "SEQ_FL_CONTA", allocationSize = 1)
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "conta_seq")
    @Column(name = "id_conta")
    private Long id;

    @Column(name = "numero_conta", nullable = false, unique = true)
    private Integer numeroConta;

    @Column(name = "saldo", nullable = false, precision = 12, scale = 2)
    private BigDecimal saldo;

    @Column(name = "tipo_conta", nullable = false, length = 30)
    private String tipoConta;

    @Column(name = "limite", precision = 12, scale = 2)
    private BigDecimal limite;

    @Column(name = "rendimento", precision = 5, scale = 2)
    private BigDecimal rendimento;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    public Conta() {}

    public Long getId() {
        return id; }

    public void setId(Long id) {
        this.id = id; }

    public Integer getNumeroConta() {
        return numeroConta; }

    public void setNumeroConta(Integer numeroConta) {
        this.numeroConta = numeroConta; }

    public BigDecimal getSaldo() {
        return saldo; }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo; }

    public String getTipoConta() {
        return tipoConta; }

    public void setTipoConta(String tipoConta) {
        this.tipoConta = tipoConta; }

    public BigDecimal getLimite() {
        return limite; }

    public void setLimite(BigDecimal limite) {
        this.limite = limite; }

    public BigDecimal getRendimento() {
        return rendimento; }

    public void setRendimento(BigDecimal rendimento) {
        this.rendimento = rendimento; }

    public Usuario getUsuario() {
        return usuario; }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario; }
}


