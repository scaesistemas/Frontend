import { Endereco } from '../shared';
import { TipoPessoa } from '../compras';
import SeguradoraContato from './SeguradoraContato';

export default class Seguradora implements Shared.IEntity{

    public id:number = 0;
    public empresaId:number =1;
    public nome: string = '';
    public fantasia: string = '';
    public tipoPessoaId: number = 0;
    public tipoPessoa?: TipoPessoa; 
    public cnpjCpf: string = '';
    public inscricaoMunicipal: string = '';
    public inscricaoEstadual: string = '';
    public susep: string = ''; 
    public codigoSeguradora: string = ''; 
    public endereco: Endereco = new Endereco();
    public contatos: SeguradoraContato[] = [];

    constructor(model?: Seguradora){
        Object.assign(this, model);
    } 
}