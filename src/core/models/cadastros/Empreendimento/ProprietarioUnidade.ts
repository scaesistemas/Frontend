export default class ProprietarioUnidade implements Shared.IEntity{
    public id!: number;
    public unidadeId: number = 0;
    public proprietarioId: number = 0;
    public participacao: number = 0;
    public observacao?: string;
}
 
