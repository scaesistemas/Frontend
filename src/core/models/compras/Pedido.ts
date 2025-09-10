import { Despesa, DespesaParcela } from '../financeiro';
import { PedidoItem, Orcamento, SituacaoFrete, PedidoClassificacao } from '.';
import { TipoProduto } from '../almoxarifado';
import { Empresa, Pessoa } from '../cadastros';
 
export default class Pedido implements Shared.IEntity {
       
    id: number = 0;
    empresaId:number = 0;
    empresa?:Empresa;  
    orcamentoId: number =0; 
    orcamento: Orcamento = new Orcamento;  
    despesaId: number = 0;  
    despesa?: Despesa;    
    tipoId: number = 0;   
    tipo?: TipoProduto;   
    fornecedorId: number = 0;
    fornecedor?: Pessoa; 
    situacaoFreteId: number = 0; 
    situacaoFrete?: SituacaoFrete; 
    frete:number = 0.00;
    dataEmissao = new Date().yyyymmdd();
    dataEntrega = new Date().yyyymmdd();
    conferente: string = '';
    itens: PedidoItem[] = []; 
    classificacoes: PedidoClassificacao[] = []; 
    parcelas: DespesaParcela[] = [];
    distribuicoes: PedidoItem[] = []; //teste
    empreendimentoId:number = 0;
    almoxarifadoId: number = 0 ;
    situacao:string = '';
    situacaoGeralPedidoItensId: number = 0;
 

    constructor(model?: Pedido){
        if(!model)
        return;
    }

}