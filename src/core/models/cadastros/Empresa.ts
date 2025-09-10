import EmpresaDocumento from '../geral/EmpresaDocumento';
import { Endereco } from '../shared';
import Arquivo from '../shared/Arquivo';
import EmpresaResponsavel from './EmpresaResponsavel';

export default class Empresa implements Shared.IEntity {
 
    public nomeFantasia: string = '';
    public id: number = 0;
    public pessoaJuridica: boolean = true;
    public cnpj: string = '';
    public razaoSocial: string = '';
    public fantasia: string  = '';
    public inscricaoMunicipal: string = '';
    public inscricaoEstadual: string = ''; 
    public cpfCnpj:string ='';
    public endereco: Endereco = new Endereco();
    public logo:any = "";
    public tipoEmpresaId:number = 0;
    public rendaMensal:number = 0;
    public selfieResponsavel?: Arquivo = new Arquivo();
    public contratoSocialLtda?: Arquivo = new Arquivo();
    public fotoDocumentoResponsavel?: Arquivo = new Arquivo();
    public versoDocumentoResponsavel?: Arquivo = new Arquivo();
    public tipoDocumentoResponsavel:string = "";
    public siteDaEmpresa:string = "";

    public telefone1: string = ''; 
    public telefone2: string = '';
    public nome: string = '';
    public email: string = '';
    public email2: string = '';  
    public site: string = '';
    public nomeContato: string = '';
    public responsavel: EmpresaResponsavel = new EmpresaResponsavel();
    public documento:EmpresaDocumento = new EmpresaDocumento();
    public documentos = [];
    public gerarZoop:boolean = false;
    public gerarHokma:boolean = false;
    responsavelSelecionado = null
        
    constructor(model?: Empresa) {
        Object.assign(this, model);
    }
} 