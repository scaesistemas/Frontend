import Pessoa from '../cadastros/Pessoa';
import { Imovel } from '.';

export default class ImovelProprietario implements Shared.IEntity{
    public id: number = 0;
    public proprietarioId: number = 0;
    public proprietario?: Pessoa;
    public imovelId: number = 0;
    public imovel?: Imovel;
    public participacao: number = 0;
}