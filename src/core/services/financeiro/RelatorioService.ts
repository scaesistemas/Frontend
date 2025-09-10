import { Service } from '../Service';
import {http } from '../../api'

export class RelatorioService extends Service{
    constructor(){
        super('financeiro/relatorio');  
    } 


     ListarCobranca(dataHoraInicial?:string, dataHoraFinal?:string, assinanteId?:any, parcelaId?:any, transacaoId?:any, erro?:any, isCobranca?:any, isBaixa?:any, isEmissaoBoleto?:any, isCancelamento?:any){
        return http.get(`https://api-logger.scae.adm.br/api/financeiro/cobranca?dataHoraInicial=${dataHoraInicial}&dataHoraFinal=${dataHoraFinal}&assinanteId=${assinanteId}&parcelaId=${parcelaId}&transacaoId=${transacaoId}&erro=${erro}&isCobranca=${isCobranca}&isBaixa=${isBaixa}&isEmissaoBoleto=${isEmissaoBoleto}&isCancelamento=${isCancelamento}`);
     }

    GetRelatorioVgv(empresasIds, empreendimentosIds, taxa, ano, correcaoCarteira, reajusteEstoque, diasInadimplente?:number){
        var concatempresasIds = this.concatIds(empresasIds, 'empresasIds');
        var concatempreendimentosIds = this.concatIds(empreendimentosIds, 'empreendimentosIds');

        return http.get(`${this.GetNomeControle()}/vgv?${concatempresasIds}${concatempreendimentosIds}&taxa=${taxa}&ano=${ano}&correcaoCarteira=${correcaoCarteira}&reajusteEstoque=${reajusteEstoque}&diasInadimplente=${diasInadimplente}`)
    }
    
    ObterRelatorioFundoReserva(empresasIds, empreendimentosIds, unidadesIds){
        var concatempresasIds = this.concatIds(empresasIds, 'empresasIds');
        var concatempreendimentosIds = this.concatIds(empreendimentosIds, 'empreendimentosIds');
        var concatunidadesIds = this.concatIds(unidadesIds, 'unidadesIds');

        return http.get(`${this.GetNomeControle()}/GetRelatorioVgv?${concatempresasIds}${concatempreendimentosIds}${concatunidadesIds}`)
    }

    ObterRelatorioSped(empresasIds, empreendimentosIds, unidadesIds){
        var concatempresasIds = this.concatIds(empresasIds, 'empresasIds');
        var concatempreendimentosIds = this.concatIds(empreendimentosIds, 'empreendimentosIds');
        var concatunidadesIds = this.concatIds(unidadesIds, 'unidadesIds');

        return http.get(`${this.GetNomeControle()}/GetRelatorioVgv?${concatempresasIds}${concatempreendimentosIds}${concatunidadesIds}`)
    }
  
    ObterRelatorioDimob(situacaoContratoId: number[], empresasIds: number[], empreendimentosIds: number[], ano:string){
        var concatempreendimentosIds = this.concatIds(empreendimentosIds, 'empreendimentosIds');
        var concatempresasIds = this.concatIds(empresasIds, 'empresasIds');
        var concatsituacaosIds = this.concatIds(situacaoContratoId, 'situacaoContratoId');

        return http.get(`${this.GetNomeControle()}/ObterRelatorioDimob?${concatsituacaosIds}${concatempresasIds}${concatempreendimentosIds}ano=${ano}`)
    }

    ObterRelatorioEFD(empresasIds:number[], empreendimentosIds:number[], clienteId: number,ano:string, dataPagamentoInicial:string, dataPagamentoFinal:string){
        var concatempresasIds = this.concatIds(empresasIds, 'empresasIds');
        var concatempreendimentosIds = this.concatIds(empreendimentosIds, 'empreendimentosIds');

        return http.get(`${this.GetNomeControle()}/obterRelatorioEFD?${concatempresasIds}${concatempreendimentosIds}clienteId=${clienteId}&ano=${ano}&dataPagamentoInicial=${dataPagamentoInicial}&dataPagamentoFinal=${dataPagamentoFinal}`)
    }

    GetRelatorioCobrancas(empresaId:number[], dataEmissaoInicial:string, dataEmissaoFinal:string) {
        var concatEmpresaId = this.concatIds(empresaId, 'empresaId');

        return http.get(`${this.GetNomeControle()}/GetRelatorioCobrancas?${concatEmpresaId}&dataEmissaoInicial=${dataEmissaoInicial}&dataEmissaoFinal=${dataEmissaoFinal}`);
    }

    GetRelatorioWppEnviados(empresaId:number[], dataEmissaoInicial:string, dataEmissaoFinal:string) {
        var concatEmpresaId = this.concatIds(empresaId, 'empresaId');

        return http.get(`${this.GetNomeControle()}/GetRelatorioWppEnviados?${concatEmpresaId}&dataEmissaoInicial=${dataEmissaoInicial}&dataEmissaoFinal=${dataEmissaoFinal}`);
    }

    GetRelatorioContratoDigital(empresasIds: number[], dataEmissaoInicial: string, dataEmissaoFinal: string, dataEnvioAssinaturaInicial: string, dataEnvioAssinaturaFinal: string, dataAssinaturaInicial: string, dataAssinaturaFinal: string) {
        var concatEmpresasIds = this.concatIds(empresasIds, 'empresasIds');
        
        return http.get(`${this.GetNomeControle()}/GetRelatorioContratoDigital?${concatEmpresasIds}&dataEmissaoInicial=${dataEmissaoInicial}&dataEmissaoFinal=${dataEmissaoFinal}&dataEnvioAssinaturaInicial=${dataEnvioAssinaturaInicial}&dataEnvioAssinaturaFinal=${dataEnvioAssinaturaFinal}&dataAssinaturaInicial=${dataAssinaturaInicial}&dataAssinaturaFinal=${dataAssinaturaFinal}`);
    }
    
    ListarTaxaAdm(empreendimentoId:any, empresaId:number, isBaixaAutomatica:boolean, dataVencimentoInicial:string, dataVencimentoFinal:string, dataPagamentoInicial:string, dataPagamentoFinal:string){
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');

        return http.get(`${this.GetNomeControle()}/taxaAdm?${concatEmpreendimento}${concatEmpresa}&isBaixaAutomatica=${isBaixaAutomatica}&dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}&dataPagamentoInicial=${dataPagamentoInicial}&dataPagamentoFinal=${dataPagamentoFinal}`);
    }
 
    ListarRecibiveisProprietarios(empreendimentoId:[], empresaId:[],situacaoParcelaId:[], isBaixaAutomatica:boolean, dataVencimentoInicial:string, dataVencimentoFinal:string, dataPagamentoInicial:string, dataPagamentoFinal:string, isTaxaCorretor:string){
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatsituacaoParcelaId = this.concatIds(situacaoParcelaId, 'situacaoParcelaId');

        return http.get(`${this.GetNomeControle()}/recebiveisProprietario?${concatEmpreendimento}${concatEmpresa}${concatsituacaoParcelaId}isBaixaAutomatica=${isBaixaAutomatica}&dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}&dataPagamentoInicial=${dataPagamentoInicial}&dataPagamentoFinal=${dataPagamentoFinal}&isTaxaCorretor=${isTaxaCorretor}`);
    }
 
    ListarDespesaDetalhada(formaPagamento:string, empreendimentoId:string, usuarioBaixa:string, fornecedorId:string, situacaoParcelaId:string,tipoDespesaId:string, dataVencimentoInicial:string, dataVencimentoFinal:string, dataBaixaInicial:string, dataBaixaFinal:string, empresaId:string, despesaId:string, numeroDocumento:string,centroCustoId:string, contaGerencialId:string, contaCorrenteId:string, dataEmissaoInicial:string, dataEmissaoFinal:string){
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatSituacaoParcela = this.concatIds(situacaoParcelaId, 'situacaoParcelaId');
        var concatTipoDespesa = this.concatIds(tipoDespesaId, 'tipoDespesaId');
 
        return http.get(`${this.GetNomeControle()}/despesaDetalhada?&formaPagamento=${formaPagamento}&${concatEmpreendimento}usuarioBaixa=${usuarioBaixa}&fornecedorId=${fornecedorId}&${concatSituacaoParcela}${concatTipoDespesa}dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}
        &dataBaixaInicial=${dataBaixaInicial}&dataBaixaFinal=${dataBaixaFinal}&${concatEmpresa}despesaId=${despesaId}&numeroDocumento=${numeroDocumento}&centroCustoId=${centroCustoId}&contaGerencialId=${contaGerencialId}&contaCorrenteId=${contaCorrenteId}&dataEmissaoInicial=${dataEmissaoInicial}&dataEmissaoFinal=${dataEmissaoFinal}`)
    }
 
    GetKPITotalRecebiveis(empreendimentoId:any, empresaId:any, dataInicial:string, dataFinal:string){
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');

        return http.get(`${this.GetNomeControle()}/KPITotalRecebiveis?${concatEmpreendimento}${concatEmpresa}dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    }

    GetKPIDisponibilidadeLotes(empreendimentoId:any, empresaId:any){
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');

        return http.get(`${this.GetNomeControle()}/KPIDisponibilidadeLotes?${concatEmpreendimento}${concatEmpresa}`);
    }

    GetKPIAditamentos(empreendimentoId:any, empresaId:string, dataInicial:string, dataFinal:string){
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');

        return http.get(`${this.GetNomeControle()}/KPIAditamentos?${concatEmpreendimento}${concatEmpresa}dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    }

    GetKPIVendidosCorretor(empreendimentoId:any, empresaId:any, dataInicial:string, dataFinal:string){
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');

        return http.get(`${this.GetNomeControle()}/KPIVendidosCorretor?${concatEmpreendimento}${concatEmpresa}dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    }

    GetKPIVendasContrato(empreendimentoId:any, empresaId:any, dataInicial:string, dataFinal:string){
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');

        return http.get(`${this.GetNomeControle()}/KPIVendasContrato?${concatEmpreendimento}${concatEmpresa}dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    }


    GetKPISituacaoReguaCobranca(empreendimentoId:[], empresaId:string, dataInicial:string, dataFinal:string){
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');

        return http.get(`${this.GetNomeControle()}/KPISituacaoReguaCobranca?${concatEmpreendimento}empresaId=${empresaId}&dataInicial=${dataInicial}&dataFinal=${dataFinal}`);
    }

    FluxoCaixa(centroCustoId: string, contaGerencialId: string,contaGerencialTipo: string | null,dataEmissaoInicial: string,dataEmissaoFinal: string,dataVencimentoInicial: string,dataVencimentoFinal: string,dataBaixaInicial: string, dataBaixaFinal: string,somenteComValor: string){
        return http.get(`${this.GetNomeControle()}/fluxocaixa?centroCustoId=${centroCustoId}&contaGerencialId=${contaGerencialId}&dataEmissaoInicial=${dataEmissaoInicial}&dataEmissaoFinal=${dataEmissaoFinal}&dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}&dataBaixaInicial=${dataBaixaInicial}&dataBaixaFinal=${dataBaixaFinal}&somenteComValor=${somenteComValor}`);
    }

    ListarFluxoCaixa(empreendimentoId:string, empresaId:string, dataInicioEmissao:string, dataFimEmissao:string, dataVencimentoInicial:string, dataVencimentoFinal:string, dataBaixaInicial:string, dataBaixaFinal:string, formaPagamentoId:string, contaCorrenteId:string){
        return http.get(`${this.GetNomeControle()}/fluxoCaixa?empreendimentoId=${empreendimentoId}&empresaId=${empresaId}&dataInicioEmissao=${dataInicioEmissao}&dataFimEmissao=${dataFimEmissao}&dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}&dataBaixaInicial=${dataBaixaInicial}&dataBaixaFinal=${dataBaixaFinal}&formaPagamentoId=${formaPagamentoId}&contaCorrenteId=${contaCorrenteId}`)
    }

    ListarReceita(id:any, dataInicioEmissao:string,dataFimEmissao:string, dataVencimentoInicial:string, dataVencimentoFinal, dataBaixaInicial:string, dataBaixaFinal:string){
        return http.get(`${this.GetNomeControle()}/receita/${id}?dataInicioEmissao=${dataInicioEmissao}&dataFimEmissao=${dataFimEmissao}&dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}&dataBaixaInicial=${dataBaixaInicial}&dataBaixaFinal=${dataBaixaFinal}`)
    } 
    
    ListarCusto(id:any, dataInicioEmissao:string,dataFimEmissao:string, dataVencimentoInicial:string, dataVencimentoFinal, dataBaixaInicial:string, dataBaixaFinal:string){
        return http.get(`${this.GetNomeControle()}/despesa/${id}?dataInicioEmissao=${dataInicioEmissao}&dataFimEmissao=${dataFimEmissao}&dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}&dataBaixaInicial=${dataBaixaInicial}&dataBaixaFinal=${dataBaixaFinal}`)
    }
  
    ListarReceitaDetalhada(empreendimentoId:string,numeroContrato:string,pagamentoAutomatico:string, formaPagamento:string, usuarioBaixa:string, clienteId:string, situacaoParcelaId:string, contratoId:string,tipoReceitaId:string, dataVencimentoInicial:string, dataVencimentoFinal:string, dataBaixaInicial:string, dataBaixaFinal:string, empresaId:string, 
        tipoAditamentoId:string,tipoServicoId:string,tipoContrato:string,tipoAmortizacao:string,grupoId:string, unidadePrincipalId:string){

        var concatEmpresa = this.concatIds(empresaId, 'empresaId');
        var concatTipoAditamento = this.concatIds(tipoAditamentoId, 'tipoAditamentoId');
        var concatSituacoes = this.concatIds(situacaoParcelaId, 'situacaoParcelaId');
        var concatTipoReceita = this.concatIds(tipoReceitaId, 'tipoReceitaId');
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatTipoServico = this.concatIds(tipoServicoId, 'tipoServicoId');

        return http.get(`${this.GetNomeControle()}/receitaDetalhada?&${concatEmpreendimento}numeroContrato=${numeroContrato}&pagamentoAutomatico=${pagamentoAutomatico}
        &formaPagamento=${formaPagamento}&usuarioBaixa=${usuarioBaixa}&clienteId=${clienteId}&${concatSituacoes}contratoId=${contratoId}&${concatTipoReceita}dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}
        &dataBaixaInicial=${dataBaixaInicial}&dataBaixaFinal=${dataBaixaFinal}&${concatEmpresa}${concatTipoAditamento}${concatTipoServico}&tipoContrato=${tipoContrato}&tipoAmortizacao=${tipoAmortizacao}&grupoId=${grupoId}&unidadePrincipalId=${unidadePrincipalId}`)
    };

    ListarParcelasPriceSac(empreendimentoId:string,numeroContrato:string,formaPagamento:string, clienteId:string, situacaoParcelaId:string, contratoId:string,tipoReceitaId:string, dataVencimentoInicial:string, dataVencimentoFinal:string, dataBaixaInicial:string, dataBaixaFinal:string, empresaId:string){
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatSituacoes = this.concatIds(situacaoParcelaId, 'situacaoParcelaId');
        var concatTipoReceita = this.concatIds(tipoReceitaId, 'tipoReceitaId');
        
        return http.get(`${this.GetNomeControle()}/priceSac?&${concatEmpreendimento}numeroContrato=${numeroContrato}
        &formaPagamento=${formaPagamento}&clienteId=${clienteId}&${concatSituacoes}contratoId=${contratoId}&${concatTipoReceita}dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}
        &dataBaixaInicial=${dataBaixaInicial}&dataBaixaFinal=${dataBaixaFinal}&${concatEmpresa}`)
    }

    ListarContratosEmAtrasos(empreendimentoId:string, numeroContrato:string, mesesVencimentoInicio:string, mesesVencimentoFim:string,quantidadeParcelasMinima:string, quantidadeParcelasMaxima:string, empresaId:string,diasVencimentoInicio:string, diasVencimentoFim:string){
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');

        return http.get(`${this.GetNomeControle()}/contratosEmAtraso?${concatEmpreendimento}numeroContrato=${numeroContrato}&mesesVencimentoInicio=${mesesVencimentoInicio}&mesesVencimentoFim=${mesesVencimentoFim}&quantidadeParcelasMinima=${quantidadeParcelasMinima}&quantidadeParcelasMaxima=${quantidadeParcelasMaxima}&${concatEmpresa}diasVencimentoInicio=${diasVencimentoInicio}&diasVencimentoFim=${diasVencimentoFim}`)
    } 
 
    ListarRelatorioClassificacao(empreendimentoId:[], empresaId:[], dataInicioEmissao:string, dataFimEmissao:string, ano, meses, filtrarVencimento, filtrarPagamento){
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatmeses = this.concatIds(meses, 'mes');

        return http.get(`${this.GetNomeControle()}/despesaClassificacao?${concatEmpreendimento}${concatEmpresa}dataInicioEmissao=${dataInicioEmissao}&dataFimEmissao=${dataFimEmissao}&ano=${ano}&${concatmeses}filtrarVencimento=${filtrarVencimento}&filtrarPagamento=${filtrarPagamento}`)
    } 
  
    ListarRelatorioBoleto(empreendimentoId:string, boletoGerado:boolean, pagamentoAutomatico:string, clienteId:string, tipoReceitaId:string, dataVencimentoInicial:string, dataVencimentoFinal:string, empresaId:string,sequenciaContrato:string,dataCobrancaInicial:string,dataCobrancaFinal:string,situacaoParcelaId:string){
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatTipoReceita = this.concatIds(tipoReceitaId, 'tipoReceitaId');
        var concatSituacaoParcela = this.concatIds(situacaoParcelaId, 'situacaoParcelaId');

        return http.get(`${this.GetNomeControle()}/receitaBoleto?${concatEmpreendimento}boletoGerado=${boletoGerado}&pagamentoAutomatico=${pagamentoAutomatico}&clienteId=${clienteId}&${concatTipoReceita}dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}&${concatEmpresa}sequenciaContrato=${sequenciaContrato}&dataCobrancaInicial=${dataCobrancaInicial}&dataCobrancaFinal=${dataCobrancaFinal}&${concatSituacaoParcela}`)
    } 

    ListarSituacoesContrato(empreendimentoId:[], dataSituacaoInicial:string, dataSituacaoFinal:string, dataEmissaoContratoInicial:string, dataEmissaoContratoFinal:string, empresaId:[], situacaoContratoId:[]){        
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatSituacaoContrato = this.concatIds(situacaoContratoId, 'situacaoContratoId');
 
        return http.get(`${this.GetNomeControle()}/situacoesContrato?${concatEmpreendimento}dataSituacaoInicial=${dataSituacaoInicial}&dataSituacaoFinal=${dataSituacaoFinal}&dataEmissaoContratoInicial=${dataEmissaoContratoInicial}&dataEmissaoContratoFinal=${dataEmissaoContratoFinal}&${concatEmpresa}${concatSituacaoContrato}`)
    }

    ListarParcelasAditadas(numeroContrato, sequenciaContrato,clienteId,corretorId,empreendimentoId:[],dataAditamentoInicial,dataAditamentoFinal, tipoAditamentoId:[],dataVencimentoInicial,dataVencimentoFinal,dataBaixaInicial,dataBaixaFinal){  
        var concatTipoAditamento = this.concatIds(tipoAditamentoId, 'tipoAditamentoId');
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');

        return http.get(`${this.GetNomeControle()}/parcelasAditadas?numeroContrato=${numeroContrato}&sequenciaContrato=${sequenciaContrato}&clienteId=${clienteId}&corretorId=${corretorId}&${concatEmpreendimento}dataAditamentoInicial=${dataAditamentoInicial}&dataAditamentoFinal=${dataAditamentoFinal}&${concatTipoAditamento}dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}&dataBaixaInicial=${dataBaixaInicial}&dataBaixaFinal=${dataBaixaFinal}`)
    }

    ListarContratosAditados(numeroContrato,clienteId,corretorId,empreendimentoId:[], dataAditamentoInicial:string, dataAditamentoFinal:string, situacaoContratoId:[], aditamentoPago:boolean,tipoAditamentoId:[]){  
        var concatTipoAditamento = this.concatIds(tipoAditamentoId, 'tipoAditamentoId');
        var concatEmpreendimento = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatSituacao = this.concatIds(situacaoContratoId, 'situacaoContratoId');

        return http.get(`${this.GetNomeControle()}/contratosAditados?numeroContrato=${numeroContrato}&clienteId=${clienteId}&corretorId=${corretorId}&${concatEmpreendimento}dataAditamentoInicial=${dataAditamentoInicial}&dataAditamentoFinal=${dataAditamentoFinal}&${concatSituacao}aditamentoPago=${aditamentoPago}&${concatTipoAditamento}`)
    }

    
    ListarFechamentoRecebiveis(empresaId:string, tipoReceitaId:string, dataInicial:string, dataFinal:string){
        var concatEmpresa = this.concatIds(empresaId, 'empresaId');
        var concatTipoReceita = this.concatIds(tipoReceitaId, 'tipoReceitaId');
     
        return http.get(`${this.GetNomeControle()}/fechamentoRecebiveis?${concatEmpresa}${concatTipoReceita}&dataInicial=${dataInicial}&dataFinal=${dataFinal}`)
    }

    ListarRelatorioConfrontantes(empreendimentos, empresas, grupoId, unidadePrincipalId){ 
        var concatEmpresa = this.concatIds(empresas, 'empresaId');
        var concatEmpreendimento = this.concatIds(empreendimentos, 'empreendimentoId');

        return http.get(`${this.GetNomeControle()}/confrontantes?${concatEmpreendimento}&${concatEmpresa}&grupoId=${grupoId}&unidadeId=${unidadePrincipalId}`)
    } 
 
    ListarRelatorioVendas(empreendimentoIds:number, empresaIds:Number, dataContratoInicial:string, dataContratoFinal:string, numeroContrato:string, clienteId:number, situacaoContrato:number, dataSituacaoInicial:string, dataSituacaoFinal:string){
        var concatEmpresa = this.concatIds(empresaIds, 'empresaIds');
        var concatEmpreendimento = this.concatIds(empreendimentoIds, 'empreendimentoIds');
  
        return http.get(`${this.GetNomeControle()}/vendas?${concatEmpreendimento}${concatEmpresa}&dataContratoInicial=${dataContratoInicial}&dataContratoFinal=${dataContratoFinal}&numeroContrato=${numeroContrato}&clienteId=${clienteId}&situacaoContrato=${situacaoContrato}&dataSituacaoInicial=${dataSituacaoInicial}&dataSituacaoFinal=${dataSituacaoFinal}`)
    }

     ListarRelatorioGerencialCarteira(empreendimentoIds:number, empresaIds:Number, dataContratoInicial:string, dataContratoFinal:string, numeroContrato:string, clienteId:number, situacaoContrato:number, grupoId:number, unidadePrincipalId:number){
        var concatEmpresa = this.concatIds(empresaIds, 'empresaIds');
        var concatEmpreendimento = this.concatIds(empreendimentoIds, 'empreendimentoIds');
  
        return http.get(`${this.GetNomeControle()}/GerencialCarteira?${concatEmpreendimento}${concatEmpresa}&dataContratoInicial=${dataContratoInicial}&dataContratoFinal=${dataContratoFinal}&numeroContrato=${numeroContrato}&clienteId=${clienteId}&situacaoContrato=${situacaoContrato}&grupoId=${grupoId}&unidadePrincipalId=${unidadePrincipalId}`)
    }

    
    ListarRelatorioTaxaBoleto(empreendimentoId:number[], empresaId:number[],numeroContrato:string, dataVencimentoInicial:string, dataVencimentoFinal:string, dataPagamentoInicial:string, dataPagamentoFinal:string) {
        var concatEmpreendimentoId = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatEmpresaId = this.concatIds(empresaId, 'empresaId');

        return http.get(`${this.GetNomeControle()}/TaxasBoleto?${concatEmpreendimentoId}${concatEmpresaId}&numeroContrato=${numeroContrato}&dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}&dataPagamentoInicial=${dataPagamentoInicial}&dataPagamentoFinal=${dataPagamentoFinal}`);
    }

    ObterRelatatorioDocumentoPessoa(id){
        return http.get(`${this.GetNomeControle()}/RelatorioPessoa/${id}`);
    }

    ObterRelatorioPainelvendas(empreendimentoId:any, empresaId:any, dataInicial:any, dataFinal:any){
        var concatEmpreendimentoId = this.concatIds(empreendimentoId, 'empreendimentoIds');
        var concatEmpresaId = this.concatIds(empresaId, 'empresaIds');

        let url = `${this.GetNomeControle()}/PainelVendas?${concatEmpresaId}${concatEmpreendimentoId}`;

        if (dataInicial) 
            url += `dataInicial=${dataInicial}`;
        
          if (dataFinal) 
            url += `&dataFinal=${dataFinal}`;
          
        return http.get(url);
    }

    ObterRelatorioPainelInadimplencia(pessoaId:number) {
        var url = `${this.GetNomeControle()}/PainelInadimplencia/${pessoaId}`
        return http.get(`${this.GetNomeControle()}/PainelInadimplencia/${pessoaId}`);
    }


    ObterRelatorioPainelDespesa(empreendimentoIds, empresaIds){
        var concatEmpreendimentoId = this.concatIds(empreendimentoIds, 'empreendimentoIds');
        var concatEmpresaId = this.concatIds(empresaIds, 'empresaIds');

        return http.get(`${this.GetNomeControle()}/RelatorioPainelDespesa?${concatEmpreendimentoId}${concatEmpresaId}`)

    }

       
 
    ObterRelatorioMes(empreendimentoIds, empresaIds, enumTipoVisualizacao){
        var concatEmpreendimentoId = this.concatIds(empreendimentoIds, 'empreendimentoIds');
        var concatEmpresaId = this.concatIds(empresaIds, 'empresaIds');
        return http.get(`${this.GetNomeControle()}/paineldespesa/demonstrativo/mes?enumTipoVisualizacao=${enumTipoVisualizacao}${concatEmpreendimentoId}${concatEmpresaId}`)
    }

    ObterRelatorioPainelReceita(empreendimentoId:any, empresaId:any, dataInicial:any, dataFinal:any){
        var concatEmpreendimentoId = this.concatIds(empreendimentoId, 'empreendimentoIds');
        var concatEmpresaId = this.concatIds(empresaId, 'empresaIds');

        let url = `${this.GetNomeControle()}/RelatorioPainelReceita?${concatEmpresaId}${concatEmpreendimentoId}`;

        if (dataInicial) 
            url += `dataInicial=${dataInicial}`;
        
          if (dataFinal) 
            url += `&dataFinal=${dataFinal}`;
          
        return http.get(url);
    }

    ObterRelatorioKPIUniversal(empreendimentoId:any, empresaId:any, dataInicial:any, dataFinal:any){
        var concatEmpreendimentoId = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatEmpresaId = this.concatIds(empresaId, 'empresaId');

        let url = `${this.GetNomeControle()}/KPIUniversalPainel?${concatEmpresaId}${concatEmpreendimentoId}`;

        if (dataInicial) 
            url += `dataInicial=${dataInicial}`;
        
          if (dataFinal) 
            url += `&dataFinal=${dataFinal}`;
          
        return http.get(url);


    } 
    ObterRelatorioDespesaListaDemonstraviva(empreendimentoId:any, empresaId:any, enumTipoVisualizacao:any, dataInicial:any, dataFinal:any){
        var concatEmpreendimentoId = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatEmpresaId = this.concatIds(empresaId, 'empresaId');

        let url = `${this.GetNomeControle()}/PainelDespesa/demonstrativo?${concatEmpresaId}${concatEmpreendimentoId}`;
        
        if(enumTipoVisualizacao)
          url += `enumTipoVisualizacao=${enumTipoVisualizacao}`

        if (dataInicial) 
            url += `&dataInicial=${dataInicial}`;
        
          if (dataFinal) 
            url += `&dataFinal=${dataFinal}`;

          
        return http.get(url);

    }

    //dataVencimentoInicial:string, dataVencimentoFinal:string, dataBaixaInicial:string, dataBaixaFinal:string,
    ListarRelatorioDespesaRateada(tipoId:string, empreendimentoId:string, fornecedorId:string, empresaId:string, formaPagamentoId:string, dataEmissaoInicial:string, dataEmissaoFinal:string, contaGerencialId:string, ano:string, meses, filtrarVencimento, filtrarPagamento){
        var concatEmpreendimentoId = this.concatIds(empreendimentoId, 'empreendimentoId');
        var concatEmpresaId = this.concatIds(empresaId, 'empresaId');
        var concatmeses = this.concatIds(meses, 'mes');
        //&dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}&dataBaixaInicial=${dataBaixaInicial}&dataBaixaFinal=${dataBaixaFinal}
        return http.get(`${this.GetNomeControle()}/despesaRateada?enumTipoVisualizacao=${tipoId}&${concatEmpreendimentoId}fornecedorId=${fornecedorId}&${concatEmpresaId}formaPagamento=${formaPagamentoId}&dataEmissaoInicial=${dataEmissaoInicial}&dataEmissaoFinal=${dataEmissaoFinal}&contaGerencialId=${contaGerencialId}&ano=${ano}&${concatmeses}filtrarVencimento=${filtrarVencimento}&filtrarPagamento=${filtrarPagamento}`)
    }





     ListarRelatorioComissoesCorretor(empreendimentoId:string, empresaId:string, corretorId:string, dataVencimentoInicial:string, dataVencimentoFinal:string, dataBaixaInicial:string, dataBaixaFinal:string, dataEmissaoInicial:string, dataEmissaoFinal:string){
        var empreendimentoId = this.concatIds(empreendimentoId, 'empreendimentoId');
        var empresaId = this.concatIds(empresaId, 'empresaId');
        var corretorId = this.concatIds(corretorId, 'corretorId');

        return http.get(`${this.GetNomeControle()}/parcelascomissao?${empreendimentoId}${empresaId}${corretorId}dataVencimentoInicial=${dataVencimentoInicial}&dataVencimentoFinal=${dataVencimentoFinal}&dataBaixaInicial=${dataBaixaInicial}&dataBaixaFinal=${dataBaixaFinal}&dataEmissaoInicial=${dataEmissaoInicial}&dataEmissaoFinal=${dataEmissaoFinal}`)
    }

    ObterRelatorioFluxoCaixa(tipoIdReceita:string, tipoIdDespesa:string, empresaId:string, ano:any, tipoFiltrodata:string){
        var concatempresaId = this.concatIds(empresaId, 'empresaId');
        return http.get(`${this.GetNomeControle()}/fluxoCaixaNovo?enumTipoVisualizacaoReceita=${tipoIdReceita}&enumTipoVisualizacaoDespesa=${tipoIdDespesa}&${concatempresaId}&ano=${ano}&tipoFiltrodata=${tipoFiltrodata}`)
    }
  
}