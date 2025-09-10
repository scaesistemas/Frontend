import { http, httpHeader } from '@/core/api';
import { Service } from '../Service';

export default class ProdutoService extends Service{
    constructor(){
        super('produto');
    }
 
    FiltrarProduto(filter){
        return http.get(`${this.GetNomeControle()}?$filter = tipoId eq ${filter.classificacaoId}`)
    }
    
    ObterFotoPorId(id:number){
        return http.get(`${this.GetNomeControle()}/${id}/foto`)
    } 

    public AutoComplete(q: string) {
        return http.get(`${this.GetNomeControle()}/AutoComplete`, {
          params: {
            q: q
          },
          headers: httpHeader.headers
        });
      }

      private GetFiltroProduto(filter: any) { 

        if (!filter) {
          return '';
        }
    
        let paramTemp = '';
  
        if (filter.codigo){
          if (paramTemp) { paramTemp += ' and '; }
          paramTemp += `codigo eq '${filter.codigo}'`;
        }

        if (filter.nome){
          if (paramTemp) { paramTemp += ' and '; }
          paramTemp += `nome eq '${filter.nome}'`;
        }
    
        if(filter.tipoId > 0){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `tipoId eq ${filter.tipoId}`;
        }

        if(filter.grupoId > 0){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `grupoId eq ${filter.grupoId}`;
        }

        if (!paramTemp) {
          return '';
        }
    
        paramTemp = `?$filter=${paramTemp}`;
    
        return paramTemp;  
      } 

    public ListarComFiltro(filter: any, include: string){
        const parametros = this.GetFiltroProduto(filter);
        return http.get(`produto${parametros}`, this.GetHeader(include));
    }
} 