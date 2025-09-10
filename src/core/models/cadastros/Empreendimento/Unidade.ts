import { ConfrontanteUnidade, DisponibilidadeOperacaoUnidade, Grupo, LegalizacaoUnidade, MapaCoordenada, SituacaoUnidade, TipoUnidade, VicioUnidade } from '..';
import { PlanoPagamentoModelo } from '../../contratos';
import { ConfrontanteLote, Imovel, Jazigo, Lote } from '../../imobiliaria';
import { Endereco } from '../../shared';
import Pessoa from '../Pessoa';
import ProprietarioUnidade from './ProprietarioUnidade';

export default class Unidade implements Shared.IEntity{
    public id: number = 0;
    public nome: string = '';
    public grupoId: number = 0;
    public grupo?: Grupo;
    public codigo: string = ''; 

    public endereco: Endereco = new Endereco();
    public imovel:any = new Imovel();
    public jazigo?: Jazigo = new Jazigo();
    public lote?: Lote = new Lote();

    public situacaoId: number = 1;
    public situacao?: SituacaoUnidade;
    public tipoId: number = 0;
    public tipo?: TipoUnidade;
    public descricao: string = '';
    public construtoraId?: number;
    public construtora?: Pessoa;
    public administradoraId?: number;
    public administradora?: Pessoa;
    public valorVenda: number = 0;
    public valorIndicacao: number = 0;
    public taxaAdmMensal: number = 0;
    public percentualIndicacao: number = 0;
    public disponibilidadeOperacao: DisponibilidadeOperacaoUnidade = new DisponibilidadeOperacaoUnidade();
    public legalizacao: LegalizacaoUnidade = new LegalizacaoUnidade();
    public proprietarios: ProprietarioUnidade[] = [];
    public vicios: VicioUnidade[] = [];
    public excluido:boolean = false;
    public mapaCoordenada = new MapaCoordenada();
    public empreendimentoId!: number;

    public kmlId!: string;

    public planoPagamento:any = new PlanoPagamentoModelo();
    public valorTotalUnidade:number = 0;
    public valorEntradaPlanoPagamento:number = 0;
    public valorFinanciamentoPlanoPagamento:number = 0;
    public valorIntermediariaPlanoPagamento:number = 0;

    public confrontante = new ConfrontanteUnidade();
    public atualizarComPlanoPagamentoModelo:boolean = false;
    public modeloPlanoPagamentoId!:number;
    public confrontantesAdicionais = [];

    public destinoLixo:string = "";
    public energiaEletrica:string = "";
    public iptu:string = "";
    public formaAquisicaoUnidade:string = "";
    public edificacao:string = "";
    public regularizacaoFundiaria:boolean = false;
    public abastecimentoAgua:string = "";
    public escoamentoSanitario:string = "";
    public ocupacoes:number = 0;

  
    constructor(model?: Unidade){
        
        if(!model)
            return;
 
        this.id = model.id;
        this.nome = model.nome;
        this.grupoId = model.grupoId;
        this.grupo = model.grupo;
        this.codigo = model.codigo;

        this.endereco = model.endereco;
        this.imovel = model.imovel ? new Imovel(model.imovel) : undefined;
        this.lote = new Lote(model.lote);
        this.jazigo = new Jazigo(model.jazigo);
        this.situacaoId = model.situacaoId;
        this.situacao = model.situacao;
        this.tipoId = model.tipoId;
        this.tipo = model.tipo;
        this.descricao = model.descricao;
        this.construtoraId = model.construtoraId;
        this.administradoraId = model.administradoraId;
        this.valorVenda = model.valorVenda;
        this.valorIndicacao = model.valorIndicacao;
        this.taxaAdmMensal = model.taxaAdmMensal;
        this.percentualIndicacao = model.percentualIndicacao;
        this.disponibilidadeOperacao = new DisponibilidadeOperacaoUnidade(model.disponibilidadeOperacao);
        this.legalizacao = new LegalizacaoUnidade(model.legalizacao);
        this.proprietarios = model.proprietarios;
        this.vicios = model.vicios;
        this.mapaCoordenada = new MapaCoordenada(model.mapaCoordenada); 
        this.empreendimentoId = model.empreendimentoId;
        this.kmlId = model.kmlId;

        /* Plano de pagamento */
        this.planoPagamento = model.planoPagamento != null  ? model.planoPagamento : null;
        this.valorEntradaPlanoPagamento = model.valorEntradaPlanoPagamento;
        this.valorFinanciamentoPlanoPagamento = model.valorFinanciamentoPlanoPagamento;
        this.valorIntermediariaPlanoPagamento = model.valorIntermediariaPlanoPagamento;
        this.valorTotalUnidade = model.valorTotalUnidade;

        this.confrontante = new ConfrontanteUnidade(model.confrontante); 
        this.atualizarComPlanoPagamentoModelo = model.atualizarComPlanoPagamentoModelo;
        this.modeloPlanoPagamentoId = model.modeloPlanoPagamentoId;
        this.confrontantesAdicionais  = model.confrontantesAdicionais;
        
        this.destinoLixo = model.destinoLixo;
        this.energiaEletrica = model.energiaEletrica;
        this.iptu = model.iptu;
        this.formaAquisicaoUnidade = model.formaAquisicaoUnidade;
        this.edificacao = model.edificacao;
        this.regularizacaoFundiaria = model.regularizacaoFundiaria;
        this.abastecimentoAgua = model.abastecimentoAgua;
        this.escoamentoSanitario = model.escoamentoSanitario;
        this.ocupacoes = model.ocupacoes;
    }
}

export enum EnumTipoUnidade{
    Lote = 1,
    Imovel = 2,
    Jazigo = 3,
} 