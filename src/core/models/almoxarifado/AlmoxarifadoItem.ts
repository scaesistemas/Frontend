import { Almoxarifado, Produto } from '.';

export default class AlmoxarifadoItem implements Shared.IEntity {
  public id: number = 0;
  public produtoId: number = 0;
  public produto?: Produto;
  public almoxarifadoId: number = 0; 
  public almoxarifado?: Almoxarifado;
  public quantidade: number = 0; 
}
