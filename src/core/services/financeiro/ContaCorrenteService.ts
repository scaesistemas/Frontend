import { http } from '@/core/api';
import { Service } from '../Service';

export class ContaCorrenteService extends Service {

    constructor(){
        super('contacorrente');
    }
    RegistrarCertificado(id, certificado){        
        return http.post(`${this.GetNomeControle()}/${id}/RegistrarCertificado`, certificado);
    }

    RemoverCertificado(id, certificadoId){        
        return http.delete(`${this.GetNomeControle()}/${id}/RemoverCertificado/${certificadoId}`);
    }

    UploadCertificadoDigital(id, arquivo){
        const formData = new FormData();
        formData.append('certificado', arquivo); 
        
        return http.post(`${this.GetNomeControle()}/${id}/certificadodigital`, formData, 
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
}