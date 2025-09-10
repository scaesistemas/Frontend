import { Produto } from '.';

export default class InventarioItem implements Shared.IEntity {
    public id: number = 0;
    public produtoId: number = 0;
    public produto?: Produto;
    public quantidade: number = 0;
    public excluido:boolean = false;

    constructor(model?: InventarioItem){
      Object.assign(this, model);
   }
}