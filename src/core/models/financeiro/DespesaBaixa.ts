import { DespesaBaixaComprovante, ContaCorrente, DespesaParcela } from '@/core/models/financeiro';
import FormaPagamento from './FormaPagamento';
export default class DespesaBaixa implements Shared.IEntity{
    
    public centroCustoId!:number;
    public contaGerencialId!:number;
    
    public id: number = 0;
    public parcelaId: number = 0;
    public parcela?: DespesaParcela;
    public dataPagamento = new Date().toISOString().substr(0, 10);
    public juros: number = 0.00;    
    public desconto: number = 0.00;
    public total: number = 0.00; 
    public valor: number = 0.00; 
    public contaCorrenteId: number = 0;   
    public contaCorrente?: ContaCorrente;
    public formaPagamentoId: number = 0;
    public formaPagamento?: FormaPagamento;  
    public usuarioId:number = JSON.parse(localStorage.sessionApp.split(".")).dados.usuarioId;
    public comprovante  = new DespesaBaixaComprovante; 
    public cancelado:boolean = false;
} 