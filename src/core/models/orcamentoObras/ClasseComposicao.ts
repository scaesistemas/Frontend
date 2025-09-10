export default class ClasseComposicao implements Shared.IEntity{
    public id: number = 0;
    public nome:string ="";
    public sigla:string = "";
       
    constructor(model?: ClasseComposicao){
        if(!model)
        return;
    
        this.id = model.id; 
        this.nome = model.nome;
        this.sigla = model.sigla;
     }
}