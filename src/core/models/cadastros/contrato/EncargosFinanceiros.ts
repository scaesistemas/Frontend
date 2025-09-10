export default class EncargosFinanceiros {
  public jurosDia: number = 0.0;
  public multa: number = 0.0;
  public descontoVencimento: number = 0.0;
  public diasDesconto: number = 0.0;
  public descontoQuitacao: number = 0.0;
  public diasDescontoVencimento: number = 0;
  public descontoQuitacaoLimite: number = 0.0;
  public descontoAntecipacao: number = 0.0;
  public descontoAntecipacaoLimite: number = 0.0;
  public diasProtesto: number = 0;
  public diasAposVencimentoNaoReceber: number = 0;
  public isDescontoVencimentoPercentual: boolean = true;

  constructor(model?: EncargosFinanceiros) {
    if (!model) return;

    this.jurosDia = model.jurosDia;
    // this.tipo = model.tipo;
    this.multa = model.multa;
    this.descontoVencimento = model.descontoVencimento;
    this.isDescontoVencimentoPercentual = model.isDescontoVencimentoPercentual;
    this.diasDesconto = model.diasDesconto;
    this.descontoQuitacao = model.descontoQuitacao;
    this.diasDescontoVencimento = model.diasDescontoVencimento;
    this.diasAposVencimentoNaoReceber = model.diasAposVencimentoNaoReceber;
    this.descontoQuitacaoLimite = model.descontoQuitacaoLimite;
    this.descontoAntecipacao = model.descontoAntecipacao;
    this.descontoAntecipacaoLimite = model.descontoAntecipacaoLimite;
  }
}
