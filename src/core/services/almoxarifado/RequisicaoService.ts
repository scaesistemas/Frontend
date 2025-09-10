import { Service } from '../Service';
import {http, httpHeader} from '../../api';

export default class RequisicaoService extends Service{
    constructor(){
        super('requisicao'); 
    }

    public async Executar(id: number){
        return await http.post(`${this.GetNomeControle()}/executar/${id}`, null, httpHeader);
    }

    private GetFiltro2(parametros: string, filter: any){

      if (filter) {
          let paramTemp = '';

          if (filter.id){
            if (paramTemp) { paramTemp += ' and '; }
            paramTemp += `id eq ${filter.id}`;
          }

          if(filter.executada){
            if(paramTemp){paramTemp += ' and '; }
            paramTemp += `executada eq ${filter.executada}`;
          } 

          if(filter.almoxarifadoId){
            if(paramTemp){paramTemp += ' and '; }
            paramTemp += `almoxarifadoId eq ${filter.almoxarifadoId}`;
          }    

          if(filter.solicitante){
            if(paramTemp){paramTemp += ' and '; }
            paramTemp += `solicitante eq '${filter.solicitante}'`;
          } 

          if(filter.descricao){
            if(paramTemp){paramTemp += ' and '; }
            paramTemp += `descricao eq '${filter.descricao}'`;
          } 

          if(filter.data){
            if(paramTemp){paramTemp += ' and '; }
            paramTemp += `data eq ${filter.data}`;
          }

          if (filter.empreendimentoId){
            if(paramTemp) { paramTemp += ' and '; }
            paramTemp += `empreendimentoId eq ${filter.empreendimentoId}`;
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

  private GetFiltroItens(filter: any) {

    if (!filter) {
      return '';
    }

    let paramTemp = '';

    if (filter.id > 0){
      if (paramTemp) { paramTemp += ' and '; }
      paramTemp += `id eq ${filter.id}`;
    }

    if(filter.empresaId > 0){
      if(paramTemp){paramTemp += ' and '; }
      paramTemp += `empreendimento/empresaId eq ${filter.empresaId}`;
    }

    if(filter.empreendimentoId > 0){
      if(paramTemp){paramTemp += ' and '; }
      paramTemp += `requisicao/empreendimentoId eq ${filter.empreendimentoId}`;
    }

    if(filter.somenteExecutada){
      if(paramTemp){paramTemp += ' and '; }
      paramTemp += `requisicao/executada eq ${filter.somenteExecutada}`;
    } 

    if (filter.dataInicial){
      if (paramTemp) { paramTemp += ' and '; }
      paramTemp += `requisicao/data ge ${filter.dataInicial}`;
    }
    
    if (filter.dataFinal){
      if (paramTemp) { paramTemp += ' and '; }
      paramTemp += `requisicao/data le ${filter.dataFinal}`;
    }

    if (!paramTemp) {
      return '';
    }

    paramTemp = `?$filter=${paramTemp}`;

    return paramTemp;  
  } 

   
   public ListarComFiltro(page:number, pageSize:number, sortBy:any[], desc:any[], search:any, columns:any[], filter:any, include){
      let parametros = this.GetParamentroPaginacaoOrdenacao(page,pageSize, sortBy,desc,search, columns);
      parametros = this.GetFiltro2(parametros, filter);
      return http.get(`Requisicao${parametros}`, this.GetHeader(include));
  } 

  public ListarItensComFiltro(filter: any, include: string){

      const parametros = this.GetFiltroItens(filter);

      return http.get(`Requisicao/Item${parametros}`, this.GetHeader(include));
  }
}    