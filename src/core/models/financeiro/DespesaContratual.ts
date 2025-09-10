import { Empresa } from '../cadastros';

export default class DespesaContratual implements Shared.IEntity{

    public id: number = 0;
    public nome!: string;
    public valor!: number;
    public vencimento!: Date;
    public beneficiarioId!: number;
    public beneficiario!: Empresa;
    
    constructor(model?: DespesaContratual){
        Object.assign(this, model);
    }
}