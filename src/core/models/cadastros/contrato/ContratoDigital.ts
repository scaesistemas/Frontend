import Contrato from "./Contrato";
import SignatarioContratoDigital from "./SignatarioContratoDigital";
 
export default class ContratoDigital implements Shared.IEntity {
    id:number = 0;
    nome:string =""; 
    tipoContratoDigital?: TipoContratoDigital;
    tipoId:number = 0;
    conteudoEditavel:string =''; 
    documento!:string; 
    situacaoId:number = SituacaoContratoDigital.EnvioPendente;
    codigoIntegracao:string = "";
    contrato?:Contrato; 
    contratoId:number = 0;
    signatarios:SignatarioContratoDigital[] = [];  
    dFourSignDocumentId:string = "";
    dataEmissao = new Date().yyyymmdd();
     
    constructor(model?: ContratoDigital){
        if(!model)
        return;

        this.id = model.id;
        this.nome = model.nome;
        this.tipoId = model.tipoId;
        this.conteudoEditavel = model.conteudoEditavel;
        this.documento = model.documento;
        this.situacaoId = model.situacaoId;
        this.codigoIntegracao = model.codigoIntegracao;
        this.contratoId = model.contratoId;
        this.signatarios = model.signatarios;
        this.dFourSignDocumentId = model.dFourSignDocumentId;
        this.dataEmissao = model.dataEmissao;
    }
}  

enum TipoContratoDigital{
    CompraEVenda = 1,
    Aditivos = 2,
    DocumentosComplementares = 3,
}

enum TipoAssinatura {
    Parte = 1,
    Testemunha = 2,
    Avalista = 3,
}

enum SituacaoContratoDigital  {
    EnvioPendente = 1,
    AguardandoSignatarios = 2,
    AguardandoAssinaturas = 3,
    Finalizado = 4,
    Arquivado = 5,
    Cancelado = 6,
    Editando = 7,
    Processando = 8
}
