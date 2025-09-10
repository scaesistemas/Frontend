import InsumoEstado from "./InsumoEstado";

export default class Insumo implements Shared.IEntity{
    public id: number = 0;
    public codigo:string ="";
    public descricao:string ="";
    public tipoId:number = 0;
    public unidadeId:number = 0;
    public valorPadraoDesonerado:number = 0;
    public valorPadraoNaoDesonerado:number = 0;
    public estado = new InsumoEstado();
    public observacao:string = ""; 
    public origemId:number = 1;
         
    constructor(model?: Insumo){
        if(!model) 
        return;
    
        this.id = model.id;  
        this.codigo = model.codigo;
        this.descricao = model.descricao;
        this.tipoId = model.tipoId;
        this.unidadeId = model.unidadeId;
        this.valorPadraoDesonerado = model.valorPadraoDesonerado;
        this.valorPadraoNaoDesonerado = model.valorPadraoNaoDesonerado;
       
        this.observacao = model.observacao;
        this.origemId = model.origemId;
        this.estado = new InsumoEstado(model.estado)
    }
}