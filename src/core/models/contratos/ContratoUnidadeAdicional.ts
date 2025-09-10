export class ContratoUnidadeAdicional implements Shared.IEntity {
    
    id:number = 0;
    contratoId:number = 0;
    unidadeId:number = 0;
   // unidade = new Unidade();

    constructor(model?: ContratoUnidadeAdicional){
        
        if(!model)
            return;

        this.id = model.id;
        this.contratoId = model.contratoId;
        this.unidadeId = model.unidadeId;
    }
}