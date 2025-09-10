import { Empresa } from '../cadastros';

export default class CentroCusto implements Shared.IEntity{
    public id: number = 0;
    public key: number = 0;
    public empresaId:number = 1;
    public empresa?:Empresa;
    public codigo: string = '';
    public nome: string = '';
    public codigoDescricao: string = ''; 
    public centroCustoPaiId!: number;
    public ativo: boolean = true;
    children:[]=[];
}