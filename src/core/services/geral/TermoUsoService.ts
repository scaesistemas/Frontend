import { http } from '@/core/api';
import { Service } from '../Service';

export class TermoUsoService extends Service {
    constructor(){
        super('termoUso');   
    }

    ObterTermosDeUsoVigente(){
        return http.get(`${this.GetNomeControle()}/Vigente`, this.GetHeader());
    }
  }


    