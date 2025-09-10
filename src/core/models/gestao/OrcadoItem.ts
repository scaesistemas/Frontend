import { Etapa } from '.';
import { Produto } from '../almoxarifado';
import { OrcadoItemConsumido } from '../projeto';

export default class OrcadoItem implements Shared.IEntity{
    
    public id:number = 0
    public produtoId: number = 0;
    public produto?: Produto; 
    public quantidade: number = 0;
    public etapa?:Etapa;
    public etapaId: number = 0;
    public valorUnitario:number = 0;
    public quantidadeConsumida:number =0;
    public total:number = 0;
    public saldo:number = 0;
    public consumidos: OrcadoItemConsumido [] = []
    excluido:boolean = false;
} 