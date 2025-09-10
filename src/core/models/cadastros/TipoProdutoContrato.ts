
export default class TipoProdutoContrato implements Shared.IEntity{
    public id!: number;
    public nome!: string;
  
    constructor(model?: TipoProdutoContrato) {
        Object.assign(this, model);
    }
} 