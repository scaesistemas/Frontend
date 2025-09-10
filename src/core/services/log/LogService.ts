import { http } from '@/core/api';
import { Service } from '../Service';

export class LogService extends Service {

    constructor(){
        super('log');
    }


    ListarCobranca(dataHoraInicial?:string, dataHoraFinal?:string, assinanteId?:any, parcelaId?:any, transacaoId?:any, erro?:any, isCobranca?:any, isBaixa?:any, isEmissaoBoleto?:any, isCancelamento?:any){
        return http.get(`${this.GetNomeControle()}/financeiro/cobranca?dataHoraInicial=${dataHoraInicial}&dataHoraFinal=${dataHoraFinal}&assinanteId=${assinanteId}&parcelaId=${parcelaId}&transacaoId=${transacaoId}&erro=${erro}&isCobranca=${isCobranca}&isBaixa=${isBaixa}&isEmissaoBoleto=${isEmissaoBoleto}&isCancelamento=${isCancelamento}`);
    }
} 