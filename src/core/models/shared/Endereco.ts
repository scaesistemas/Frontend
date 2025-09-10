export default class Endereco {
    public cep: string = '';
    public logradouro: string = '';
    public numero: string = '';
    public complemento: string = '';
    public bairro: string = '';
    public municipioId: number = 0;
    public estadoId: number = 0;
 
    constructor(cep: string = '', logradouro: string = '', bairro: string = '', municipioId: number = 0, estadoId: number = 0) {
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.municipioId = municipioId;
        this.estadoId = estadoId;
    }
}