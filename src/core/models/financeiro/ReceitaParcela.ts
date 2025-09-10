import { Receita, SituacaoReceitaParcela, ReceitaBaixa, Encargo, AntecipacaoComprovante, ValoresAdicionais } from '.';
export default class ReceitaParcela implements Shared.IEntity  {
    public id: number = 0;
    public receitaId: number = 0; 
    public receita?: Receita;  
    public parcela: number = 0;
    public parcelaStr: string = '';
    public dataVencimentoOriginal = new Date().yyyymmdd();
    public dataVencimento = new Date().yyyymmdd(); 
    public valor: number = 0; 
    public linhaDigitavelBoleto: string = '';  
    public situacaoId: number = 1;  
    public situacao?: SituacaoReceitaParcela;  
    public codigoMovimentoRetorno: string = '';
    public dataRemessa: string = '';
    public isAgrupador: boolean = false;
    public isAntecipador: boolean = false; 
    public agrupadorId!:number; 
    public codigoZoop:string = ''
    public encargoFinanceiro: Encargo = new Encargo();
    public instrucao1:string = '';
    public instrucao2:string = ''; 
    public ultimaDataPagamento:string = ""; 
    public ultimaFormaPagamento:string = "";
    public remessa: number = 0; 
    public nossoNumero: string = ''; 
    public urlBoleto:string =''; 
    public valorPago: number = 0; 
    public saldo: number = 0;
    public baixas?: ReceitaBaixa[];
    public tipoServicoId!:number;
    public antecipacaoComprovante?: AntecipacaoComprovante;
    public amortizacao: number = 0;
    public juros:number = 0;
    public tipoGatewayId:number = 1;
    public saldoAmortizacaoInicioPeriodoCorrigido:number = 0;
    public saldoAmortizacaoPeriodoOriginal:number = 0;
    public saldoAmortizacaoFimPeriodoCorrigido:number = 0;
    public correcaoSaldo:number = 0;
    public valoresAdicionais:any = new ValoresAdicionais();
    public tipoOperacaoId!:number;
    public contaCorrenteId!:number;
    public observacao:string = "";
    public dataEnvioCobrancaWhatsapp:string = "";
    //public conciliado:boolean = false;
     

    constructor(model?: ReceitaParcela){
        if(!model)
        return;

        this.id = model.id;
        this.receitaId = model.receitaId;
        this.parcela = model.parcela;
        this.parcelaStr = model.parcelaStr;
        this.dataVencimentoOriginal = model.dataVencimentoOriginal;
        this.dataVencimento = model.dataVencimento;
        this.valor = model.valor;
        this.linhaDigitavelBoleto = model.linhaDigitavelBoleto;
        this.situacaoId = model.situacaoId;
        this.codigoMovimentoRetorno = model.codigoMovimentoRetorno;
        this.dataRemessa = model.dataRemessa;
        this.isAgrupador = model.isAgrupador;
        this.isAntecipador = model.isAntecipador;
        this.agrupadorId = model.agrupadorId;
        this.codigoZoop = model.codigoZoop;
        this.encargoFinanceiro = model.encargoFinanceiro;
        this.instrucao1 = model.instrucao1;
        this.instrucao2 = model.instrucao2;
        this.ultimaDataPagamento = model.ultimaDataPagamento;
        this.ultimaFormaPagamento = model.ultimaFormaPagamento;
        this.remessa = model.remessa;
        this.nossoNumero = model.nossoNumero;
        this.urlBoleto = model.urlBoleto;
        this.valorPago = model.valorPago;
        this.saldo = model.saldo;
        this.baixas = model.baixas;
        this.tipoServicoId = model.tipoServicoId;
        this.antecipacaoComprovante = model.antecipacaoComprovante;
        this.amortizacao = model.amortizacao;
        this.juros = model.juros;
        this.tipoGatewayId = model.tipoGatewayId;
        this.saldoAmortizacaoInicioPeriodoCorrigido = model.saldoAmortizacaoInicioPeriodoCorrigido;
        this.saldoAmortizacaoPeriodoOriginal = model.saldoAmortizacaoPeriodoOriginal;
        this.saldoAmortizacaoFimPeriodoCorrigido = model.saldoAmortizacaoFimPeriodoCorrigido;
        this.correcaoSaldo = model.correcaoSaldo;
        this.valoresAdicionais = model.valoresAdicionais;
        this.tipoOperacaoId = model.tipoOperacaoId;
        this.contaCorrenteId = model.contaCorrenteId;
        this.observacao = model.observacao;
        this.dataEnvioCobrancaWhatsapp = model.dataEnvioCobrancaWhatsapp;
        //this.conciliado = model.conciliado;
    }
}

export enum EnumTipoIntervaloParcelas{
    Mensal = 1,   
    Quinzenal = 2,  
    Bimestral = 3, 
    Trimestral = 4,   
    Quadrimestral = 5,  
    Semestral = 6, 
    Anual = 7
}