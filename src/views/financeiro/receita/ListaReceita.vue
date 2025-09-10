<template>
  <master-page titulo="Receita" subTitulo="Lista das Receitas cadastradas no Sistema">

     <v-row>
     <v-col cols="12">
        <v-breadcrumbs :items="breadCrumbLinks" divider="/"></v-breadcrumbs>
      </v-col>
    </v-row>

    <h3>Receita</h3>

    <br>

    <v-card>
      <v-card-title>
        <v-col cols="12" md="5"> 
          <v-row justify="center" align="center" dense>
            <v-col v-for="button in buttons" :key="button.id">
              <v-btn rounded @click="toggleButton(button)" :color="button.color" :outlined="button.active" small> {{ button.label }}</v-btn>
            </v-col>
          </v-row>  
        </v-col>
            
        <v-spacer></v-spacer>
          <v-col cols="12" md="3" class="pt-9"> 
            <v-select multiple solo label="Situação" :items="situacoes" v-model="filter.situacaoId" item-value="id" clearable item-text="nome" @change="Atualizar()"></v-select>
          </v-col>
 
          <v-tooltip bottom> 
            <template v-slot:activator="{ on }">
              <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="Remessa()">
                <v-icon size="30">mdi-bank-transfer-in</v-icon>
              </v-btn> 
            </template>
            <span>Remessa bancária</span>  
          </v-tooltip> 

            <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="RetornoBancario()">
                <v-icon size="30">mdi-bank-transfer-out</v-icon>
              </v-btn>
            </template>
            <span>Retorno báncario</span>  
          </v-tooltip> 

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="ExportarExcel('tabela')">
                <v-icon>mdi-file-excel-outline</v-icon>
              </v-btn>
            </template>
            <span>Exportar</span>   
          </v-tooltip> 
          
          <v-bottom-sheet v-model="sheet">
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="ResetFiltro()" v-bind="attrs" v-on="on"  icon color="primary" class="mb-2" dark>  
                <v-icon>mdi-filter-outline</v-icon>
              </v-btn>
            </template>
                
            <v-sheet class="text-center scrollable-sheet"  height="auto">
              <v-toolbar dense flat>
                <v-icon>mdi-filter</v-icon>
              <v-toolbar-title class="pl-3">Filtros</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-row dense>
                <v-col cols="3" sm="3" md="1" lg="1">
                  <v-text-field label="Número" v-model="filter.numero" dense outlined></v-text-field>
                </v-col>

                <v-col cols="9" sm="9" md="5" lg="5">
                  <v-autocomplete label="Empresa" v-model="filter.empresaId" :items="empresas" item-value="id"  clearable item-text="nome" dense outlined></v-autocomplete>
                </v-col>

                <v-col cols="6" md="6">
                  <v-autocomplete label="Cliente" clearable v-model="filter.clienteId" :items="pessoas"  item-text="nomeCnpjCpf" item-value="id" dense outlined ></v-autocomplete>
                </v-col>

                <v-col cols="6" md="6">
                  <v-autocomplete label="Empreendimento" v-model="filter.empreendimentoId" :items="empreendimentos" item-value="id" item-text="nome" clearable dense outlined></v-autocomplete>
                </v-col>  

                <v-col cols="8" md="3">
                  <v-select multiple :items="situacoes" label="Situação" clearable v-model="filter.situacaoId" item-value="id" item-text="nome" dense outlined></v-select>
                </v-col>

                <v-col cols="4" md="3">
                  <v-text-field label="Nº do Documento" v-model="filter.numeroDocumento" dense outlined></v-text-field>
                </v-col>

                <v-col cols="6" sm="3" md="3">
                  <v-autocomplete v-model="filter.centroCustoId" label="Centro Custo" :items="listaCentroCusto" item-value="key" item-text="value" dense clearable outlined></v-autocomplete> 
                </v-col>
                
                <v-col cols="6" sm="3" md="3">
                  <v-autocomplete v-model="filter.contaGerencialId" label="Categoria" :items="listaContaGerencial" item-value="key" item-text="value" dense clearable outlined></v-autocomplete>
                </v-col>

                <v-col cols="6" sm="6" md="3" lg="3">
                  <v-autocomplete label="Conta Corrente" v-model="filter.contaCorrenteId" item-value="id" clearable item-text="nome" :items="contaCorrentes" dense outlined></v-autocomplete>
                </v-col>

                <v-col cols="6" sm="6" md="3" lg="3">
                  <v-autocomplete label="Forma de pagamento" v-model="filter.formaPagamentoId" item-value="id" clearable item-text="nome" :items="formasPagamento" dense outlined></v-autocomplete>
                </v-col>  

                <v-col cols="6" sm="6" md="3" lg="3">
                  <v-text-field label="Data Inicial" clearable v-model="filter.dataVencimentoInicial" type="date" dense hint="Filtrar por data de Vencimento Inicial" persistent-hint outlined></v-text-field>
                </v-col>

                <v-col cols="6" sm="6" md="3" lg="3">
                  <v-text-field label="Data Final" clearable v-model="filter.dataVencimentoFinal" type="date" dense hint="Filtrar por data de Vencimento Final" persistent-hint outlined></v-text-field>
                </v-col>

                <v-col cols="6" sm="6" md="3" lg="3">
                  <v-text-field label="Data Inicial" clearable v-model="filter.dataPagamentoInicial" type="date" dense hint="Filtrar por data de Pagamento Inicial" persistent-hint outlined></v-text-field>
                </v-col>

                <v-col cols="6" sm="6" md="3" lg="3">
                  <v-text-field label="Data Final" clearable v-model="filter.dataPagamentoFinal" type="date" dense hint="Filtrar por data de Pagamento Final" persistent-hint outlined></v-text-field>
                </v-col>

                <!-- <v-col cols="6" sm="3" md="3">
                  <v-select v-model="filter.codigoBanco" label="Banco" :items="listaBancos" item-value="codigo" item-text="nome" dense clearable outlined></v-select>
                </v-col> -->
              <v-spacer></v-spacer>
              
              <div style="display: flex; justify-content: flex-end; width: 100%;">
                <v-btn color="primary" @click="Atualizar()">Consultar
                  <v-icon right>mdi-magnify</v-icon>
                </v-btn>
              </div>
              </v-row>
            </v-card-text>
          </v-sheet>
        </v-bottom-sheet>

        <v-tooltip bottom> 
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="ResetFiltro(), Atualizar()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Atualizar</span>
        </v-tooltip> 
        
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="Novo()">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Nova Receita</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        
        <v-switch v-model="gerarCancelarBoletos" label="Gerar/Cancelar boletos"></v-switch>

        <v-row v-if="gerarCancelarBoletos">
          <v-checkbox class="ml-3" :label="textselecionartodasparcelas" @click="SelecionarTodos()"></v-checkbox>
          <div v-if="selectedItems.length >0" class="ml-3 mt-3"><v-btn outlined color="primary" @click="GerarBoletos()">Gerar </v-btn></div>
          <div v-if="selectedItems.length >0" class="ml-1 mt-3"><v-btn color="error" @click="CancelarBoletos()">Cancelar</v-btn></div>
          <div v-if="selectedItems.length >0" class="ml-1 mt-3"><v-btn color="error" @click="ExcluirBoletos()">Excluir Boletos</v-btn></div>
        </v-row>
         
        <v-data-table id="tabela" :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50, -1], showFirstLastPage: true}" :headers="headers" sort-by="dataVencimento" :search="search" :items="lista" :options.sync="options" :server-items-length="totalLista" :loading="loading" class="elevation-0"  item-value="id">
          <template v-slot:item="props">
            <tr>
              <td>
                <div style="display: flex; align-items: center;">
                  <v-checkbox v-if="gerarCancelarBoletos" v-model="selectedItems" :value="props.item.id" @change="onItemSelected"></v-checkbox>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn outlined v-bind="attrs" v-on="on" tile color="primary">
                        <v-icon size="25px" left>mdi-menu-down</v-icon>Ações
                      </v-btn>
                    </template>

                    <v-list>
                      <v-list-item @click="EditarReceita(props.item)">
                        <v-list-item-title>
                          <v-icon color="purple" size="30px">mdi-pencil-circle</v-icon> Editar Receita
                        </v-list-item-title>
                      </v-list-item>

                      <v-divider />
                      <v-list-item @click="ClonarReceita(props.item)">
                        <v-list-item-title>
                          <v-icon color="black" size="30px">mdi-content-copy</v-icon> Clonar Receita
                        </v-list-item-title>
                      </v-list-item>

                      <v-divider />
                      <v-list-item @click="EditarParcela(props.item)">
                        <v-list-item-title>
                          <v-icon color="primary" size="30px">mdi-pencil-circle</v-icon> Editar Parcela
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />

                      <v-list-item @click="ValoresAdicionais(props.item)">
                        <v-list-item-title>
                          <v-icon color="primary" size="30px">mdi-plus-circle-multiple-outline</v-icon> Valores adicionais
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />

                      <v-list-item @click="DetalharParcela(props.item)">
                        <v-list-item-title>
                          <v-icon color="blue" size="30px">mdi-information-outline</v-icon> Detalhar
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />

                      <v-list-item @click="BaixarParcela(props.item)">
                        <v-list-item-title>
                          <v-icon color="green" size="30px">mdi-check-circle-outline</v-icon> Baixar
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />

                      <v-list-item @click="CancelarParcela(props.item)">
                        <v-list-item-title>
                          <v-icon color="red" size="30px">mdi-cancel</v-icon> Cancelar
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />

                      <v-list-item @click="EstornarBoleto(props.item)">
                        <v-list-item-title>
                          <v-icon size="30px">mdi-undo-variant</v-icon> Cancelar Boleto
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </td>

              <td>{{ props.item.receita.contrato ? props.item.receita.contrato.numeroSequencia : '-' }}</td>
              <td>{{ props.item.receita.empresa.nome }}</td>
              <td>{{ props.item.receita.numeroDocumento }}</td>
              <td>{{ props.item.parcela }}</td>
              <td>{{ props.item.receita.cliente ? props.item.receita.cliente.nome : '-' }}</td>
              <td>
                <div v-if="props.item.urlBoleto || props.item.linhaDigitavelBoleto">
                  <v-icon @click="VisualizarBoleto(props.item)" color="black">mdi-barcode</v-icon>
                </div>

                <v-btn v-else icon>
                  <v-icon :disabled="props.item.situacaoId == 3 || props.item.situacaoId == 2 || props.item.situacaoId == 5 || props.item.situacaoId == 4" @click="GerarBoleto(props.item)" color="grey"> mdi-printer</v-icon>
                </v-btn>
              </td>
              <td>{{ props.item.dataVencimento.toDateDDMMYYYY() }}</td>
              <td>{{ Number(props.item.valor).toMoeda(true) }}</td>
              <td>
                <v-chip :color="SituacaoColor(props.item)">
                  <div v-if="props.item.receita.agrupadorId != null">Agrupada</div>
                  <div v-else>{{ props.item.situacao.nome }}</div>
                </v-chip>
              </td>
              <td>{{ Number(props.item.saldo).toMoeda(true) }}</td>
              <td>{{ Number(props.item.valorPago).toMoeda(true) }}</td>
            </tr>
          </template>

          <template v-slot:[`body.append`]>
            <tr>
              <td :colspan="8"></td>
              <td>{{ lista.reduce((x, y) => x + y.valor, 0).toMoeda(true) }}</td>
              <td></td>
              <td>{{ lista.reduce((x, y) => x + y.saldo, 0).toMoeda(true) }}</td>
              <td>{{ lista.reduce((x, y) => x + y.valorPago, 0).toMoeda(true) }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <cadastro-remessa v-model="dialogRemessa" :item="remessa" @fechou="dialogRemessa = false, Atualizar()" @salvou="Atualizar()"></cadastro-remessa>
    <cadastro-retornobancario v-model="dialogRetornoBancario" :item="retornoBancario" @fechou="dialogRetornoBancario = false, Atualizar()" @salvou="Atualizar()"></cadastro-retornobancario>
    <cadastro-receita v-model="dialogCadastro" :item="item" @fechou="dialogCadastro = false, Atualizar()" @salvou="Atualizar()"></cadastro-receita>
    <parcelabaixa-receita v-model="dialogBaixar" :item="itemParcela" @fechou="dialogBaixar = false,Atualizar()" @salvou="Atualizar()"></parcelabaixa-receita>
    <parceladetalhe-receita v-model="dialogVisualizar" :item="itemParcela" @fechou="dialogVisualizar = false,Atualizar()" @salvou="Atualizar()"></parceladetalhe-receita>
    <editar-parcela v-model="dialogEditar" :item="itemParcela" @fechou="dialogEditar = false,Atualizar()" @salvou="Atualizar()"></editar-parcela>
    <valores-adicionaisreceita v-model="dialogValoresAdicional" :item="itemParcela" @fechou="dialogValoresAdicional = false,Atualizar()" @salvou="Atualizar()"></valores-adicionaisreceita>
  </master-page>
</template> 
   
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { CentroCustoService, ContaCorrenteService, ContaGerencialService, FormaPagamentoService, ReceitaService, SituacaoReceitaParcelaService} from "@/core/services/financeiro";
import { ReceitaParcela, ReceitaBaixa,Receita, RetornoBancario, Remessa} from "@/core/models/financeiro";
import { EmpresaService } from "@/core/services/compras/EmpresaService";
import { EmpreendimentoService, PessoaService } from "@/core/services/cadastros";
import { mixins } from "vue-class-component";
import ListPage from "@/components/shared/ListPage";
import { ConstruirQueryParams, SituacaoColor, TableToExcel } from '@/assets/scripts/helper';
import { EnumTipoOperacaoFinanceira } from "@/core/models/cadastros";

@Component
export default class ListaReceita extends mixins(Vue,ListPage) {
  service = new ReceitaService();
  item = new Receita(); 
  filter = new Model();
  remessa = new Remessa();

  itemParcela = new ReceitaParcela(); 
  baixa = new ReceitaBaixa();
  retornoBancario = new RetornoBancario();
  gerarCancelarBoletos:boolean = false;

  empresas = [];
  lista: [] = [];
  pessoas = [] 
  situacoes = [];
  empreendimentos:any = [];
  listaCentroCusto = [];
  listaContaGerencial = [];
  contaCorrentes = [];
  formasPagamento = [];
  selectedItems:any = [];
 
  totalLista = 0;
  dataPagamentoFinal = null
  loading: boolean = false;
  dialogCadastro: boolean = false;
  dialogRetornoBancario: boolean = false;
  dialogVisualizar: boolean = false;
  dialogEditar: boolean = false;
  dialogBaixar: boolean = false;
  dialogValoresAdicional:boolean = false;
  dialogRemessa:boolean = false;
  sheet:boolean = false;
  allSelected =  false;
  
  options: any = {
    itemsPerPage: 20,
  };

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nº do Contrato", value: "receita.contrato/numero"},
    { text: "Empresa", value: "receita.empresa/nome"},
    { text: "Código do Documento", value: "receita.numeroDocumento" },
    { text: "N° da Parcela", value: "parcela"},
    { text: "Cliente", value: "receita.cliente/nome"},
    { text: "Boleto", value: "urlBoleto", sortable: false },
    { text: "Vencimento", value: "dataVencimento"},
    { text: "Valor", value: "valor"},
    { text: "Situação", value: "situacao.nome" },
    { text: "Saldo", value: "saldo", sortable: false},
    { text: "Valor Pago", value: "valorPago", sortable: false}
  ];    

   breadCrumbLinks: any[] = [
    { text: 'Home', href: '/financeiro/painel/kpi',},
    { text: 'Lista de Receita', disabled: true, href: '/financeiro/painel/despesas'}
  ]

  @Watch("options", { deep: true })
  Atualizar() { 
    const { page, itemsPerPage, sortBy, sortDesc, search, columns  } = this.options;
    this.loading = true;    
    this.service.ListarParcelas(page,itemsPerPage,sortBy,sortDesc,search, columns, this.filter, '' , '', 'Baixas, Receita.Contrato, Receita.Empresa, Receita.Cliente, Situacao').then(
      (res) => {
        this.lista = res.data.items;
        this.totalLista = res.data.count;
        this.sheet = false
      },
      (err) => {
        if (!err.response) {
          this.$swal("Aviso", "Não foi possível acessar a API", "error");
        } else if (err.response.status == 403) {
          this.$swal("Aviso", err.response.data.message, "warning" );
        } else {
          this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
        }
      })
    .finally(() => (this.loading = false)); 
  } 
   
  Novo() {
    this.item = new Receita();
    this.dialogCadastro = true;
  } 

  RetornoBancario() {
    this.retornoBancario = new RetornoBancario();
    this.dialogRetornoBancario = true;
  }

  Remessa(){
    this.remessa = new Remessa();
    this.dialogRemessa = true;
  }

  ValoresAdicionais(item){
    this.itemParcela = item;
    this.dialogValoresAdicional = true;
  }

  DetalharParcela(item) {
    this.service.ObterParcelaPorId(item.id, "Receita.Tipo, Receita.Cliente, Situacao, Baixas.FormaPagamento, Receita.Classificacoes.CentroCusto, Receita.Classificacoes.ContaGerencial, Receita.Contrato.Empreendimento, Receita.Contrato.UnidadePrincipal,  Receita.Contrato.TipoProduto, Receita.TipoDocumento").then((res) => {       
      this.itemParcela = res.data
      this.dialogVisualizar = true;
    },
    (err) => {
      if (!err.response) {
        this.$swal("Aviso", "Não foi possível acessar a API", "error");
      } else if (err.response.status == 403) {
        this.$swal("Aviso", err.response.data.message, "warning" );
      } else {
        this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
      }
    }); 
  }
 
  EditarReceita(item){
    this.service.ObterPorId(item.receita.id, "Parcelas.Baixas, Classificacoes, Documentos").then((res) => {       
      this.item = res.data;
      this.item.dataEmissao = new Date(res.data.dataEmissao).yyyymmdd();
      this.dialogCadastro = true;
    }, 
    (err) => {
      if (!err.response) {
        this.$swal("Aviso", "Não foi possível acessar a API", "error");
      } else if (err.response.status == 403) {
        this.$swal("Aviso", err.response.data.message, "warning" );
      } else {
        this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
      }
    });
  }

  ClonarReceita(item){
    this.service.ObterPorId(item.receita.id, "Parcelas.Baixas, Classificacoes").then((res) => {   
          
      this.item = res.data;
      this.item.id = 0;

      this.item.parcelas.forEach(x => {
        x.id = 0;
        x.baixas = [];
        x.situacaoId = 1;
        x.linhaDigitavelBoleto = '';
      })
      this.item.classificacoes.forEach(x => {
        x.id = 0;
      })

      this.item.documentos = [];

      this.item.dataEmissao = new Date(res.data.dataEmissao).yyyymmdd();
      this.dialogCadastro = true;
    },
      
    (err) => {
      if (!err.response) {
        this.$swal("Aviso", "Não foi possível acessar a API", "error");
      } else if (err.response.status == 403) {
        this.$swal("Aviso", err.response.data.message, "warning" );
      } else {
        this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
      }
    }); 
  }
  
  EditarParcela(item) {
     this.service.ObterParcelaPorId(item.id, 'Receita.Parcelas').then((res) => {       
      this.itemParcela = res.data;
      this.itemParcela.dataVencimento = new Date(res.data.dataVencimento).yyyymmdd();
      this.dialogEditar = true;
    },
    (err) => {
      if (!err.response) {
        this.$swal("Aviso", "Não foi possível acessar a API", "error");
      } else if (err.response.status == 403) {
        this.$swal("Aviso", err.response.data.message, "warning" );
      } else {
        this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
      }
    }); 
  } 
    
  BaixarParcela(item) {
    this.service.ObterParcelaPorId(item.id, 'Receita').then(res =>{
      this.itemParcela = res.data;
      this.itemParcela.dataVencimento = new Date(res.data.dataVencimento).yyyymmdd();
      this.dialogBaixar = true;
    })
  } 
  
  VisualizarBoleto(item){ 
    this.service.ObterParcelaPorId(item.id, 'Transacoes, Transacoes.ContaCorrente.Banco').then(
      (res) => {
        let ultimaTransacao = res.data.ultimaTransacao;

        if (item.tipoOperacaoId === EnumTipoOperacaoFinanceira.Boleto) {
          this.abrirUrlNoNovaJanela("financeiroBoleto", { transacaoId: ultimaTransacao.id });
        } 
        else if (item.tipoOperacaoId === EnumTipoOperacaoFinanceira.Gateway) {
          if (item.tipoGatewayId === 3) {
            this.abrirUrlNoNovaJanela("RelBoletoSafra", { codigoZoop: item.codigoZoop });
          }else{
            window.open(item.urlBoleto, "_blank");
          }
        }
        else if (item.tipoOperacaoId === EnumTipoOperacaoFinanceira.Banco) {
              this.DownloadDocumento(item.id);
        }
      });
  } 

  abrirUrlNoNovaJanela(nomeRota, queryParams) {
    let routeLink = this.$router.resolve({
      name: nomeRota,
      query: ConstruirQueryParams(queryParams),
    });
    window.open(routeLink.href, "_blank");
  }

  GerarBoletos(){
    if(this.selectedItems.length == 0){
      return this.$swal("Aviso", "É necessário selecionar uma ou mais parcela para gerar o boleto" , "warning")
    }

     this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja Gerar os Boletos?",
      icon: "question", 
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.service.GerarBoletos(this.selectedItems.map(x=> x)).then(
          (res) => {
            if (res.status == 200) {
              this.selectedItems = [];
              this.Atualizar(); 
              return res;
            }
          },
          (err) => this.$swal("Aviso", err.response.data, "error")
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
      }
    }); 
  }

  CancelarBoletos(){
     this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja cancelar os Boletos?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.service.CancelarBoletos(this.selectedItems.map(x=> x)).then(
          (res) => {
            if (res.status == 200) {
              this.selectedItems = [];
              this.Atualizar(); 
              return res;
            }
          },
          (err) => this.$swal("Aviso", err.response.data, "error")
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
      }
    }); 
  }

  ExcluirBoletos(item) {
    this.$swal({
      title: "Atenção!",
      text: "Essa opção excluí o boleto do nosso sistema completamente. Só utilize essa função se tem certeza que o boleto foi cancelado na instituição financeira onde ele foi registrado. Tem certeza que deseja prosseguir e excluir o Boleto?",
      icon: "warning",
      iconColor: "red",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.service.ExcluirBoletos(this.selectedItems.map(x=> x)).then(
          (res) => {
            if (res.status == 200) {
              this.selectedItems = [];
              this.Atualizar(); 
              return res;
            }
          },
          (err) => {
            if (!err.response) {
              this.$swal("Aviso", "Não foi possível acessar a API", "error");
            } else if (err.response.status == 403) {
              this.$swal("Aviso", err.response.data.message, "warning");
            } else {
              this.$swal(
                "Aviso",
                err.response.data,
                err.response.status == 400 ? "warning" : "error"
              );
            }
          }
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
      }
    });
  }

  GerarBoleto(item){
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja Gerar o Boleto?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.service.GerarBoleto(item.id).then(
          (res) => {
            if (res.status == 200) {
              this.Atualizar(); 
              return res;
            }
          },
          (err) => this.$swal("Aviso", err.response.data, "error")
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
      }
    });
  }

  CancelarParcela(item) {
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja cancelar o registro atual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.service.CancelarParcela(item.id).then(
          (res) => {
            if (res.status == 200) {
              this.Atualizar();
              return res;
            }
          },
          (err) => this.$swal("Aviso", err.response.data, "error")
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
      }
    });
  } 

  EstornarBoleto(item){
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja estornar o boleto?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.service.CancelarBoleto(item.id).then(
          (res) => {
            if (res.status == 200) {
              this.Atualizar();
              return res;
            }
          },
          (err) => this.$swal("Aviso", err.response.data, "error")
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
      }
    });
  }
   
  Consultar(){
    this.loading = true;
    this.options.page = 1;
    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;

    this.service.ListarParcelas(page, itemsPerPage, sortBy,sortDesc,this.search,this.headers, this.filter, '' , '', 'Baixas, Receita.Contrato, Receita.Empresa, Receita.Cliente, Situacao').then(
      (res) => {
        this.lista = res.data.items;
        this.totalLista = res.data.count;
        this.loading = false;  
      },  
      (err) => {
        if (!err.response) {
          this.$swal("Aviso", "Não foi possível acessar a API", "error");
        } else if (err.response.status == 403) {
          this.$swal("Aviso", err.response.data.message, "warning" );
        } else {
          this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
        }
      }
    );   
    this.sheet = false;
  } 

  ExportarExcel(tabela: string, worksheet?: string){
    TableToExcel(tabela, worksheet);
  }  

  ResetFiltro(){
    this.filter = { codigoBanco:0,contaCorrenteId:0,numero:0,empresaId:0,tipoId:0,numeroDocumento:"",formaPagamentoId:0, clienteId:0, situacaoId:[], dataVencimentoInicial:"", dataVencimentoFinal:"",dataPagamentoInicial:"", dataPagamentoFinal:"", empreendimentoId:0, centroCustoId:0, contaGerencialId:0}
  }

  SituacaoColor(item){
    return SituacaoColor(item);
  }

  buttons = [
    { id: 1, label: "30", color: "red lighten-2", active: true, dias: -30 },
    { id: 2, label: "15", color: "red lighten-2", active: true, dias: -15 },
    { id: 3, label: "5", color: "red lighten-2", active: true, dias: -5 },
    { id: 4, label: "HOJE", color: "blue lighten-2", active: true, dias: 0 },
    { id: 5, label: "5", color: "green lighten-2", active: true, dias: 5 },
    { id: 6, label: "15", color: "green lighten-2", active: true, dias: 15 },
    { id: 7, label: "30", color: "green lighten-2", active: true, dias: 30 },
  ]

  toggleButton(button){
    if (button.active) {
      this.filterByDias(button.dias);
      this.resetButtons();
      button.active = false;
    } else {
      button.active = true;
      this.filter.dataVencimentoInicial ="";
      this.filter.dataVencimentoFinal ="";
      this.Atualizar();
    }
  }

  filterByDias(dias) {
    const date = new Date(new Date().setDate(new Date().getDate() + dias));
    this.filter.dataVencimentoInicial = new Date().yyyymmdd();
    this.filter.dataVencimentoFinal = new Date().yyyymmdd();

    if(dias >=0){
      this.filter.dataVencimentoFinal = new Date(date).yyyymmdd();
    }else if(dias < 0){
      this.filter.dataVencimentoInicial = new Date(date).yyyymmdd();
    } 
    this.Atualizar();
  }

  resetButtons() {
    this.buttons.forEach((button) => (button.active = true));
  }

  DownloadDocumento(id: number){
    this.loading = true;
      this.service.DownloadDocumento(id).then(
        res => 
        {
          let file = new Blob([res.data], {type: res.headers["content-type"]});
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        },
          (err) => { 
        if (!err.response) {
          this.$swal("Aviso", "Não foi possível acessar a API", "error");
        } else if (err.response.status == 403) {
          this.$swal("Aviso", err.response.data.message, "warning" );
        } else {
          this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
        }}
    )
    .finally(() => this.loading = false);
  }

  onItemSelected(selectedItems) {
    this.selectedItems = selectedItems;
  }

 SelecionarTodos() {
    if (this.allSelected) {
      this.selectedItems = [];
    } else {
      this.selectedItems = this.lista.map((x:any) => x.id);
    }
    this.allSelected = !this.allSelected;
  }

  get textselecionartodasparcelas(){
    if (this.selecionarTodosEmpreendimentos) return 'Desmarcar'
    if (this.SelecionarAlgunsEmpreendimentos) return 'Selecionando...'
    return 'Selecionar todos'
  }

  get selecionarTodosEmpreendimentos(){
    return this.selectedItems.length === this.lista.length;
  }

  get SelecionarAlgunsEmpreendimentos(){
    return this.selectedItems.length > 0 && !this.selecionarTodosEmpreendimentos;
  }
  
  mounted(){ 
    new FormaPagamentoService().ListarTudo().then( res => {
      this.formasPagamento = res.data.items;
    })

    new ContaCorrenteService().Listar(-1, -1, ['nome'],[],'',[], '', '' , 'Id, nome', '').then(res =>{
      this.contaCorrentes = res.data.items
    })

    new EmpreendimentoService().Listar(-1, -1, ['nome'],[],'',[], '', '' , 'Id, nome', '').then(
      res => this.empreendimentos = res.data.items
    )
 
    new PessoaService().Listar(-1, -1, ['nome'],[],'',[], '', '' , 'Id,nome,cnpjCpf, nomeCnpjCpf', '').then(
      res => this.pessoas = res.data.items
    )

    new SituacaoReceitaParcelaService().ListarTudo().then(
      res => this.situacoes = res.data.items
    )

    new EmpresaService().Listar(-1, -1, ['nome'],[],'',[], '', '' , 'Id, nome', '').then(
      res => this.empresas = res.data.items
    )

    new CentroCustoService().Listagem().then((res) => {
      this.listaCentroCusto = res.data;
    });

    new ContaGerencialService().Listagem().then((res) => {
      this.listaContaGerencial = res.data;
    });
  }
} 

 class Model {
    situacaoId = [];
    contaCorrenteId:number = 0;
    numero:number = 0;
    empresaId:number = 0;
    tipoId:number = 0;
    numeroDocumento:string = "";
    formaPagamentoId: number = 0;
    clienteId: number = 0;
    dataVencimentoInicial:string = "";
    dataVencimentoFinal:string = "";
    dataPagamentoInicial:string = "";
    dataPagamentoFinal:string = "";
    empreendimentoId:number = 0;
    centroCustoId:number = 0;
    contaGerencialId:number = 0;
    codigoBanco:number = 0;
  }
</script>

<style scoped>
.scrollable-sheet {
  max-height: 540px; /* Defina a altura máxima que você deseja */
  overflow-y: auto;
}
</style>