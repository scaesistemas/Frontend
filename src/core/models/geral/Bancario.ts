export default class Bancario implements Shared.IEntity{
    public id: number = 0;
    public banco: string = '';
    public agencia: string = '';
    public agenciaDigito: string = '';
    public conta: string = '';
    public contaDigito: string = '';
    public pix: string = '';
}