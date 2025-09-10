export default class DisponibilidadeOperacaoUnidade implements Shared.IEntity{
    public id: number = 0;
    public venda: boolean = true;
    public locacao: boolean = false;
    
    constructor(model?: DisponibilidadeOperacaoUnidade){
        Object.assign(this, model);
    }
}