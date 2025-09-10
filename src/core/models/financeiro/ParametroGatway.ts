import ContaCorrenteSplit from "./ContaCorrenteSplit";
import Encargo from "./Encargo";
import TipoGateway from "./TipoGateway";

export default class ParametroGatway implements Shared.IEntity {
    public id: number = 0;
    public tipoId:number = 0;
    public tipo?: TipoGateway;
    public encargoFinanceiro = new Encargo();
    public instrucao1:string = "";
    public instrucao2:string = ""; 
    public instrucao3:string = "";
    public principal:boolean = false;
    public contaPay = new GatewayContaPay();
    public galaxPay = new GatewayGalaxPay();
    public globalPay = new GatewayGlobalPay();
    public safra = new GatewaySafra();
    public asaas = new GatewayAsaas();
    public contasCorrentesSplit: ContaCorrenteSplit[] = [];
}  

class GatewayAsaas {
    public accessToken:string = ""; 
}

class GatewayContaPay {
    public email:string = ""; 
    public accessToken:string = ""; 
}

 
class GatewayGalaxPay {
    public id:string = "";
    public hash:string = ""; 
    public isSubcontaAtiva:boolean = false; 
    public isSubconta:boolean = false; 
    public documentosEnviados: boolean = false;
}
class GatewayGlobalPay {
    public email:string = "";
    public senha:string = ""; 
    public isSubcontaAtiva:boolean = false; 
    public isSubconta:boolean = false; 
    public documentosEnviados: boolean = false;
}

class GatewaySafra {
    public clientId:string = "";
    public usuario:string = "";
    public senha:string = "";
    public agencia:string = "";
    public conta:string = "";
    public contaSemDigito:string ="";
    public agenciaSemDigito:string = "";
    public digitoConta:string = "";
    public nossoNumeroInicial:string ="";
}
