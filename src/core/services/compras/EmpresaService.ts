import { http } from '@/core/api';
import { Service } from '../Service';
import { SubcontaGlobalDocumentos } from '@/core/models/financeiro/SubcontaGlobalDocumentos';

export  class EmpresaService extends Service {
   
    constructor(){
        super('empresa');   
    } 

    VerificarCnpj(q:any){
        return http.get(`${this.GetNomeControle()}?$filter = cpfCnpj eq '${q}'`)
    }
 
    DocumentoZoop(id:number){
        return http.post(`${this.GetNomeControle()}/${id}/DocumentoZoop`)
    }

    SaldoZoop(id:number){
        return http.get(`${this.GetNomeControle()}/${id}/SaldoZoop`)
    }

    TransferirSaldo(id:number, contaCorrenteId, modelo:any){
        return http.post(`${this.GetNomeControle()}/${id}/ContaCorrente/${contaCorrenteId}/TransferirSaldoZoop`, modelo)
    }

    Extrato(id:number){
        return http.get(`${this.GetNomeControle()}/${id}/Extrato`)
    }

    CarregarFoto(id:number){
        return http.get(`${this.GetNomeControle()}/${id}/CarregarFoto`)
    }

  }
 

    