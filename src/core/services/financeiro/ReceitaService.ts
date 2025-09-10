import { Service } from "../Service";
import { http } from "@/core/api";
import { Encargo } from "@/core/models/financeiro";

export class ReceitaService extends Service {
  constructor() {
    super("receita");
  }

  AjustarParcelaPadrao(parcelaInicialId: number, valorParcela: number) {
    return http.put(
      `${this.GetNomeControle()}/ajustarValorParcelas/${parcelaInicialId}?valorParcela=${valorParcela}`
    );
  }

  AjustarAmortizacao(
    parcelaId: number,
    tipoOperacaoId: number,
    saldoAmortizacaoInicioPeriodoCorrigido: number,
    valorParcela: number
  ) {
    return http.put(
      `${this.GetNomeControle()}/ajustarAmortizacao/${parcelaId}?tipoOperacaoId=${tipoOperacaoId}&saldoAmortizacaoInicioPeriodoCorrigido=${saldoAmortizacaoInicioPeriodoCorrigido}&valorParcela=${valorParcela}`
    );
  }

  ObterSaldoDevedor(receitaId: number, data: string) {
    return http.get(
      `${this.GetNomeControle()}/SaldoDevedorPorDataPriceSac/${receitaId}?&data=${data}`
    );
  }

  ObterSimulacaoAmortizacao(
    receitaId: number,
    valorAmortizado: number,
    dataPagamento: string,
    tipoAntecipacaoId: number
  ) {
    return http.get(
      `${this.GetNomeControle()}/SimularAmortizacao/${receitaId}?&valorAmortizado=${valorAmortizado}&dataPagamento=${dataPagamento}&tipoAntecipacaoId=${tipoAntecipacaoId}`
    );
  }

  CriarParcelaAmortizacao(
    receitaId: number,
    valorAmortizado: number,
    dataPagamento: string,
    tipoAntecipacaoId: number
  ) {
    return http.post(
      `${this.GetNomeControle()}/CriarParcelaAmortizacao/${receitaId}?&valorAmortizado=${valorAmortizado}&dataPagamento=${dataPagamento}&tipoAntecipacaoId=${tipoAntecipacaoId}`
    );
  }

  ListarParcelasOtimizadas(
    page: number,
    pageSize: number,
    sortBy: any[],
    desc: any[],
    search: any,
    columns: any[],
    filter
  ) {
    let parametros = this.GetParamentroPaginacaoOrdenacao(
      page,
      pageSize,
      sortBy,
      desc,
      search,
      columns
    );
    parametros = this.GetFiltro3(parametros, filter);

    return http.get(
      `${this.GetNomeControle()}/ListarParcelas${parametros}&numeroDocumento=${
        filter.numeroDocumento
      }&contaCorrenteId=${
        filter.contaCorrenteId > 0 ? filter.contaCorrenteId : ""
      }`
    );
  }

  private GetFiltro3(parametros: string, filter?: any) {
    if (filter) {
      let paramTemp = "";
      if (filter.situacaoId.length != 0) {
        paramTemp += `(`;

        for (let i = 0; i < filter.situacaoId.length; i++) {
          if (i == 0) {
            paramTemp += `situacaoId eq ${filter.situacaoId[i]}`;
          } else {
            paramTemp += ` or situacaoId eq ${filter.situacaoId[i]} `;
          }
        }
        paramTemp += `)`;
      }

      if (filter.empreendimentoId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `empreendimentoId eq ${filter.empreendimentoId}`;
      }

      if (filter.empresaId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `empresaId eq ${filter.empresaId}`;
      }

      if (filter.dataVencimentoInicial) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataVencimentoParcela ge ${filter.dataVencimentoInicial}`;
      }

      if (filter.dataVencimentoFinal) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataVencimentoParcela le ${filter.dataVencimentoFinal}`;
      }

      if (filter.clienteId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/clienteId eq ${filter.clienteId}`;
      }

      if (filter.dataPagamentoInicial) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataPagamentoParcela ge ${filter.dataPagamentoInicial}`;
      }

      if (filter.dataPagamentoFinal) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataPagamentoParcela le ${filter.dataPagamentoFinal}`;
      }

      if (filter.centroCustoId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `classificacao/centrosCustoIds/any(o: o eq ${filter.centroCustoId})`;
      }

      if (filter.contaGerencialId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `classificacao/contasGerenciaisIds/any(o: o eq ${filter.contaGerencialId})`;
      }

      /*if(filter.formaPagamentoId > 0){
                    if(paramTemp) { paramTemp += ' and '; }
                    paramTemp += `classificacao/contasGerenciaisIds/any(o: o eq ${filter.formaPagamentoId})`;
                }*/

      /* if (filter.contaCorrenteId){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `contasCorrentesIds/any(o: o eq ${filter.contaCorrenteId})`
                }*/

      if (filter.numero) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/numeroContrato eq ${filter.numero}`;
      }

      if (paramTemp) {
        if (parametros) {
          parametros += "&";
        } else {
          parametros += "?";
        }

        parametros += `$filter=${paramTemp}`;
      }
    }
    return parametros;
  }

  private GetFiltro2(parametros: string, filter: any) {
    if (filter) {
      let paramTemp = "";

      if (filter.situacaoId ? filter.situacaoId.length != 0 : 0) {
        paramTemp += `(`;

        for (let i = 0; i < filter.situacaoId.length; i++) {
          if (i == 0) {
            paramTemp += `situacaoId eq ${filter.situacaoId[i]}`;
          } else {
            paramTemp += ` or situacaoId eq ${filter.situacaoId[i]} `;
          }
        }
        paramTemp += `)`;
      }

      if (filter.numero) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/contrato/numero eq ${filter.numero}`;
      }
      if (filter.empresaId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/empresaId eq ${filter.empresaId}`;
      }
      if (filter.clienteId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/clienteId eq ${filter.clienteId}`;
      }

      if (filter.numeroDocumento) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `contains(tolower(receita/numeroDocumento),tolower('${filter.numeroDocumento}'))`;
      }

      if (filter.formaPagamentoId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `baixas/any(o: o/formaPagamentoId eq ${filter.formaPagamentoId})`;
      }

      if (filter.dataVencimentoInicial) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataVencimento ge ${filter.dataVencimentoInicial}`;
      }

      if (filter.dataVencimentoFinal) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataVencimento le ${filter.dataVencimentoFinal}`;
      }

      if (filter.boletoGerado == true) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `urlBoleto ne null and urlBoleto ne ''`;
      }

      if (filter.dataPagamentoInicial) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `baixas/any(o: o/dataPagamento ge ${filter.dataPagamentoInicial})`;
      }

      if (filter.dataPagamentoFinal) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `baixas/any(o: o/dataPagamento le ${filter.dataPagamentoFinal})`;
      }

      if (filter.dataInicial) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/dataEmissao ge ${filter.dataInicial}`;
      }

      if (filter.dataFinal) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/dataEmissao le ${filter.dataFinal}`;
      }

      if (filter.empreendimentoId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/empreendimentoId eq ${filter.empreendimentoId}`;
      }

      if (filter.tipoId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/tipoId eq ${filter.tipoId}`;
      }

      if (filter.contratoId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/contratoId eq ${filter.contratoId}`;
      }

      if (filter.centroCustoId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/classificacoes/any(o: o/centroCustoId eq ${filter.centroCustoId})`;
      }

      if (filter.contaGerencialId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/classificacoes/any(o: o/contaGerencialId eq ${filter.contaGerencialId})`;
      }

      if (filter.contaGerencialId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `receita/classificacoes/any(o: o/contaGerencialId eq ${filter.contaGerencialId})`;
      }

      if (filter.contaCorrenteId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `baixas/any(o: o/contaCorrenteId eq ${filter.contaCorrenteId})`;
      }

      if (paramTemp) {
        if (parametros) {
          parametros += "&";
        } else {
          parametros += "?";
        }
        //and not baixas/any(o: o/cancelado eq true)
        parametros += `$filter=${paramTemp} and agrupadorId eq null`;
      }
    }
    return parametros;
  }

  ListarParcelas(
    page: number,
    pageSize: number,
    sortBy: any[],
    desc: any[],
    search?: any,
    columns?: any[],
    filter?: any,
    expand?: string,
    select?: string,
    include?: string
  ) {
    let parametros = this.GetParamentroPaginacaoOrdenacao(
      page,
      pageSize,
      sortBy,
      desc,
      search,
      columns,
      filter,
      expand,
      select
    );

    parametros = this.GetFiltro2(parametros, filter);
    return http.get(
      `${this.GetNomeControle()}/parcela${parametros}`,
      this.GetHeader(include)
    );
  }

  ObterParcelaPorId(id: number, include?: string) {
    return http.get(
      `${this.GetNomeControle()}/parcela/${id}`,
      this.GetHeader(include)
    );
  }

  ExcluirParcela(id: number) {
    return http.delete(`${this.GetNomeControle()}/parcela/${id}`);
  }

  RemoverSplit(id: number) {
    return http.delete(
      `${this.GetNomeControle()}/parcela/${id}/removerSplitParcela`
    );
  }

  AtualizarSplit(id: number, type: string, value: number) {
    return http.post(
      `${this.GetNomeControle()}/parcela/${id}/adicionarSplitParcela?type=${type}&value=${value}`
    );
  }

  CancelarParcela(id: number) {
    return http.put(`${this.GetNomeControle()}/parcela/${id}/cancelar`);
  }

  CancelarBoleto(id: number) {
    return http.put(`${this.GetNomeControle()}/parcela/${id}/CancelarBoleto`);
  }

  CancelarBoletoForcado(id: number) {
    return http.put(
      `${this.GetNomeControle()}/parcela/${id}/CancelarBoletoForcado`
    );
  }

  CancelarBaixa(id: number) {
    return http.put(`${this.GetNomeControle()}/baixa/${id}/cancelar`);
  }

  GerarBoleto(id: number) {
    return http.post(`${this.GetNomeControle()}/parcela/${id}/GerarBoleto`);
  }

  CancelarBoletos(parcelasIds: []) {
    return http.put(`${this.GetNomeControle()}/cancelarBoletos`, parcelasIds);
  }

  ExcluirBoletos(parcelasIds: []) {
    return http.put(`${this.GetNomeControle()}/excluirboletos`, parcelasIds);
  }

  GerarBoletos(parcelasIds: []) {
    return http.post(`${this.GetNomeControle()}/gerarBoletos`, parcelasIds);
  }

  GerenciarReceitaNova(
    idContrato: number,
    idReceitaAntiga: number,
    modelo: any
  ) {
    return http.post(
      `${this.GetNomeControle()}/GerenciarReceita?&idContrato=${idContrato}&idReceitaAntiga=${idReceitaAntiga}`,
      modelo
    );
  }

  ObterAntecipacao(id: number, parcelaIds: string, dataVencimento: string) {
    let parcelas = parcelaIds.toString();
    return http.get(
      `${this.GetNomeControle()}/${id}/Antecipacao?parcelaIds=${parcelas}&dataVencimento=${dataVencimento}`
    );
  }

  Antecipacao(id: number, modelo) {
    return http.post(`${this.GetNomeControle()}/${id}/Antecipacao`, modelo);
  }

  GerarCarne(modelo) {
    return http.post(`${this.GetNomeControle()}/Parcelas/Boleto/Carne`, modelo);
  }

  GerarCarneBancoBrasil(modelo) {
    return http.post(
      `${this.GetNomeControle()}/Parcelas/Boleto/Carne/pdf`,
      modelo,
      {
        responseType: "arraybuffer",
      }
    );
  }

  ObterQuitacao(id: number, dataVencimento: string) {
    return http.get(
      `${this.GetNomeControle()}/${id}/Quitacao?dataVencimento=${dataVencimento}`
    );
  }

  Quitar(id: number, modelo) {
    return http.post(`${this.GetNomeControle()}/${id}/Quitacao`, modelo);
  }
  AgruparParcelas(id: number, modelo) {
    return http.post(`${this.GetNomeControle()}/${id}/Agrupar`, modelo);
  }

  ObterDocumento(id: number) {
    return http.get(`${this.GetNomeControle()}/${id}/documento`);
  }

  BaixarParcela(id: number, modelo: any) {
    return http.put(`${this.GetNomeControle()}/parcela/${id}/baixar`, modelo);
  }

  BaixarMultiplasParcelas(modelo) {
    return http.post(`${this.GetNomeControle()}/baixar/parcelas`, modelo);
  }

  EditarParcela(id: number, modelo: any, aplicarJuros: boolean) {
    return http.put(
      `${this.GetNomeControle()}/parcela/${id}/?aplicarJuros=${aplicarJuros}`,
      modelo
    );
  }

  Executar(modelo: any) {
    return http.post(`${this.GetNomeControle()}/Reajustar`, modelo);
  }

  AtualizarDataSequencia(modelo: any) {
    return http.post(
      `${this.GetNomeControle()}/AtualizarDataSequencia`,
      modelo
    );
  }

  AtualizarEncargos(
    id: number,
    modelo: Encargo,
    gatewayId: number,
    tipoOperacaoId: number,
    contaCorrenteId?: number,
    taxaBoleto?: number,
    taxaAdicional?: number,
    taxaAdicionalNome?: string
  ) {
    return http.put(
      `${this.GetNomeControle()}/${id}/AtualizarEncargos?gatewayId=${
        gatewayId ?? ""
      }&tipoOperacaoId=${tipoOperacaoId ?? ""}&contaCorrenteId=${
        contaCorrenteId ?? ""
      }&taxaBoleto=${taxaBoleto}&taxaAdicional=${taxaAdicional}&taxaAdicionalNome=${taxaAdicionalNome}`,
      modelo
    );
  }

  AtualizarEncargosContrato(id: number, modelo: any) {
    return http.put(
      `${this.GetNomeControle()}/${id}/AtualizarEncargosContrato`,
      modelo
    );
  }

  EncargosContrato(id: number) {
    return http.get(`${this.GetNomeControle()}/${id}/EncargosContrato`);
  }

  GerarComprovante(id: number) {
    return http.post(`${this.GetNomeControle()}/${id}/GerarComprovante`);
  }

  VisualizarComprovante(id: number) {
    return http.get(`${this.GetNomeControle()}/${id}/VisualizarComprovante`);
  }

  GerarDocumentoAntecipacao(id: number) {
    return http.post(
      `${this.GetNomeControle()}/GerarDocumentoAntecipacao/${id}`
    );
  }

  VisualizarDocumentoAntecipacao(id: number) {
    return http.get(`${this.GetNomeControle()}/DocumentoAntecipacao/${id}`);
  }

  SalvarDocumento(id: number, string) {
    return http.put(
      `${this.GetNomeControle()}/SalvarDocumentoAntecipacao/${id}`,
      string
    );
  }

  SimularAntecipacao(id: number, parcelaIds, dataSimulada) {
    return http.get(
      `${this.GetNomeControle()}/SimulacaoAntecipacao/${id}?parcelaIds=${parcelaIds}&dataSimulada=${dataSimulada}`
    );
  }

  SimularQuitacao(id: number, dataSimulada) {
    return http.get(
      `${this.GetNomeControle()}/SimulacaoQuitacao/${id}?dataSimulada=${dataSimulada}`
    );
  }

  SalvarReceitaServico(modelo: any) {
    return http.post(
      `${this.GetNomeControle()}/CadastrarParcelasServico`,
      modelo
    );
  }

  BaixaRetroativa(
    id: number,
    tipoOperacaoId: number,
    formaPagamentoId: number,
    contaCorrenteId: number
  ) {
    return http.put(
      `${this.GetNomeControle()}/parcela/${id}/BaixasRetroativas/?tipoOperacaoId=${tipoOperacaoId}&formaPagamentoId=${formaPagamentoId}&contaCorrenteId=${contaCorrenteId}`
    );
  }

  ParcelamentoPrice(
    valorFinanciamento?: number,
    taxaJuros?: number,
    quantidadeParcelas?: number,
    isDFIFixo?: boolean,
    percentualMPI?: number,
    percentualDFI?: number,
    taxaGestao?: number
  ) {
    return http.get(
      `${this.GetNomeControle()}/ParcelamentoPrice/?valorFinanciamento=${valorFinanciamento}&taxaJuros=${taxaJuros}&quantidadeParcelas=${quantidadeParcelas}&isDFIFixo=${isDFIFixo}&percentualMPI=${percentualMPI}&DFI=${percentualDFI}&taxaGestao=${taxaGestao}`
    );
  }

  ParcelamentoSac(
    valorFinanciamento: number,
    taxaJuros: number,
    quantidadeParcelas: number,
    isDFIFixo: boolean,
    percentualMPI: number,
    percentualDFI: number,
    taxaGestao: number
  ) {
    return http.get(
      `${this.GetNomeControle()}/ParcelamentoSac/?valorFinanciamento=${valorFinanciamento}&taxaJuros=${taxaJuros}&quantidadeParcelas=${quantidadeParcelas}&isDFIFixo=${isDFIFixo}&percentualMPI=${percentualMPI}&DFI=${percentualDFI}&taxaGestao=${taxaGestao}`
    );
  }

  GetTotalSimulacaoQuitacao(
    id: number,
    quantidadeParcelas: number,
    dataVencimento: string,
    tipoQuitacaoId: number
  ) {
    return http.get(
      `${this.GetNomeControle()}/TotalSimulacaoQuitacao/${id}?quantidadeParcelas=${quantidadeParcelas}&dataVencimento=${dataVencimento}&tipoQuitacaoId=${tipoQuitacaoId}`
    );
  }

  SalvarValoresAdicionais(
    id: number,
    gestao,
    percentualMPI,
    percentualDFI,
    valorDFI,
    isDFIFixo
  ) {
    return http.put(
      `${this.GetNomeControle()}/${id}/parcelas/valoresAdicionais/?gestao=${gestao}&percentualMPI=${percentualMPI}&percentualDFI=${percentualDFI}&valorDFI=${valorDFI}&isDFIFixo=${isDFIFixo}`
    );
  }

  ProcessarRetorno(codigoBanco, arquivoRetorno) {
    const formData = new FormData();
    formData.append("arquivoRetorno", arquivoRetorno);

    return http.post(
      `${this.GetNomeControle()}/retorno/${codigoBanco}/processar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  BaixarParcelas(parcelas) {
    return http.post(`${this.GetNomeControle()}/retorno/baixar/`, parcelas);
  }

  ListarTransacoes(
    page: number,
    pageSize: number,
    sortBy: any[],
    desc: any[],
    search?: any,
    columns?: any[],
    filter?: any,
    expand?: string,
    select?: string,
    include?: string
  ) {
    let parametros = this.GetParamentroPaginacaoOrdenacao(
      page,
      pageSize,
      sortBy,
      desc,
      search,
      columns
    );
    parametros = this.GetFiltroTransacoes(parametros, filter);

    return http.get(
      `${this.GetNomeControle()}/transacao${parametros}`,
      this.GetHeader(include)
    );
  }

  private GetFiltroTransacoes(parametros: string, filter?: any) {
    if (filter) {
      let paramTemp = "";

      if (filter.situacaoId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `situacaoId eq ${filter.situacaoId}`;
      }

      if (filter.contaCorrenteId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `contaCorrenteId eq ${filter.contaCorrenteId}`;
      }

      if (paramTemp) {
        if (parametros) {
          parametros += "&";
        } else {
          parametros += "?";
        }

        parametros += `$filter=${paramTemp} and remessaId eq null`;
      }
    }
    return parametros;
  }

  DownloadDocumento(id: number) {
    return http.get(
      `${this.GetNomeControle()}/Parcela/${id}/Boleto/BaixarPdf`,
      {
        responseType: "arraybuffer",
      }
    );
  }

  visualizarPdfSantander(id: number) {
    return http.get(
      `${this.GetNomeControle()}/Parcela/${id}/Boleto/BaixarPdfSantander`,
      {
        responseType: "arraybuffer",
      }
    );
  }

  DesmarcarBoletosCobrancasAutomaticas(
    parametroId,
    desmarcarBoletoCobrancaAutomatico
  ) {
    return http.put(
      `${this.GetNomeControle()}/DesmarcarBoletoCobrancaAutomatico/${parametroId}&desmarcarBoletoCobrancaAutomatico=${desmarcarBoletoCobrancaAutomatico}`
    );
  }
}
