import Encargo from "./Encargo";

export default class AntecipacaoComprovante implements Shared.IEntity {
    public id:number = 0;
    public isQuitacao:boolean = false;
    public usuarioId:number = 0;
    public dataEmissaoComprovante:string = "";
    public dataCriacaoAntecipacao:string = "";
    public receitaParcelaId:number = 0;
    public encargoContrato = new Encargo();
    public documento:string ="";
}