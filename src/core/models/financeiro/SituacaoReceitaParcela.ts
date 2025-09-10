export class SituacaoReceitaParcela implements Shared.IEntity{
    
    public id: number = 0;
    public nome: string = '';
} 

export enum EnumSituacaoReceitaParcela{
    Aberto = 1,
    Cancelado = 2,
    Pago = 3,
    PagoParcialmente = 4
}