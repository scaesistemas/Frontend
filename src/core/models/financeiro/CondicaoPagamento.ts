import { Empresa } from '../cadastros';

export default class CondicaoPagamento implements Shared.IEntity{
    public id: number = 0;
    public empresaId: number = 1;
    public empresa!: Empresa;
    public nome: string = '';
    public parcelas: number = 0;
    public intervalo: number = 0;
} 