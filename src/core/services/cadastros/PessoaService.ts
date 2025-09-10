import { http, httpHeader } from '@/core/api';
import { Service } from '../Service';
export class PessoaService extends Service {

    constructor() {
        super('pessoa');  
    }

    public ListarPessoas(){
      return http.get(`${this.GetNomeControle()}/ListarPessoas`)
    }

    public AutoCompletePessoa(q: string) {
      return http.get(`${this.GetNomeControle()}/AutoComplete`, {
        params: {
          q: q
        },
        headers: httpHeader.headers
      });
    }

    CriarUsuario(cpfCnpj: string){
      return http.post(`${this.GetNomeControle()}/criarusuario`, null, {
          params:{
              cpfCnpj
          }
      })
    }

    VerificarCnpj(q:any){
        return http.get(`${this.GetNomeControle()}?$filter = cnpjCpf eq '${q}'`)
    }
} 