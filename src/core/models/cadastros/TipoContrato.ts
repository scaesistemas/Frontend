import TipoOperacaoContrato from './TipoOperacaoContrato';
import Empresa from './Empresa';

export default class TipoContrato implements Shared.IEntity{
    public id:number = 0;
    public nome:string = "";
    public empresaId!: number;
    public empresa?: Empresa;
    public tipoOperacaoId = 1;
    public tipoOperacao?: TipoOperacaoContrato;

    constructor(model?: TipoContrato){
        if(!model)
        return;

        this.id = model.id;
        this.nome = model.nome;
        this.empresaId = model.empresaId;
        this.tipoOperacaoId = model.tipoOperacaoId;    
    }
}