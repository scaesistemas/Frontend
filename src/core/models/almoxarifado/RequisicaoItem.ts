import { Produto } from '.';
import { Empreendimento } from '../cadastros';
import { Etapa } from '../gestao';
import Requisicao from './Requisicao';

export default class RequisicaoItem implements Shared.IEntity {
   public id: number = 0; 
   public requisicaoId: number = 0;
   public requisicao?:Requisicao;  
   public produtoId: number = 0;
   public produto?: Produto; 
   public etapa?: Etapa; 
   public etapaId:number = 0;
   public unidadeMedidaId:number = 0;
   public custoMedio:number =0;
   public quantidade: number = 0;  
   public saldoEmEstoque:number =0; 
   public excluido:boolean = false;
    
    constructor(model?: RequisicaoItem){ 
      Object.assign(this, model);
   }
}