import InsumoEstadoValor from "./InsumoEstadoValor";

export default class InsumoEstado {
    public acre = new InsumoEstadoValor();
    public alagoas = new InsumoEstadoValor();
    public amapa = new InsumoEstadoValor();
    public amazonas = new InsumoEstadoValor();
    public bahia = new InsumoEstadoValor();
    public ceara = new InsumoEstadoValor();
    public espiritoSanto = new InsumoEstadoValor();
    public goias = new InsumoEstadoValor();
    public maranhao = new InsumoEstadoValor();
    public matoGrosso = new InsumoEstadoValor();
    public matoGrossoDoSul = new InsumoEstadoValor();
    public minasGerais = new InsumoEstadoValor();
    public para = new InsumoEstadoValor();
    public paraiba = new InsumoEstadoValor();
    public parana = new InsumoEstadoValor();
    public pernambuco = new InsumoEstadoValor();
    public piaui = new InsumoEstadoValor();
    public rioDeJaneiro = new InsumoEstadoValor();
    public rioGrandeDoNorte = new InsumoEstadoValor();
    public rioGrandeDoSul = new InsumoEstadoValor();
    public rondonia = new InsumoEstadoValor();
    public roraima = new InsumoEstadoValor();
    public santaCatarina = new InsumoEstadoValor();
    public saoPaulo = new InsumoEstadoValor();
    public sergipe = new InsumoEstadoValor();
    public tocantins = new InsumoEstadoValor();
    public distritoFederal = new InsumoEstadoValor();
    public estadoId:number = 0;

    constructor(model?: InsumoEstado){
        if(!model)
        return;
    
        this.acre =  new InsumoEstadoValor(model.acre);
        this.alagoas = new InsumoEstadoValor(model.alagoas);
        this.amapa = new InsumoEstadoValor(model.amapa);
        this.amazonas = new InsumoEstadoValor(model.amazonas);
        this.bahia = new InsumoEstadoValor(model.bahia);
        this.ceara = new InsumoEstadoValor(model.ceara);
        this.espiritoSanto = new InsumoEstadoValor(model.espiritoSanto);
        this.goias = new InsumoEstadoValor(model.goias);
        this.maranhao = new InsumoEstadoValor(model.goias);
        this.matoGrosso = new InsumoEstadoValor(model.matoGrosso); 
        this.matoGrossoDoSul = new InsumoEstadoValor(model.matoGrossoDoSul);
        this.minasGerais = new InsumoEstadoValor(model.minasGerais);
        this.para = new InsumoEstadoValor(model.para);
        this.paraiba = new InsumoEstadoValor(model.paraiba);
        this.parana = new InsumoEstadoValor(model.parana);
        this.pernambuco = new InsumoEstadoValor(model.pernambuco);
        this.piaui = new InsumoEstadoValor(model.piaui);
        this.rioDeJaneiro = new InsumoEstadoValor(model.rioDeJaneiro);
        this.rioGrandeDoNorte = new InsumoEstadoValor(model.rioGrandeDoNorte);
        this.rioGrandeDoSul = new InsumoEstadoValor(model.rioGrandeDoSul);
        this.rondonia = new InsumoEstadoValor(model.rondonia);
        this.roraima = new InsumoEstadoValor(model.roraima);
        this.santaCatarina = new InsumoEstadoValor(model.santaCatarina);
        this.saoPaulo = new InsumoEstadoValor(model.saoPaulo);
        this.sergipe = new InsumoEstadoValor(model.sergipe);
        this.tocantins = new InsumoEstadoValor(model.tocantins);
        this.distritoFederal = new InsumoEstadoValor(model.distritoFederal);
        this.estadoId = model.estadoId;
     }
}