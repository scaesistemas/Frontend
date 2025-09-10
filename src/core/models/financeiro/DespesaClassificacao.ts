import { CentroCusto, ContaGerencial, Despesa } from '.';
export default class DespesaClassificacao implements Shared.IEntity{

    public id: number = 0;
    //public receitaId: number = 0;
    public despesa?: Despesa;
    public centroCustoId: number = 0;
    public centroCusto?: CentroCusto;
    public contaGerencialId: number = 0;
    public contaGerencial?: ContaGerencial;
    public valor: number = 0.00; 
    public percentual: number = 0.00;
   // public excluido:boolean = false;

   constructor(model?: DespesaClassificacao){
       Object.assign(this, model); 
   }   
}