import {
  DocumentoEmpreendimento,
  Grupo,
  InfraestruturaEmpreendimento,
  LadoAdicional,
  LegalizacaoEmpreendimento,
  MapaInterativo,
  ProprietarioEmpreendimento,
  Foto,
  EmpreendimentoPessoa,
} from "..";
import { PlanoPagamentoModelo } from "../../contratos";
import { Documento } from "../../geral";
import { Endereco } from "../../shared";

export default class Empreendimento implements Shared.IEntity {
  id: number = 0;
  empresaId: number = 0;
  empresaAdministradoraId!: number;
  nome: string = "";
  tipoId: number = 0;
  percentualAdiministradora: number = 0;
  percentualCorretor: number = 0;
  ajusteIndice: number = 0;
  observacao: string = "";
  endereco = new Endereco();
  legalizacao = new LegalizacaoEmpreendimento();
  infraestrutura = new InfraestruturaEmpreendimento();
  ladosAdicionaisPadroes = [];
  grupos: Grupo[] = [];
  proprietarios: ProprietarioEmpreendimento[] = [];
  mapaInterativo = new MapaInterativo();
  quantidadeGrupo: number = 0;
  documentos: DocumentoEmpreendimento[] = [];
  fotoPrincipal: any = null;
  kml: any;
  planoPagamentoModeloId!: number;
  planoPagamento?: PlanoPagamentoModelo;
  fotos: Documento[] = [];
  documentosCompartilhados: Documento[] = [];
  empreendimentosPessoas: EmpreendimentoPessoa[] = [];
  quantidadeUnidade: number = 0;
  imagemPrincipal: string | undefined | null = "";

  constructor(model?: Empreendimento) {
    if (!model) return;

    this.id = model.id;
    this.empresaId = model.empresaId;
    this.empresaAdministradoraId = model.empresaAdministradoraId;
    this.nome = model.nome;
    this.tipoId = model.tipoId;
    this.percentualAdiministradora = model.percentualAdiministradora;
    this.percentualCorretor = model.percentualCorretor;
    this.ajusteIndice = model.ajusteIndice;
    this.observacao = model.observacao;
    this.endereco = model.endereco;
    this.legalizacao = new LegalizacaoEmpreendimento(model.legalizacao);
    this.infraestrutura = new InfraestruturaEmpreendimento(
      model.infraestrutura
    );
    this.ladosAdicionaisPadroes = model.ladosAdicionaisPadroes;
    this.grupos = model.grupos;
    this.proprietarios = model.proprietarios;
    this.mapaInterativo = model.mapaInterativo;
    this.quantidadeGrupo = model.quantidadeGrupo;
    this.documentos = model.documentos;
    this.fotoPrincipal = model.fotoPrincipal;
    this.kml = model.kml;
    this.planoPagamentoModeloId = model.planoPagamentoModeloId;
    this.planoPagamento = new PlanoPagamentoModelo(model.planoPagamento);
    this.fotos = model.fotos;
    this.documentosCompartilhados = model.documentosCompartilhados;
    this.empreendimentosPessoas = model.empreendimentosPessoas;
    this.quantidadeUnidade = model.quantidadeUnidade;
    this.imagemPrincipal = model.imagemPrincipal;
  }
}

export enum EnumTipoEmpreendimento {
  Loteamento = 1,
  Predio = 2,
  Condominio = 3,
  Cimiterio = 4,
}
