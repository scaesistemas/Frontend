import { Documento } from "../geral";

export default class Remessa implements Shared.IEntity {
    public id: number = 0;
    public nome: string = "";
    public numeroSequencia:number = 0;
    public contaCorrenteId:number = 0;
    public dataCriacao = new Date().yyyymmdd();
    public documento!: Documento;
    public tipoId:number = 0;
    public isProcessado:boolean = false; 
    public transacoes = [];
    public tipoCnab:number = 0;
 
    constructor(model?: Remessa){
        
        if(!model) 
            return;

        this.id = model.id;
        this.nome = model.nome;
        this.numeroSequencia = model.numeroSequencia;
        this.contaCorrenteId = model.contaCorrenteId;
        this.dataCriacao = model.dataCriacao;
        this.documento = model.documento;
        this.tipoId = model.tipoId;
        this.isProcessado = model.isProcessado;
        this.transacoes = model.transacoes;
        this.tipoCnab = model.tipoCnab;
    }
} 