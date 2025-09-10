import { http } from '@/core/api';
import { Service } from '../Service';

export class ParametroService extends Service {
   
    constructor(){
        super('compras/parametro');   
    }

    ListarParametroFirst(){
        return http.get(`/parametro/first/`);
    }
 
    /*Listar(){
        return http.get(`/parametro/`);
    }*/
    
    /*Excluir(id:number){
        return http.delete(`/parametro/${id}`)
    }
   
    
    Salvar(modelo: any) {
        return  modelo.id > 0 ? http.put(`/parametro/${modelo.id}`, modelo) : http.post(`/parametro/`, modelo);
    }*/
  }


    