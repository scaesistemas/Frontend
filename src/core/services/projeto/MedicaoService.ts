import { Service } from '../Service';
import { http } from '@/core/api';

export class MedicaoService extends Service {
  constructor(){
      super('Medicao');
  }

 GerarDespesa(id: number, modelo){
    return http.post(`${this.GetNomeControle()}/${id}/gerardespesa`, modelo);
    
  }

 /* MedicaoId(id: number,include?: string){
    return http.get(`${this.GetNomeControle()}/${id}`, this.GetHeader(include));
  }*/


    private Filtro(parametros: string, filter: any){
                    
      if (filter) {
          let paramTemp = '';
          if (filter.contratoFornecedorId){
              if(paramTemp){paramTemp += ' and '; }
              paramTemp += `contratoFornecedorId eq ${filter.contratoFornecedorId}`
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
      return parametros
  }

  ObterMedicoes(page: number, pageSize: number, sortBy: any[], desc: any[], search?: any, columns?: any[], filter?: any,expand?:string, select?:string, include?: string){
    let parametros = this.GetParamentroPaginacaoOrdenacao(page, pageSize, sortBy, desc, search, columns, filter, expand, select);

    parametros = this.Filtro(parametros, filter);
    return http.get(`${this.GetNomeControle()}/${parametros}`,this.GetHeader(include))
  }
     
}
 