import { OrcadoItem } from '.';
import { Empreendimento, Empresa } from '../cadastros';
export default class Orcado implements Shared.IEntity {
    public id: number = 0;
    public empresaId: number = 1; 
    public empresa?: Empresa;    
    public empreendimento?: Empreendimento;
    public empreendimentoId: number = 0;
    public itens:OrcadoItem[]=[]; 
}