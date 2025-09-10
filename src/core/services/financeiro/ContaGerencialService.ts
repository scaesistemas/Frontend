import { Service } from '../Service';
import { http } from '@/core/api';

export class ContaGerencialService extends Service {

    constructor(){
      super('contagerencial');
    }

    TreeView(){
      return http.get(`${this.GetNomeControle()}/treeview`);
    } 
  
    Listagem(tipo?:string){
      return http.get(`${this.GetNomeControle()}/listagem?tipo=${tipo != null ? tipo : ''}`);
    }

    public ListarComFiltro(page:number, pageSize:number, sortBy:any[], desc:any[], search:any, columns:any[], filter:any, include){
      let parametros = this.GetParamentroPaginacaoOrdenacao(page,pageSize, sortBy,desc,search, columns);
      parametros = this.GetFiltro2(parametros, filter);
      return http.get(`${this.GetNomeControle()}${parametros}`);
    } 
  
    private GetFiltro2(parametros: string, filter: any){
    
        if (filter) {
            let paramTemp = '';
    
            if(filter.id){
              if(paramTemp){paramTemp += ' and '; }
              paramTemp += `id eq ${filter.id}`;
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