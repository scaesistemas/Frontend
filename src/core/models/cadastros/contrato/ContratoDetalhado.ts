export default class ContratoDetalhado implements Shared.IEntity {
  public id: number = 0;
  public numeroSequencia: string = "";
  public situacaoNome: string = "";
  public valor: number = 0;
  public valorRecebido: number = 0;
  public valorComJuros: number = 0;

  public empresaNome: string = "";
  public tipoProdutoNome: string = "";
  public empreendimentoNome: string = "";
  public grupoNome: string = "";
  public loteNome: string = "";
  public dataContrato: string = "";
  public indiceNome: string = "";
  public intervaloNome: string = "";
  public tipoTabelaNome: string = "";
  public anoPrimeiroReajuste: number = 0;
  public receitas: any = [];
  public clientes: any = [];
  public corretores: any = [];
  public historicoSituacoes: any = [];
}
