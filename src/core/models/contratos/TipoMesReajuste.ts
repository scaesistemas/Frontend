export class TipoMesReajuste implements Shared.IEntity {

    public id:number = 0;
    public nome:string = "";

    constructor(model?: TipoMesReajuste){
        
        if(!model)
            return;

        this.id = model.id;
        this.nome = model.nome;
    }
}