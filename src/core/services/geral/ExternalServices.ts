import { http } from '@/core/api';
import { Endereco } from '@/core/models/shared';

export default class ExternalServices {
    private cors: string = "https://cors-anywhere.herokuapp.com/";

    public PesquisaCep(cep: string) {

        return new Promise<Endereco>((res, rej) => {

            let url = `${this.cors}https://viacep.com.br/ws/${cep}/json/`;

            http.get(url)
                .then(response => {
                    
                    if (response.data.hasOwnProperty('erro'))
                        rej('Ocorreu um erro.');

                    let endereco: Endereco = new Endereco(cep, response.data.logradouro, response.data.bairro, +response.data.ibge, +response.data.ibge.slice(0, 2));
                    res(endereco);

                })
                .catch(response => {
                    rej(response);
                })
        })
    }
}