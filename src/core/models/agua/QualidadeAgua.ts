import { Documento } from "../geral";

export default class QualidadeAgua implements Shared.IEntity {
    public id: number = 0;
    public dataCriacao = new Date().yyyymmdd();
    public maximoExigido = new DadosAgua();
    public amostraRealizada = new DadosAgua();
    public documento!:Documento;
    public usuarioId = JSON.parse(localStorage.sessionApp.split(".")).dados.usuarioId;

    constructor(model?: QualidadeAgua){
        
        if(!model)
            return;

        this.id = model.id;
        this.dataCriacao = model.dataCriacao;
        this.maximoExigido = model.maximoExigido;
        this.amostraRealizada = model.amostraRealizada;
        this.documento = model.documento;
        this.usuarioId = model.usuarioId;
    }
}

export  class DadosAgua {
    public turbidez:number = 0;
    public cor:number = 0;
    public cloro:number = 0;
    public ph:number = 0;
    public fluoreto:number = 0;

    constructor(model?: DadosAgua){
        
        if(!model)
            return;

        this.turbidez = model.turbidez;
        this.cor = model.cor;
        this.cloro = model.cloro;
        this.ph = model.ph;
        this.fluoreto = model.fluoreto;
    }
}