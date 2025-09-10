export class TipoPlanoPagamento implements Shared.IEntity {
    
    public id:number = 0;
    public nome:string = "";

    constructor(model?: TipoPlanoPagamento){
        
        if(!model)
            return;

        this.id = model.id;
        this.nome = model.nome;
    }
}