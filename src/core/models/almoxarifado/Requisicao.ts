import { Almoxarifado,  RequisicaoItem } from '.';
import { Empreendimento } from '../cadastros';

export default class Requisicao implements Shared.IEntity {  
    public id: number = 0;  
    public empresaId: number = 1; 
    public empreendimento?: Empreendimento;
    public empreendimentoId: number = 0;
    public data = new Date().toISOString().substr(0, 10);
    public solicitante: string = ''; 
    public almoxarifadoId: number = 0; 
    public almoxarifado?: Almoxarifado; 
    public pedidoId!: number; 
    public descricao: string = ''; 
    public titulo:string ='';
    public observacao:string = ''; 
    public dataHoraExecucao?: Date;     
    public executada: boolean = false;
    public itens:RequisicaoItem[]=[]; 

    constructor(model?: Requisicao){
       Object.assign(this, model);    
    } 
 
   }    