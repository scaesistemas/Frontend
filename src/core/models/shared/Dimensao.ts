export default class Dimensao{
    frente:number = 0;
    fundo: number = 0;
    ladoEsquerdo: number = 0;
    ladoDireito: number = 0;
    curva: number = 0; 
    areaTotal: number =0;

    constructor(model?: Dimensao){
        if(!model)
        return;

        this.frente = model.frente;
        this.fundo = model.fundo;
        this.ladoEsquerdo = model.ladoEsquerdo;
        this.ladoDireito = model.ladoDireito;
        this.curva = model.curva; 
        this.areaTotal = model.areaTotal;
    }
}