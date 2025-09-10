<template>
  <master-page :titulo="titulo" :subTitulo="subTitulo">

    <v-row>
     <v-col cols="12">
        <v-breadcrumbs :items="breadCrumbLinks" divider="/"></v-breadcrumbs>
      </v-col>
    </v-row>

    <h3>Contratos</h3>
    <br>

    <v-card> 
      <v-card-title>
        <v-spacer/>

          <template>
            <div class="text-center">
              <v-bottom-sheet v-model="sheet" >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="ResetFiltro()"  v-bind="attrs" v-on="on" icon color="primary" class="mb-2" dark>
                    <v-icon>mdi-filter-outline</v-icon>
                  </v-btn>  
                </template> 
  
                <v-sheet class="overflow-y-auto">
                  <v-toolbar dense flat>
                    <v-icon>mdi-filter</v-icon>
                    <v-toolbar-title class="pl-3">Filtros</v-toolbar-title>
                  </v-toolbar> 
    
                  <v-card-text>  
                    <v-row dense>
                      <v-col md="2" xs="1">
                        <v-text-field outlined label="Número" type="number" v-model="filter.numero" dense/>
                      </v-col>

                      <v-col md="2" xs="1">
                        <v-text-field outlined label="Sequência" type="number" v-model="filter.sequencia" dense/>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-autocomplete outlined v-model="filter.clienteIds" :items="pessoas" clearable item-text="nomeCnpjCpf" item-value="id" label="Cliente/CPF-CNPJ" placeholder="Digite o Cliente" dense />
                      </v-col> 

                      <v-col md="4">
                        <v-text-field outlined label="Data do Contrato" v-model="filter.data" type="date" dense />
                      </v-col>

                      <v-col md="4" xs="1">
                        <v-select outlined label="Tipo do Produto" v-model="filter.tipoProdutoId" item-value="id" item-text="nome" :items="tiposProdutos" dense clearable :menu-props="{ offsetY: true, offsetOverflow: true }"/>
                      </v-col>

                      <v-col md="4" xs="1">
                        <v-select outlined label="Tipo do Contrato" v-model="filter.tipoId" item-value="id" item-text="nome" :items="tipos" dense clearable :menu-props="{ offsetY: true, offsetOverflow: true }"/>
                      </v-col>

                      <v-col md="4" xs="1">
                        <v-autocomplete outlined v-model="filter.email" :items="pessoas" clearable item-text="email" item-value="email" label="Email" placeholder="Digite o Email" dense />
                      </v-col>

                      <v-col cols="4" xs="1">
                        <v-autocomplete outlined placeholder="Selecione" label="Empreendimento" @change="ObterGrupos()" v-model="filter.empreendimentoId" item-value="id" item-text="nome" :items="empreendimentos" dense clearable/>
                      </v-col> 
 
                      <v-col md="4" xs="1">
                        <v-autocomplete outlined placeholder="Selecione" label="Quadras" v-model="filter.grupoId" dense clearable @change="ObterUnidades()" :items="listaGrupos" item-value="id" item-text="nome"/>
                      </v-col>
 
                      <v-col md="4" xs="1">
                        <v-autocomplete outlined placeholder="Selecione" label="Unidades" dense clearable v-model="filter.unidadeId" :items="listaUnidades" item-value="id" item-text="nome"/>
                      </v-col>

                      <v-col md="4" xs="1">
                        <v-autocomplete outlined v-model="filter.situacaoId" :items="situacaoContrato" clearable item-text="nome" item-value="id" label="Situação" dense/>
                      </v-col>
                      
                      <v-spacer/>
                    
                      <div>
                        <v-btn color="primary" @click="Consultar()">Consultar</v-btn>
                      </div> 
                    </v-row>
                  </v-card-text> 
                </v-sheet>
              </v-bottom-sheet>
            </div>
          </template>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="Novo()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Novo {{titulo}}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="ResetFiltro(), Atualizar()">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template> 
            <span>Atualizar</span>
          </v-tooltip>
        <slot name="botoes" />
      </v-card-title> 
     
      <v-card-text>                                                          
        <v-data-table fixed-header height="500" multi-sort :headers="headers" :items="lista" :options.sync="options" :footer-props="{ showFirstLastPage: true }"  :server-items-length="totalLista" :loading="loading">
          <template v-slot:item="props">
            <tr>
              <td>  
                <v-tooltip>
                  <template v-slot:activator="{ on }">
                      <v-menu offset-y v-on="on">
                        <template v-slot:activator="{ on, attrs }">
                          <v-row>
                            <v-btn outlined v-bind="attrs" v-on="on" tile color="primary">
                              <v-icon size="25px" left>mdi-menu-down</v-icon>
                              Ações
                            </v-btn>
                          </v-row> 
                        </template>  
                  
                        <v-list>
                          <template v-if="props.item.situacaoId == 1 || props.item.situacaoId == 6 || props.item.situacaoId == 3 || props.item.situacaoId == 2 || props.item.situacaoId == 8">
                            <v-list-item @click="Gerenciar(props.item)">
                              <v-list-item-title>
                                <v-icon size="32px" color="primary">mdi-file-document-edit</v-icon> Gerenciar
                              </v-list-item-title>
                            </v-list-item> 
                            <v-divider/>  
                          </template> 

                          <v-list-item @click="Visualizar(props.item)">
                            <v-list-item-title> 
                              <v-icon size="32px" color="blue">mdi-information-outline</v-icon> Detalhar   
                            </v-list-item-title> 
                          </v-list-item> 
                          
                        <template v-if="props.item.situacaoId == 1 || props.item.situacaoId == 6 || props.item.situacaoId == 3">
                        <v-divider/>
                          <v-list-item @click="Aditar(props.item)">
                            <v-list-item-title>
                              <v-icon size="32px" color="#FFD54F">mdi-file-import</v-icon> Aditar
                            </v-list-item-title>
                          </v-list-item>
                        <v-divider/>   
                        </template>

                      <template v-if="props.item.situacaoId == 1 || props.item.situacaoId == 3">
                        <v-list-item @click="Cancelar(props.item)">
                          <v-list-item-title>
                            <v-icon size="32px" color="black">mdi-cancel</v-icon> Distrato
                          </v-list-item-title>
                        </v-list-item>
                      </template>

                      <template v-if="props.item.situacaoId == 5">
                        <v-divider/>  
                        <v-list-item @click="ReverterCancelamento(props.item)">
                          <v-list-item-title>
                            <v-icon size="32px" color="black">mdi-repeat</v-icon> Reverter Cancelamento  
                          </v-list-item-title>
                        </v-list-item>
                      <v-divider/>   
                      </template>  

                      <template v-if="(props.item.situacaoId != 5 &&  props.item.situacaoId != 7) && props.item.contratoAnteriorAditadoId != null">
                        <v-divider/>
                          <v-list-item @click="ReverterAditamento(props.item)">
                            <v-list-item-title>
                              <v-icon size="32px" color="purple">mdi-repeat</v-icon> Reverter Aditamento  
                            </v-list-item-title>
                          </v-list-item> 
                        </template>

                        <template v-if="props.item.situacaoId == 5">
                          <v-list-item @click="GerarDespesa(props.item)">
                            <v-list-item-title> 
                              <v-icon size="32px" color="red">mdi-cash-multiple</v-icon> {{props.item.despesaId > 0 ? 'Visualizar' : 'Fazer' }} Reembolso
                            </v-list-item-title>
                          </v-list-item>
                        </template> 
                      </v-list>
                    </v-menu> 
                  </template> 
                <span>Editar</span>
                </v-tooltip>
              </td>

            <td>{{props.item.numeroSequenciaContrato}}</td>
              <td>{{props.item.clienteNome}}</td>
                <td>
                  <v-chip :color="situacaoColor(props.item)">
                    {{props.item.situacaoNome }} 
                  </v-chip> 
                </td>
                <td>{{props.item.empreendimentoNome}}</td>
                <td>{{props.item.grupoNome}}</td>
                <td>{{props.item.unidadeNome}}</td>
                <td>{{new Date(props.item.dataContrato).toLocaleDateString()}}</td>
              </tr>
            </template>
          </v-data-table> 
      </v-card-text>  

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="50"/>
    </v-overlay>
  </v-card> 

    <v-row justify="center">
      <gerenciador-contrato v-model="dialogGerenciador" :clienteNome="clienteNome" :item="item" @fechou="dialogGerenciador = false, Atualizar()" @salvou="Atualizar()"/> 
      <novo-cadastro-contrato v-model="dialogCadastro" :item="item" @fechou="dialogCadastro = false" @salvou="Atualizar()"/>
      <visualizar-contrato v-model="dialogVisualizar" :item="item" @fechou="dialogVisualizar = false, Atualizar()" @salvou="Atualizar()"/>    
      <aditar-contrato v-model="dialogAditar" :item="item" @fechou="dialogAditar = false, Atualizar()" @salvou="Atualizar()"/>
      <cadastro-despesa v-model="dialogCadastroDespesa" :pedidos="[]" :item="despesa" @fechou="(dialogCadastroDespesa = false), Atualizar()" @salvou="Atualizar()"/>
      <cancelar-contrato v-model="dialogCancelar" :item="item" :clienteNome="clienteNome" @fechou="(dialogCancelar = false), Atualizar()"/>
    </v-row>    
    
  </master-page> 
</template> 
 
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import ListPage from '@/components/shared/ListPage';
import { ContratoService, EmpreendimentoService, PessoaService, SituacaoContratoService } from '@/core/services/cadastros';
import { Contrato, Pessoa } from '@/core/models/cadastros';
import { DespesaService, TipoContratoService, TipoProdutoContratoService } from '@/core/services/financeiro';
import { Despesa } from '@/core/models/financeiro';
import { EnumOrigemDespesa } from "@/core/models/financeiro/OrigemDespesa";

@Component
export default class ListaContrato extends mixins(Vue,ListPage) {
  item = new Contrato(); 

  filter = new Relatorio();
  service =  new ContratoService();

  dialogCadastro: boolean = false;
  dialogGerenciador:boolean = false;
  dialogVisualizar:boolean = false;
  dialogCancelar: boolean = false;
  dialogDigital:boolean = false;
  dialogCadastroDespesa:boolean = false;
  dialogAditar = false;
  overlay:boolean = false; 
  loading: boolean = false;
  totalLista: number = 0;
  lista:any = [];

  contratoDigital = new Contrato();
  despesa = new Despesa();
  cliente = new Pessoa();
 
  titulo: string = 'Contrato';
  subTitulo: string = 'Lista de Contratos cadastrados no Sistema';

  options: any = {
    itemsPerPage: 15 
  };  

  sheet: boolean = false; 
  empreendimentos:any = [];
  tiposProdutos = [];
  listaGrupos: any = [] = [];
  listaUnidades: any = [] = [];
  listaUnidadesAdicionais: any = [] = [];
  pessoas = [];
  tipos = [];
  situacaoContrato = [];

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nº do Contrato", value: "numero"},
    { text: "Cliente", value: "clienteNome", sortable: false }, // aqui é uma lista de clientes
    { text: "Situação", value: "situacao.nome"},
    { text: "Empreendimento", value: "empreendimento.nome"},
    { text: "Grupo", value: "unidadePrincipal.grupo/nome"},
    { text: "Unidade", value: "unidadePrincipal.nome"},
    { text: "Data do Contrato", value: "data"},
  ]; 
 
  
   breadCrumbLinks: any[] = [
    { text: 'Home', href: '/financeiro/painel/kpi',},
    { text: 'Lista de Contratos', disabled: true, href: '/financeiro/painel/despesas'}
  ]
  
  @Watch("options",{ deep: true })
  Atualizar() {
    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;
  
    this.loading = true;
    this.service.ListarContratosAtualizados(page,itemsPerPage, sortBy.length == 0 ? ['numero'] : sortBy, sortBy.length == 0 ? [true] : sortDesc, search, columns, this.filter, 'Clientes, UnidadePrincipal.Grupo').then(
      (res) => {     
        this.lista = res.data.items;
        this.totalLista = res.data.count;
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
    ).finally(() => (this.loading = false));
  }

  Visualizar(item){
    this.overlay = !this.overlay;

    this.service.ObterPorId(item.id,"TipoAditamento, Receitas.Tipo, Reserva, TipoIndice, TipoProduto,Empresa,Empreendimento, UnidadePrincipal.Grupo, Clientes.Cliente, Corretores, Observacoes, Receitas.Parcelas.Situacao, Receitas.Parcelas.Baixas.FormaPagamento, HistoricoSituacoes.Situacao, HistoricoSituacoes.Usuario, Observacoes.Usuario").then((res) => {
      this.item = res.data;
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
    }
   ).finally(() => {this.overlay = false}) 
  }  
   
  Consultar() {
    this.options.page = 1;
    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;
    this.loading = true; 

    this.service.ListarContratosAtualizados(page,itemsPerPage, sortBy.length == 0 ? ['numero'] : sortBy, sortBy.length == 0 ? [true] : sortDesc,search,columns, this.filter, '').then(
      (res) => { 
        this.lista = res.data.items;
        this.totalLista = res.data.count;
      },
      (err) => {
        if (!err.response) {
          this.$swal("Aviso", "Não foi possível acessar a API", "error");
        } else if (err.response.status == 403) {
          this.$swal("Aviso", err.response.data.message, "warning" );
        } else {
          this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
        }
      }).finally(() => (this.loading = false));
    
    this.sheet = false;
  }  
 
  ObterUnidades() {
    new EmpreendimentoService().ListarUnidade(this.filter.grupoId).then(
      (res) => {
        this.listaUnidades = res.data
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
    )
  }

  ObterGrupos() {
    new EmpreendimentoService().ListarGrupo(this.filter.empreendimentoId).then(
      (res) => {
        this.listaGrupos = res.data
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
    )
  } 
 
  Novo(){
    this.item = new Contrato;
    this.dialogCadastro = true;  
  }
    
  Cancelar(item){
    this.overlay = !this.overlay;
      this.service.ObterPorId(item.id, "Clientes, UnidadePrincipal, Receitas.Parcelas.Transacoes.UsuarioBoletoGerado, UnidadesAdicionais.Unidade, ContratosDigitais.Tipo, ContratosDigitais.Situacao, ContratosDigitais.Signatarios.Cliente, ContratosDigitais.Signatarios.Situacao, Receitas.Parcelas.AntecipacaoAmortizacao.Itens,TipoAmortizacao, Receitas.Parcelas.AntecipacaoComprovante, Receitas.Parcelas.Situacao, Receitas.Parcelas.Baixas.FormaPagamento, TipoIndice").then(res => {
        this.item = new Contrato(res.data);  
        this.clienteNome = item.clienteNome;
        this.dialogCancelar = true;
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
    ).finally(() => {this.overlay = false}) 
  } 

  ReverterCancelamento(item){
     this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja reverter o registro atual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.service.ReverterCancelamento(item.id).then(
          (res) => {
            if (res.status == 200) {
              return res;
            }
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
      }, 
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if (result.value) {
        this.$swal("Aviso",result.value.data,result.value.status == 200 ? "success" : "warning");
        this.Atualizar();
      }
    });   
  }
   
  ReverterAditamento(item){
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja reverter o registro atual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.service.Reverter(item.id).then(
          (res) => {
            if (res.status == 200) {
              return res;
            }
          },  
          (err) => this.$swal("Aviso", err.response.data, "error")
        );
      }, 
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result:any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
        this.Atualizar();
      }
    }); 
  }

  clienteNome:string = "";
    
  Gerenciar(item) {  
    this.overlay = !this.overlay;
      this.service.ObterPorId(item.id, "Despesas.Parcelas.Baixas.FormaPagamento, Despesas.Fornecedor, Despesas.Parcelas.Situacao,Receitas.Parcelas.Transacoes.UsuarioBoletoGerado, UnidadesAdicionais.Unidade, ContratosDigitais.Tipo, ContratosDigitais.Situacao, ContratosDigitais.Signatarios.Cliente, ContratosDigitais.Signatarios.Situacao, Receitas.Parcelas.AntecipacaoAmortizacao.Itens,TipoAmortizacao, Receitas.Parcelas.AntecipacaoComprovante, Observacoes, Receitas.Parcelas.Situacao, Receitas.Parcelas.Baixas.FormaPagamento,TipoIndice").then(res => {
        this.item = new Contrato(res.data);  
        this.clienteNome = item.clienteNome;
        this.dialogGerenciador = true;
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
    ).finally(() => {this.overlay = false}) 
  }  

  GerarDespesa(item){
    if(item.despesaId > 0){
      const despesaService = new DespesaService();
        despesaService.ObterPorId(item.despesaId, 'Parcelas, Classificacoes').then(
        (res) => {
          this.despesa = res.data;
          this.despesa.dataEmissao = new Date(res.data.dataEmissao).yyyymmdd();
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
      
      }else{
        this.despesa = new Despesa();
        this.despesa.origemId = EnumOrigemDespesa.Contrato;
        this.despesa.contratoId = item.id;
        this.despesa.fornecedorId = item.clienteId;
        this.despesa.empreendimentoId = item.empreendimentoId;
      }

    this.dialogCadastroDespesa = true;
  }
    
  Aditar(item) {  
    this.overlay = !this.overlay;
    
    this.service.ObterPorId(item.id, "Empresa, Empreendimento,Clientes, Corretores, Receitas.Parcelas.Baixas, Observacoes, Tipo, UnidadePrincipal.Grupo, UnidadesAdicionais").then((res) => {
      this.item = new Contrato(res.data);
      this.item.data = new Date().yyyymmdd();
      this.dialogAditar = true;
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
    ).finally(() => {this.overlay = false})  
  }

  situacaoColor(item){ 
    if(item.situacaoId == 1)
      return "blue lighten-3";

      else if(item.situacaoId == 2) 
      return "orange lighten-1";

      else if(item.situacaoId == 3)
      return "deep-purple lighten-1";

      else if(item.situacaoId == 4)
      return "red lighten-1";
  
      else if(item.situacaoId == 5)
      return "grey lighten-1";

      else if(item.situacaoId == 6) 
      return "teal lighten-1";

      else if(item.situacaoId == 7)
      return "yellow lighten-1";
  }
 
  ResetFiltro(){
    this.filter = {numero:0,  sequencia:0, tipoProdutoId:0,situacaoId:0, tipoId:0, data:'', empreendimentoId:0, grupoId:0, unidadePrincipalId:0, clienteIds:0, email:''}
  }

  mounted(){
    const situacaoContratoService = new SituacaoContratoService();
    situacaoContratoService.ListarTudo().then(
      res => {
        this.situacaoContrato = res.data.items
      }
    )

    const pessoaService = new PessoaService();
    pessoaService.Listar(-1, -1, ['nome'],[],'',[], '', '' , 'id, Nome, CnpjCpf,nomeCnpjCpf, Email', '').then(
      res => {
        this.pessoas = res.data.items
      }
    )

  new TipoProdutoContratoService().ListarTudo().then(
    res => {
      this.tiposProdutos = res.data.items
    }) 

  new EmpreendimentoService().Listar(-1, -1, ['nome'], [], undefined, [], "", '', "Id,Nome", "").then(
    res => {
      this.empreendimentos = res.data.items
    })

  new TipoContratoService().ListarTudo().then(
    res => {
      this.tipos = res.data.items
    })
  } 
} 
           
class Relatorio {
  numero: number = 0;
  sequencia: number = 0;
  tipoProdutoId:number = 0;
  situacaoId:number = 0;
  tipoId: number =  0;
  data:string = "";
  empreendimentoId: number = 0;
  grupoId: number= 0; 
  unidadePrincipalId:number= 0;
  clienteIds = 0;
  email:string = "";
}
</script>