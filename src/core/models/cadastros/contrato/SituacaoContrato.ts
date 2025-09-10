export class SituacaoContrato implements Shared.IEntity{
    public id:number = 0;
    public nome:string ='';
}

export enum EnumSitucaoContrato{ 
    EmAndamento = 1,
    Cobranca = 2,
    Juridico = 3,
    Prejuizo = 4,
    Cancelado = 5,
    Quitado = 6,
    Aditado = 7,
    ComProcesso = 8
}       