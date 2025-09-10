import { Unidade } from "../cadastros";
import MarcacaoAgua from "./MarcacaoAgua";

export default class Hidrometro implements Shared.IEntity {
    public id: number = 0;
    public codigo:number = 0;
    public descricao:string = "";
    public pessoaId:number = 0;
    public numeroHidrometro:string = "";
    public ativo:boolean = true;
    public contratoId?:number;
    public receitaId?:number;
    public unidades:any[] = []; /* Multiplos lotes */ 
    public marcacoes:MarcacaoAgua[] = []; /* Automatico */

    constructor(model?: Hidrometro){
        
        if(!model)
            return;

        this.id = model.id;
        this.codigo = model.codigo;
        this.descricao = model.descricao;
        this.pessoaId = model.pessoaId;
        this.numeroHidrometro = model.numeroHidrometro;
        this.ativo = model.ativo;
        this.contratoId = model.contratoId;
        this.receitaId = model.receitaId;
        this.unidades = model.unidades;
        this.marcacoes = model.marcacoes;
    }
}

class HidrometroUnidade {
    public id:number = 0;
    public hidrometroId:number = 0;
    public unidadeId:number = 0;
    public unidade = new Unidade();
}