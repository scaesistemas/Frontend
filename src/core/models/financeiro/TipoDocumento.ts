import { Empresa } from '../cadastros';

export default class TipoDocumento implements Shared.IEntity {

    public empresaId:number = 1;
    public emprsa?: Empresa;
    public id: number = 0;
    public nome: string = '';

}