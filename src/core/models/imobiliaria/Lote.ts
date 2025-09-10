import { ConfrontanteLote } from '.';
import { DimensaoLote, LadoAdicional, Unidade } from '../cadastros';
import { Legalizacao } from '../shared';

export default class Lote implements Shared.IEntity{
     id: number = 0;
     unidade?: Unidade;
     unidadeId: number = 0;
     confrontante: ConfrontanteLote = new ConfrontanteLote()
     dimensao: DimensaoLote = new DimensaoLote();
     legalizacao: Legalizacao = new Legalizacao();

     ladosAdicionais = [];

    constructor(model?: Lote){
        Object.assign(this, model);
    }
}