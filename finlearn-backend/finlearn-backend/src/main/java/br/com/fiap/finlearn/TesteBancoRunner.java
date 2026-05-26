package br.com.fiap.finlearn;

import br.com.fiap.finlearn.model.Conta;
import br.com.fiap.finlearn.model.Investimento;
import br.com.fiap.finlearn.model.MetaFinanceira;
import br.com.fiap.finlearn.model.Pix;
import br.com.fiap.finlearn.model.Transacao;
import br.com.fiap.finlearn.model.Usuario;
import br.com.fiap.finlearn.service.ContaService;
import br.com.fiap.finlearn.service.InvestimentoService;
import br.com.fiap.finlearn.service.MetaFinanceiraService;
import br.com.fiap.finlearn.service.PixService;
import br.com.fiap.finlearn.service.TransacaoService;
import br.com.fiap.finlearn.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class TesteBancoRunner implements CommandLineRunner {

    private final UsuarioService usuarioService;
    private final ContaService contaService;
    private final TransacaoService transacaoService;
    private final PixService pixService;
    private final InvestimentoService investimentoService;
    private final MetaFinanceiraService metaFinanceiraService;

    public TesteBancoRunner(
            UsuarioService usuarioService,
            ContaService contaService,
            TransacaoService transacaoService,
            PixService pixService,
            InvestimentoService investimentoService,
            MetaFinanceiraService metaFinanceiraService
    ) {
        this.usuarioService = usuarioService;
        this.contaService = contaService;
        this.transacaoService = transacaoService;
        this.pixService = pixService;
        this.investimentoService = investimentoService;
        this.metaFinanceiraService = metaFinanceiraService;
    }

    @Override
    public void run(String... args) {
        System.out.println("==========================================");
        System.out.println("INICIANDO TESTE DO BACKEND FINLEARN");
        System.out.println("==========================================");

        String codigoUnico = String.valueOf(System.currentTimeMillis()).substring(6);

        Usuario usuario = new Usuario();
        usuario.setNome("Thiago Santos");
        usuario.setCpf("123456" + codigoUnico);
        usuario.setEmail("thiago" + codigoUnico + "@finlearn.com");
        usuario.setSenha("123456");
        usuario.setTelefone("11999999999");

        Usuario usuarioSalvo = usuarioService.criar(usuario);

        System.out.println("Usuário criado com sucesso. ID: " + usuarioSalvo.getId());

        Conta contaCorrente = new Conta();
        contaCorrente.setNumeroConta(Integer.parseInt("10" + codigoUnico.substring(0, 4)));
        contaCorrente.setSaldo(new BigDecimal("2850.90"));
        contaCorrente.setTipoConta("CORRENTE");
        contaCorrente.setLimite(new BigDecimal("500.00"));
        contaCorrente.setRendimento(BigDecimal.ZERO);
        contaCorrente.setUsuario(usuarioSalvo);

        Conta contaCorrenteSalva = contaService.criar(contaCorrente);

        System.out.println("Conta corrente criada com sucesso. ID: " + contaCorrenteSalva.getId());

        Conta contaPoupanca = new Conta();
        contaPoupanca.setNumeroConta(Integer.parseInt("20" + codigoUnico.substring(0, 4)));
        contaPoupanca.setSaldo(new BigDecimal("1200.00"));
        contaPoupanca.setTipoConta("POUPANCA");
        contaPoupanca.setLimite(BigDecimal.ZERO);
        contaPoupanca.setRendimento(new BigDecimal("0.50"));
        contaPoupanca.setUsuario(usuarioSalvo);

        Conta contaPoupancaSalva = contaService.criar(contaPoupanca);

        System.out.println("Conta poupança criada com sucesso. ID: " + contaPoupancaSalva.getId());

        Transacao transacao = new Transacao();
        transacao.setDescricao("Pagamento de mercado");
        transacao.setValor(new BigDecimal("320.50"));
        transacao.setTipoTransacao("SAIDA");
        transacao.setOrigem("Conta Corrente");
        transacao.setDataTransacao(LocalDate.now());
        transacao.setContaOrigem(String.valueOf(contaCorrenteSalva.getNumeroConta()));
        transacao.setContaDestino("Mercado");
        transacao.setStatus("CONCLUIDA");
        transacao.setUsuario(usuarioSalvo);

        Transacao transacaoSalva = transacaoService.criar(transacao);

        System.out.println("Transação criada com sucesso. ID: " + transacaoSalva.getId());

        Pix pix = new Pix();
        pix.setValor(new BigDecimal("450.00"));
        pix.setTipoPix("ENTRADA");
        pix.setChavePix(usuarioSalvo.getEmail());
        pix.setContaOrigem("Banco externo");
        pix.setContaDestino(String.valueOf(contaCorrenteSalva.getNumeroConta()));
        pix.setDataPix(LocalDate.now());
        pix.setStatus("CONCLUIDO");
        pix.setUsuario(usuarioSalvo);

        Pix pixSalvo = pixService.criar(pix);

        System.out.println("Pix criado com sucesso. ID: " + pixSalvo.getId());

        Investimento investimento = new Investimento();
        investimento.setTipoInvestimento("Tesouro Direto");
        investimento.setValor(new BigDecimal("500.00"));
        investimento.setRentabilidade(new BigDecimal("12.50"));
        investimento.setDataAplicacao(LocalDate.now());
        investimento.setStatus("ATIVO");
        investimento.setUsuario(usuarioSalvo);

        Investimento investimentoSalvo = investimentoService.criar(investimento);

        System.out.println("Investimento criado com sucesso. ID: " + investimentoSalvo.getId());

        MetaFinanceira meta = new MetaFinanceira();
        meta.setTitulo("Reserva de emergência");
        meta.setDescricao("Guardar dinheiro para emergências");
        meta.setValorObjetivo(new BigDecimal("5000.00"));
        meta.setValorAtual(new BigDecimal("1200.00"));
        meta.setDataLimite(LocalDate.of(2026, 12, 31));
        meta.setStatus("EM_ANDAMENTO");
        meta.setPontosRecompensa(100);
        meta.setUsuario(usuarioSalvo);

        MetaFinanceira metaSalva = metaFinanceiraService.criar(meta);

        System.out.println("Meta financeira criada com sucesso. ID: " + metaSalva.getId());

        System.out.println("==========================================");
        System.out.println("TESTE FINALIZADO COM SUCESSO");
        System.out.println("Acesse no navegador para conferir:");
        System.out.println("http://localhost:8080/usuarios");
        System.out.println("http://localhost:8080/contas");
        System.out.println("http://localhost:8080/transacoes");
        System.out.println("http://localhost:8080/pix");
        System.out.println("http://localhost:8080/investimentos");
        System.out.println("http://localhost:8080/metas");
        System.out.println("==========================================");
        System.out.println("Projeto Java completo com todas integrações prontas e pronto para proxima etapa");
    }
}