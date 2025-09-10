import { Empresa } from '../cadastros';

export default class ContaGerencial implements Shared.IEntity {
    public id: number = 0;
    public key: number = 0;
    public empresaId:number =1;
    public empresa?:Empresa;
    public codigo: string = '2';
    public nome: string = '';
    public codigoDescricao: string = '';
    public tipo: string = 'A';
    public contaGerencialPaiId: number = 1;
    public ativo: boolean = true;
    children:[]=[]; 
}  