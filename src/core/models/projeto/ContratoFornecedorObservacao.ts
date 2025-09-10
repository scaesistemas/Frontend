

export default class ContratoFornecedorObservacao implements Shared.IEntity{

    public id: number = 0;
    public contratoFornecedorId: number = 0;
    public texto: string = '';
    public usuarioId: number = 0;
    public dataHora = new Date();

    public excluido:boolean = false;
 
}