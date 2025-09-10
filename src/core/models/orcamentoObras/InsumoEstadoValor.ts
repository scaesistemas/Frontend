
export default class InsumoEstadoValor{
    public valorDesonerado: number = 0;
    public valorNaoDesonerado:number =0;
        
    constructor(model?: InsumoEstadoValor){
        if(!model)
        return;
    
        this.valorDesonerado = model.valorDesonerado; 
        this.valorNaoDesonerado = model.valorNaoDesonerado;
     }
}