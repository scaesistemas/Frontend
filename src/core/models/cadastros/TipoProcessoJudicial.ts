export default class TipoProcessoJudicial implements Shared.IEntity{
    public id: number = 0;
    public nome: string = '';

    constructor(model?: TipoProcessoJudicial) {
        Object.assign(this, model);
    }
}