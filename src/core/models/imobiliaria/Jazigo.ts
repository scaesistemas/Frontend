import { Unidade } from '../cadastros';

export default class Jazigo implements Shared.IEntity{
    public id: number = 0;
    public unidadeId: number = 0;
    public unidade?: Unidade;

    constructor(model?: Jazigo){
        Object.assign(this, model);
    }
}