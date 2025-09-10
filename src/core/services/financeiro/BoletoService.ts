import { http } from '@/core/api';
import { Service } from '../Service';

export class BoletoService extends Service {
    constructor(){
        super('boleto');
    }

    VisualizarBoletoSafra(codigo:string){
        return http.post(`${this.GetNomeControle()}/html/${codigo}`)
    }
  
    VisualizarBoleto(transacaoId){
        return http.post(`${this.GetNomeControle()}/visualizar/${transacaoId}`)
    }
} 
   