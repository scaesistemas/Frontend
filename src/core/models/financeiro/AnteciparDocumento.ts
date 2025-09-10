export default class AnteciparDocumento {
    public clienteNome:string = '';
    public clienteCPF: string = '';
    public protocolo:string = '';
    public numeroSequenciaContrato:string = '';  
    public loteNome:string = '';  
    public quadraNome:string = '';  
    public empreendimentoNome:string = '';  
    public usuarioNome:string = '';  
    public dataEmissao:string = '';  
    public contratoEmpresaNome:string = ''; 
    public cnpjContratoEmpresa:string = '';  
    public valorTotalParcela:number = 0; 
    public totalEncargos:number = 0;
    public valorTotalPago:number = 0;
    public totalDescontoAntecipacaoQuitacao:number=0;
    public parcelas:AnteciparParcelas[] = [];
    public valorEntrada:number = 0;
}  

class AnteciparParcelas {
    public parcelaNumero:number = 0;
    public quantidadeParcelas:number = 0;
    public dataVencimento:string = "";
    public dataPagamento:string = "";
    public diasAtraso:number = 0;
    //public valorParcela:number = 0;
    public encargos:number = 0;
    public descontoAntecipacaoQuitacao:number = 0;
    public valorPago:number = 0;
    public saldoParcela:number = 0;
}   