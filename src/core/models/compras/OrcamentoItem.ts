import { Produto, GrupoProduto } from '../almoxarifado';
import { OrcamentoItemFornecedor,  Orcamento } from '.';

export default class OrcamentoItem implements Shared.IEntity{
    public id: number = 0;
    public orcamentoId: number = 0; 
    public orcamento?: Orcamento; 
    public grupoId: number = 0;  
    public grupo?: GrupoProduto; 
    public produtoId: number =0;
    public produto?: Produto; 
    public produtoNome:string='';
    public quantidade: number = 0;
    public itemFornecedores: OrcamentoItemFornecedor[]=[]; 
    public valorTotal:number = 0.00;
    public excluido:boolean = false;
} 