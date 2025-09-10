
export default class OrcamentoAprovacao implements Shared.IEntity {
    public id:number= 0;
    public aprovado!:boolean;
    public dataHora  = new Date().toISOString().substr(0, 10);
    public usuarioId:number =0;

}