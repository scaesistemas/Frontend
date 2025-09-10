import {  SituacaoOrcamento, OrcamentoItem, OrcamentoDocumento, OrcamentoFornecedor } from '.';
import { CentroCusto, DespesaClassificacao } from '../financeiro';
import { TipoProduto } from '../almoxarifado';
import ContaGerencial from './../financeiro/ContaGerencial';
import OrcamentoAprovacao from './OrcamentoAprovacao';
import Empresa from '../cadastros/Empresa';

export default class Orcamento implements Shared.IEntity{
    public id: number = 0; 
    public empresaId: number = 0;  
    public empresa?: Empresa;   
    public observacao:string =''; 
    public classificacaoId!:number;
    public classificacao?: TipoProduto;   
    public situacaoId: number = 2; 
    public situacao?: SituacaoOrcamento;    
    public descricao:string =''; 
    public centroCustoId: number = 1; 
    public centroCusto?: CentroCusto;
    public contaGerencialId: number = 1;
    public contaGerencial?: ContaGerencial; 
    public aprovacao?: OrcamentoAprovacao;
    public fornecedores:OrcamentoFornecedor[]=[]; 
    public documentos:OrcamentoDocumento[]=[];
    public itens:OrcamentoItem[]=[];
    public classificacoes: DespesaClassificacao[] = []; //ex
    
    constructor(model?: Orcamento) {
        Object.assign(this, model);
    }
    
}  