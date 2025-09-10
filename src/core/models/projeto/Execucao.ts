import { ExecucaoUnidade } from ".";
import ExecucaoDocumento from "./ExecucaoDocumento";

export default class Execucao implements Shared.IEntity{

    id: number = 0;
    contratoItemId: number = 0;
    medicaoId: number = 0;
    data = new Date().yyyymmdd();
    quantidade: number = 0;
    valorUnitario: number = 0;
    total: number = 0;
    responsavelId: number = 0;
    observacao: string = '';  
    unidades: ExecucaoUnidade [] = []
    documentos: ExecucaoDocumento [] = []
   

    constructor(model?: Execucao){
        if(!model)
        return;

        this.id = model.id;
        this.contratoItemId = model.contratoItemId;
        this.medicaoId = model.medicaoId;
        this.data = new Date(model.data).yyyymmdd();;
        this.quantidade = model.quantidade;
        this.valorUnitario = model.valorUnitario;
        this.total = model.total;
        this.responsavelId = model.responsavelId;
        this.observacao = model.observacao;
        this.unidades = model.unidades;
        this.documentos = model.documentos;
    }
}

