import Composicao from "./Composicao";
import Insumo from "./Insumo";

export default class ComposicaoItem implements Shared.IEntity{
    public id!: number;
    public composicaoId!:number;
    public composicao?: Composicao;
    public insumoId!:number;
    public insumo!:Insumo;
    public composicaoAuxiliarId!:number;
    public composicaoAuxiliar!:Composicao; 
    public coeficiente:number = 0; 
 
    constructor(model?: ComposicaoItem){
        if(!model)
        return;
     
        this.id = model.id; 
        this.composicaoId = model.composicaoId;
        this.composicao = model.composicao;
        this.insumo = model.insumo;
        this.insumoId = model.insumoId;
        this.composicaoAuxiliarId = model.composicaoAuxiliarId;
        this.composicaoAuxiliar = model.composicaoAuxiliar;
        this.coeficiente = model.coeficiente;
    }
}