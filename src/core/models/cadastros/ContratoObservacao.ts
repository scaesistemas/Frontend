import { Contrato } from ".";

export default class ContratoObservacao implements Shared.IEntity{
    public id!: number;
    public contratoId!: number;
    public contrato?: Contrato;
    public observacao: string ='';
    public usuarioId: number = 0;
    public dataHora = new Date().toISOString().substr(0, 10);
    public ativo:boolean = true;
}