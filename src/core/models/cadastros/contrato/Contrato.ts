import {
  Despesa,
  Encargo,
  Receita,
  TipoAmortizacao,
  TipoGateway,
} from "@/core/models/financeiro/";
import {
  ContratoCliente,
  ContratoCorretor,
  ContratoDigital,
  DocumentoContrato,
  Empreendimento,
  TipoContrato,
  TipoIndice,
  TipoProcessoJudicial,
  Unidade,
} from "..";
import { TipoProduto } from "../../almoxarifado";
import Empresa from "../Empresa";
import ContratoObservacao from "../ContratoObservacao";
import { ContratoVistoria } from "../../clientes";
import { SituacaoContrato } from "./SituacaoContrato";

export default class Contrato implements Shared.IEntity {
  id: number = 0;
  anoPrimeiroReajuste: number = 0;
  teste: number = 0;
  empresaId: number = 0;
  empresa?: Empresa;
  unidadePrincipal?: Unidade;
  unidadePrincipalId: number = 0;
  empreendimento?: Empreendimento;
  empreendimentoId: number = 0;
  numero: number = 0;
  sequencia: number = 0;
  tipoId: number = 0;
  grupoId: number = 0;
  tipo?: TipoContrato;
  tipoProdutoId: number = 0;
  tipoAmortizacaoId: number = 1;
  tipoAmortizacao!: TipoAmortizacao;
  intervaloReajusteId: number = 1;
  jurosAmortizacao: number = 0;
  tipoProduto?: TipoProduto;
  clientes: ContratoCliente[] = [];
  corretores: ContratoCorretor[] = [];
  percentualAdiministradora: number = 0;
  data = new Date().yyyymmdd();
  descricao: string = "";
  tipoIndiceId: number = 0;
  tipoIndice?: TipoIndice;
  valor: number = 0;
  quantidadeParcela: number = 0;
  renovavel: boolean = false;
  periodicidadeReajuste: number = 12;
  periodicidadeRenovacao: number = 0;
  mesReajuste: any = null;
  prazoContratual: number = 0;
  primeiroVencimento = new Date().yyyymmdd();
  melhorDia: number = 0;
  observacao: string = "";
  prazo: number = 0;
  despesas: Despesa[] = [];
  receitas: any = [];
  vistorias: ContratoVistoria[] = [];
  documentos: DocumentoContrato[] = [];
  responsavel: string = "";
  encargoFinanceiro: Encargo = new Encargo();
  numeroProcessoJudicial: string = "";
  tipoProcessoJudicialId!: number;
  tipoProcessoJudicial?: TipoProcessoJudicial;
  observacoes: ContratoObservacao[] = [];
  situacao?: SituacaoContrato;
  situacaoId: number = 1;
  saldoGeralAditado: number = 0;
  saldoGeral: number = 0;
  tipoAditamentoId?: null;
  contratoAnteriorAditadoId?: number;
  totalPagoGeral: number = 0;
  quantidadeParcelasPagasGeral: number = 0;
  quantidadeParcelasAPagar: number = 0;
  historicoSituacoes: any = [];
  contratosDigitais: ContratoDigital[] = [];
  tipoGatewayId!: number;
  tipoGateway?: TipoGateway;
  unidadesAdicionais = [];
  tipoOperacaoId: number = 0;
  contaCorrenteId?: any;
  reserva?: any;
  valorParcelaAtual: number = 0;

  gerarDespesa: boolean = false;
  quantidadeParcelas: number = 0;
  dataCriacao = new Date().yyyymmdd();
  valorComissaoCorretor: number = 0;

  constructor(model?: Contrato) {
    if (!model) return;

    this.id = model.id;
    this.anoPrimeiroReajuste = model.anoPrimeiroReajuste;
    this.teste = model.teste;
    this.empresaId = model.empresaId;
    this.empresa = model.empresa;
    this.unidadePrincipal = model.unidadePrincipal;
    this.unidadePrincipalId = model.unidadePrincipalId;
    this.empreendimento = model.empreendimento;
    this.empreendimentoId = model.empreendimentoId;
    this.numero = model.numero;
    this.sequencia = model.sequencia;
    this.tipoId = model.tipoId;
    this.grupoId = model.grupoId;
    this.tipo = model.tipo;
    this.tipoProdutoId = model.tipoProdutoId;
    this.tipoAmortizacaoId = model.tipoAmortizacaoId;
    this.tipoAmortizacao = model.tipoAmortizacao;
    this.intervaloReajusteId = 1;
    this.jurosAmortizacao = model.jurosAmortizacao;
    this.tipoProduto = model.tipoProduto;
    this.clientes = model.clientes;
    this.corretores = model.corretores;
    this.percentualAdiministradora = model.percentualAdiministradora;
    this.data = model.data;
    this.descricao = model.descricao;
    this.tipoIndiceId = model.tipoIndiceId;
    this.tipoIndice = model.tipoIndice;
    this.valor = model.valor;
    this.quantidadeParcela = model.quantidadeParcela;
    this.periodicidadeReajuste = model.periodicidadeReajuste;
    this.periodicidadeRenovacao = model.periodicidadeRenovacao;
    this.mesReajuste = model.mesReajuste;
    this.prazoContratual = model.prazoContratual;
    this.primeiroVencimento = new Date(model.primeiroVencimento).yyyymmdd();
    this.melhorDia = model.melhorDia;
    this.observacao = model.observacao;
    this.prazo = model.prazo;
    this.despesas = model.despesas;
    this.receitas = model.receitas;
    this.vistorias = model.vistorias;
    this.documentos = model.documentos;
    this.responsavel = model.responsavel;
    this.encargoFinanceiro = model.encargoFinanceiro;
    this.numeroProcessoJudicial = model.numeroProcessoJudicial;
    this.tipoProcessoJudicialId = model.tipoProcessoJudicialId;
    this.tipoProcessoJudicial = model.tipoProcessoJudicial;
    this.observacoes = model.observacoes;
    this.situacao = model.situacao;
    this.situacaoId = model.situacaoId;
    this.saldoGeralAditado = model.saldoGeral;
    this.saldoGeral = model.saldoGeral;
    this.tipoAditamentoId = model.tipoAditamentoId
      ? model.tipoAditamentoId
      : null;
    this.contratoAnteriorAditadoId = model.contratoAnteriorAditadoId;
    this.totalPagoGeral = model.totalPagoGeral;
    this.quantidadeParcelasPagasGeral = model.quantidadeParcelasPagasGeral;
    this.quantidadeParcelasAPagar = model.quantidadeParcelasAPagar;
    this.historicoSituacoes = model.historicoSituacoes;
    this.contratosDigitais = model.contratosDigitais;
    this.tipoGatewayId = model.tipoGatewayId;
    this.tipoGateway = model.tipoGateway;
    this.unidadesAdicionais = model.unidadesAdicionais;
    this.tipoOperacaoId = model.tipoOperacaoId;
    this.contaCorrenteId = model.contaCorrenteId;
    this.reserva = model.reserva;
    this.dataCriacao = new Date(model.dataCriacao).yyyymmdd();
    this.valorComissaoCorretor = model.valorComissaoCorretor;
    this.valorParcelaAtual = model.valorParcelaAtual;
  }

  PrepararContrato(item?: Contrato, ReceitasAdicionais: any[] = []) {
    let contrato: any = new Contrato();

    if (item != undefined) {
      contrato = Object.assign({}, item);
    } else {
      contrato = Object.assign({}, this);
    }

    ReceitasAdicionais.forEach((receita) => {
      if (receita.parcelas.length !== 0) {
        contrato.receitas.push(receita);
      }
    });
    contrato.unidadePrincipal = null;
    contrato.receitas.forEach((receita) => {
      (receita.clienteId = contrato.clientes[0].clienteId),
        (receita.empreendimentoId = contrato.empreendimentoId);
      //receita.empresaId = contrato.empresaId;
      receita.tipoGatewayId = contrato.tipoGatewayId;
      receita.tipoOperacaoId = contrato.tipoOperacaoId;
      receita.contaCorrenteId = contrato.contaCorrenteId;

      receita.parcelas.forEach((parcela) => {
        parcela.dataVencimentoOriginal =
          parcela.dataVencimentoOriginal == undefined
            ? parcela.dataVencimento
            : parcela.dataVencimentoOriginal;
        parcela.situacao = undefined;
        parcela.tipoGatewayId = contrato.tipoGatewayId;
        parcela.tipoOperacaoId = contrato.tipoOperacaoId;
        parcela.contaCorrenteId = contrato.contaCorrenteId;
      });
    });
    return contrato;
  }
}

export enum EnumTipoOperacaoFinanceira {
  Gateway = 1,
  Boleto = 2,
  Banco = 3,
}
