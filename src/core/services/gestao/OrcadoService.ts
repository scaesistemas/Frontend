import { http } from '@/core/api';
import { Service } from '../Service';

export class OrcadoService extends Service {
    constructor(){
        super('Orcado');
    }

    OrcadoRealizado(id:number){
        return http.get(`${this.GetNomeControle()}/${id}/OrcadoRealizado`)
    }
}
 