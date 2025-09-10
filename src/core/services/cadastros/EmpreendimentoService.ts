import { http } from "@/core/api";
import { Service } from "../Service";
import { MapaInterativo } from "@/core/models/cadastros";
import { ICoordinatesLot } from "@/components/negocios/mapainterativo/Mapear.vue";

export class EmpreendimentoService extends Service {
  constructor() {
    super("empreendimento");
  }

  ObterRelatorioDimob(empreendimentoId: any, clienteId: any, empresaId: any) {
    throw new Error("Method not implemented.");
  }

  SalvarKml(empreendimentoId: number, modelo) {
    return http.post(
      `${this.GetNomeControle()}/${empreendimentoId}/kml`,
      modelo
    );
  }

  MapearKml(unidadeld: number, unidadeKmlId: string) {
    return http.post(
      `${this.GetNomeControle()}/mapearKml/${unidadeld}?unidadeKmlId=${unidadeKmlId}`
    );
  }

  ObterUnidadeKml(unidadeKmlId, include?: string) {
    return http.get(
      `${this.GetNomeControle()}/unidadeByKml?unidadeKmlId=${unidadeKmlId}`,
      this.GetHeader(include)
    );
  }

  DeletarLadoUnidade(id) {
    return http.delete(`${this.GetNomeControle()}/unidade/ladoAdicional/${id}`);
  }

  ListarTodasUnidadesEmpreendimento(id) {
    return http.get(`${this.GetNomeControle()}/pontosMapaInterativo/${id}`);
  }

  updateFotoPrincipal(id: number, image: any) {
    const imageString = JSON.stringify(image);
    return http.post(
      `${this.GetNomeControle()}/${id}/fotoPrincipal`,
      imageString,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  ListarFluxoCaixa(
    page: number,
    pageSize: number,
    sortBy: any[],
    desc: any[],
    search: any,
    columns: any[],
    filter: any,
    include
  ) {
    let parametros = this.GetParamentroPaginacaoOrdenacao(
      page,
      pageSize,
      sortBy,
      desc,
      search,
      columns
    );
    parametros = this.GetFiltro2(parametros, filter);
    return http.get(
      `${this.GetNomeControle()}/fluxoCaixa/relatorio${parametros}`,
      this.GetHeader(include)
    );
  }

  ListarReceita(
    id: any,
    page: number,
    pageSize: number,
    sortBy: any[],
    desc: any[],
    search: any,
    columns: any[],
    filter: any
  ) {
    let parametros = this.GetParamentroPaginacaoOrdenacao(
      page,
      pageSize,
      sortBy,
      desc,
      search,
      columns
    );
    parametros = this.GetFiltro2(parametros, filter);
    return http.get(
      `${this.GetNomeControle()}/receita/${id}/relatorio${parametros}`
    );
  }

  ListarCusto(
    id: any,
    page: number,
    pageSize: number,
    sortBy: any[],
    desc: any[],
    search: any,
    columns: any[],
    filter: any
  ) {
    let parametros = this.GetParamentroPaginacaoOrdenacao(
      page,
      pageSize,
      sortBy,
      desc,
      search,
      columns
    );
    parametros = this.GetFiltro2(parametros, filter);
    return http.get(
      `${this.GetNomeControle()}/custo/${id}/relatorio${parametros}`
    );
  }

  ListarRelatorioClassificacao(
    empreendimentoId: string,
    empresaId: string,
    dataInicioEmissao: string,
    dataFimEmissao: string
  ) {
    return http.get(
      `${this.GetNomeControle()}/classificacao/relatorio?&empreendimentoId=${empreendimentoId}&empresaId=${empresaId}&dataInicioEmissao=${dataInicioEmissao}&dataFimEmissao=${dataFimEmissao}`
    );
  }

  private GetFiltro2(parametros: string, filter: any) {
    if (filter) {
      let paramTemp = "";

      if (filter.id > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `id eq ${filter.id}`;
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

      if (filter.dataInicioEmissao) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataInicioEmissao ge ${filter.dataInicioEmissao}`;
      }

      if (filter.dataFimEmissao) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataFimEmissao le ${filter.dataFimEmissao}`;
      }

      if (filter.dataVencimentoInicial) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataVencimentoInicial ge ${filter.dataVencimentoInicial}`;
      }

      if (filter.dataVencimentoFinal) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataVencimentoFinal le ${filter.dataVencimentoFinal}`;
      }

      if (filter.dataBaixaInicial) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataBaixaInicial ge ${filter.dataBaixaInicial}`;
      }

      if (filter.dataBaixaFinal) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataBaixaFinal le ${filter.dataBaixaFinal}`;
      }

      if (filter.dataEmissaoFinal) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `dataEmissaoFinal le ${filter.dataEmissaoFinal}`;
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

  ListarComFiltro(
    page: number,
    pageSize: number,
    sortBy: any[],
    desc: any[],
    search: any,
    columns: any[],
    filter: any,
    include
  ) {
    let parametros = this.GetParamentroPaginacaoOrdenacao(
      page,
      pageSize,
      sortBy,
      desc,
      search,
      columns
    );
    return http.get(
      `${this.GetNomeControle()}?$filter=tipoId eq ${filter.tipoId}`,
      this.GetHeader(include)
    );
  }

  ListarUnidades(empreendimentoId: any, situacaoId: any, empresaId: any) {
    var concatEmpreendimento = this.concatIds(
      empreendimentoId,
      "empreendimentoId"
    );
    var concatSituacoes = this.concatIds(situacaoId, "situacaoId");
    var concatEmpresa = this.concatIds(empresaId, "empresaId");

    return http.get(
      `${this.GetNomeControle()}/unidade/relatorio?${concatEmpreendimento}${concatSituacoes}${concatEmpresa}`
    );
  }

  ListarIptu(empreendimentoId, grupoId, unidadeId, clienteId, empresaId) {
    var concatEmpresa = this.concatIds(empresaId, "empresaId");
    return http.get(
      `${this.GetNomeControle()}/iptuRelatorio?&empreendimentoId=${empreendimentoId}&grupoId=${grupoId}&unidadeId=${unidadeId}&clienteId=${clienteId}&${concatEmpresa}`
    );
  }

  ListarGrupo(id: number, include?: string) {
    return http.get(
      `${this.GetNomeControle()}/ListarGrupos/${id}`,
      this.GetHeader(include)
    );
  }

  ListarUnidade(id) {
    return http.get(`${this.GetNomeControle()}/ListarUnidades/${id}`);
  }

  ExcluirGrupo(id: number) {
    return http.delete(`${this.GetNomeControle()}/grupo/${id}`);
  }

  ExcluirGrupos(ids: number[]) {
    return http.delete(`${this.GetNomeControle()}/ExcluirGrupos/${ids}`);
  }

  ExcluirUnidade(id: number) {
    return http.delete(`${this.GetNomeControle()}/unidade/${id}`);
  }

  ListarTodasUnidades() {
    return http.get(`${this.GetNomeControle()}/unidade`);
  }

  ListarTodasUnidades2(
    page: number,
    pageSize: number,
    sortBy: any[],
    desc: any[],
    search?: any,
    columns?: any[],
    filtro?: any,
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
      filtro,
      expand,
      select
    );

    return http.get(
      `${this.GetNomeControle()}/unidade${parametros}`,
      this.GetHeader(include)
    );
  }

  private GetFiltro3(parametros: string, filter: any) {
    if (filter) {
      let paramTemp = "";

      if (filter.empreendimentoId > 0) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `grupo/empreendimentoId eq ${filter.empreendimentoId}`;
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

  updateFotoMapaInterativo(id: number, image: any) {
    const imageString = JSON.stringify(image);
    return http.post(
      `${this.GetNomeControle()}/${id}/mapaInterativoImagem`,
      imageString,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  ObterUnidade(id: number, include?: string) {
    return http.get(
      `${this.GetNomeControle()}/unidade/${id}`,
      this.GetHeader(include)
    );
  }

  SalvarGrupos(modelo) {
    return http.post(`${this.GetNomeControle()}/grupos`, modelo);
  }

  SalvarUnidade(id: number, modelo) {
    return http.put(`${this.GetNomeControle()}/unidade/${id}`, modelo);
  }

  SalvarGrupo(id: number, modelo) {
    return http.put(`${this.GetNomeControle()}/grupo/${id}`, modelo);
  }

  ObterKpi(id: number) {
    return http.get(`${this.GetNomeControle()}/${id}/kpisituacaounidade`);
  }

  ObterTotaisPlanoPagamento(id: number) {
    return http.get(
      `${this.GetNomeControle()}/unidade/${id}/totalPlanoPagamento`
    );
  }

  ListarPontosMapa(id: number) {
    return http.get(`${this.GetNomeControle()}/${id}/pontosMapaInterativo`);
  }

  updateMapaInterativo(enterpriseId: number, map: MapaInterativo) {
    return http.put(
      `${this.GetNomeControle()}/${enterpriseId}/mapaInterativo`,
      map
    );
  }

  salvarPontosMapaInterativo(pontos: ICoordinatesLot[]) {
    return http.post(
      `${this.GetNomeControle()}/mapearPontosMapaInterativo`,
      pontos
    );
  }
}
