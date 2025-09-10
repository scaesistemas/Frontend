import { http } from '@/core/api';
import { Service } from '../Service';

export default class HidrometroService extends Service{
    constructor(){
        super('hidrometro');
    }
 
    ObterMarcacoes(filter){
        return http.get(`${this.GetNomeControle()}/marcacao/?dataReferencia=${filter.dataReferencia}`);
    } 

    SalvarMarcacao(hidrometroId, modelo){
        return http.post(`${this.GetNomeControle()}/${hidrometroId}/marcacao`, modelo);
    } 

    AlterarMarcacao(marcacaoId:number, modelo){
        return http.put(`${this.GetNomeControle()}/marcacao/${marcacaoId}`, modelo);
    }

    GerarBoleto(marcacaoId){
        return http.post(`${this.GetNomeControle()}/marcacao/${marcacaoId}/boleto`);
    }

    ObterMarcacaoPorId(marcacaoId){
        return http.get(`${this.GetNomeControle()}/marcacao/${marcacaoId}`);
    }
} 