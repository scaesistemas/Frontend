import ContratoVistoriaFoto from "./ContratoVistoriaFoto";

export default class ContratoVistoria implements Shared.IEntity {
    public id: number = 0;
    public contratoId: number = 0;
    public data: string = '';
    public observacao: string = '';
    public descricaoReparo: string = '';
    public valorReparo: number = 0;
    public fotos: ContratoVistoriaFoto[] = [];
    public vistoriador: string = '';
} 