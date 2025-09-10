import { Service } from '../Service';
import { http } from '@/core/api';

export class EtapaService extends Service {
    constructor(){
        super('etapa');
    }

    
  TreeView(){
    return http.get(`${this.GetNomeControle()}/treeview`);
  }

  Listagem(){
    return http.get(`${this.GetNomeControle()}/listagem`);
  }

}