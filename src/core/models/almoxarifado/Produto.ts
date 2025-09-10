import GrupoProduto from './GrupoProduto';
import TipoProduto from './TipoProduto';
import UnidadeMedida from './UnidadeMedida';
import { AlmoxarifadoItem } from '.'; 
import Empresa from '../cadastros/Empresa';

export default class Produto implements Shared.IEntity {
    
    public id: number = 0;
    public empresaId: number = 1; 
    public empresa?:Empresa;
    public tamanho: number = 0;
    public dados: string = '';
     

    public produto?: Produto;
    public almoxarifadoItem?: AlmoxarifadoItem;

    public codigo: string = '0';
    public nome: string = '';
    public descricao: string = ''; 

    public grupoId: number = 1;
    public grupo?: GrupoProduto;

    public saldo:number =0.00;

    public tipoId: number = 1;
    public tipo?: TipoProduto;
    
    public unidadeMedidaId: number = 1;
    public unidadeMedida? = new UnidadeMedida();
    public ultimaCompraData: Date = new Date();

    //public ultimaCompraFornecedorId: number = 0;
    //public ultimaCompraFornecedor?: Pessoa;

    public fornecedorNome: string = '';
    public produtoNome:string = '';
    public grupoNome: string = '';
    public ultimaCompraPreco:number = 0.00;
 
    public precoCustoMedio: number = 0;  
    public estoqueMinimo: number = 0;
    public estoqueCritico: number = 0;
    //public saldo: number = 0;
    public ativo: boolean = true;
    public almoxarifadoItens:AlmoxarifadoItem[]=[];

    public idNome: string = '';
    public idNomeSaldo: string = '';
    public foto:string= '';
    public almoxarifadoId:number=0;

    constructor(model?: Produto){
      Object.assign(this, model);
   }
}

  
  