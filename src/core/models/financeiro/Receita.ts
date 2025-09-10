import { TipoDocumento, TipoReceita, ReceitaParcela, ReceitaClassificacao, Encargo, ValoresAdicionais } from '.';
import { Contrato, Empreendimento, Empresa } from '../cadastros';
import Pessoa from '../cadastros/Pessoa';
import { Documento } from '../geral';

export class Receita implements Shared.IEntity {
    id!: number; 
    empresaId: number = 0; 
    empresa?: Empresa; 
    contratoId!: number; 
    contrato?: Contrato;  
    tipoId: number = 0;  
    tipo?: TipoReceita;   
    clienteId: number = 0;  
    cliente?: Pessoa; 
    empreendimentoId!:number;  
    empreendimento?: Empreendimento;
    dataEmissao = new Date().yyyymmdd(); 
    dataInicialParcelas = new Date().yyyymmdd();
    valor: number = 0;
    tipoDocumentoId!: number; 
    tipoDocumento?: TipoDocumento; 
    numeroDocumento: string = '';
    observacao: string = '';
    saldo: number = 0;
    parcelas: ReceitaParcela[] = [];
    classificacoes: ReceitaClassificacao[] = [];  
    documentos: Documento[] = []; 
    melhorDia:number = 0;
    saldoPreAditamento:number =0;
    totalPagoParcelas:number = 0;
    totalCanceladoParcelas:number =0;
    quantidadeParcela: number = 0;
    quantidadeParcelasPagas:number =0;
    quantidadeParcelasAPagar:number = 0;
    valorParcelaAtual:number = 0;
    dataCriacao = new Date().yyyymmdd();
    primeiroVencimento: string = new Date().yyyymmdd();;
    mediaPrestacoes:number = 0;
    encargoFinanceiro: Encargo = new Encargo();
    jurosAditamento:number = 0;
    descontoAditamento:number = 0;
    saldoAmortizacao:number = 0;

    realizarCobrancaAutomatica:boolean = true;
    gerarBoletoAutomatico:boolean = true;
    
    isReajustavel:boolean = false;
    gerarFinanciamentoPosEntrada:boolean = false;
    gerarFinanciamentoComIntermediaria:boolean = false;

    tipoAmortizacaoId?:number;
    jurosAmortizacao:number = 0; 
    valoresAdicionaisParcela = new ValoresAdicionais();
    titulo:string='';
    tipoGatewayId!:number;
    tipoOperacaoId:number = 0;
    contaCorrenteId!:number;
 
    constructor(tipoId: number = 0) {
        this.tipoId = tipoId;  
    } 
}

export enum EnumTipoReceita{ 
    Titulo = 1,  //Financiamento
    TituloCredito = 2, //
    TituloEntrada = 3, // ENTRADA 
    TituloAditamento = 4,  //ADITAMENTO
    TituloIntermediaria = 5, //INTERMEDIARIA
    Outros = 9  //SERVIÇOS
}