import { Despesa } from "../financeiro";
import { Execucao } from ".";

export default class Medicao implements Shared.IEntity{


    id: number = 0;
    contratoFornecedorId: number = 0
    despesa?: Despesa;
    despesaId!: number;
    data = new Date().yyyymmdd();
    execucoes: Execucao [] = []


    constructor(model?: Medicao){
        if(!model)
        return;

        this.id = model.id;
        this.contratoFornecedorId = model.contratoFornecedorId;
        this.despesa = model.despesa;
        this.despesaId = model.despesaId;
        this.data = new Date(model.data).yyyymmdd();
        this.execucoes = model.execucoes;
    }
}