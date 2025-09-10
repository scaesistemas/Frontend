
 
import { ContratoFornecedorItem } from ".";
import { ContratoFornecedorDocumento } from ".";
import ContratoFornecedorObservacao from "./ContratoFornecedorObservacao";
import { TipoContratoFornecedor } from ".";
export default class ContratoFornecedor implements Shared.IEntity{

id: number = 0;
empresaId: number = 0;
fornecedorId: number = 0;
empreendimentoId: number = 0;
numero:number = 0;
prazoInicio = new Date().ddmmyyyy();;
prazoFim = new Date().ddmmyyyy();
prazoGarantiaInicio =  new Date().ddmmyyyy();
prazoGarantiaFim =  new Date().ddmmyyyy(); 

tipoId: number = 3;
itens: ContratoFornecedorItem [] = [];
tipo: TipoContratoFornecedor [] = [];
centroCustoId:number = 0;
contaGerencialId:number =0;
observacoes: ContratoFornecedorObservacao [] = [];
documentos: ContratoFornecedorDocumento [] = [];

constructor(model?: ContratoFornecedor){
    if(!model)
    return;

    this.id = model.id; 
    this.empresaId = model.empresaId;
    this.fornecedorId = model.fornecedorId;
    this.empreendimentoId = model.empreendimentoId;
    this.numero = model.numero;
    this.prazoInicio = new Date(model.prazoInicio).yyyymmdd();
    this.prazoFim = new Date(model.prazoFim).yyyymmdd();
    this.prazoGarantiaInicio = new Date(model.prazoGarantiaInicio).yyyymmdd();
    this.prazoGarantiaFim =  new Date(model.prazoGarantiaFim).yyyymmdd();
    this.tipoId = model.tipoId;
    this.itens = model.itens;
    this.tipo = model.tipo;
    this.centroCustoId = model.centroCustoId;
    this.contaGerencialId = model.contaGerencialId;
    this.observacoes = model.observacoes;
    this.documentos = model.documentos;
 }
}