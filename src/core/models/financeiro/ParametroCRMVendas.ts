
export default class ParametroCRMVendas {
    public diasExpiracaoPreReserva: number = 30;
    public diasExpiracaoReserva:number = 30;
    public diasMinimosEntreReservaMesmoLead:number = 0;
    public diasExpiracaoReajusteProposta:number = 0;
    public centroCustoComissaoCorretorId!:number;
    public contaGerencialComissaoCorretorId!:number;
    public percentualComissaoCorretor:number = 0;
 
    constructor(model?: ParametroCRMVendas){
        
        if(!model) 
            return;

        this.diasExpiracaoPreReserva = model.diasExpiracaoPreReserva;
        this.diasExpiracaoReserva = model.diasExpiracaoReserva;
        this.diasMinimosEntreReservaMesmoLead = model.diasMinimosEntreReservaMesmoLead;
        this.diasExpiracaoReajusteProposta = model.diasExpiracaoReajusteProposta;
        this.centroCustoComissaoCorretorId = model.centroCustoComissaoCorretorId;
        this.contaGerencialComissaoCorretorId = model.contaGerencialComissaoCorretorId;
        this.percentualComissaoCorretor = model.percentualComissaoCorretor;
    }
}  