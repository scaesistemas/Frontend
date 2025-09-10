import { http } from '@/core/api';
import { Service } from '../Service';

export class PedidoService extends Service {
    
    constructor(){ 
        super('pedido');   
    }  

    ReceberPedido(id: number,modelo: any){
      return http.put(`${this.GetNomeControle()}/Item/${id}/receber`,modelo);
    } 

    ReceberItens(lista){
      return http.put(`${this.GetNomeControle()}/Item/receberItens`, lista);
    }
 
   private GetFiltro2(parametros: string, filter: any){

        if (filter) { 
            let paramTemp = '';

            if (filter.orcamentoId){
                if (paramTemp) { paramTemp += ' and '; }
                paramTemp += `orcamentoId eq ${filter.orcamentoId}`;
            }

            if(filter.fornecedorId){
                if(paramTemp){ paramTemp += ' and '; }
                paramTemp += `fornecedorId eq ${filter.fornecedorId}`;
            }

            if(filter.conferente){
                if(paramTemp){ paramTemp += ' and '; }
                paramTemp += `conferente eq '${filter.conferente}'`;
            }
            if(filter.tipoId){
                if(paramTemp){paramTemp += ' and '; }
                paramTemp += `tipoId eq ${filter.tipoId}`;
            }

            if(filter.dataEmissao){
                if(paramTemp){paramTemp += ' and '; }
                paramTemp += `dataEmissao eq ${filter.dataEmissao} `;
            }

            if(filter.dataEmissao){
                if(paramTemp){paramTemp += ' and '; }
                paramTemp += `dataEmissao eq ${filter.dataEmissao} `;
            }
            if(filter.dataEntrega){
                if(paramTemp){paramTemp += ' and '; }
                paramTemp += `dataEntrega eq ${filter.dataEntrega} `;
            }
             
            if(filter.descricao){
                if(paramTemp){paramTemp += ' and '; }
                paramTemp += `orcamento/descricao eq '${filter.descricao}' `;
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

        if(filter.orcamentoId > 0){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `pedido/orcamentoId eq ${filter.orcamentoId}`;
        }

        if(filter.usuarioId > 0){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `pedido/orcamento/aprovacao/usuarioId eq ${filter.usuarioId}`;
        }

        if (filter.dataHoraInicial){
          if (paramTemp) { paramTemp += ' and '; }
          paramTemp += `pedido/orcamento/aprovacao/dataHora ge ${filter.dataHoraInicial}`;
        }
        
        if (filter.dataHoraFinal){
          if (paramTemp) { paramTemp += ' and '; }
          paramTemp += `pedido/orcamento/aprovacao/dataHora le ${filter.dataHoraFinal}`;
        }

        if(filter.fornecedorId > 0){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `pedido/fornecedorId eq ${filter.fornecedorId}`;
        }
    
        if(filter.empresaId > 0){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `pedido/empresaId eq ${filter.empresaId}`;
        }
    
        if (filter.dataInicial){
          if (paramTemp) { paramTemp += ' and '; }
          paramTemp += `pedido/dataEmissao ge ${filter.dataInicial}`;
        }
        
        if (filter.dataFinal){
          if (paramTemp) { paramTemp += ' and '; }
          paramTemp += `pedido/dataEmissao le ${filter.dataFinal}`;
        }

        if (filter.dataEntregaInicial){
          if (paramTemp) { paramTemp += ' and '; }
          paramTemp += `pedido/dataEntrega ge ${filter.dataEntregaInicial}`;
        }
        
        if (filter.dataEntregaFinal){
          if (paramTemp) { paramTemp += ' and '; }
          paramTemp += `pedido/dataEntrega le ${filter.dataEntregaFinal}`;
        }
    
        if (!paramTemp) {
          return '';
        }
    
        paramTemp = `?$filter=${paramTemp}`;
    
        return paramTemp;  
    } 

    ListarComFiltro(page:number, pageSize:number, sortBy:any[], desc:any[], search:any, columns:any[], filter:any, include){
        let parametros = this.GetParamentroPaginacaoOrdenacao(page,pageSize, sortBy,desc,search, columns);
        parametros = this.GetFiltro2(parametros, filter);
        return http.get(`${this.GetNomeControle()}${parametros}`, this.GetHeader(include))
    }

    public ListarItensComFiltro(filter: any, include: string){

        const parametros = this.GetFiltroItens(filter);
  
        return http.get(`Pedido/Item${parametros}`, this.GetHeader(include)); 
    } 


    LerArquivoXml(arquivo){
      const formData = new FormData();
        formData.append('arquivo', arquivo); 
        
        return http.post(`${this.GetNomeControle()}/LerArquivoXML`, formData, 
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

  AdicionarCodigoFornecedor(fornecedorId:number, pedidoXml){
    return http.put(`${this.GetNomeControle()}/AdicionarCodigoFornecedor?fornecedorId=${fornecedorId}`, pedidoXml)
  }

  AssociarEReceberProdutos(pedidoId:number, fornecedorId:number, pedidoXml){
    return http.put(`${this.GetNomeControle()}/AssociarEReceberXml/${pedidoId}/?fornecedorId=${fornecedorId}`, pedidoXml)
  }
}
 
 
     