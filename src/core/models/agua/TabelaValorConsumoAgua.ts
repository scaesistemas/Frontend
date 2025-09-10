import TabelaValorConsumoAguaItem from "./TabelaValorConsumoAguaItem";

export default class TabelaValorConsumoAgua implements Shared.IEntity {
    public id: number = 0;
    public dataCriacao = new Date().yyyymmdd();
    public nome:string = "";
    public isPrincipal:boolean = false;
    public itens:TabelaValorConsumoAguaItem[] = []
   
    constructor(model?: TabelaValorConsumoAgua){
        
        if(!model)
            return;

        this.id = model.id;
        this.dataCriacao = model.dataCriacao;
        this.nome = model.nome;
        this.isPrincipal = model.isPrincipal;
        this.itens = model.itens;      
    }
} 