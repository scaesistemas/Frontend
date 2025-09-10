import { EncargosFinanceiros } from "../cadastros";
import Banco from "./Banco";
import CertificadoBanco from "./CertificadoBanco";

 
export default class ContaCorrente implements Shared.IEntity {
    public id: number = 0;
    public empresaId: number = 0;
    public nome: string = '';
    public geraBoleto: boolean = false;
    public bancoId: number = 0;
    public banco?: Banco;
    public numeroAgencia: string = '';
    public digitoAgencia: string = '';
    public agenciaNumeroDigito: string = '';
    public numeroConta: string = '';
    public digitoConta: string = ''; 
    public contaNumeroDigito: string = '';
    public carteira: string = '';
    public saldoInicial: number = 0.00;
    public clienteDesde: string = '';
    public naoReceberDias: number = 0;
    public boletoSequencia: number = 0;
    public remessaSequencia: number = 0; 
    public jurosDia: number = 0.00;
    public multaMes: number = 0.00;
    public desconto: number = 0.00;
    public diasDesconto: number = 0;
    public descontoQuitacao: number = 0.00;
    public descontoQuitacaoLimite: number = 0.00;
    public descontoQuitacaoConcedido: number = 0.00;
    public descontoAntecipacao: number = 0.00;
    public descontoAntecipacaoLimite: number = 0.00;
    public formaPagamentoId: number = 0;
    public instrucao1: string = '';
    public instrucao2: string = '';
    public instrucao3: string = '';
    public gerarInstrucoes: boolean = true;

    public isPoupanca:boolean = false;
    public codigoZoop:string = "";
    public codigoTokenZoop:string ="";
    public codigoAssociacaoZoop:string = "";

    public digitoCarteira:string = "";
    public codigoCedente: string = '';
    public digitoCedente: string = '';

    public nomeCertificado: string = "";
    public senhaCertificado: string = "";
    public certificados:CertificadoBanco[] = [];
    public clientId: string = "";
    public clientSecret: string = "";
    public tokenAcesso: string = "";
    public posto: string ="";
    public codWorkerSpace: string ="";
    public dataUploadCertificado:string = "";
    public saldo:number = 0;
    public encargoFinanceiro = new EncargosFinanceiros();
}