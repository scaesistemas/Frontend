import { DespesaClassificacao, DespesaDocumento, TipoDocumento, TipoDespesa, DespesaParcela, OrigemDespesa } from '.';
import { Pedido } from '../compras';
import { Contrato, Empresa, Usuario } from '../cadastros';
import Pessoa from '../cadastros/Pessoa';
import Empreendimento from '../cadastros/Empreendimento/Empreendimento';

export default class Despesa implements Shared.IEntity {
    
    id: number = 0; 
    empresaId: number = 0; 
    empresa?: Empresa;
    contratoId!: number; 
    contrato?: Contrato; 
    origemId:number = 0;
    origem?: OrigemDespesa;
    tipoId: number = 0;    
    tipo?: TipoDespesa;  
    pedidoId!: number;
    pedido?: Pedido; 
    fornecedorId: number = 0; 
    fornecedor?: Pessoa;
    dataEmissao = new Date().yyyymmdd();
    dataCriacao = new Date().yyyymmdd();
    valor: number = 0;
    tipoDocumentoId: number =0;
    tipoDocumento?: TipoDocumento;
    empreendimentoId!: number; 
    empreendimento?: Empreendimento; 
    numeroDocumento: string = ''; 
    chaveDfe: string = '';
    observacao: string = '';
    saldo: number = 0; 
    juros:number = 0;
    despesas:Despesa[] = [];
    pedidos:Pedido[] = [];
    parcelas: DespesaParcela[] = [];
    classificacoes: DespesaClassificacao[] = [];
    documentos: Array<DespesaDocumento> = [];
    quantidadeParcela: number = 0;
    valorParcelaAtual: number = 0;
    totalPagoParcelas: number = 0;
    valorDespesaAtual: number = 0;
    observacoes:any[]=[];

    constructor(model?: Despesa){
        if(!model)
        return;
    }
} 