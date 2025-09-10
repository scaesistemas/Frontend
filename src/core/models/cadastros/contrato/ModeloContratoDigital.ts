export default class ModeloContratoDigital implements Shared.IEntity{
    id:number = 0;
    nome:string ="";
    tipoId:number = 0;
    conteudo:string = "";
    isPadraoSistema:boolean = false;

    constructor(model?: ModeloContratoDigital){
        if(!model)
        return;

        this.id = model.id;
        this.nome = model.nome;
        this.tipoId = model.tipoId;
        this.conteudo = model.conteudo;
        this.isPadraoSistema = model.isPadraoSistema;
    }
} 


