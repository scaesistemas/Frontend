import Pessoa from "../Pessoa";

export default class SignatarioContratoDigital implements Shared.IEntity{
    id:number = 0;
    clienteId!:number;
    cliente!: Pessoa;
    contratoDigitalId:number = 0;
    situacaoId:number = SituacaoEmailSignatario.Pendente;
    situacao = SituacaoEmailSignatario;
    tipoAssinaturaId:number = 0;
    dFourSignKeySigner:string = "";
    email:string = "";

    constructor(model?: SignatarioContratoDigital){
        if(!model)
        return;
 
        this.id = model.id;
        this.clienteId = model.clienteId;
        this.cliente = model.cliente;
        this.contratoDigitalId = model.contratoDigitalId;
        this.situacaoId = model.situacaoId;
        this.tipoAssinaturaId = model.tipoAssinaturaId;
        this.situacao = model.situacao;
        this.email = model.email
    }
} 
 
enum SituacaoEmailSignatario  {
    Assinado = 1,
    Pendente = 2,
    NaoEnviado = 3
}