import { Imovel } from '.';

export default class Foto implements Shared.IEntity{
    public id: number = 0;
    public imovel?: Imovel;
    public imovelId: number = 0;
    public descricao: string = '';
    public nome: string = '';
    public tamanho: number = 0;
    public tipo: string = '';
    public dados: any = '';
}