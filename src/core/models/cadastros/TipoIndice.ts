export default class TipoIndice implements Shared.IEntity{
    public id: number = 0;
    public nome: string = "";
    public nomeEditavel:string = "";
    public edicaoBloqueada:boolean = false;
    public criado:boolean = true;

    
    constructor(model?: TipoIndice){
        
        if(!model)
            return;

        this.id = model.id;
        this.nome = model.nome;
        this.nomeEditavel = model.nomeEditavel;
        this.edicaoBloqueada = model.edicaoBloqueada;
        this.criado = model.criado;
    }
}  