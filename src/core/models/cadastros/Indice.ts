import { TipoIndice } from '.';
export default class Indice implements Shared.IEntity{

    id:number = 0;
    tipoIndiceId:number = 0;
    tipoIndice!: TipoIndice;
    mes:number = 1;
    ano = new Date().getFullYear();
    percentual:number = 0;
    mensal:number = 0;
    acumulado:number = 0; 
    total:number = 0;
    dia:number = 1;
    aplicarIndiceNegativo:boolean = false;
    avulsoMensal:number = 0;
    totalMensal:number = 0;
  
    constructor(model?: Indice){
        if(!model)
        return;

        this.id = model.id;
        this.tipoIndiceId = model.tipoIndiceId;
        this.mes = model.mes;
        this.ano = model.ano;
        this.percentual = model.percentual;
        this.mensal = model.mensal;
        this.acumulado = model.acumulado;
        this.total = model.total;
        this.dia = model.dia;
        this.aplicarIndiceNegativo = model.aplicarIndiceNegativo;
        this.avulsoMensal = model.avulsoMensal;
        this.totalMensal = model.totalMensal;
    }
}  