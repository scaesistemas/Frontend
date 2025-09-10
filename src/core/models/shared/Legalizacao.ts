import { Cartorio } from '../imobiliaria';

export default class Legalizacao{
    public matricula: string = '';
    public rgi: string = '';
    public numeroProcesso: number = 0;
    public orgaoEmissor: string = '';
    public livroNumero: string = '';
    public escrituraLavrada: string = '';
    public incricaoCadastral: string = '';
    public cartorioId!: number;
    public cartorio?: Cartorio;
    public observacao: string = '';

    constructor(model?: Legalizacao){
        if(!model)
        return;
        
        this.matricula = model.matricula;
        this.rgi = model.rgi;
        this.numeroProcesso = model.numeroProcesso;
        this.orgaoEmissor = model.orgaoEmissor;
        this.livroNumero = model.livroNumero;
        this.escrituraLavrada = model.escrituraLavrada;
        this.incricaoCadastral = model.incricaoCadastral;
        this.cartorioId = model.cartorioId;
        this.observacao = model.observacao;
    }
}