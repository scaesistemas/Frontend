export default class MarcacaoAgua implements Shared.IEntity {
    public id: number = 0;
    public dataAfericao = new Date().yyyymmdd();
    public hidrometroId:number = 0;
    public leitura:number = 0;
    public responsavelId:number = JSON.parse(localStorage.sessionApp.split(".")).dados.usuarioId;
    public consumo:number = 0;
    public valor:number = 0;
    public parcelaId?:number;

    constructor(model?: MarcacaoAgua){
        
        if(!model)
            return;

        this.id = model.id;
        this.dataAfericao = model.dataAfericao;
        this.hidrometroId = model.hidrometroId;
        this.leitura = model.leitura;
        this.responsavelId = model.responsavelId; 
        this.consumo = model.consumo;
        this.valor = model.valor;
        this.parcelaId = model.parcelaId;
    }
}