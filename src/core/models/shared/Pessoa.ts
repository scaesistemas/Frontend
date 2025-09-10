export default class Pessoa implements Shared.IEntity{
    public id:number = 0;
    public nome:string = "";
    public nomeCnpjCpf:string = "";
    public email:string ="";
    public telefone:string ="";
    public isCliente:boolean = false;
    public isFornecedor:boolean = false;
    public isProprietario:boolean = false;
    public isCorretor:boolean = false;
    public IsSeguradora:boolean = false;
} 