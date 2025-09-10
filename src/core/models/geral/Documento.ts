export default class Documento{
    public id: number = 0;
    public nome: string = '';
    public tamanho: number = 0;
    public dados: string = '';
    public tipo: string = '';
    public descricao: string = '';
    public excluido:boolean = false 
    public dataEmissao = new Date().yyyymmdd();
    public usuarioId: number = 0;
} 