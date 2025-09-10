import { CentroCusto, ContaGerencial, ParametroCRMVendas, ValoresAdicionais } from ".";
import { Empresa } from "../cadastros";
import ParametroCobranca from "./ParametroCobranca";
import ParametroGatway from "./ParametroGatway";

export default class ParametroFinanceiro implements Shared.IEntity {
    id: number = 0;
    empresaId: number = 0;
    empresa!:Empresa;    
    centroCustoReceitalId:number = 0;  
    centroCustoReceita!: CentroCusto;  
    contaGerenciaReceitalId:number = 0;
    contaGerencialReceita!: ContaGerencial;
    jurosAditamento:number = 0;
    descontoAditamento:number = 0; 
    gatways:ParametroGatway[] = [];  
    cobrancas:ParametroCobranca[] = [];
    jurosAmortizacao:number = 0;
    tipoAmortizacaoId:number = 1;
    valoresAdicionaisParcela = new ValoresAdicionais();
    parametroCRMVendas  = new ParametroCRMVendas();
    parametroControleAgua = new ParametroControleAgua();
    desmarcarBoletosCobrancasAutomaticas = false;
    
    constructor(model?: ParametroFinanceiro){
        if(!model)
        return;
    
        this.id = model.id;
        this.empresaId = model.empresaId;
        this.empresa = model.empresa;
        this.centroCustoReceitalId = model.centroCustoReceitalId;
        this.centroCustoReceita = model.centroCustoReceita;
        this.contaGerenciaReceitalId = model.contaGerenciaReceitalId;
        this.contaGerencialReceita = model.contaGerencialReceita;
        this.jurosAditamento = model.jurosAditamento;
        this.descontoAditamento = model.descontoAditamento;
        this.gatways = model.gatways;
        this.cobrancas = model.cobrancas;
        this.jurosAmortizacao = model.jurosAmortizacao;
        this.tipoAmortizacaoId = model.tipoAmortizacaoId;
        this.valoresAdicionaisParcela = model.valoresAdicionaisParcela  == null ?  new ValoresAdicionais(model.valoresAdicionaisParcela) : model.valoresAdicionaisParcela;
        this.parametroCRMVendas = model.parametroCRMVendas == null ? new ParametroCRMVendas(model.parametroCRMVendas) : model.parametroCRMVendas; 
        this.parametroControleAgua = model.parametroControleAgua;
        this.desmarcarBoletosCobrancasAutomaticas = model.desmarcarBoletosCobrancasAutomaticas;
    }
} 

class ParametroControleAgua {
   public centroCustoControleAguaId!:number;
   public contaGerencialControleAguaId!:number;
   public empresaPadraoBoletoAgua:boolean = false;
   public contaCorrenteId!:number;
   public tipoGatewayId!:number;
   public tipoOperacaoId!:number;
}