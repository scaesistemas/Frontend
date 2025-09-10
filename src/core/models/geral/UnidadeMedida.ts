import { Empresa } from '../cadastros';

export default class UnidadeMedida{
    public id: number = 0;
    public empresaId: number = 0;
    public empresa?: Empresa;
    public nome: string = '';
    public sigla: string = '';
}