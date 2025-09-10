export default class ContratoFornecedorItem implements Shared.IEntity{
    id: number = 0;
    etapaId: number = 0;
    contratoFornecedorId: number = 0;
    valorUnitario: number = 0;
    quantidade: number = 0;
    caucao: number = 0;
    dataInicio = new Date().yyyymmdd();
    dataFim = new Date().yyyymmdd();
    valorTotal: number = 0;   

    constructor(model?: ContratoFornecedorItem){
        if(!model)
        return;
    
        this.id = model.id;
        this.etapaId = model.etapaId;
        this.contratoFornecedorId = model.contratoFornecedorId;
        this.valorUnitario = model.valorUnitario;
        this.quantidade = model.quantidade;
        this.quantidade = model.quantidade;
        this.caucao = model.caucao;
        this.dataInicio = new Date(model.dataInicio).yyyymmdd();
        this.dataFim = new Date(model.dataFim).yyyymmdd();
        this.valorTotal = model.valorTotal;
    }
}
