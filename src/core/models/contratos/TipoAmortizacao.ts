export class TipoAmortizacao implements Shared.IEntity {
    
    public id:number = 0;
    public nome:string = "";

    constructor(model?: TipoAmortizacao){
        
        if(!model)
            return;

        this.id = model.id;
        this.nome = model.nome;
    }
}