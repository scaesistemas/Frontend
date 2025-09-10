import OrcamentoEtapa from "./OrcamentoEtapa";

export default class OrcamentoObras implements Shared.IEntity{
    public id: number = 0;
    public dataHora = new Date().yyyymmdd();
    public dataHoraAtualizacao = new Date().yyyymmdd();
    public empresaId:number = 0;
    public empreendimentoId:number = 0;
    public descricao:string = "";
    public observacao:string = "";
    public referencia:string = "";  
    public estadoId:number = 0 
    public origemId:number = 1;
    public encargosDesonerados:boolean = false;
    public percentualBDI:number = 0;
    public etapas:any[] = []; 

    public valorTotalDesonerado:number = 0;
    public valorTotalNaoDesonerado:number = 0;

    public valorTotalDesoneradoComBDI:number = 0;
    public valorTotalNaoDesoneradoComBDI:number = 0;
    public valorDesoneradoBDI:number = 0;
    public valorNaoDesoneradoBDI:number = 0;

    public valorTotalSemBDI:number = 0;
    public valorBDI:number = 0
    public valorTotalComBDI:number = 0;
  
    constructor(model?: OrcamentoObras){
        if(!model)
        return;
    
        this.id = model.id; 
        this.dataHora = model.dataHora;
        this.dataHoraAtualizacao = model.dataHoraAtualizacao;
        this.empresaId = model.empresaId;
        this.empreendimentoId = model.empreendimentoId;
        this.descricao = model.descricao; 
        this.observacao = model.observacao;
        this.referencia = model.referencia;
        this.estadoId = model.estadoId;
        this.origemId = model.origemId;
        this.encargosDesonerados = model.encargosDesonerados;
        this.percentualBDI = model.percentualBDI;
        this.etapas = model.etapas;
        
        this.valorTotalDesonerado = model.valorTotalDesonerado;
        this.valorTotalNaoDesonerado = model.valorTotalNaoDesonerado
        this.valorTotalNaoDesoneradoComBDI = model.valorTotalNaoDesoneradoComBDI;
        this.valorTotalDesoneradoComBDI = model.valorTotalDesoneradoComBDI;
        this.valorDesoneradoBDI = model.valorDesoneradoBDI;
        this.valorNaoDesoneradoBDI = model.valorNaoDesoneradoBDI;

        this.valorTotalSemBDI = model.valorTotalSemBDI;
        this.valorBDI = model.valorBDI;
        this.valorTotalComBDI = model.valorTotalComBDI;
     }
}