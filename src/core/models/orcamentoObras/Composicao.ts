import { UnidadeMedida } from "../geral";
import ClasseComposicao from "./ClasseComposicao";
import ComposicaoItem from "./ComposicaoItem";
import InsumoEstado from "./InsumoEstado";
import TipoComposicao from "./TipoComposicao";

export default class Composicao implements Shared.IEntity{
    public id: number = 0;
    public codigo:string ="";
    public descricao:string ="";
    public unidadeId:number = 0;
    public unidadeMedida!:UnidadeMedida;
    public classeId:number = 0;
    public classeComposicao!: ClasseComposicao;
    public tipoId:number = 0;
    public tipoComposicao!: TipoComposicao;
    public valorUnitario:number = 0;
    public itens:ComposicaoItem[] = [];
    public origemId:number = 1;
    public estado = new InsumoEstado();
    public ano: number = 0;

    public valorDesonerado:number = 0;
    public valorNaoDesonerado:number = 0;
    ///public quantidade:number = 0;
    
    constructor(model?: Composicao){
        if(!model)
        return;

        this.id = model.id; 
        this.codigo = model.codigo;
        this.descricao = model.descricao;
        this.unidadeId = model.unidadeId;
        this.unidadeMedida = model.unidadeMedida;
        this.classeId = model.classeId;
        this.tipoId = model.tipoId;
        this.valorUnitario = model.valorUnitario;
        this.itens = model.itens;
        this.origemId = model.origemId;
        this.estado = new InsumoEstado(model.estado);
        //this.valorDesonerado = model.valorDesonerado;
        this.valorNaoDesonerado = model.valorNaoDesonerado;
        this.ano = model.ano;
    }
}