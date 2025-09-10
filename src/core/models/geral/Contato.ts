export default class Contato implements Shared.IEntity{
    public id: number = 0;
    public pessoaId: number = 0;
    public nome: string = '';
    public celular: string = '';
    public telefone: string = '';
    public ramal: string = '';
    public email: string = '' 

    constructor(model?: Contato){
        Object.assign(this, model);
     }
}