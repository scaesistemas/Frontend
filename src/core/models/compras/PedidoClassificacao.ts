import Pedido from './Pedido';
import { CentroCusto, ContaGerencial, Despesa } from '../financeiro';

export default class PedidoClassificacao implements Shared.IEntity{
    
    public id:number = 0;
    public pedidoId: number = 0;
    public pedido?: Pedido; 
    public centroCustoId:number = 0;
    public centroCusto?: CentroCusto;
    public contaGerencialId: number = 0;
    public contaGerencial?: ContaGerencial;
    public valorTotal:number = 0.00;
    public valor: number = 0.00;
    public percentual: number = 0.00;

    constructor(model?: PedidoClassificacao){
        Object.assign(this, model);
    }    
}