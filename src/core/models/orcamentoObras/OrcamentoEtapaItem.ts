import Composicao from "./Composicao";
import OrcamentoEtapa from "./OrcamentoEtapa";

export default class OrcamentoEtapaItem implements Shared.IEntity{
    public id: number = 0;
    public etapaId!:number;
    public etapa!: OrcamentoEtapa;
    public composicaoId!:number;
    public composicao!:Composicao;
    public valorDesoneradoItem!:number;
    public valorNaoDesoneradoItem!: number;
    public quantidade:number = 0;
    public valorTotalItemDesonerado:number = 0;
    public valorTotalItemNaoDesonerado:number = 0;
    public valorTotalItemDesoneradoComBDI:number = 0;
    public valorTotalItemNaoDesoneradoComBDI:number = 0;
    public valorTotalItem:number = 0;
    public valorItem: number = 0;
    
    constructor(model?: OrcamentoEtapaItem){
        if(!model)
        return;
     
        this.id = model.id;
        this.etapaId = model.etapaId;
        this.etapa = model.etapa;
        this.composicaoId = model.composicaoId;
        this.composicao = model.composicao;
        this.valorDesoneradoItem = model.valorDesoneradoItem;
        this.valorNaoDesoneradoItem = model.valorNaoDesoneradoItem;
        this.quantidade = model.quantidade;
    }
}