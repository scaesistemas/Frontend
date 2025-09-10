import { TipoIndice } from "../cadastros";
import { Encargo } from "../financeiro";
import { IntervaloReajuste } from "./IntervaloReajuste";
import { ReceitaPlanoPagamento } from "./ReceitaPlanoPagamento";
import { TipoAmortizacao } from "./TipoAmortizacao";
import { TipoAnoInicioReajuste } from "./TipoAnoInicioReajuste";
import { TipoMesReajuste } from "./TipoMesReajuste";
 import { TipoValorTotal } from "./TipoValorTotal";
  
export class PlanoPagamentoModelo implements Shared.IEntity {
    
    public id:number = 0;
    public nome:string = "";
    public intervaloReajusteId:number = 0;
    public intervaloReajuste?:IntervaloReajuste;
    public tipoIndiceId:number = 0;
    public tipoIndice?: TipoIndice;
    public tipoAmortizacaoId:number = 1;
    public tipoAmortizacao?: TipoAmortizacao;
    public jurosTabela:number = 0;
    public taxaGestao:number = 0;
    public seguroMPI:number = 0;
    public seguroDFI:number = 0;
    public isDFIFixo:boolean = false;
    public tipoValorTotalId:number = 0; 
    public tipoValorTotal?: TipoValorTotal;
    public tipoMesReajusteId:number = 0;
    public tipoMesReajuste?: TipoMesReajuste;
    public tipoAnoInicioReajusteId:number = 0;
    public tipoAnoInicioReajuste?:TipoAnoInicioReajuste;

    public entrada = new ReceitaPlanoPagamento();
    public intermediaria = new ReceitaPlanoPagamento();
    public financiamento = new ReceitaPlanoPagamento();
    public valorMetroQuadrado:number = 0;
    public valorUnidade:number = 0;
    public unidadeId!:number;
    public encargoFinanceiro = new Encargo();
    public tipoGatewayId!:number; 
    public tipoOperacaoId!:number;
    public contaCorrenteId!:number;

    constructor(model?: PlanoPagamentoModelo){
        
        if(!model)    
            return;
 
        this.id = model.id;
        this.nome = model.nome;
        this.intervaloReajusteId = model.intervaloReajusteId;
        this.intervaloReajuste = model.intervaloReajuste;
        this.tipoIndiceId = model.tipoIndiceId;
        this.tipoIndice = model.tipoIndice;
        this.tipoAmortizacaoId = model.tipoAmortizacaoId;
        this.tipoAmortizacao = model.tipoAmortizacao;
        this.jurosTabela = model.jurosTabela;
        this.taxaGestao = model.taxaGestao;
        this.seguroMPI = model.seguroMPI;
        this.seguroDFI = model.seguroDFI; 
        this.isDFIFixo = model.isDFIFixo ? model.isDFIFixo : false;
        this.tipoValorTotalId = model.tipoValorTotalId;
        this.tipoValorTotal = model.tipoValorTotal; 
        this.valorMetroQuadrado = model.valorMetroQuadrado;
        this.valorUnidade = model.valorUnidade;
        this.tipoAnoInicioReajusteId = model.tipoAnoInicioReajusteId;
        this.tipoAnoInicioReajuste = model.tipoAnoInicioReajuste;
        this.tipoMesReajusteId = model.tipoMesReajusteId;
        this.tipoMesReajuste = model.tipoMesReajuste;
        this.unidadeId = model.unidadeId
        this.encargoFinanceiro = new Encargo(model.encargoFinanceiro);
        
        this.tipoGatewayId = model.tipoGatewayId;
        this.tipoOperacaoId = model.tipoOperacaoId;
        this.contaCorrenteId = model.contaCorrenteId;
        this.entrada = new ReceitaPlanoPagamento(model.entrada);
        this.intermediaria = new ReceitaPlanoPagamento(model.intermediaria);
        this.financiamento =  new ReceitaPlanoPagamento(model.financiamento);
    }     
}

export enum EnumTipoAnoInicioReajuste{
    /* ano do contrato = id: 1
    1 ano após o contrato = id: 2
    2 anos após o contrato = id: 3 
    3 anos após o contrato = id: 4*/

    Anocontrato = 1,
    UmAnoAposContrato = 2,
    DoisAnosAposContrato = 3,
    TresAnosAposContrato = 4,
} 

export enum EnumTipoMesReajuste{
    /* Mes do contrato = id: 1
    1º parcela de entrada = id: 2
    1º parcela do financiamento = id: 3 
    1 mês antes do contrato = id: 4*
    2 meses antes do contrato = id: 5
    3 meses antes do contrato = id: 6
    1 mes depois do contrato = id: 7
    2 meses depois do contrato = id: 8
    3 meses depois do contrato = id: 9*/

    MesContrato = 1,
    UmaParcelaEntrada = 2,
    UmaParcelaFinanciamento = 3,
    
    UmMesAntesContrato = 4,
    DoisMesesAntesContrato = 5,
    TresMesesAntesContrato = 6,

    UmMesDepoisContrato = 7,
    DoisMesesDepoisContrato = 8,
    TresMesesDepoisContrato = 9
} 

