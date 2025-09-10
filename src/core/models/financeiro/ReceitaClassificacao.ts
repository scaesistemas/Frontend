import { CentroCusto, ContaGerencial,  Receita } from '.';
export default class ReceitaClassificacao implements Shared.IEntity{
    public id: number = 0;
    public receitaId: number = 0;
    public receita?: Receita;
    public centroCustoId: number = 0;
    public centroCusto?: CentroCusto;
    public contaGerencialId: number = 0;
    public contaGerencial?: ContaGerencial;
    public valor: number = 0.00;
    public percentual: number = 0.00; 

    constructor(model?: ReceitaClassificacao){
       Object.assign(this, model);
   }
}