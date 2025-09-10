import { Almoxarifado, InventarioItem } from '.';
import { Empresa } from '../cadastros';

export default class Inventario implements Shared.IEntity {
    public id: number = 0;
    public empresaId: number = 1;
    public empresa?:Empresa;
    public data = new Date().yyyymmdd();
    public almoxarifadoId: number = 0;
    public almoxarifado?: Almoxarifado;
    public dataHoraExecucao?: Date;
    public executada: boolean = false;
    public itens:InventarioItem[]=[];

    constructor(model?: Inventario){
      Object.assign(this, model);
   } 
} 