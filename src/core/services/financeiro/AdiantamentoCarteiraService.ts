import { http } from '@/core/api';
import { Service } from '../Service';

export class AdiantamentoCarteiraService extends Service {
    constructor(){
        super('adiantamentocarteira');
    }


    ObterSimulacao(valor, mes){
        return http.get(`${this.GetNomeControle()}/ListaSimulacaoAdiantamentoCarteira/${valor}/${mes}`)
    }

    ObterValor(empresaId){
        return http.get(`${this.GetNomeControle()}/ValorLiberadoAdiantamento/${empresaId}`)
    }

    listarAdiantamentos(assinanteId: number, include: string){
        return http.get(`${this.GetNomeControle()}/listarAssinanteAdiantamento/${assinanteId}`,
        {
            headers: 
            {
               Include: include
            }
        })
    }
}