export default class ReguaCobrancaEtapa implements Shared.IEntity{

    id: number = 0;
    reguaCobrancaId!: number;
    
    nome: string = '';
    minimoDiasVencido:number = 0;
    maximoDiasVencido:number = 0;
    ativo:boolean = true;
}