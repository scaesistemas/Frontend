import { Almoxarifado } from '../almoxarifado';
import { Empresa } from '../cadastros';

export default class Parametro implements Shared.IEntity {  
    public id: number = 0;  
    public empresaId: number = 0;
    public empresa?: Empresa;
    public almoxarifadoPadraoId:number =0;
    public almoxarifadoPadrao?: Almoxarifado;
     
    constructor(model?: Parametro){
       Object.assign(this, model);
    } 
}    