
export enum Permissao {
     
    /* ALMOXARIFADO */  
        master = 0, 
        gerente = 1,
        administrador = 2, 
        Almoxarifado_Almoxarifado_Cadastrar = 1001,  
        Almoxarifado_Almoxarifado_Alterar = 1002,
        Almoxarifado_Almoxarifado_Excluir = 1003,
        Almoxarifado_Almoxarifado_Listar = 1004, 
        
        Almoxarifado_GrupoProduto_Cadastrar = 2001,   
        Almoxarifado_GrupoProduto_Alterar = 2002,
        Almoxarifado_GrupoProduto_Excluir = 2003,
        Almoxarifado_GrupoProduto_Listar = 2004,  

        Almoxarifado_Inventario_Cadastrar = 3001,  
        Almoxarifado_Inventario_Alterar = 3002, 
        Almoxarifado_Inventario_Excluir = 3003,
        Almoxarifado_Inventario_Listar = 3004, 

        Almoxarifado_Movimentacao_Cadastrar = 4001,  
        Almoxarifado_Movimentacao_Alterar = 4002,
        Almoxarifado_Movimentacao_Excluir = 4003,
        Almoxarifado_Movimentacao_Listar = 4004,
        Almoxarifado_Movimentacao_Transferir = 4005,
        
        Almoxarifado_Produto_Cadastrar = 5001,
        Almoxarifado_Produto_Alterar = 5002,
        Almoxarifado_Produto_Excluir = 5003,
        Almoxarifado_Produto_Listar = 5004,

        Almoxarifado_Requisicao_Cadastrar = 6001,
        Almoxarifado_Requisicao_Alterar = 6002,
        Almoxarifado_Requisicao_Excluir = 6003,
        Almoxarifado_Requisicao_Listar = 6004,

        
        Almoxarifado_TipoMovimentacao_Listar = 7001,
            
        Almoxarifado_TipoProduto_Listar = 8001,

        Almoxarifado_UnidadeMedida_Cadastrar = 9001,
        Almoxarifado_UnidadeMedida_Alterar = 9002,
        Almoxarifado_UnidadeMedida_Excluir = 9003,
        Almoxarifado_UnidadeMedida_Listar = 9004,


    /* BASE */

        Base_Assinante_Cadastrar = 10001,
        Base_Assinante_Alterar = 10002,
        Base_Assinante_Excluir = 10003,
        Base_Assinante_Listar = 10004,

         
    /* CLIENTES */

        Clientes_Contrato_Cadastrar = 11001,
        Clientes_Contrato_Alterar = 11002,
        Clientes_Contrato_Excluir = 11003,
        Clientes_Contrato_Listar = 11004,

        Clientes_Contrato_Aditar = 11005,
        Clientes_Contrato_ReverterAditamento = 11008,

        Clientes_Contrato_AtualizarInstrucao = 11006,
        Clientes_Contrato_Cancelar = 11007,

        Clientes_TipoContrato_Cadastrar = 12001,
        Clientes_TipoContrato_Alterar = 12002,
        Clientes_TipoContrato_Excluir = 12003,  
        Clientes_TipoContrato_Listar = 12004,

        Clientes_TipoOperacaoContrato_Listar = 13001,
        Clientes_TipoProdutoContrato_Listar = 14001,

        Clientes_TipoAditamentoContrato_Listar = 66001,

    /* COMPRAS */
    
        Compras_Orcamento_Cadastrar = 15001,
        Compras_Orcamento_Alterar = 15002,
        Compras_Orcamento_Excluir = 15003,
        Compras_Orcamento_Listar = 15004,

        Compras_Orcamento_Cancelar = 15005,
        Compras_Orcamento_Aprovar = 15006,
        
        Compras_Parametro_Cadastrar = 16001,
        Compras_Parametro_Alterar = 16002,
        Compras_Parametro_Excluir = 16003,
        Compras_Parametro_Listar = 16004,
       
        Compras_Pedido_Cadastrar = 17001,
        Compras_Pedido_Alterar = 17002,
        Compras_Pedido_Excluir = 17003,
        Compras_Pedido_Listar = 17004,

        Compras_Pedido_Receber = 17005,

       
        Compras_SituacaoOrcamento_Listar = 18001,

        Compras_SituacaoPedidoItem_Listar = 19001,

    /* EMPREENDIMENTO */

        Empreendimento_Empreendimento_Cadastrar = 20001,
        Empreendimento_Empreendimento_Alterar = 20002,
        Empreendimento_Empreendimento_Excluir = 20003,
        Empreendimento_Empreendimento_Listar = 20004,

        Empreendimento_SituacaoUnidade_Listar = 21001,

        Empreendimento_TipoEmpreendimento_Listar = 22001,

        Empreendimento_TipoGrupo_Listar = 23001,

        Empreendimento_TipoImovel_Listar = 24001,

        Empreendimento_TipoUnidade_Listar = 25001,

        Empreendimento_Vicio_Cadastrar = 26001,
        Empreendimento_Vicio_Alterar = 26002,
        Empreendimento_Vicio_Excluir = 26003,
        Empreendimento_Vicio_Listar = 26004,

    /* FINANCEIRO */

        Financeiro_Banco_Cadastrar = 27001,
        Financeiro_Banco_Alterar = 27002,
        Financeiro_Banco_Excluir = 27003,
        Financeiro_Banco_Listar = 27004,

        Financeiro_CentroCusto_Cadastrar = 28001,
        Financeiro_CentroCusto_Alterar = 28002,
        Financeiro_CentroCusto_Excluir = 28003,
        Financeiro_CentroCusto_Listar = 28004,
        Financeiro_CentroCusto_Transferencia = 28005,

        Financeiro_CondicaoPagamento_Cadastrar = 29001,
        Financeiro_CondicaoPagamento_Alterar = 29002,
        Financeiro_CondicaoPagamento_Excluir = 29003,
        Financeiro_CondicaoPagamento_Listar = 29004,

        Financeiro_ContaCorrente_Cadastrar = 30001,
        Financeiro_ContaCorrente_Alterar = 30002,
        Financeiro_ContaCorrente_Excluir = 30003,
        Financeiro_ContaCorrente_Listar = 30004,

        Financeiro_ContaGerencial_Cadastrar = 31001,
        Financeiro_ContaGerencial_Alterar = 31002,
        Financeiro_ContaGerencial_Excluir = 31003,
        Financeiro_ContaGerencial_Listar = 31004,
        Financeiro_ContaGerencial_Transferencia = 31005,

        Financeiro_Despesa_Cadastrar = 32001,
        Financeiro_Despesa_Alterar = 32002,
        Financeiro_Despesa_Excluir = 32003,
        Financeiro_Despesa_Listar = 32004,


        Financeiro_Despesa_ExcluirClassificacao = 32005,
        Financeiro_Despesa_CancelarBaixa = 32006,
        Financeiro_Despesa_ExcluirDocumento = 32007,
        Financeiro_Despesa_ListarDocumento = 32008,
        Financeiro_Despesa_ListarBaixa = 32009,
        Financeiro_Despesa_ListarParcela = 32010,

        Financeiro_Despesa_BaixarParcela = 32011,
        Financeiro_Despesa_CancelarParcela = 32012,
        Financeiro_Despesa_AlterarParcela = 32013,

        Financeiro_Receita_Cadastrar = 33001,
        Financeiro_Receita_Alterar = 33002,
        Financeiro_Receita_Excluir = 33003,
        Financeiro_Receita_Listar = 33004,

         Financeiro_Receita_ExcluirClassificacao = 33005,
        Financeiro_Receita_CancelarBaixa = 33006,
        Financeiro_Receita_ExcluirDocumento = 33007,
        Financeiro_Receita_ListarDocumento = 33008,
        Financeiro_Receita_ListarBaixa = 33009,
        Financeiro_Receita_ListarParcela = 33010,
        Financeiro_Receita_BaixarParcela = 33011,
        Financeiro_Receita_CancelarParcela = 33012,
        Financeiro_Receita_AlterarParcela = 33013,
        Financeiro_Receita_GerarComprovante = 33014,

        Financeiro_Receita_VisualizarComprovante = 33015,
        Financeiro_Receita_Reajustar = 33016,
        Financeiro_Receita_Agrupar = 33017,
        Financeiro_Receita_Quitar = 33027,//
        Financeiro_Receita_VisualizarQuitacao = 33018,

        Financeiro_Receita_Antecipar = 33019,
        Financeiro_Receita_VisualizarAntecipacao = 33020,
        Financeiro_Receita_GerarBoleto = 33021,
        
        Financeiro_Receita_CadastrarParcela = 33022,
        Financeiro_Receita_CancelarBoleto = 33023,
        Financeiro_Receita_AtualizarEncargos = 33024,
        Financeiro_Receita_VisualizarEncargos = 33025, 


        Financeiro_Receita_VisualizarComprovanteAntecipacao = 33028,
        Financeiro_Receita_GerarComprovanteAntecipacao = 33029,
        Financeiro_Receita_VisualizarComprovanteSimulacaoAntecipacao = 33030,
        Financeiro_Receita_VisualizarComprovanteSimulacaoQuitacao = 33031,

        Financeiro_ReguaCobranca_Listar = 68004,
        Financeiro_ReguaCobranca_Cadastrar = 68001,
        Financeiro_ReguaCobranca_Alterar =  68002,
        Financeiro_ReguaCobranca_Excluir = 68003,
         
        Financeiro_FormaPagamento_Cadastrar = 34001,
        Financeiro_FormaPagamento_Alterar = 34002,
        Financeiro_FormaPagamento_Excluir = 34003,
        Financeiro_FormaPagamento_Listar = 34004,

        Financeiro_Indice_Cadastrar = 35001,
        Financeiro_Indice_Alterar = 35002,
        Financeiro_Indice_Excluir = 35003,
        Financeiro_Indice_Listar = 35004,

        Financeiro_Parametro_Cadastrar = 37001,
        Financeiro_Parametro_Alterar = 37002,
        Financeiro_Parametro_Excluir = 37003,
        Financeiro_Parametro_Listar = 37004,

        Financeiro_Relatorio_Listar = 38001,


        Financeiro_SituacaoDespesaParcela_Listar = 39001,
        Financeiro_SituacaoReceitaParcela_Listar = 40001,


        Financeiro_LayoutCobranca_Listar = 36001,
         
        Financeiro_TipoDespesa_Listar = 41001,
        Financeiro_TipoGateway_Listar = 43001,

        Financeiro_TipoIndice_Listar = 44001,

        Financeiro_TipoReceita_Listar = 45001,

        Financeiro_TipoDocumento_Cadastrar = 42001,
        Financeiro_TipoDocumento_Alterar = 42002,
        Financeiro_TipoDocumento_Excluir = 42003,
        Financeiro_TipoDocumento_Listar = 42004,
    
    /* GERAL */

        Geral_Cartorio_Cadastrar = 46001,
        Geral_Cartorio_Alterar = 46002,
        Geral_Cartorio_Excluir = 46003,
        Geral_Cartorio_Listar = 46004,

        Geral_Empresa_Cadastrar = 47001,
        Geral_Empresa_Alterar = 47002,
        Geral_Empresa_Excluir = 47003,
        Geral_Empresa_Listar = 47004,

        Geral_Empresa_ListarExtrato = 47005, 
        Geral_Empresa_ListarSaldoZoop = 47006, 
        Geral_Empresa_TransferirSaldoZoop = 47007, 
        Geral_Empresa_CadastrarDocumentoZoop = 47008, 

        Geral_Endereco_Listar = 48001,
        Geral_EstadoCivil_Listar = 49001,

        Geral_Log_Cadastrar = 50001,
        Geral_Log_Listar = 50002,

        Geral_Nacionalidade_Listar = 51001,


        Geral_Pessoa_Cadastrar = 52001,
        Geral_Pessoa_Alterar = 52002,
        Geral_Pessoa_Excluir = 52003,
        Geral_Pessoa_Listar = 52004,

        Geral_Pessoa_CriarUsuario = 52005,
        Geral_Profissao_Listar = 53001,

        Geral_Seguradora_Cadastrar = 54001,
        Geral_Seguradora_Alterar = 54002,
        Geral_Seguradora_Excluir = 54003,
        Geral_Seguradora_Listar = 54004,

        Geral_Sexo_Listar = 55001,
        Geral_SituacaoFrete_Listar = 56001,
        Geral_TipoOrigem_Listar = 57001,
        Geral_TipoPessoa_Listar = 58001,

        Geral_TipoProcessoJudicial_Cadastrar = 59001,
        Geral_TipoProcessoJudicial_Alterar = 59002,
        Geral_TipoProcessoJudicial_Excluir = 59003,
        Geral_TipoProcessoJudicial_Listar = 59004,

        Geral_Usuario_Cadastrar = 60001,
        Geral_Usuario_Alterar = 60002,
        Geral_Usuario_Excluir = 60003,
        Geral_Usuario_Listar = 60004,

        Geral_Usuario_ResetarSenha = 60005,
        Geral_Usuario_AlterarSenha = 60006,
        Geral_Usuario_MudarTema = 60007,

        Financeiro_TipoServicoParcela_Cadastrar = 67001,
        Financeiro_TipoServicoParcela_Alterar = 67002,
        Financeiro_TipoServicoParcela_Excluir = 67003,
        Financeiro_TipoServicoParcela_Listar = 67004,


    /* PROJETO */
        Projeto_ContratoFornecedor_Cadastrar = 61001,
        Projeto_ContratoFornecedor_Alterar = 61002,
        Projeto_ContratoFornecedor_Excluir = 61003,
        Projeto_ContratoFornecedor_Listar = 61004,

        Projeto_Etapa_Cadastrar = 62001,
        Projeto_Etapa_Alterar = 62002,
        Projeto_Etapa_Excluir = 62003,
        Projeto_Etapa_Listar = 62004,

        Projeto_Medicao_Cadastrar = 63001,
        Projeto_Medicao_Alterar = 63002,
        Projeto_Medicao_Excluir = 63003,
        Projeto_Medicao_Listar = 63004,
        Projeto_Medicao_GerarDespesa = 63005,

        Projeto_Orcado_Cadastrar = 64001,
        Projeto_Orcado_Alterar = 64002,
        Projeto_Orcado_Excluir = 64003,
        Projeto_Orcado_Listar = 64004,

        Projeto_TipoContratoFornecedor_Listar = 65001,

        Financeiro_Despesa_ExcluirParcela = 32014,
        Financeiro_Receita_ExcluirParcela = 33032, 

       /* POR MÓDULO */
       Modulos_Modulo_Negocio = 999001,
       Modulos_Modulo_Contrato = 999002,
       Modulos_Modulo_Financeiro = 999003,
       Modulos_Modulo_Cadastro = 999004,
       Modulos_Modulo_Administracao = 999005,
       Modulos_Modulo_KPI = 999006,
       Modulos_Modulo_Almoxarifado = 999007,
       Modulos_Modulo_Compra = 999008,
       Modulos_Modulo_Projeto = 999009,
}