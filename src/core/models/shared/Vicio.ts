import { Empresa, TipoUnidade, Unidade } from '../cadastros';

export default class Vicio implements Shared.IEntity{
    public id: number = 0;
    public empresaId: number = 0;
    public empresa!: Empresa;
    public nome: string = '';
    public tipoUnidadeId: number = 0;
    public tipoUnidade!: TipoUnidade;

}