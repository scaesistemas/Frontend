import { Despesa, FormaPagamento, SituacaoDespesaParcela, DespesaBaixa } from '.';

export default class DespesaParcela implements Shared.IEntity {
    public id: number = 0;
    public despesaId: number = 0; 
    public despesa: Despesa = new Despesa();
    public parcela: number = 0;
    public dataVencimento = new Date().yyyymmdd();
    public valor: number = 0;
    public saldo: number = 0;  
    public linhaDigitavelBoleto: string = "";  
    public valorPago: number = 0; 
    public situacaoId: number = 1; 
    public situacao?: SituacaoDespesaParcela; 
    public baixas: DespesaBaixa[]=[]; 
    public parcelaStr:string = "";
    public observacao:string = "";
    public ultimaDataPagamento?:null;
    public ultimaFormaPagamento?:null;
    public pagamentoLiberado:boolean = false;
    public corretorNome!:string;

     
     
    constructor(model?: DespesaParcela){
        if(!model)
        return;

     
        this.id = model.id;
        this.despesaId = model.despesaId;
        this.parcela = model.parcela;
        this.dataVencimento = model.dataVencimento;
        this.valor = model.valor;
        this.saldo = model.saldo;
        this.linhaDigitavelBoleto = model.linhaDigitavelBoleto; 
        this.valorPago = model. valorPago
        this.situacaoId = model.situacaoId
        this.baixas = model.baixas;
        this.parcelaStr = model.parcelaStr;
        this.observacao = model.observacao;
        this.ultimaDataPagamento = model.ultimaDataPagamento;
        this.ultimaFormaPagamento = model.ultimaFormaPagamento;
        this.pagamentoLiberado = model.pagamentoLiberado;
        this.corretorNome = model.corretorNome
    }
}  