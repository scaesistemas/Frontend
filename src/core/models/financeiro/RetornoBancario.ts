
export default class RetornoBancario implements Shared.IEntity {
    public id: number = 0;
    public nome: string = '';
    public documento:any;
    public dataEmissao = new Date().yyyymmdd();
} 