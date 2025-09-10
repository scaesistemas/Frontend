import { TipoPessoa, Orcamento } from '../compras';
import { Endereco } from '../shared';
import {Qualificacao, Conjuge, Bancario, Contato, Sexo} from '@/core/models/geral/index';
import { EmpreendimentoPessoa, Empresa, PessoaFamiliar } from '.';

export default class Pessoa implements Shared.IEntity {
    public id: number = 0;
    public empresaId?: number =1;  
    public empresa?: Empresa; 
    public nome: string = '';
    public fantasia: string = "";
    public tipoPessoaId?: number = 1; 
    public tipoPessoa?: TipoPessoa; 
    public cnpjCpf: string = '';
    public inscricaoMunicipal: string = ''; 
    public inscricaoEstadual: string = ''; 
    public endereco: Endereco = new Endereco();
    public telefone: string = '';
    public email: string = '';
    public dataCadastro = new Date().toISOString().substr(0, 10);
    public dataNascimento = new Date().toISOString().substr(0, 10);
    public nomeCnpjCpf: string = '';
    public rg: string = '';
    public orgaoExpedido: string = '';
    public dataExpedicao?: string;
    public qualificacao = new Qualificacao();
    public conjuge: Conjuge = new Conjuge();
    public contatos: Contato[]  = [];
    public bancario: Bancario = new Bancario();
    public isCliente: boolean = true;
    public isFornecedor: boolean = false;
    public isProprietario: boolean = false;
    public isCorretor: boolean = false;
    public isSeguradora: boolean = false;
    public isAdministradora: boolean = false;
    public isConstrutora: boolean = false;
    public isTransportadora: boolean = false;
    public susep: string = '';
    public sexoId: number = 1;
    public sexo?: Sexo;
    public documentos: any[] = [];
    public cliente!: Pessoa;
    public corretor !: Pessoa;
    public familiares:PessoaFamiliar[] = [];
    public cpfCnpjLimpo:string = "";
    public familiarProblemaCronico:number = 0;
    public beneficioGov:boolean = false;
    public idososFamilia:number = 0;
    public creci:string = "";
    public juridicaResponsavel = new PessoaJuridicaResponsavel();
    public telefone2:string = "";
    public empreendimentosPessoas:EmpreendimentoPessoa[] = [];
    
    constructor(model?: Pessoa){
        if(!model)
        return;

        this.id = model.id;
        this.empresaId = model.empresaId;   
        this.nome = model.nome;
        this.fantasia = model.fantasia;
        this.tipoPessoaId = model.tipoPessoaId; 
        this.cnpjCpf = model.cnpjCpf;
        this.inscricaoMunicipal = model.inscricaoMunicipal;
        this.inscricaoEstadual = model.inscricaoEstadual; 
        this.endereco = model.endereco;
        this.telefone = model.telefone;
        this.email = model.email;
        this.dataCadastro = new Date(model.dataCadastro).toISOString().substr(0, 10);
        this.dataNascimento = new Date(model.dataNascimento).toISOString().substr(0, 10);
        this.nomeCnpjCpf = model.nomeCnpjCpf;
        this.rg = model.rg;
        this.orgaoExpedido = model.orgaoExpedido
        this.dataExpedicao = model.dataExpedicao;
        this.qualificacao = model.qualificacao;
        this.conjuge = new Conjuge(model.conjuge);
        this.contatos = model.contatos
        this.bancario = model.bancario;
        this.isCliente = model.isCliente;
        this.isFornecedor = model.isFornecedor;
        this.isProprietario = model.isProprietario;
        this.isCorretor = model.isCorretor;
        this.isSeguradora = model.isSeguradora;
        this.isAdministradora = model.isAdministradora;
        this.isConstrutora = model.isConstrutora;
        this.isTransportadora = model.isTransportadora;
        this.susep = model.susep;
        this.sexoId = model.sexoId;
        this.documentos = model.documentos;
        this.familiares = model.familiares;
        this.cpfCnpjLimpo = model.cpfCnpjLimpo;
        this.familiarProblemaCronico = model.familiarProblemaCronico;
        this.beneficioGov = model.beneficioGov;
        this.idososFamilia = model.idososFamilia;
        this.juridicaResponsavel = new PessoaJuridicaResponsavel(model.juridicaResponsavel);
        this.creci = model.creci;
        this.telefone2 = model.telefone2;
        this.empreendimentosPessoas = model.empreendimentosPessoas;
    }
}
 
class PessoaJuridicaResponsavel {
    public nome:string = "";
    public cnpjCpf:string = "";
    public rg:string = "";
    public orgaoExpedido:string = "";
    public dataExpedicao:string = "";
    public sexoId?:number;
    public qualificacao = new Qualificacao();
    public endereco = new Endereco();

    public email:string = "";
    public dataNascimento:string = ""
    public telefone:string = "";
    

    constructor(model?: PessoaJuridicaResponsavel){
        if(!model)
        return;

        this.nome = model.nome;
        this.cnpjCpf = model.cnpjCpf;
        this.rg = model.rg;
        this.orgaoExpedido = model.orgaoExpedido;
        this.dataExpedicao = model.dataExpedicao;
        this.sexoId = model.sexoId;
        this.qualificacao = model.qualificacao;
        this.endereco = model.endereco;
        this.email = model.email;
        this.telefone = model.telefone;
        this.dataNascimento = model.dataNascimento;
    }
}