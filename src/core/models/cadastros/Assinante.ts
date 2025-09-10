import { AssinanteContato, AssinanteDominio, EmpresaResponsavel } from ".";
import { Endereco } from "../shared";

 export default class Assinante implements Shared.IEntity{
    public id:number = 0;
    public pessoaJuridica:boolean = false;
    public cpfCnpj:string ="";
    public nome:string ="";
    public nomeFantasia:string = ""; 
    public inscricaoEstadual:string ="";
    public inscricaoMunicipal:string=""; 
    public dataCriacao = new Date();
    public endereco:Endereco = new Endereco();
    public telefone1:string ="";
    public telefone2:string =""; 
    public email:string ="";  
    public ativo: boolean = false;
    public cpfCnpjLimpo: string ="";
    public cpfCnpjNome:string ="";
    public telefoneNome:string =""; 
    public contatos = [] as AssinanteContato [];    
    public dominios = [] as AssinanteDominio [];
    public subDominio: string ="";
    public dFourSignSafeId:string = "";

    public responsavel: EmpresaResponsavel = new EmpresaResponsavel();
     /*constructor(model?: Assinante) {
        Object.assign(this, model);
    }*/
    constructor(model?: Assinante){
        if(!model)
        return;

        this.id = model.id;
        this.pessoaJuridica = model.pessoaJuridica;
        this.cpfCnpj = model.cpfCnpj;
        this.nome = model.nome;
        this.nomeFantasia = model.nomeFantasia;
        this.inscricaoEstadual = model.inscricaoEstadual;
        this.inscricaoMunicipal = model.inscricaoMunicipal;
        this.dataCriacao = model.dataCriacao;
        this.endereco = model.endereco;
        this.telefone1 = model.telefone1;
        this.telefone2 = model.telefone2;
        this.email = model.email;
        this.ativo = model.ativo;
        this.cpfCnpjLimpo = model.cpfCnpjLimpo;
        this.cpfCnpjNome = model.cpfCnpjNome;
        this.telefoneNome = model.telefoneNome;
        this.contatos = model.contatos;
        this.dominios = model.dominios;
        this.subDominio = model.subDominio;
        this.dFourSignSafeId = model.dFourSignSafeId;
        this.responsavel = model.responsavel;
    }
} 
 