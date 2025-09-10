import { Unidade } from '..';
import { Vicio } from '../../shared';

export default class VicioUnidade extends Vicio{
    public unidadeId: number = 0;
    public unidade!: Unidade;
    public vicioId: number = 0;
    public vicio!: Vicio;
}