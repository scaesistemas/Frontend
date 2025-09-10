
export default class ModeloComposicao{
    public codigo: string = "";
    public descricao:string =  "";
    public unidadeMedidaId:number = 0;
    public classeId:number = 0;
    public origemId:number = 0;
    public mes:number = 0;
    public ano:number = 0;
    public valorOriginalDesonerado:number = 0;
    public valorOriginalNaoDesonerado:number = 0;
        
    constructor(model?: ModeloComposicao){
        if(!model)
        return;
    
        this.codigo = model.codigo; 
        this.descricao = model.descricao;
        this.unidadeMedidaId = model.unidadeMedidaId;
        this.classeId = model.classeId;
        this.origemId  = model.origemId;
        this.mes = model.mes;
        this.ano = model.ano;
        this.valorOriginalDesonerado = model.valorOriginalDesonerado;
        this.valorOriginalNaoDesonerado
     }
}