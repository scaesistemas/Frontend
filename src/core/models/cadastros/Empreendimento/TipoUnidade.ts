export default class TipoUnidade implements Shared.IEntity{
    public id: number = 0;
    public nome: string = '';

    constructor(model?: TipoUnidade){
        Object.assign(this, model);
    }
}