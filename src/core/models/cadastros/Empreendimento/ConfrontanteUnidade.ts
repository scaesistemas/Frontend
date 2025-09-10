export default class ConfrontanteUnidade{
    public frenteNome: string = "";
    public frente: number = 0;
    public fundoNome:string = "";
    public fundo: number = 0;
    public ladoEsquerdoNome: string = "";
    public ladoEsquerdo: number = 0;
    public ladoDireitoNome:string = "";
    public ladoDireito:number = 0;

    constructor(model?: ConfrontanteUnidade){
        if(!model)
        return;

        this.frenteNome = model.frenteNome;
        this.frente = model.frente;
        this.fundoNome = model.fundoNome;
        this.fundo = model.fundo;
        this.ladoEsquerdoNome = model.ladoEsquerdoNome;
        this.ladoEsquerdo = model.ladoEsquerdo;
        this.ladoDireitoNome = model.ladoDireitoNome;
        this.ladoDireito = model.ladoDireito;
    }
} 