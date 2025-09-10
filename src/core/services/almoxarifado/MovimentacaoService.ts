import { Service } from '../Service';
import Transferencia from '@/core/models/almoxarifado/Transferencia';
import {http, httpHeader} from '../../api';

export default class MovimentacaoService extends Service{
    constructor(){
        super('movimentacao');
    }

    public async Transferir(modelo: Transferencia){
        return await http.post(`${this.GetNomeControle()}/transferir`, modelo, httpHeader);
    }

     private GetFiltro2(filter: any) { 

        if (!filter) {
          return '';
        }
    
        let paramTemp = '';
    
        if (filter.id > 0){
          if (paramTemp) { paramTemp += ' and '; }
          paramTemp += `id eq ${filter.id}`;
        }
    
        if(filter.tipoOrigemId > 0){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `tipoOrigemId eq ${filter.tipoOrigemId}`;
        }

        if(filter.tipoId > 0){
            if(paramTemp){paramTemp += ' and '; }
            paramTemp += `tipoId eq ${filter.tipoId}`;
          }

        if(filter.produtoId > 0){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `almoxarifadoItem/produtoId eq ${filter.produtoId}`;
        }

        if(filter.tipoProdutoId > 0){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `almoxarifadoItem/produto/tipoId eq ${filter.tipoProdutoId}`;
        }
     
       
        if(filter.empreendimentoId > 0){
           if(paramTemp){paramTemp += ' and '; }
           paramTemp += `empreendimentoConsumidorId eq ${filter.empreendimentoId}`;
         }

        if(filter.almoxarifadoId > 0){
            if(paramTemp){paramTemp += ' and '; }
            paramTemp += `almoxarifadoItem/almoxarifadoId eq ${filter.almoxarifadoId}`;
          }
    
        if (filter.dataInicial){
          if (paramTemp) { paramTemp += ' and '; }
          paramTemp += `dataHora ge ${filter.dataInicial}`;
        }
        
        if (filter.dataFinal){
          if (paramTemp) { paramTemp += ' and '; }
          paramTemp += `dataHora le ${filter.dataFinal}`;
        }
    
        if (!paramTemp) {
          return '';
        }
    
        paramTemp = `?$filter=${paramTemp}`;
    
        return paramTemp;  
      } 

    public ListarComFiltro(filter: any, include: string){

        const parametros = this.GetFiltro2(filter);
  
        return http.get(`movimentacao${parametros}`, this.GetHeader(include));
    } 
}