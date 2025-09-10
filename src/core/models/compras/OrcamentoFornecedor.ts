import { FormaPagamento } from '../financeiro';
import Pessoa from '../cadastros/Pessoa';
import { Orcamento } from '.';
import { Empresa } from '../cadastros';

export default class OrcamentoFornecedor implements Shared.IEntity{
    id: number = 0;
    orcamentoId: number=0;
    orcamento?: Orcamento;
    empresaId:number=0;
    empresa?:Empresa; 
    fornecedorId: number = 0; 
    fornecedor?: Pessoa;
    formaPagamentoId: number = 0;
    formaPagamento?: FormaPagamento;
    prazoEntregaDias: number = 0; 
    validadeDias: number = 0;   
    frete: number = 0;
    valorTotal:number = 0;
    observacao:string ='';
    aprovado: boolean = false;
    valor?:number; 
    total:number = 0;

    constructor(model?: OrcamentoFornecedor){
        if(!model)
        return;

        this.id = model.id;
        this.orcamentoId = model.orcamentoId;
        this.empresaId = model.empresaId;
        this.fornecedorId = model.fornecedorId;
        this.formaPagamentoId = model.formaPagamentoId;
        this.prazoEntregaDias = model.prazoEntregaDias;
        this.validadeDias = model.validadeDias;
        this.frete = model.frete;
        this.valorTotal = model.valorTotal;
        this.observacao = model.observacao;
        this.aprovado = model.aprovado;
        this.total = model.total;
    }
 }