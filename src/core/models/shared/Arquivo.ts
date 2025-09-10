export default class Arquivo{
    nome: string = "";
    tamanho:Number = 0;
    tipo: string = "";
    dados?: string = "";
    dataEmissao: Date = new Date();

    constructor(model?: Arquivo){
        if(!model)
        return;

        this.nome = model.nome,
        this.tamanho = model.tamanho,
        this.tipo = model.tipo,
        this.dados = model.dados,
        this.dataEmissao = model.dataEmissao
    }
}