import InsumoEstado from "./InsumoEstado";

export default class ComposicaoInsumo implements Shared.IEntity{
    public id: number = 0;
    public composicaoId:number = 0;
    public insumoId:number = 0;
    public tipoId: number = 0;
    public coeficiente:number = 0;
    public valorDesonerado:number = 0;
    public valorNaoDesonerado:number = 0;
    public totalDesonerado:number = 0;
    public totalNaoDesonerado:number = 0;
    public observacao:string ="";
    public estado = new InsumoEstado();
        
    constructor(model?: ComposicaoInsumo){
        if(!model)
        return;
    
        this.id = model.id; 
        this.composicaoId = model.composicaoId;
        this.insumoId = model.insumoId;
        this.tipoId = model.tipoId;
        this.coeficiente = model.coeficiente;
        this.valorDesonerado = model.valorDesonerado;
        this.valorNaoDesonerado = model.valorNaoDesonerado;
        this.totalDesonerado = model.totalDesonerado;
        this.totalNaoDesonerado = model.totalNaoDesonerado;
        this.observacao = model.observacao;
     }
}