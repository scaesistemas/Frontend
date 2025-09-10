
export default class TipoComposicao implements Shared.IEntity{
    public id: number = 0;
    public nome:string = "";
    public sigla:number = 0;
        
    constructor(model?: TipoComposicao){
        if(!model)
        return;
    
        this.id = model.id; 
        this.nome = model.nome;
        this.sigla = model.sigla;
     }
}