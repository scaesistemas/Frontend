import { Service } from '../Service';
import { http } from '../../api';

export default class OrcamentoEtapaService extends Service {
    constructor(){
        super('orcamentoetapa');
    }

    public ListagemTreeView(orcamentoId:number){
        return http.get(`orcamentoetapa/treeview?orcamentoId=${orcamentoId}`)
    }
}
 