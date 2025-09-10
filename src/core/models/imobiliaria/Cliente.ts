import { Endereco } from '../shared';
import TipoPessoa from './../compras/TipoPessoa';
import { Profissao, Nacionalidade, Naturalidade, EstadoCivil, Contato } from '../geral';
import { Empresa } from '../cadastros';

export default class Cliente implements Shared.IEntity{
    public clienteId:number = 0;
    public cliente?:Cliente;
    public id:number = 0;
    public empresaId: number = 1;
    public empresa?: Empresa;
    public nome: string = '';
    public fantasia: string = '';
    public tipoPessoaId: number = 0;
    public tipoPessoa?: TipoPessoa; 
    public cnpjCpf: string = '';
    public inscricaoMunicipal: string = '';
    public inscricaoEstadual: string = '';
    public endereco: Endereco = new Endereco();
    public telefone: string = '';
    public dataCadastro = new Date().toISOString().substr(0,10);
    public nomeCnpjCpf: string = '';
    public dataNascimento = new Date().toISOString().substr(0,10);
    public rg: string = '';
    public orgaoExpedido: string = '';
    public dataExpedicao = new Date().toISOString().substr(0,10);
    public profissaoId: number = 0;
    public profissao?: Profissao;
    public nacionalidadeId: number = 0;
    public nacionalidade?: Nacionalidade;
    public naturalidadeId: number = 0;
    public naturalidade?: Naturalidade;
    public rendaBruta: number = 0.00;
    public rendaLiquida: number = 0.00;
    public estadoCivilId:number = 0;
    public estadoCivil?: EstadoCivil; 
    public cpfConjuge:string = '';
    public nomeConjuge: string = '';
    public rgConjuge: string = '';
    public orgaoExpedidorConjuge: string = '';
    public dataNascimentoConjuge = new Date().toISOString().substr(0,10);

    

    public contatos: Contato[] = [];

    constructor(model?: Cliente){
        Object.assign(this, model);
        }
    

}
