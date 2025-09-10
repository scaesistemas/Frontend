
import { Service } from '../Service';
import { http } from '../../api';

export class DespesaService extends Service{
    
        constructor(){ 
            super('despesa'); 
        }   

        ListarParcelasOtimizadas(page: number, pageSize: number, sortBy: any[], desc: any[], search: any, columns: any[], filter, include?:string){
            let parametros = this.GetParamentroPaginacaoOrdenacao(page,pageSize, sortBy,desc,search, columns);
            parametros = this.GetFiltro2(parametros, filter);
            return http.get(`${this.GetNomeControle()}/ListarParcelas${parametros}&numeroDocumento=${filter.numeroDocumento}`,this.GetHeader(include))
        } 
         
 
        private GetFiltro2(parametros: string, filter?: any){
 
            if (filter) {
                let paramTemp = '';
                 if (filter.situacaoId && filter.situacaoId.length != 0){ 
                    paramTemp += `(`
                        
                     for(let i = 0; i < filter.situacaoId.length; i++){
                        if(i == 0)
                        {
                           
                            paramTemp += `situacaoId eq ${filter.situacaoId[i]}`
                        }
                        else
                        {
                            paramTemp += ` or situacaoId eq ${filter.situacaoId[i]} `
                        }
                     }
                     paramTemp += `)`
                 }

                if(filter.empresaId > 0){
                    if (paramTemp) { paramTemp += ' and '; }
                    paramTemp += `empresaId eq ${filter.empresaId}`;
                }

                 if(filter.despesaId > 0){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `despesa/id eq ${filter.despesaId}`
                 }

                 if(filter.dataVencimentoInicial){ 
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `dataVencimentoParcela ge ${filter.dataVencimentoInicial}`
                }

                if (filter.dataVencimentoFinal){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `dataVencimentoParcela le ${filter.dataVencimentoFinal}`
                }

               /*if (filter.contaCorrenteId){
                  if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `contasCorrentesIds/any(o: o eq ${filter.contaCorrenteId})`
              }  */

                if(filter.pedidoId > 0){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `despesa/pedidoId eq ${filter.pedidoId}`;
                } 

                if(filter.fornecedorId > 0){
                    if (paramTemp) { paramTemp += ' and '; }
                    paramTemp += `despesa/fornecedorId eq ${filter.fornecedorId}`;
                }

                if(filter.empreendimentoId > 0){
                    if (paramTemp) { paramTemp += ' and '; }
                    paramTemp += `empreendimentoId eq ${filter.empreendimentoId}`;
                }


                if(filter.dataPagamentoInicial){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `dataPagamentoParcela ge ${filter.dataPagamentoInicial}`
                }
    
                if (filter.dataPagamentoFinal){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `dataPagamentoParcela le ${filter.dataPagamentoFinal}`
                }

                if(filter.centroCustoId > 0){
                    if(paramTemp) { paramTemp += ' and '; }
                    paramTemp += `classificacao/centrosCustoIds/any(o: o eq ${filter.centroCustoId})`;
                }

                if(filter.contaGerencialId > 0){
                    if(paramTemp) { paramTemp += ' and '; }
                    paramTemp += `classificacao/contasGerenciaisIds/any(o: o eq ${filter.contaGerencialId})`;
                }

                if(filter.contaCorrenteId > 0){ 
                    if(paramTemp) { paramTemp += ' and '; }
                    paramTemp += `contasCorrentesIds/any(o: o eq ${filter.contaCorrenteId})`
                }

                if(filter.formaPagamentoId > 0){ 
                    if(paramTemp) { paramTemp += ' and '; }
                    paramTemp += `formasPagamentosIds/any(o: o eq ${filter.formaPagamentoId})`
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
        
        private GetFiltro3(parametros: string, filter?: any){
 
            if (filter) {
                let paramTemp = '';
                 if (filter.situacaoId.length != 0){ 
                    paramTemp += `(`
                        
                     for(let i = 0; i < filter.situacaoId.length; i++){
                        if(i == 0)
                        {
                           
                            paramTemp += `situacaoId eq ${filter.situacaoId[i]}`
                        }
                        else
                        {
                            paramTemp += ` or situacaoId eq ${filter.situacaoId[i]} `
                        }
                     }
                     paramTemp += `)`
                 }

                 if (filter.empreendimentoId > 0){
                    if(paramTemp) { paramTemp += ' and '; }
                    paramTemp += `despesa/empreendimentoId eq ${filter.empreendimentoId}`
                }

                if(filter.empresaId > 0){
                    if (paramTemp) { paramTemp += ' and '; }
                    paramTemp += `despesa/empresaId eq ${filter.empresaId}`;
                }

                 if(filter.id > 0){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `despesa/id eq ${filter.id}`
                 }

                 if(filter.dataPagamentoInicial){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `baixas/any(o: o/dataPagamento ge ${filter.dataPagamentoInicial})`
                }
    
                if (filter.dataPagamentoFinal){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `baixas/any(o: o/dataPagamento le ${filter.dataPagamentoFinal})`
                }


                 if(filter.dataInicial){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `despesa/dataEmissao ge ${filter.dataInicial}`
                 }
    
                 if (filter.dataFinal){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `despesa/dataEmissao le ${filter.dataFinal}`
                 }
    
                 if(filter.dataVencimentoInicial){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `dataVencimento ge ${filter.dataVencimentoInicial}`
                 }

                 if (filter.dataVencimentoFinal){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `dataVencimento le ${filter.dataVencimentoFinal}`
                 }

                 if(filter.despesaId > 0){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `despesa/id eq ${filter.despesaId}`;
                 }    

                 if(filter.pedidoId > 0){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `despesa/pedido/orcamentoId eq ${filter.pedidoId}`;
                 } 

                 if(filter.fornecedorId > 0){
                   if (paramTemp) { paramTemp += ' and '; }
                   paramTemp += `despesa/fornecedorId eq ${filter.fornecedorId}`;
                 }

                 if(filter.empreendimentoId > 0){
                    if (paramTemp) { paramTemp += ' and '; }
                    paramTemp += `despesa/empreendimentoId eq ${filter.empreendimentoId}`;
                  }

                 if(filter.numeroDocumento){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `despesa/numeroDocumento eq '${filter.numeroDocumento}'`;
                 }
                
                 if(filter.centroCustoId > 0){
                     if (paramTemp) { paramTemp += ' and '; }
                     paramTemp += `despesa/classificacoes/any(o: o/centroCustoId eq ${filter.centroCustoId})`;
                 }

                 if(filter.contaGerencialId > 0){
                     if(paramTemp) { paramTemp += ' and '; }
                     paramTemp += `despesa/classificacoes/any(o: o/contaGerencialId eq ${filter.contaGerencialId})`;
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

        ListarComFiltro(page:number, pageSize:number, sortBy:any[], desc:any[], search:any, columns:any[], filter:any, include){
            let parametros = this.GetParamentroPaginacaoOrdenacao(page,pageSize, sortBy,desc,search, columns);
            parametros = this.GetFiltro3(parametros, filter);
            return http.get(`${this.GetNomeControle()}/parcela${parametros}`,this.GetHeader(include))
        }
 
        private GetFiltro4(parametros: string, filter?: any){
 
            if (filter) {
                let paramTemp = '';
                 if (filter.situacaoId.length != 0){ 
                    paramTemp += `(`
                        
                     for(let i = 0; i < filter.situacaoId.length; i++){
                        if(i == 0)
                        {
                           
                            paramTemp += `situacaoId eq ${filter.situacaoId[i]}`
                        }
                        else
                        {
                            paramTemp += ` or situacaoId eq ${filter.situacaoId[i]} `
                        }
                     }
                     paramTemp += `)`
                 }

                 if (filter.empreendimentoId > 0){
                    if(paramTemp) { paramTemp += ' and '; }
                    paramTemp += `despesa/empreendimentoId eq ${filter.empreendimentoId}`
                }

                if(filter.empresaId > 0){
                    if (paramTemp) { paramTemp += ' and '; }
                    paramTemp += `despesa/empresaId eq ${filter.empresaId}`;
                }

                 if(filter.id > 0){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `despesa/id eq ${filter.id}`
                 }

                 if(filter.dataPagamentoInicial){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `baixas/any(o: o/dataPagamento ge ${filter.dataPagamentoInicial})`
                }
    
                if (filter.dataPagamentoFinal){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `baixas/any(o: o/dataPagamento le ${filter.dataPagamentoFinal})`
                }

                 if(filter.dataInicial){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `despesa/dataEmissao ge ${filter.dataInicial}`
                 }
    
                 if (filter.dataFinal){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `despesa/dataEmissao le ${filter.dataFinal}`
                 }
    
                 if(filter.dataVencimentoInicial){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `dataVencimento ge ${filter.dataVencimentoInicial}`
                 }

                 if (filter.dataVencimentoFinal){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `dataVencimento le ${filter.dataVencimentoFinal}`
                 }

                 if(filter.despesaId > 0){
                     if(paramTemp){paramTemp += ' and '; }
                     paramTemp += `despesa/id eq ${filter.despesaId}`;
                 }    

                 if(filter.pedidoId > 0){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `despesa/pedido/orcamentoId eq ${filter.pedidoId}`;
                 } 

                 if(filter.fornecedorId > 0){
                   if (paramTemp) { paramTemp += ' and '; }
                   paramTemp += `despesa/fornecedorId eq ${filter.fornecedorId}`;
                 }

                 if(filter.empreendimentoId > 0){
                    if (paramTemp) { paramTemp += ' and '; }
                    paramTemp += `despesa/empreendimentoId eq ${filter.empreendimentoId}`;
                  }

                 if(filter.numeroDocumento){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `contains(tolower(despesa/numeroDocumento),tolower('${filter.numeroDocumento}'))`;
                }
                
                 if(filter.centroCustoId > 0){
                    if (paramTemp) { paramTemp += ' and '; }
                    paramTemp += `despesa/classificacoes/any(o: o/centroCustoId eq ${filter.centroCustoId})`;
                 }
 
                if(filter.contaGerencialId > 0){ 
                    if(paramTemp) { paramTemp += ' and '; }
                    paramTemp += `despesa/classificacoes/any(o: o/contaGerencialId eq ${filter.contaGerencialId})`;
                } 
 
                if(filter.contaCorrenteId > 0){ 
                    if(paramTemp) { paramTemp += ' and '; }
                    paramTemp += `baixas/any(o: o/contaCorrenteId eq ${filter.contaCorrenteId})`
                }

                if(filter.formaPagamentoId > 0){ 
                    if(paramTemp) { paramTemp += ' and '; }
                    paramTemp += `baixas/any(o: o/formaPagamentoId eq ${filter.formaPagamentoId})`
                }

               /* if(filter.conciliado == false){ 
                    if(paramTemp) { paramTemp += ' and '; }
                    paramTemp += `(not baixas/any() or baixas/any(o: o/conciliado eq ${filter.conciliado}))`
                }*/
 
               if (paramTemp) {
        
                if(parametros){
                  parametros += '&';
                }
                else {
                  parametros += '?';
                }
                //and not baixas/any(o: o/cancelado eq true)
                parametros += `$filter=${paramTemp}`;
                }
            }
        
            return parametros;  
        } 
 

        ListarParcelas(page: number, pageSize: number, sortBy: any[], desc: any[], search?: any, columns?: any[], filter?: any,expand?:string, select?:string, include?: string){
            let parametros = this.GetParamentroPaginacaoOrdenacao(page, pageSize, sortBy, desc, search, columns, filter, expand, select);
            
            parametros = this.GetFiltro4(parametros, filter);
            return http.get(`${this.GetNomeControle()}/parcela${parametros}`, this.GetHeader(include))
        }
 
         
        private GetFiltroDespesa(parametros: string, filter?: any){

            if (filter) {
                let paramTemp = '';
    
                if (filter.empreendimentoId > 0){
                    if(paramTemp) { paramTemp += ' and '; }
                    paramTemp += `empreendimentoId eq ${filter.empreendimentoId}`
                }

                if (filter.dataVencimentoInicial){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `parcelas/any(o: o/dataVencimento ge ${filter.dataVencimentoInicial})`
                }

                if (filter.dataVencimentoFinal){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `parcelas/any(o: o/dataVencimento le ${filter.dataVencimentoFinal})`
                }

                if(filter.numeroDocumento){
                    if(paramTemp){paramTemp += ' and '; }
                    paramTemp += `numeroDocumento eq tolower('${filter.numeroDocumento})'`;
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

        ListarDespesaComFiltro(page:number, pageSize:number, sortBy:any[], desc:any[], search:any, columns:any[], filter:any, include){
            let parametros = this.GetParamentroPaginacaoOrdenacao(page,pageSize, sortBy,desc,search, columns);
            parametros = this.GetFiltroDespesa(parametros, filter);
            return http.get(`${this.GetNomeControle()}${parametros}`,this.GetHeader(include))
        } 
        
        CancelarBaixa(id:any){
            return http.put(`${this.GetNomeControle()}/Baixa/${id}/Cancelar`);
        }

        VerificarNumeroDocumento(q:any){
            return http.get(`${this.GetNomeControle()}/parcela?$filter = despesa/numeroDocumento eq '${q}'`)
        }
    
        ObterParcelaPorId(id: any, include?: string){
            return http.get(`${this.GetNomeControle()}/parcela/${id}`, this.GetHeader(include));
        }
     
        ExcluirParcela(id: number){
            return http.delete(`${this.GetNomeControle()}/parcela/${id}`);
        }

        CancelarParcela(id: number){
            return http.put(`${this.GetNomeControle()}/parcela/${id}/cancelar`);
        } 

         CancelarDespesa(id: number){
            return http.put(`${this.GetNomeControle()}/${id}/cancelar`);
        } 
    
        ObterDocumento(id: number){
            return http.get(`${this.GetNomeControle()}/${id}/documento`);
        } 
    
        BaixarParcela(id: number, modelo){
            return http.put(`${this.GetNomeControle()}/parcela/${id}/baixar`, modelo);
        } 
    
        EditarParcela(id: number, modelo){
            return http.put(`${this.GetNomeControle()}/parcela/${id}`, modelo);
        }
 
        BaixarDocumento(id:number){
            return http.get(`${this.GetNomeControle()}/documento/${id}/download`, {responseType: 'blob'});
        }

        DeletarDocumento(id:number){
            return http.delete(`${this.GetNomeControle()}/documento/${id}`);
        }

        BaixarComprovante(id:number){
            return http.get(`${this.GetNomeControle()}/parcela/baixa/${id}/downloadcomprovante`, {responseType: 'blob'});
        }

        GerarDespesaPedido(modelo){
            return http.post(`${this.GetNomeControle()}/pedido`, modelo);
        }

        BaixarMultiplasParcelas(modelo){
            return http.post(`${this.GetNomeControle()}/baixar/parcelas`, modelo)
        }
}