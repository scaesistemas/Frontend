import { http } from '@/core/api';
import { Service } from '../Service';

export class PlanoPagamentoService extends Service{
    constructor(){
        super('planopagamento');
    }

    AtualizarPlano(modelo, planoPagamentoId){
        return http.put(`${this.GetNomeControle()}/PlanoPagamentoUnidades/${planoPagamentoId}`, modelo)
    }
} 