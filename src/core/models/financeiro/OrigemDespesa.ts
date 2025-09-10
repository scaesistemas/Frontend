export default class OrigemDespesa implements Shared.IEntity{
    public id: number = 0; 
    public nome: string = ''; 
}

export enum EnumOrigemDespesa{
    Contrato = 1,
    Documentacao = 2,
    Financeiro = 3,
    PedidoCompra = 4,
    Servico = 5,
} 