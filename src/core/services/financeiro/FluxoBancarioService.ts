
import { Service } from '../Service';
import { http } from '../../api';

export class FluxoBancarioService extends Service{
    
        constructor(){ 
            super('despesa');
        }   

    LerArquivoConciliacao(arquivo, contaCorrenteId:number){
        const formData = new FormData();
        formData.append('arquivo', arquivo); 
        
        return http.post(`${this.GetNomeControle()}/LerArquivoConciliacao?contaCorrenteId=${contaCorrenteId}`, formData, 
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }); 
    }

    AtualizarDadosArquivo(contaCorrenteId:Number, ofxModelRetorno){
        return http.post(`${this.GetNomeControle()}/atualizarconciliacao?contaCorrenteId=${contaCorrenteId}`, ofxModelRetorno)
    }

    Conciliar(lista, contaCorrenteId:Number){
        return http.put(`${this.GetNomeControle()}/conciliar?contaCorrenteId=${contaCorrenteId}&usuarioId=${JSON.parse(localStorage.sessionApp.split(".")).dados.usuarioId}`, lista)
    }
}