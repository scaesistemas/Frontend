import { Endereco } from "../shared";

export default class EmpresaResponsavel{

    public cpf: string =''; 
    public nome:string ='';
    public telefone:string ='';
    public dataNascimento?:string;
    public email:string ='';
    public endereco:Endereco = new Endereco();
    public telefoneLimpo:string ='';
    public cpfLimpo:string ='';
    public sobrenome:string ='';
    public nomeCompleto:string ='';
    public codigoCategoriaComerciante: number = 0;
    public categoriaComerciante:string='';
    public codigoZoop:string ='';
    public nomeDaMae:string = "";
}