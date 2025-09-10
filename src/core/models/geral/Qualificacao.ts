import { Profissao, Nacionalidade, Naturalidade, EstadoCivil } from '.';

export default class Qualificacao implements Shared.IEntity{
    public id: number = 0;
    public profissaoId?: number;
    public profissao?: Profissao;
    public nacionalidadeId?: number = 10;
    public nacionalidade?: Nacionalidade;
    public naturalidadeId?: number;
    public naturalidade?: Naturalidade;
    public rendaBruta: number = 0.00;
    public rendaLiquida: number = 0.00;
    public estadoCivilId?: number;
    public estadoCivil?: EstadoCivil;    
 } 