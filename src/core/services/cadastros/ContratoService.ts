import { http } from "@/core/api";
import { Service } from "../Service";

export class ContratoService extends Service {
  constructor() {
    super("contrato");
  }

  MontarDocumentoContratoDigital(id: number, modelo) {
    return http.post(
      `${this.GetNomeControle()}/${id}/contratoDigital/MontarDocumento`,
      modelo
    );
  }

  ExcluirSignatario(id: number) {
    return http.delete(
      `${this.GetNomeControle()}/contratoDigital/Signatario/${id}`
    );
  }

  ExcluirContratoDigital(id: number) {
    return http.delete(`${this.GetNomeControle()}/contratoDigital/${id}`);
  }

  CancelarContratoDigital(id: number) {
    return http.put(`${this.GetNomeControle()}/contratoDigital/${id}/cancelar`);
  }

  DownloadContratoDigital(id: number) {
    return http.post(
      `${this.GetNomeControle()}/contratoDigital/${id}/download`
    );
  }

  UploadDocumentoDfourSign(id: number) {
    return http.post(
      `${this.GetNomeControle()}/contratoDigital/${id}/UploadDocumentoD4Sign`
    );
  }

  CadastrarSignatariosD4Sign(modelo) {
    return http.post(
      `${this.GetNomeControle()}/contratoDigital/CadastrarSignatariosD4Sign`,
      modelo
    );
  }

  EnviarDocumentoAssinaturaD4Sign(id) {
    return http.post(
      `${this.GetNomeControle()}/contratoDigital/${id}/EnviarDocumentoAssinaturaD4Sign`
    );
  }

  SalvarDocumento(id) {
    return http.post(
      `${this.GetNomeControle()}/contratoDigital/${id}/SalvarDocumento`
    );
  }

  CofresD4Sign() {
    return http.get(`${this.GetNomeControle()}/ContratoDigital/cofresD4Sign`);
  }

  AlterarContratoDigital(id: number, modelo) {
    return http.put(`${this.GetNomeControle()}/contratoDigital/${id}`, modelo);
  }

  CriarContratoDigital(modelo) {
    return http.post(`${this.GetNomeControle()}/contratoDigital`, modelo);
  }

  AditarContrato(id: number, modelo: any) {
    return http.post(`${this.GetNomeControle()}/${id}/Aditar`, modelo);
  }

  private GetFiltro2(parametros: string, filter: any) {
    if (filter) {
      let paramTemp = "";

      if (filter.numero) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `numero eq ${filter.numero}`;
      }

      if (filter.sequencia) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `sequencia eq ${filter.sequencia}`;
      }

      if (filter.tipoProdutoId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `tipoProdutoId eq ${filter.tipoProdutoId}`;
      }

      if (filter.tipoId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `tipoId eq ${filter.tipoId}`;
      }

      if (filter.data) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `data eq ${filter.data}`;
      }

      if (filter.clienteId) {
        //  filter.clientes.forEach(cliente => {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `clientes/any(o: o/clienteId eq ${filter.clienteId})`;
        // });
      }

      if (filter.empreendimentoId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `empreendimentoId eq ${filter.empreendimentoId}`;
      }

      if (filter.grupoId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `unidade/grupoId eq ${filter.grupoId}`;
      }

      if (filter.unidadeId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `unidadeId eq ${filter.unidadeId}`;
      }

      //http://api-development.scae.adm.br/api/Contrato?$filter=unidade/nome eq 'Lote 5'
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

  ListarContrato2(
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
      `${this.GetNomeControle()}${parametros}`,
      this.GetHeader(include)
    );
  }

  private GetFiltroAtualizado(parametros: string, filter: any) {
    if (filter) {
      let paramTemp = "";

      if (filter.numero) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `numero eq ${filter.numero}`;
      }

      if (filter.sequencia) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `sequencia eq ${filter.sequencia}`;
      }

      if (filter.tipoProdutoId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `tipoProdutoId eq ${filter.tipoProdutoId}`;
      }

      if (filter.tipoId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `tipoId eq ${filter.tipoId}`;
      }

      if (filter.data) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `data eq ${filter.data}`;
      }

      if (filter.empreendimentoId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `empreendimentoId eq ${filter.empreendimentoId}`;
      }
      //or unidadesAdicionaisIds/any(o: o/grupo/empreendimentoId eq ${filter.empreendimentoId})

      if (filter.grupoId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `UnidadePrincipal/grupoId eq ${filter.grupoId}`;
      }

      if (filter.unidadeId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `UnidadePrincipalId eq ${filter.unidadeId} or unidadesAdicionais/any(o: o/unidadeId eq ${filter.unidadeId})`;
      }
      //or unidadesAdicionaisIds/any(o: o/id eq ${filter.unidadeId})

      if (filter.clienteIds) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `clientes/any(o: o/clienteId eq ${filter.clienteIds})`;
      }

      if (filter.email) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `clientes/any(o: o/cliente/email eq '${filter.email}')`;
      }

      if (filter.situacaoId) {
        if (paramTemp) {
          paramTemp += " and ";
        }
        paramTemp += `situacaoId eq ${filter.situacaoId}`;
      }

      // if (filter.sequencia){
      //    if (paramTemp) { paramTemp += ' and '; }
      //    paramTemp += `sequencia eq ${filter.sequencia}`;
      //  }

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

  ListarContratosAtualizados(
    page: number,
    pageSize: number,
    sortBy: any[],
    desc: any[],
    search: any,
    columns: any[],
    filter: any,
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
    parametros = this.GetFiltroAtualizado(parametros, filter);
    return http.get(
      `${this.GetNomeControle()}/ListarContratos${parametros}`,
      this.GetHeader(include)
    );
  }

  InstrucaoParcela(id: number) {
    return http.post(
      `${this.GetNomeControle()}/${id}/AtualizarParcelaInstrucao`
    );
  }

  Cancelar(id: number) {
    return http.put(`${this.GetNomeControle()}/${id}/Cancelar`);
  }

  Reverter(id: number) {
    return http.put(`${this.GetNomeControle()}/${id}/ReverterAditamento`);
  }

  ReverterCancelamento(id: number) {
    return http.put(`${this.GetNomeControle()}/${id}/ReverterCancelamento`);
  }

  AprovarProposta(id: number, modelo, quantidadeParcelas?: Number) {
    return http.put(
      `${this.GetNomeControle()}/${id}/AprovarProposta?quantidadeParcelas=${quantidadeParcelas}`,
      modelo
    );
  }

  CancelarProposta(id: number, motivo: { observacao: string }) {
    return http.put(`${this.GetNomeControle()}/${id}/RejeitarProposta`, motivo);
  }

  GerarContrato(modelo, quantidadeParcelas?: number) {
    return http.post(
      `${this.GetNomeControle()}/despesaComissao?quantidadeParcelas=${quantidadeParcelas}`,
      modelo
    );
  }

  ObterContratoDetalhado(id) {
    return http.get(`${this.GetNomeControle()}/${id}/detalhado`);
  }

  CalcularDistrato(id) {
    return http.get(`${this.GetNomeControle()}/calcularDistrato/${id}`);
  }
}
