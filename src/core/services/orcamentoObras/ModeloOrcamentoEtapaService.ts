import { http } from '@/core/api';
import { Service } from '../Service';

export default class ModeloOrcamentoEtapaService extends Service {
    constructor(){
        super('modeloorcamentoetapa');
    }

    TreeView(){
        return http.get(`${this.GetNomeControle()}/treeview`);
    }

    Listagem(){
        return http.get(`${this.GetNomeControle()}/listagem`);
    }

    AplicarModeloOrcamento(id:number, etapaPaiId?:any, modelo?:any){
        return http.post(`${this.GetNomeControle()}/aplicar/${id}?etapaPaiId=${etapaPaiId}`, modelo)
    }

    SalvarModeloEtapa(etapaId, estadoId){
        return http.post(`${this.GetNomeControle()}/salvarcomomodelo/${etapaId}?estadoId=${estadoId}`)
    }
}