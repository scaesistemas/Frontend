import { http } from '@/core/api';
import { Service } from '../Service';

export class RemessaService extends Service {

    constructor() {
        super('remessa');
    } 
 
    Processar(modelo, id:number){
        return http.put(`${this.GetNomeControle()}/${id}/processar/${modelo.tipoCnab}`);
    }

    SalvarProcessar(modelo){
        return http.post(`${this.GetNomeControle()}/salvarprocessar/${modelo.tipoCnab}`, modelo);
    }
} 