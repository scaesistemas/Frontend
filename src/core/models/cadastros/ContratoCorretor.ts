import { Contrato } from '.';
import { Cliente } from '../imobiliaria';

export default class ContratoCorretor implements Shared.IEntity{
    public id!: number;
    public contratoId: number = 0;
    public contrato?: Contrato;
    public corretorId: number = 0;
    public corretor?: Cliente;
    public percentual: number = 0; 
    public isPercentual = false; 
    public valorFixo:number = 0;
    public quantidadeParcela:number = 0;
    public ligacaoParcelas:ParcelaLigacao[] = [];
} 

export interface ParcelaLigacao {
    numeroParcelaDespesa: number;
    numeroParcelaReceita: number | null;
    tipoReceitaId: number | null;
    valor: string;
    situacaoNome: string;
    dataDeVencimento: string;
  }