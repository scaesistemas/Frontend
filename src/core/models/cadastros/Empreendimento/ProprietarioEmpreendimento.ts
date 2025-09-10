export default class ProprietarioEmpreendimento implements Shared.IEntity{
    public id: number = 0;
    public empreendimentoId: number = 0;
    public proprietarioId: number = 0;
    public participacao: number = 0;
    public observacao?: string;
    public excluido:boolean = false;
}