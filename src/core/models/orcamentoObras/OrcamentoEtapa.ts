import OrcamentoEtapaItem from "./OrcamentoEtapaItem";
import OrcamentoObras from "./OrcamentoObras";

export default class OrcamentoEtapa implements Shared.IEntity{
    public id!: any;
    public orcamentoId!:number;
    public orcamento!: OrcamentoObras;
    public etapaPaiId!:any;
    public titulo:string = "";
    public descricao:string = "";
    public quantidade:number = 0;
    public itens:OrcamentoEtapaItem[] = [];
    public children:OrcamentoEtapa[] = [];
    public valorTotalDesonerado:number = 0;
    public valorTotalNaoDesonerado:number = 0; 
    public valorTotalItemDesonerado: number = 0;
  
    constructor(model?: OrcamentoEtapa){
        if(!model) 
        return;
    
        this.id = model.id;
        this.orcamentoId = model.orcamentoId;
        this.orcamento = model.orcamento;
        this.etapaPaiId = model.etapaPaiId;
        this.titulo = model.titulo;
        this.descricao = model.descricao;
        this.quantidade = model.quantidade;
        this.itens = model.itens;
        this.children = model.children;
        this.valorTotalDesonerado = model.valorTotalDesonerado;
        this.valorTotalNaoDesonerado = model.valorTotalNaoDesonerado;
        this.valorTotalItemDesonerado = model.valorTotalItemDesonerado;
     } 
} 