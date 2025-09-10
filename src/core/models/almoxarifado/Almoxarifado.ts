import { Empreendimento, Empresa } from '../cadastros';
import AlmoxarifadoItem from "./AlmoxarifadoItem";

export default class Almoxarifado implements Shared.IEntity {
  public id: number = 0;
  public empresaId: number = 1;
  public empresa?: Empresa;

  public empreendimentoId:number =0; 
  public empreendimento?: Empreendimento;
  
  public nome: string = "";
  public itens: AlmoxarifadoItem[] = [];


  constructor(model?: Almoxarifado){ 
    Object.assign(this, model);
} 
}
 