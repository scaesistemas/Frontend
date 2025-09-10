import { TipoPlanoPagamento } from "./TipoPlanoPagamento";

export class ReceitaPlanoPagamento  {
    
    public tipoId!:number;
    public tipo?: TipoPlanoPagamento
    public porcentagemValorTotal:number = 0;
    public valor:number = 0;
    public prazosDisponiveis:any = [];
    public prazo:number = 0;
    public tipoIntervaloParcelaId!:number;
    //public tipoIntervaloParcelaId:number = 1;
    public gerarFinanciamentoPosEntrada:boolean = false;
    public gerarFinanciamentoComIntermediaria:boolean = false;

    constructor(model?: ReceitaPlanoPagamento){  
         
        if(!model)
            return;

        this.tipoId = model.tipoId; 
        //this.tipo = model.tipo;
        this.porcentagemValorTotal = model.porcentagemValorTotal
        this.valor = model.valor;
        this.prazosDisponiveis = model.prazosDisponiveis;
        this.prazo =  model.prazo ? model.prazo : 0;
        this.tipoIntervaloParcelaId = model.tipoIntervaloParcelaId;
        //this.tipoIntervaloParcelaId = model.tipoIntervaloParcelaId ? model.tipoIntervaloParcelaId : 0;
        this.gerarFinanciamentoPosEntrada = model.gerarFinanciamentoPosEntrada;
        this.gerarFinanciamentoComIntermediaria = model.gerarFinanciamentoComIntermediaria;
     }
} 
