import { http } from '@/core/api';
import { Service } from '../Service';
import { NumberFormat } from 'xlsx';

export class ReguaCobrancaService extends Service {

    constructor(){
        super('reguacobranca'); 
    }

    GetContratosPaginated(id:number, page:number, pageSize:number){
        return http.get(`${this.GetNomeControle()}/${id}/contrato/Page/${page}/Size/${pageSize}`,{
            ...this.GetHeader()
        })
    }

    GetContratos(id:number){
        return http.get(`${this.GetNomeControle()}/${id}/contrato`,this.GetHeader())
    } 
    
    ExcluirEtapa(id:number){
        return http.delete(`${this.GetNomeControle()}/Etapa/${id}`)
    }
}