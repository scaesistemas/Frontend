import { Endereco } from '../shared';
import { TaxaImovel, LegalizacaoImovel, InfraestruturaImovel, Foto } from '.';
import { Empresa } from '../cadastros';
import DisponibilidadeOperacao from './DisponibilidadeOperacao';
import ImovelProprietario from './ImovelProprietario';
import TipoImovel from './TipoImovel';

export default class Imovel implements Shared.IEntity{
    public id: number = 0;
    public tipoImovel?: TipoImovel
    public tipoImovelId = 8;
    public nome: string = '';
    public empresaId: number = 0;
    public empresa?: Empresa;
    public codigo: string = '';
    public exclusivo: boolean = false;
    public ocupado: boolean = false;
    public alugado: boolean = false;
    public placa: boolean = false;
    public financiavel: boolean = false;
    public naPlanta: boolean = false;
    public descricao: string = '';
    public dataVencimentoAutorizacao: string = new Date().yyyymmdd();
    public disponibilidadeOperacao: DisponibilidadeOperacao = new DisponibilidadeOperacao();
    public valorAluguel: number = 0;
    public valorVenda: number = 0;
    public taxaAdmMensal: number = 0;
    public valorIndicacao: number = 0;
    public percentualIndicacao: number = 0;
    public endereco: Endereco = new Endereco();
    public taxa: TaxaImovel = new TaxaImovel();
    public infraestrutura: InfraestruturaImovel = new InfraestruturaImovel();
    public proprietarios: ImovelProprietario[] = [];
    public fotos: Foto[] = [];

    constructor(model?: Imovel){
        Object.assign(this, model);
    }
}