import Foto from '@/core/models/imobiliaria/Foto';
export default class Vistoria implements Shared.IEntity {
    public id: number = 0;
    public contratoId: number = 0;
    public data: string = '2020-06-07T16:54:16.439Z';
    public observacao: string = '';
    public descricaoReparo: string = '';
    public valorReparo: number = 0;
    public fotos: Foto[] = [];
    public vistoriador: string = '';
}