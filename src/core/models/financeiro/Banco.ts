import { Empresa } from '../cadastros';

export default class Banco implements Shared.IEntity {
    public id: number = 0;
    public empresaId: number=1;
    public empresa?:Empresa;
    public codigo: number = 0;
    public nome: string = '';
    public site: string = '';
} 