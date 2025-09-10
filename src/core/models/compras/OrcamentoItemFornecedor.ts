import Pessoa from '../cadastros/Pessoa';

export default class OrcamentoItemFornecedor implements Shared.IEntity{
    public id: number = 0;
    public orcamentoItemId: number = 0;
    public fornecedorId: number = 0;
    public fornecedor?: Pessoa;    
    public valorUnitario: number = 0.00;
    public valorTotal:number = 0.00;   
    public totalComFrete:number = 0.00;

}