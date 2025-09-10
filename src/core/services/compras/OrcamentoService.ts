import { Service } from '../Service';
import { http } from '../../api';

export class OrcamentoService extends Service {
    constructor(){
        super('orcamento');     
    }

    /* orcamento */
    CancelarOrcamento(id: number){
        return http.put(`${this.GetNomeControle()}/${id}/cancelar`);
    } 
    AprovarOrcamento(id: number){
        return http.put(`${this.GetNomeControle()}/${id}/aprovar`);
    } 
}  

 


     