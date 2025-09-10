import Pessoa from '../cadastros/Pessoa';
import Lote  from './Lote';

export default class Lote_Proprietario implements Shared.IEntity{

    public id:number = 0;
    public loteId:number = 0;
    public lote?: Lote;
    public proprietarioId:number = 0;
    public proprietario?: Pessoa;
    public participacao:number = 0.00;
    public observacao:string = '';

}