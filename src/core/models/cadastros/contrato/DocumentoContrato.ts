 import Contrato from './Contrato';

export default class DocumentoContrato  implements Shared.IEntity{
    public contratoId!: number;
    public contrato?: Contrato;

    public id!: number;
    public nome: string = '';
    public tamanho: number = 0;
    public dataEmissao:string = '';
    public dados: string = '';
    public tipo: string = '';
    public descricao: string = '';
    public usuarioId!:number;
}