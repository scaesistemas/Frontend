import { Produto, GrupoProduto } from '../almoxarifado';
import { SituacaoPedidoItem, ReceberPedidoItemModel } from '.';
import Pedido from './Pedido';

export default class PedidoItem implements Shared.IEntity { 
    id: number = 0;
    produtoId!: number;
    produto?: Produto; 
    pedidoId!: number; 
    pedido?: Pedido; 
    grupoId:number = 0; 
    grupo?:GrupoProduto; 
    situacaoId: number =1; 
    situacao?: SituacaoPedidoItem; 
    receber?: ReceberPedidoItemModel; 
    quantidade: number = 0;
    quantidadeRecebida: number = 0;
    valorUnitario: number = 0;
    total: number = 0;  
    totalRecebido: number = 0;
    valor:number = 0; 
    quantidadeAReceber:number = 0; 
    empresaId:number = 1; 
    almoxarifadoId:number = 1;
    descricao:string='';

    constructor(model?: PedidoItem){
        Object.assign(this, model);  
     }    
}
