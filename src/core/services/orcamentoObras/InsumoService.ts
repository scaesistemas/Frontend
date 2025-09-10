import { Service } from '../Service';
import { http } from '../../api';

export default class InsumoService extends Service{
    
    constructor(){ 
        super('insumo'); 
    }   

    public async PesquisarInsumosDetalhado(page: number, pageSize: number, sortBy: any[], desc: any[], search: any, columns: any[], filter, include){
        //let paginacao = this.GetParamentroPaginacaoOrdenacao(page,pageSize, sortBy,desc,search, columns);
        // parametros = this.GetFiltroInsumo(parametros);
        

        return http.get(`${this.GetNomeControle()}/InsumoItemLista?&estadoId=${filter.estadoId ? filter.estadoId : '0'}` +
                                                                `&origemId=${filter.origemId ? filter.origemId :'0'}` +
                                                                `&unidadeId=${filter.unidadeId ? filter.unidadeId :'0'}` +
                                                                `&mes=${filter.mes ? filter.mes : '0'}` +
                                                                `&ano=${filter.ano ? filter.ano : '0'}` +
                                                                `${filter.codigo ? '&codigo='+filter.codigo : ''}` +
                                                                `${filter.descricao ? '&descricao=' + filter.descricao : ''}` +
                                                                `&comValores=${filter.comValores ? filter.comValores : false}`,
                                                                this.GetHeader(include));
    }

    public async PesquisarInsumos(page: number, pageSize: number, sortBy: any[], desc: any[], search: any, columns: any[], filter, include){
        let parametros = this.GetParamentroPaginacaoOrdenacao(page,pageSize, sortBy,desc,search, columns);
        parametros = this.GetFiltroInsumo(parametros, filter);
        return http.get(`${this.GetNomeControle()}/${parametros}`, this.GetHeader(include))
    }

    private GetFiltroInsumo(parametros: string, filter?: any){
 
        if (filter) {
            let paramTemp = '';

            if (filter.origemId > 0){
                if(paramTemp) { paramTemp += ' and '; }
                paramTemp += `origemId eq ${filter.origemId}`
            }

            if (filter.unidadeId > 0){
                if(paramTemp) { paramTemp += ' and '; }
                paramTemp += `unidadeId eq ${filter.unidadeId}`
            }

            if (filter.estadoId > 0){
                if(paramTemp) { paramTemp += ' and '; }
                paramTemp += `estadoId eq ${filter.estadoId}`
            }

           if (paramTemp) {
            
            if(parametros){
              parametros += '&';
            }
            
            else {
              parametros += '?';
            }

            parametros += `$filter=${paramTemp}`;
            }
        }
    
        return parametros;  
    } 
}
 