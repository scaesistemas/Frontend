export default class TipoOperacaoContrato implements Shared.IEntity{
    public id!: number;
    public nome!: string;

    constructor(model?: TipoOperacaoContrato) {
        Object.assign(this, model);
    }
}