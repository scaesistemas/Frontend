import Usuario from "../Usuario";
import { SituacaoContrato } from "./SituacaoContrato";

export default class EncargosFinanceiros{
    public id: number = 0;
    public dataAlteracao: string = '';
    public situacaoId: number = 0;
    public situacao?:SituacaoContrato;
    public contratoId:number = 0;
    public usuarioId:number = 0;
    public usuario?:  Usuario;
}