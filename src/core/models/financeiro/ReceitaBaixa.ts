import { ContaCorrente, ReceitaParcela } from '@/core/models/financeiro';
import FormaPagamento from './FormaPagamento';
export default class ReceitaBaixa implements Shared.IEntity{
    id!: number; 
    parcelaId: number = 0;
    parcela?: ReceitaParcela;
    dataPagamento = new Date().yyyymmdd();
    multa: number = 0; 
    juros: number = 0;
    desconto: number = 0;
    total: number = 0;
    valor: number = 0;   
    contaCorrenteId: number = 0;
    contaCorrente?: ContaCorrente;
    formaPagamentoId: number = 0;
    formaPagamento?: FormaPagamento; 
    automatica:boolean = false;
    usuarioId:number = JSON.parse(localStorage.sessionApp.split(".")).dados.usuarioId;
    cancelado:boolean = false;

    constructor(model?: ReceitaBaixa){
        if(!model)
        return;

        this.id = model.id;
        this.parcelaId = model.parcelaId;
        this.dataPagamento = model.dataPagamento;
        this.multa = model.multa;
        this.juros = model.juros;
        this.desconto = model.desconto;
        this.total = model.total;
        this.valor = model.valor;
        this.contaCorrenteId = model.contaCorrenteId;
        this.formaPagamentoId = model.formaPagamentoId;
        this.automatica = model.automatica;
        this.usuarioId = model.usuarioId;
        this.cancelado = model.cancelado;
    }
} 