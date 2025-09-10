export default class Etapa implements Shared.IEntity{
    public id: number = 0;
    public empresaId:number = 1;
    public codigo: string = '';
    public nome: string ='';
    public codigoDescricao = '';
    public etapaPaiId!:number;
    public ativo:boolean= true;
    public children:[]=[];
}