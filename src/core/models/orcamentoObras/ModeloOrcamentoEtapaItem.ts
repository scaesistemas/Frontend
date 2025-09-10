import ModeloComposicao from "./ModeloComposicao";

export default class InsumoEstadoValor{
    public id: number = 0;
    public modeloEtapaId!:number;
    public composicao = new ModeloComposicao();
    public quantidade:number  = 0;
    public valorDesoneradoItemOriginal:number = 0;
    public valorNaoDesoneradoItemOriginal:number = 0;
    public valorTotalItemDesonerado:number = 0;
    public valorTotalItemNaoDesonerado:number = 0;
        
    constructor(model?: InsumoEstadoValor){
        if(!model)
        return;
    
        this.id = model.id; 
        this.modeloEtapaId = model.modeloEtapaId;
        this.composicao = model.composicao;
        this.quantidade = model.quantidade;
        this.valorDesoneradoItemOriginal = model.valorDesoneradoItemOriginal;
        this.valorNaoDesoneradoItemOriginal = model.valorNaoDesoneradoItemOriginal;
        this.valorTotalItemDesonerado = model.valorTotalItemDesonerado;
        this.valorTotalItemNaoDesonerado = model.valorTotalItemNaoDesonerado;
    }
}