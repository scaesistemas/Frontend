export default class ValoresAdicionais  {
    gestao: number = 0;
    valorMPI: number = 0;
    percentualMPI: number = 0;
    valorDFI: number = 0;
    percentualDFI: number = 0;
    correcaoIndice:number = 0;
    isDFIFixo:boolean = false;
    taxaBoleto:number = 0;
    nomeTaxaAdicional:string = "";
    valorFixoTaxaAdicional:number = 0;
    isDescontoVencimentoPercentual?:boolean = true;

    constructor(model?: ValoresAdicionais){ 
        if(!model)
        return;

        this.gestao = model.gestao;
        this.valorMPI = model.valorMPI;
        this.percentualMPI = model.percentualMPI;
        this.valorDFI = model.valorDFI;
        this.percentualDFI = model.percentualDFI;
        this.correcaoIndice = model.correcaoIndice;
        this.isDFIFixo = model.isDFIFixo;
        this.taxaBoleto = model.taxaBoleto;
        this.nomeTaxaAdicional = model.nomeTaxaAdicional;
        this.valorFixoTaxaAdicional = model.valorFixoTaxaAdicional;
        this.isDescontoVencimentoPercentual = model.isDescontoVencimentoPercentual;
    } 
} 