export class IntervaloReajuste implements Shared.IEntity {
    
    public id:number = 0;
    public nome:string = "";

    constructor(model?: IntervaloReajuste){
        
        if(!model)
            return;

        this.id = model.id;
        this.nome = model.nome;
    }
}