import { TipoOrigem } from '../geral';
import { AlmoxarifadoItem, TipoMovimentacao } from '.';
 
export default class Movimentacao implements Shared.IEntity {
  public id: number = 0;
  public empresaId: number = 1;
  public almoxarifadoItemId: number = 1;
  public almoxarifadoItem?: AlmoxarifadoItem;

  public tipoId: number = 0; 
  public tipo?: TipoMovimentacao;  
  public tipoOrigemId: number = 1;
  public tipoOrigem?: TipoOrigem;
  public pedidoId!: number;

  public etapaId:number = 0;

  public orcamentoId?: number = 1;
  public empreendimentoId:number = 0;
  
  public quantidade: number = 0;
  public custo:number =0.00;
  
  public dataHora: Date = new Date();;
  public descricao: string = "";

  public almoxarifadoId: number = 0;
  public produtoId?: number=0;

  constructor() {
    this.dataHora = new Date(Date.now());
  }
}
