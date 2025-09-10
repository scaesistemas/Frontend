export default class Encargo {
  public jurosDia: number = 0;
  public multa: number = 0;
  public descontoVencimento: number = 0;
  public diasDescontoVencimento: number = 0;
  public descontoAntecipacao: number = 0;
  public diasAposVencimentoNaoReceber: number = 0;
  public diasProtesto: number = 0;
  public correcaoMonetaria: number = 0;

  public isDescontoVencimentoPercentual: boolean = true;
  public diasNegativacao: number = 0;

  constructor(model?: Encargo) {
    if (!model) return;

    this.jurosDia = model.jurosDia;
    this.multa = model.multa;
    this.descontoVencimento = model.descontoVencimento;
    this.diasDescontoVencimento = model.diasDescontoVencimento;
    this.descontoAntecipacao = model.descontoAntecipacao;
    this.diasAposVencimentoNaoReceber = model.diasAposVencimentoNaoReceber;
    this.diasProtesto = model.diasProtesto;
    this.correcaoMonetaria = model.correcaoMonetaria;

    this.isDescontoVencimentoPercentual = model.isDescontoVencimentoPercentual;
    this.diasNegativacao = model.diasNegativacao;
  }
}
