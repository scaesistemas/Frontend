import { Iptu, Cmb } from '.';

export default class TaxaImovel{
    public codigoLixo: string = '0';
    public codigoSequencial: string = '0';
    public codigoAgua: string = '0';
    public codigoEnergia: string = '0';
    public codigoGas: string = '0';
    public codigoSpu: string = '0';
    public codigoLuz: string = '0';
    public codigoHidrometro: string = '0';
    public descricao: string = '';
    public apoliceSeguro: number = 0;
    public valorCaucao: number = 0;
    public valorCondominio: number = 0;
    public iptu: Iptu = new Iptu();
    public cmb: Cmb = new Cmb();
}