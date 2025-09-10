import { Empreendimento, Unidade } from '..';

export default class Grupo implements Shared.IEntity{
    public id: number = 0;
    public empreendimentoId: number = 0;
    public nome: string = '';
    public checado:boolean = false;
    public quantidadeUnidade: number = 0;
    public unidades: Unidade[] = []; 
    public excluido:boolean = false; 
} 