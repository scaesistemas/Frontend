import { Pessoa } from '../cadastros';

export default class TipoPessoa implements Shared.IEntity {
    public id: number = 0;
    public nome: string = '';
    public fornecedor?: Pessoa;
    public fornecedorId:number =0;
    public tipoPessoaNome: string ='';
}