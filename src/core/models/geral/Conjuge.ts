import Qualificacao from "./Qualificacao";

export default class Conjuge {
    public cpf: string = "";
    public nome: string = "";
    public rg: string = "";
    public orgaoExpedidor: string = "";
    public dataNascimento = new Date().toISOString().substr(0, 10);
    public dataEmissaoRg = new Date().toISOString().substr(0, 10);
    public telefone:string = "";
    public nomePai:string = "";
    public nomeMae:string = "";
    public qualificacao = new Qualificacao();
    public rendaBruta:number = 0;
    public sexoId?:number;

        constructor(model?: Conjuge){
            if(!model)
            return;

        this.cpf = model.cpf;
        this.nome = model.nome;
        this.rg = model.rg;
        this.orgaoExpedidor = model.orgaoExpedidor;
        this.dataNascimento = new Date(model.dataNascimento).toISOString().substr(0, 10);
        this.dataEmissaoRg = new Date(model.dataEmissaoRg).toISOString().substr(0, 10);
        this.telefone = model.telefone;
        this.nomePai = model.nomePai;
        this.nomeMae = model.nomeMae;
        this.qualificacao = model.qualificacao;
        this.rendaBruta = model.rendaBruta;
        this.sexoId = model.sexoId;
    }
}