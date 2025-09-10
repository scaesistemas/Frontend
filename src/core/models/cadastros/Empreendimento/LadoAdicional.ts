
export default class LadoAdicional implements Shared.IEntity{
    public id!: 0;
    public nome: string = '';
    public valor: number = 0;  
    public empreendimentoId!:number; 
    public loteId!:number; 
    public excluido:boolean = false;
} 