export default class CertificadoBanco implements Shared.IEntity{
    public id: number = 0;
    public contaCorrenteId: number = 0;
    public nome: string = '';
    public formato:string = '';
    public dataValidacaoInicial = new Date();
    public dataValidacaoFinal = new Date();
    public excluido: boolean = false;    
    public senha: string = ''; 
    public conteudo: string = '';
}