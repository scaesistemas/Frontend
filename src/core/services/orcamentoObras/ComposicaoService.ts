import { http } from '@/core/api';
import { Service } from '../Service';

export default class ComposicaoService extends Service {
    constructor(){
        super('composicao');
    }

    ObterDatas(){
        return http.get(`${this.GetNomeControle()}/datas`);
    }

    ListarComposicoesValoresAtualizados(filterComposicao:any, estadoId, referencia,page: number, pageSize: number, sortBy: any[], desc: any[], search: any, columns: any[], filtro?: any, include?: string){
      let parametros = this.GetParamentroPaginacaoOrdenacao(page, pageSize, sortBy, desc, search, columns, filtro);
      parametros = this.GetFiltroComposicao(parametros, filtro);
      return http.get(`${this.GetNomeControle()}/composicoesValores/${parametros}&origemId=${filterComposicao.origemId > 0 ? filterComposicao.origemId :''}&classeId=${filterComposicao.classeId > 0 ?filterComposicao.classeId : ''}&tipoId=${filterComposicao.tipoId >0 ? filterComposicao.tipoId : ''}&unidadeMedidaId=${filterComposicao.unidadeId >0 ? filterComposicao.unidadeId:''}&estadoId=${estadoId}&mesAno=${referencia}&descricao=${filterComposicao.descricao.length > 0 ? filterComposicao.descricao :''}`, this.GetHeader(include));
    }

    GetFiltroComposicao(parametros: string, filtro: any){
        if (filtro) {
            let paramTemp = '';

            if (filtro.classeId > 0){
              if(paramTemp) { paramTemp += ' and '; }
              paramTemp += `classeId eq ${filtro.classeId}`
            }
    
            if (filtro.origemId > 0){
              if(paramTemp) { paramTemp += ' and '; }
              paramTemp += `origemId eq ${filtro.origemId}`
            }
    
            if (filtro.unidadeId > 0){
                if(paramTemp) { paramTemp += ' and '; }
                paramTemp += `unidadeId eq ${filtro.unidadeId}`
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

    /*ObterValor(id:any, estadoId:number, desonerado:boolean){
        return http.get(`${this.GetNomeControle()}/Valor/${id}?estadoId=${estadoId}&desonerado=${desonerado}`)
    }*/

    /*AlterarEstado(estadoId:number){
        return http.patch(`${this.GetNomeControle()}/AtualizarEstado?estadoId=${estadoId}`);
    }*/
}
  