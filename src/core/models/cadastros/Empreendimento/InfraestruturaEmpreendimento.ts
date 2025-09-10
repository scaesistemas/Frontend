import { InfraestruturaLazerImovel } from '../../imobiliaria';
import DimensaoLote from './DimensaoLote';

export default class InfraestruturaEmpreendimento implements Shared.IEntity{
    public id: number = 0;
    public descricao: string = '';
    public areaUnidade: number = 0;
    public areaPublicaTotal: number = 0;
    public areaUsoPublico: number = 0;
    public areaRua: number = 0;
    public areaPrefeitura: number = 0;
    public areaVerde: number = 0;
    public areaReservadoProprietario: number = 0;
    public areaOutras: number = 0;
    public areaTotal?: number = 0;
    public dimensaoLotePadrao = new DimensaoLote();
    public lazer = new InfraestruturaLazerImovel();

    constructor(model?: InfraestruturaEmpreendimento){
        if(!model)
        return;

        this.id = model.id;
        this.descricao = model.descricao;
        this.areaUnidade = model.areaUnidade;
        this.areaPublicaTotal = model.areaPublicaTotal;
        this.areaUsoPublico = model.areaUsoPublico
        this.areaRua = model.areaRua;
        this.areaPrefeitura = model.areaPrefeitura;
        this.areaVerde = model.areaVerde;
        this.areaReservadoProprietario = model.areaReservadoProprietario;
        this.areaOutras = model.areaOutras;
        this.areaTotal = model.areaTotal;
        this.dimensaoLotePadrao = new DimensaoLote(model.dimensaoLotePadrao);
        this.lazer = new InfraestruturaLazerImovel(model.lazer);
    }
} 