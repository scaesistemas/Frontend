export default class PessoaFamiliar implements Shared.IEntity{
    id:number = 0;
    pessoaId!:number;
    grauParentescoId = 25;
    cpf:string = "";
    nome:string = "";
    rg:string = "";
    orgaoExpedidor:string = "";
    rendaBruta:number = 0;
    rendaLiquida:number = 0;
    dataNascimento:string = ""; 
    profissaoId:number = 0;
    escolaridadeId:number = 0;
    dependente:boolean = false;

    constructor(model?: PessoaFamiliar) {
        Object.assign(this, model);
    }
}  