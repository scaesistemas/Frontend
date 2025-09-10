import { ModeloOrcamentoEtapaItem } from ".";

export default class ModeloOrcamentoEtapa{
    public id: number = 0;
    public modeloEtapaPaiId!:number;
    public titulo:string = "";
    public descricao:string = "";
    public quantidade:number = 0;
    public itens:ModeloOrcamentoEtapaItem[] = [];
    public origemId!:number; //sinap ou manual

    public valorTotalDesonerado:number = 0;
    public valorTotalNaoDesonerado:number = 0;
        
    constructor(model?: ModeloOrcamentoEtapa){
        if(!model)
        return; 
    
        this.id = model.id; 
        this.modeloEtapaPaiId = model.modeloEtapaPaiId;
        this.titulo = model.titulo; 
        this.descricao = model.descricao;
        this.quantidade  = model.quantidade;
        this.itens = model.itens;
        this.origemId = model.origemId;
        this.valorTotalDesonerado = model.valorTotalDesonerado;
        this.valorTotalNaoDesonerado = model.valorTotalNaoDesonerado;
     }
}