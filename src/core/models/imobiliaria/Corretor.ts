import { Endereco } from '../shared';
import TipoPessoa from './../compras/TipoPessoa';
import { Contato } from '../geral';

export default class Corretor implements Shared.IEntity {

    public id: number = 0;
    public empresaId: number = 1;
    public nome: string = '';
    public fantasia: string = '';
    public tipoPessoaId: number = 0;
    public tipoPessoa?: TipoPessoa;
    public cnpjCpf: string = '';
    public endereco: Endereco = new Endereco();
    public telefone1: string = '';
    public telefone2: string = '';
    public dataCadastro = new Date().toISOString().substr(0, 10);
    public nomeCnpjCpf: string = '';
    public dataNascimento = new Date().toISOString().substr(0, 10);
    public rg: string = '';
    public orgaoExpedido: string = '';
    public dataExpedicao = new Date().toISOString().substr(0, 10);
    public banco: string = '';
    public agencia: string = '';
    public agenciaDigito: string = '';
    public conta: string = '';
    public contaDigito: string = '';

    public contatos: Contato[] = [];

    constructor(model?: Corretor) {
        Object.assign(this, model);
    }


}