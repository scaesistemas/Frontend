import { http } from '@/core/api';
import { Service } from '../Service';
export class TipoIndiceService extends Service {

    constructor(){
        super('tipoindice');
    }

    AlterarTipoIndice(item, id){
        return http.put(`${this.GetNomeControle()}/${id}/alterarTipoIndice/`, item);
    }
}