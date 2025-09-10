import { Service } from '../Service';
import { http, httpHeader } from '@/core/api';
export class EnderecoService extends Service {
    constructor(){
        super('endereco/estado/');   
    } 

    ListarEstados(){
        return http.get(`endereco/estado?$orderby=nome`, httpHeader);
    }
    
    BuscarEstadoPorId(isEstadual: number = 0){
        return http.get(`endereco/estado/${isEstadual}`, httpHeader);
    }
 
    ListarMunicipiosPorIdEstadual(idEstadual: number = 0){
        return http.get(`endereco/estado/${idEstadual}/municipio?$orderby=nome`, httpHeader);
    }
    
    BuscarMunicipioPorId(id: number = 0){
        return http.get(`endereco/estado/municipio/${id}`, httpHeader);
    }
      
    EncontrarEnderecoPorCep(cep: string){
        return http.get(`endereco/cep/${cep}`, httpHeader);
    }
  }
      