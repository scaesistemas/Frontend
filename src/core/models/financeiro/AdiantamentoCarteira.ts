export default class AdiantamentoCarteira implements Shared.IEntity {
    public id: number = 0;
    public empresaSolicitanteId:number = 0;
    public empresaSolicitante = new EmpresaSolicitante();
    public objetivo:string  = "";
    public valor:number = 0; 
    public primeiroMesParcela:string = "";
    public quantidadeParcelas:number = 0;
    public tipoAdiantamentoCarteiraId:number = 1; 
    public situacaoAdiantamentoCarteiraId:number = 1;
    public assinanteId:number = JSON.parse(localStorage.sessionApp.split(".")).dados.assinanteId;
    public valorParcela:number = 0;
       
    constructor(model?: AdiantamentoCarteira){
        if(!model) 
        return;
    
        this.id = model.id; 
        this.empresaSolicitanteId = model.empresaSolicitanteId;
        this.empresaSolicitante = model.empresaSolicitante;
        this.objetivo = model.objetivo;
        this.valor = model.valor;
        this.primeiroMesParcela = model.primeiroMesParcela;
        this.quantidadeParcelas = model.quantidadeParcelas;
        this.tipoAdiantamentoCarteiraId = model.tipoAdiantamentoCarteiraId;
        this.situacaoAdiantamentoCarteiraId = model.situacaoAdiantamentoCarteiraId;
        this.assinanteId = model.assinanteId; 
        this.valorParcela = model.valorParcela;
    }     

     
}

class EmpresaSolicitante {
    cnpj:string = "";
    empresaId:number = 0;
    nome:string = "";
}