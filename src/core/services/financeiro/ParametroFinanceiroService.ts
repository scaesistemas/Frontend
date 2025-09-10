import { http } from '@/core/api';
import { Service } from '../Service';

export class ParametroFinanceiroService extends Service {

    constructor() {
        super('financeiro/parametro');
    } 

    ListarParametroFirst(){
        return http.get(`${this.GetNomeControle()}/first/`);
    }
    
    ObterParametroEmpresaPorId(id:number,include?: string){
      return http.get(`${this.GetNomeControle()}/${id}/First`, this.GetHeader(include))
    } 

    CriarSubConta(id, tipoGatewayId, subConta:any){
        //id do  parametro 
        return http.post(`${this.GetNomeControle()}/criarSubConta/${id}?tipoGatewayId=${tipoGatewayId}`, subConta,{
             headers: {
                    'Content-Type': 'application/json'
                }
        });
    }

    EnviarDocumentoSubconta(id, tipoGatewayId, documentos:any){
        //id do  parametro 
        return http.post(`${this.GetNomeControle()}/EnviarDocumentoSubconta/${id}?tipoGatewayId=${tipoGatewayId}`, documentos,{
             headers: {
                    'Content-Type': 'application/json'
                }
        });
    }

    ConsultarSubconta(id, tipoGatewayId){
        //id do  parametro 
        return http.get(`${this.GetNomeControle()}/VerificarSubconta/${id}?tipoGatewayId=${tipoGatewayId}`);
    }
}