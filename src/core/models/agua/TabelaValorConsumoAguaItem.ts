export default class TabelaValorConsumoAguaItem implements Shared.IEntity {
    public id: number = 0;
    public tabelaId:number = 0;
    public nome:string = "";
    public faixaConsumoInicial:number = 0;
    public faixaConsumoFinal:number = 0;
    public valor:number = 0;
    public isValorFixo:boolean = false; 

    constructor(model?: TabelaValorConsumoAguaItem){
        
        if(!model)
            return;

        this.id = model.id;
        this.tabelaId = model.tabelaId;
        this.nome = model.nome;
        this.faixaConsumoInicial = model.faixaConsumoInicial;
        this.faixaConsumoFinal = model.faixaConsumoFinal;
        this.valor = model.valor;
        this.isValorFixo = model.isValorFixo;
    }
}