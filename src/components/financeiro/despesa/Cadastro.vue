<template>
  <v-dialog persistent v-model="dialog" fullscreen no-click-animation hide-overlay transition="dialog-bottom-transition">
    <v-card> 
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn> 

        <v-toolbar-title>Despesa</v-toolbar-title>
        <v-spacer/>
   
        <v-toolbar-items>
          <v-btn dark text @click="Salvar()" :loading="overlay">Salvar</v-btn>
        </v-toolbar-items> 
 
        <template v-slot:extension>
          <v-tabs v-model="tabActive" background-color="primary" dark>
            <v-tab>Geral</v-tab>
            <v-tab>Parcelas</v-tab>
            <v-tab>Classificação</v-tab>
            <v-tab>Observações</v-tab>
            <v-tab>Documentos</v-tab>
          </v-tabs> 
        </template>  
      </v-toolbar>  
      
      <v-form ref="formDespesa" v-model="valid" lazy-validation> 
        <v-tabs-items v-model="tabActive">
          <v-tab-item>  
            <v-card elevation="1">
        
              <v-card-text> 
                <v-card-title>
                  <v-icon large left color="primary">mdi-information</v-icon>
                  <span class="title-span">Informações da Despesa</span>
                </v-card-title>
                
                <span class="pt-3 px-3" id="campos">* Campo obrigatório</span>
                  <v-row dense class="px-3">
                    <v-col cols="12" sm="12" md="3">
                      <span class="font-weight-bold">Código do documento*</span>
                      <v-text-field outlined v-model="item.numeroDocumento" dense  :rules="fieldRules"  :counter="35" maxlength="35"/>
                    </v-col>

                    <v-col cols="12" sm="12" md="3">
                      <span class="font-weight-bold">Emissão*</span>
                      <v-text-field outlined v-model="item.dataEmissao" :rules="fieldRules" type="date" max="9999-12-31" dense/>
                    </v-col>
      
                    <v-col cols="12" sm="12" md="6">
                      <span class="font-weight-bold">Tipo de Despesa*</span>
                      <v-autocomplete placeholder="Selecione" outlined v-model="item.tipoId" :items="tipoDespesas" item-value="id" item-text="nome" :rules="fieldRules" dense/>
                    </v-col>
 
                    <v-col cols="12" sm="12" md="4">
                      <span class="font-weight-bold">Tipo de documento*</span>
                      <v-autocomplete placeholder="Selecione" outlined v-model="item.tipoDocumentoId" :items="tipoDocumentos" item-value="id" item-text="nome" :rules="fieldRules" dense/> 
                    </v-col> 
  
                    <v-col cols="12" sm="12" md="2" class="pb-6">
                      <span class="font-weight-bold">Valor da Despesa Original*</span>
                      <money-input :class="{ 'campo-desabilitado': item.id > 0 }" :disabled="item.id > 0" v-model="item.valor" @ValorFormatado="valor => item.valor = valor"/>
                    </v-col>
                   
                    <v-col cols="12" sm="12" md="2" class="pb-6" v-if="item.parcelas.some(p => p.situacaoId == 2)">
                      <span class="font-weight-bold">Valor da Despesa Atual*</span>
                      <money-input class="campo-desabilitado" disabled v-model="item.valorDespesaAtual" @ValorFormatado="valor => item.valorDespesaAtual = valor"/>
                    </v-col>
 
                    <v-col cols="12" sm="12" md="4">
                      <span class="font-weight-bold">Fornecedor*</span>
                     
                      <v-autocomplete placeholder="Selecione" outlined no-data-text="Fornecedor não encontrado." :items="pessoas" v-model="item.fornecedorId" item-value="id" clearable item-text="nomeCnpjCpf" dense :rules="fieldRules">
                       <template v-slot:append-outer>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                              <v-btn icon v-on="on" style="margin-top: -5px" @click="NovaPessoa()">
                                <v-icon color="primary">mdi-account-plus</v-icon>
                              </v-btn>
                            </template>
                            <span>Cadastrar Pessoa</span>
                          </v-tooltip> 
                        </template>
                      </v-autocomplete>
                    </v-col> 
 
                    <v-col cols="12" sm="12" md="6">
                      <span class="font-weight-bold">Empresa*</span>
                      <v-autocomplete @change="ObterEmpreendimentosPorEmpresa()" placeholder="Selecione" outlined :items="empresas" v-model="item.empresaId" item-value="id"  item-text="nomeFantasia" dense :rules="fieldRules"/>
                    </v-col> 

                    <v-col cols="12" sm="12" md="4">
                      <span class="font-weight-bold">Empreendimento</span>
                      <v-autocomplete placeholder="Selecione" outlined :items="empreendimentos" v-model="item.empreendimentoId" item-value="id" item-text="nome" dense/>
                    </v-col>

                    <v-col cols="12" sm="12" md="2">
                      <span class="font-weight-bold">Chave de Acesso</span>
                      <v-text-field outlined v-model="item.chaveDfe" :counter="44" maxlength="44" dense /> 
                    </v-col> 

                    <v-col cols="12" md="12">
                      <span class="font-weight-bold">Observação</span>
                      <v-textarea outlined v-model="item.observacao" dense/>
                    </v-col>
                  </v-row>
                  
                  <div v-if="item.id > 0 && item.dataCriacao" style="font-size: 10px !important" class="pl-3 overline text--secondary">Data de criação: {{ new Date(item.dataCriacao).ddmmyyyy() }} - {{ item.horaCriacao.split('.')[0] }}</div>
                  <div v-if="item.id > 0 && item.usuario" style="font-size: 10px !important" class="pl-3 overline text--secondary">Criada por: {{ item.usuario.login }}</div>
               </v-card-text>
             </v-card> 
            <br> 
          </v-tab-item>

          <v-tab-item>
            <v-card elevation="1">
              <v-card-text> 
                <v-form ref="formParcela" v-model="valid" lazy-validation>
                  <v-card-title>
                    <span class="title-span">Parcela</span>             
                  </v-card-title>
                 
                  <v-row dense class="pt-3 px-3">
                    <v-col cols="12" md="2">
                      <span class="font-weight-bold">Quantidade de Parcelas*</span>
                      <v-text-field outlined type="number" v-model="numeroParcelas" @input="valorInicialParcelas = Number((item.valor / numeroParcelas).toFixed(2))"  dense/>
                    </v-col> 
    
                    <v-col cols="12" md="2">
                      <span class="font-weight-bold">Valor da Parcela*</span>
                      <money-input v-model="valorInicialParcelas" readonly />
                    </v-col>

                    <v-col cols="12" md="3">
                      <span class="font-weight-bold">1° Vencimento*</span>
                      <v-text-field outlined v-model="parcela.dataVencimento" type="date" max="9999-12-31" dense/>
                    </v-col>

                    <v-col cols="12" md="2" class="pt-7">
                      <v-btn color="primary" @click="GerarParcelas()">
                        <v-icon>mdi-plus</v-icon> Gerar
                      </v-btn>
                    </v-col> 
                  </v-row>

                  <v-data-table :headers="headersParcela" :items="item.parcelas" :options.sync="options" :footer-props="{ showFirstLastPage:false }" :loading="loading" item-key="item.parcela" class="elevation-1">
                    <template v-slot:[`item.actions`] = "{item}">
                      <v-tooltip left>
                        <template v-slot:activator="{ on }">
                          <v-icon small @click="EditarParcela(item)" :disabled="item.situacaoId != 1" v-on="on">mdi-pencil</v-icon>
                        </template>
                        <span>Editar</span>
                      </v-tooltip>
                    </template>

                    <template v-slot:[`item.parcela`] = "{item}">
                      {{ item.parcela }}
                    </template>

                    <template v-slot:[`item.valor`] = "{item}">
                      {{ item.valor ? Number(item.valor).toMoeda(true) : new Number(0).toMoeda(true) }}
                    </template>

                    <template v-slot:[`item.valorPago`] = "{item}">
                      {{ item.valorPago ? Number(item.valorPago).toMoeda(true) : new Number(0).toMoeda(true) }}
                    </template>

                    <template v-slot:[`item.linhaDigitavelBoleto`] = "{item}">
                      <v-edit-dialog :return-value.sync="item.linhaDigitavelBoleto">
                        <v-tooltip right>
                          <template v-slot:activator="{ on }">
                            <v-icon small v-on="on">mdi-pencil</v-icon>
                          </template>
                          <span>Editar</span>
                        </v-tooltip>   
                        {{ item.linhaDigitavelBoleto }}  
                        
                        <template v-slot:input>
                          <v-text-field :rules="validaBoleto" :disabled="item.situacaoId != 1" v-model="item.linhaDigitavelBoleto"  label="Edit" single-line :counter="58" maxlength="58"/>
                        </template>
                      </v-edit-dialog>
                    </template>

                    <template v-slot:[`item.dataVencimento`] = "{item}">
                      <v-edit-dialog :return-value.sync="item.dataVencimento">
                        {{  new Date(item.dataVencimento).ddmmyyyy()}}

                        <template v-slot:input>
                          <v-col cols="12" md="3">
                            <v-text-field :disabled="item.situacaoId != 1" v-model="item.dataVencimento" max="9999-12-31" label="Editar" type="date" dense/>
                          </v-col>
                        </template>
                      </v-edit-dialog> 
                    </template>

                    <template v-slot:[`item.situacaoId`] = "{item}">  
                      <v-chip :color="SituacaoColor(item)"> {{situacoes.find((f) => f.id == item.situacaoId).nome}}</v-chip>  
                    </template>
                  </v-data-table> 
                </v-form> 
              </v-card-text> 
            </v-card> 
           <br>
          </v-tab-item>

          <v-tab-item>
            <v-card elevation="1">
              <v-card-text>
                <v-card-title>
                  <span class="title-span">Classificação</span>             
                </v-card-title>

                <v-row dense class="pt-3 px-3">
                  <v-col cols="12" sm="12" md="2">
                    <span class="font-weight-bold">Valor total</span>
                    <money-input readonly v-model="valorTotal" dense />
                  </v-col>
                </v-row> 

               <v-form ref="formClassificacao" v-model="valid" lazy-validation>
                <v-row class="px-3" dense> 
                  <v-col cols="12" sm="12" md="3">
                    <span class="font-weight-bold">Centro Custo*</span>
                    <v-autocomplete placeholder="Selecione" outlined v-model="classificacao.centroCustoId" :items="centroCustosOrdenada" item-value="key" item-text="value" dense :rules="fieldRules"/> 
                  </v-col>
                
                  <v-col cols="12" sm="12" md="3">
                    <span class="font-weight-bold">Categoria*</span>
                    <v-autocomplete placeholder="Selecione" outlined v-model="classificacao.contaGerencialId" :items="contaGerenciaisOrdenada" item-value="key" item-text="value" dense :rules="fieldRules"/> 
                  </v-col>

                  <v-col cols="12" sm="12" md="2">
                    <span class="font-weight-bold">Valor*</span>
                    <money-input v-model="classificacao.valor" @ValorFormatado="valor => classificacao.valor = valor" @input="CalcularPercentualValor(classificacao.valor)" :rules="fieldRules"/>
                  </v-col>

                  <v-col cols="12" sm="12" md="2">
                    <span class="font-weight-bold">Percentual*</span>
                    <v-text-field outlined v-model="classificacao.percentual" @input="CalcularValorPercentual(classificacao.percentual)" suffix="%" type="number" dense :rules="fieldRules"/>
                  </v-col>

                  <v-col cols="12" sm="12" md="2" class="pt-6">
                    <v-btn color="primary" dark @click="AdicionarClassificacao()">
                      <v-icon>mdi-plus</v-icon>Adicionar
                    </v-btn>
                  </v-col>
                </v-row>
               
                <v-row> 
                  <v-col cols="12" sm="12" md="12">
                    <v-data-table :headers="headersClassificacao" :items="item.classificacoes" :options.sync="options" :footer-props="{ showFirstLastPage:false }" class="elevation-1" :loading="loading"   item-key="item.centroCustoId">
                      <template v-slot:[`item.actions`] = "{item}">
                        <v-tooltip right>
                          <template v-slot:activator="{ on }">
                            <v-icon :disabled="item.excluido" small @click="EditarClassificacao(item)" v-on="on">mdi-pencil</v-icon>
                          </template>
                          <span>Editar</span>
                        </v-tooltip>
                      
                        <v-tooltip right>
                          <template v-slot:activator="{ on }">
                            <v-icon small :disabled="item.excluido" @click="ExcluirClassificacao(item)" v-on="on">mdi-delete</v-icon>
                          </template>
                          <span>Excluir</span>
                        </v-tooltip>
                      </template>

                      <template v-slot:[`item.centroCustoId`] = "{item}">
                        {{ centroCustosOrdenada.find(x => x.key == item.centroCustoId).value  }}  
                      </template>

                      <template v-slot:[`item.contaGerencialId`] = "{item}">
                        {{ contaGerenciaisOrdenada.find((d) => d.key == item.contaGerencialId) ? contaGerenciaisOrdenada.find((d) => d.key == item.contaGerencialId).value : ''}}
                      </template> 

                      <template v-slot:[`item.valor`] = "{item}">
                        {{ item.valor ? Number(item.valor).toMoeda(true) : new Number(0).toMoeda(true)}}
                      </template>

                      <template v-slot:[`item.percentual`] = "{item}">
                        {{ `${item.percentual ? item.percentual.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : '0' } %` }}   
                      </template>
                    </v-data-table>
                  </v-col> 
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
          <br>
          </v-tab-item>

          <v-tab-item> 
            <v-card outlined>
              <vcard-observacao :lista.sync="item.observacoes" /> 
            </v-card> 
          </v-tab-item>
  
          <v-tab-item>
            <vcard-documento :lista.sync="item.documentos" :exibirCampos="true"/>
            <br>
          </v-tab-item>          
        </v-tabs-items>
      </v-form>
    <v-overlay :value="overlay"/>
  </v-card>

    <v-dialog v-model="dialogParcela" persistent max-width="700px" no-click-animation>
      <v-card>
        <v-toolbar flat>
          <v-card-actions>
            <v-btn @click="dialogParcela = false" icon color="primary">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card-title class="title font-weight-light">Editar Parcelas</v-card-title>
          </v-card-actions>
        </v-toolbar>
      
        <v-card-text> 
          <v-container>
            <v-form v-model="valid" ref="formParcela" lazy-validation>
              <v-row dense>
                <v-col cols="12" md="2">
                  <span class="font-weight-bold">Parcela</span>
                  <v-text-field outlined type="number" v-model="parcela.parcela" readonly dense/>
                </v-col>
                
                <v-col cols="12" md="4" class="pb-6">
                  <span class="font-weight-bold">Valor da Parcela</span>
                  <money-input v-model="parcela.valor" @ValorFormatado="valor => parcela.valor = valor"/>
                </v-col>

                <v-col cols="12" md="6"> 
                  <span class="font-weight-bold">Situação</span>
                  <v-select outlined v-model="parcela.situacaoId" :items="situacoes" item-value="id" item-text="nome" readonly dense/>
                </v-col> 

                <v-col cols="12" md="6">
                  <span class="font-weight-bold">1º vencimento</span>
                  <v-text-field outlined  v-model="parcela.dataVencimento" max="9999-12-31" type="date" dense/>
                </v-col>

                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Linha Digitável</span>
                  <v-text-field :rules="validaBoleto" outlined v-model="parcela.linhaDigitavelBoleto" :counter="58" maxlength="58" dense/>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn :disabled="!valid" color="primary" text @click="Confirmar()">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <cadastro-pessoa v-model="dialogCadastroPessoa" :item="Pessoa" @salvou="dialogCadastroPessoa = false, AtualizarPessoas()" @fechou="dialogCadastroPessoa = false"/>
  </v-dialog>
</template> 

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { DespesaService, TipoDocumentoService,SituacaoDespesaParcelaService,CentroCustoService,ContaGerencialService} from "@/core/services/financeiro";
import { Despesa,DespesaParcela, DespesaClassificacao} from "@/core/models/financeiro";
import { TipoDespesaService } from "../../../core/services/financeiro/TipoDespesaService";
import { EmpresaService } from "../../../core/services/compras/EmpresaService";
import { PessoaService, EmpreendimentoService} from "../../../core/services/cadastros";
import Pessoa from "../../../core/models/cadastros/Pessoa";
import * as jsonpatch from 'fast-json-patch';
import { SituacaoColor, TratarErroApi } from '@/assets/scripts/helper';
import { Pedido } from "@/core/models/compras";
import { boleto } from 'boleto-brasileiro-validator';
   
@Component
export default class CadastroDespesa extends Vue {
  @Prop() public item!: Despesa; 
  @Prop() public value!: string;
  @Prop() public pedidos!: [];

  service = new DespesaService();
  classificacao = new DespesaClassificacao();
  parcela = new DespesaParcela();
  Pessoa = new Pessoa(); 

  validaBoleto = [(v) => v.length == 0 || boleto(v) || "Código do boleto inválido!"];
   
  situacoes = []; 
  empresas = [];
  tipoDocumentos = [];
  tipoDespesas = [];  
  empreendimentos = [];
  centroCustosOrdenada = [];
  contaGerenciaisOrdenada = [];
  pessoas = [];
  parcelas:any = [];
  
  parcelaIndex = -1;
  classificacaoIndex = -1;
   
  dialogCadastroPessoa = false;
  tabActive = 0;
  dialogParcela = false;
  loading = false;
  valid = true;
  dialog = false;
  overlay = false;

  numeroParcelas = 0;
  valorInicialParcelas = 0;
 
  options: any = {
    itemsPerPage: 15,
  };

  $refs!: {
    formDespesa: HTMLFormElement;
    formParcela: HTMLFormElement;
    formClassificacao: HTMLFormElement
  }; 

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  headersParcela = [
    { text: "", value: "actions", sortable: false },
    { text: "Parcela", value: "parcela" },
    { text: "Valor", value: "valor" },
    { text: "Valor Pago", value: "valorPago" },
    { text: "Linha Digitável", value: "linhaDigitavelBoleto" },
    { text: "Vencimento", value: "dataVencimento" },
    { text: "Situação", value: "situacaoId" },
  ];

  headersClassificacao = [
    { text: "", value: "actions", sortable: false },
    { text: "Centro Custo", value: "centroCustoId" },
    { text: "Categoria", value: "contaGerencialId" },
    { text: "Valor", value: "valor" },
    { text: "Percentual", value: "percentual" },
  ];
 
  @Watch("item")
  Item() {
    if (this.$refs.formDespesa) {
      this.$refs.formDespesa.resetValidation();
    }
  }

  @Watch("parcela")
  Parcela() {
    if (this.$refs.formParcela) {
      this.$refs.formParcela.resetValidation();
    }
  }

  @Watch("classificacao")
  Classificacao() {
    if (this.$refs.formClassificacao) {
      this.$refs.formClassificacao.resetValidation();
    }
  }

  observer! : jsonpatch.Observer<Despesa>; 

  @Watch("value") 
  Value() {
    this.dialog = this.value ? true : false; 
    if (this.dialog){
      this.observer = jsonpatch.observe(this.item);
    } else {
      jsonpatch.unobserve(this.item, this.observer);
    }
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }else{
      if(this.item.id>0){
         this.ObterEmpreendimentosPorEmpresa();
        }
      } 
    };

  @Watch("item", {deep:true})
  ObservadorItem(){
    this.observer = jsonpatch.observe(this.item);
  };
  
  Validacoes(){
    if(!this.item.numeroDocumento || !this.item.dataEmissao || !this.item.tipoId || !this.item.tipoDocumentoId || !this.item.valor || !this.item.fornecedorId || !this.item.empresaId){
      this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
      this.tabActive = 0;
      return true;
    }
    if(this.item.parcelas.length == 0){
      this.$swal("Aviso", "É necessário adicionar as parcelas.", "warning");
      this.tabActive = 1;
      return true;
    }
    if(this.item.classificacoes.length == 0){
      this.$swal("Aviso", "É necessário adicionar as classificações.", "warning");
      this.tabActive = 2;
      return true;
    }
  }   

  Salvar() {  
    this.$refs.formDespesa.validate();
    if (!this.Validacoes()) {
      const model = this.CriarModelDespesaPedido();

      this.overlay = !this.overlay;
      let pacthModel = jsonpatch.generate(this.observer);
      
      (this.pedidos.length > 0 ? this.service.GerarDespesaPedido(model) : (this.item.id > 0 ? this.service.Patch(pacthModel, this.item.id) : this.service.Salvar(this.item))).then(
        (res) => {
        this.$swal("Aviso", "Operação realizada com sucesso!", res.status == 201 || res.status == 200 ? "success" : "warning");
        this.$emit("salvou");
        this.Close();
      },  
      (err) => TratarErroApi(err)
      ).finally(() => this.overlay = false);
    }
  }

  CriarModelDespesaPedido(){
    let model = new ModelDespesaPedido();

      if(this.pedidos.length > 0){
        this.pedidos.forEach((x:any) => {x.orcamento = undefined,x.tipo = undefined,x.itens = undefined,x.fornecedor = undefined});
        model.despesa = this.item;
        model.pedidos = this.pedidos;
      }

    return model;
  }
  
  Close() { 
    this.Reset();
    this.dialog = false;
  }

  NovaPessoa(){
    this.Pessoa = new Pessoa();
    this.dialogCadastroPessoa = true;
  }
      
  GerarParcelas(){     
    this.parcelas = [...this.item!.parcelas];

    if(this.item.valor <= 0){
      this.$swal("Aviso", "O campo valor não pode ser menor que 0.", "warning");
      this.tabActive = 0;
      return;
    }
    
    if (this.item.parcelas.some(parcela => parcela.situacaoId !== 1)) 
      return this.$swal("Aviso", "Não é possível editar uma parcela paga ou cancelada.", "warning");
  
    this.item.parcelas = []; 
 
    for(let i = 0; i < this.numeroParcelas; i++){
      let parcela = new DespesaParcela();

      let dataInicial = new Date(`${this.parcela.dataVencimento} 00:00:00`);
      let dataCalculada = new Date(dataInicial.setMonth(dataInicial.getMonth() + i));

      parcela.parcela = i + 1;
      parcela.valor = this.valorInicialParcelas;
      parcela.situacaoId = 1;
      parcela.dataVencimento = dataCalculada.toISOString().split('T')[0];
      parcela.linhaDigitavelBoleto = this.parcela.linhaDigitavelBoleto;

    

      let parcelaExistente = this.parcelas[i];
      parcela.id = parcelaExistente && parcelaExistente.id !== undefined ? parcelaExistente.id : 0;
      parcela.despesa = parcelaExistente && parcelaExistente.despesa !== undefined ? parcelaExistente.despesa : undefined;
      parcela.despesaId = parcelaExistente && parcelaExistente.despesaId !== undefined ? parcelaExistente.despesaId : 0;
      parcela.parcelaStr = parcelaExistente && parcelaExistente.parcelaStr !== undefined ? parcelaExistente.parcelaStr : '';
      parcela.saldo = parcelaExistente && parcelaExistente.saldo !== undefined ? parcelaExistente.saldo : 0;
      parcela.ultimaFormaPagamento = parcelaExistente && parcelaExistente.ultimaFormaPagamento !== undefined ? parcelaExistente.ultimaFormaPagamento : '';
      parcela.ultimaDataPagamento = parcelaExistente && parcelaExistente.ultimaDataPagamento !== undefined ? parcelaExistente.ultimaDataPagamento : '';
      parcela.corretorNome = parcelaExistente && parcelaExistente.corretorNome !== undefined ? parcelaExistente.corretorNome : undefined; 
      //parcela.ultimaFormaPagamento = undefined;
      
      this.item.parcelas.push(parcela);
      this.parcela.linhaDigitavelBoleto = "";
    }
     this.valorInicialParcelas = 0; 
    this.numeroParcelas = 0;
  } 
 
  EditarParcela(item) {
    this.parcela = item;
    this.parcela.dataVencimento = new Date(item.dataVencimento).yyyymmdd();    
    this.dialogParcela = true;
  }

  Confirmar(){
    // Obtenha o índice da parcela editada na lista item.parcelas
    let indiceParcelaEditada = this.item.parcelas.indexOf(this.parcela);
    let valorParcelaEditada = this.parcela.valor;

    // Calcule o valor total das parcelas anteriores à parcela editada
    let valorParcelasAnteriores = 0;
    for (let i = 0; i < indiceParcelaEditada; i++) {
      valorParcelasAnteriores += this.item.parcelas[i].valor;
    }
 
    // Calcule o saldo restante após a edição da parcela
    let saldoRestante = this.item.valor - valorParcelasAnteriores - valorParcelaEditada;
    
    // Atualize as parcelas posteriores à parcela editada
    for (let i = indiceParcelaEditada + 1; i < this.item.parcelas.length; i++) {
      let parcela = this.item.parcelas[i];

      let valorFormatado = Number((saldoRestante > 0 ? saldoRestante : 0) / (this.item.parcelas.length - (indiceParcelaEditada + 1))).toFixed(2);
      parcela.valor =  Number(valorFormatado);
    }
    
    let valorTotal = this.item.parcelas.reduce((total, parcela) => total + parcela.valor, 0).toFixed(2);
    this.item.valor = Number(valorTotal);
    this.parcela = new DespesaParcela();
    this.dialogParcela = false;
  }
  
  ExcluirParcela(item) {
      this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja excluir o registro atual?",
      icon: "question",
      showCancelButton: true, 
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm:true,
      preConfirm:() => { 
       if(item.id > 0){
          this.service.ExcluirParcela(item.id).then(
            (res) => {
              if (res.status == 200) {
                this.$swal("Aviso", "Registro excluído com sucesso!", "success");
                this.Atualizar();
              }
            },
            (err) => TratarErroApi(err)
          );
        }else{
          const index = this.item.parcelas!.indexOf(item);
          this.item.parcelas!.splice(index, 1);
          return this.$swal("Aviso", "Registro excluído com sucesso!", "success");
        }
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if(result.value){
      }
    })
  }
  
  get valorTotal(){
    const valorClassificacoes = this.item.classificacoes.reduce((total, classificacao) => total + classificacao.valor, 0);
    const valorTotal = this.item.valor - valorClassificacoes;
    return Number(valorTotal).toFixed(2);
  }

  AdicionarClassificacao() {
     if (this.$refs.formClassificacao.validate()) {

      let valorRestante = Number(this.valorTotal);

      if (this.classificacaoIndex > -1) {
        const currentClassification = this.item.classificacoes[this.classificacaoIndex];
        valorRestante += currentClassification.valor;
      }

      if (this.classificacao.valor > valorRestante) {
        return this.$swal("Aviso", "O valor não pode ser maior que o valor a ser dividido", "warning");
      }      

      if (this.classificacaoIndex > -1) {
        Object.assign(this.item.classificacoes[this.classificacaoIndex], this.classificacao);
      } else {
        this.item.classificacoes.push(this.classificacao);
      }

      this.classificacao = new DespesaClassificacao();
      this.classificacaoIndex = -1;
    }
  }
  

  ExcluirClassificacao(item) {
      this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja excluir o registro atual?",
      icon: "question",
      showCancelButton: true, 
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm:true,
      preConfirm:() => {
        if(item.id > 0){
          item.excluido = true;
          const index = this.item.classificacoes!.indexOf(item);
          delete this.item.classificacoes![index]
          this.dialog = false;
          this.dialog = true;
          return true;
        }else{
        const index = this.item.classificacoes!.indexOf(item);
        this.item.classificacoes!.splice(index, 1);
        return this.$swal("Aviso", "Registro excluído com sucesso!", "success");
        }
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if(result.value){
      }
    })
  }

  EditarClassificacao(item) {
    this.classificacaoIndex = this.item.classificacoes.indexOf(item);
    this.classificacao = Object.assign({}, item);
  } 
 
  SituacaoColor(item){
    return SituacaoColor(item);
  }

  Atualizar(){
    this.service.ObterPorId(this.item.id, "Parcelas.Baixas, Classificacoes, Documentos").then(
      (res) => {
        this.item = res.data;
        jsonpatch.unobserve(this.item, this.observer);
      }); 
  }

  @Watch("classificacao.valor")
  CalcularPercentualValor(valor){
    if(valor > 0){
      let percentual =  valor * 100 / Number(this.item.valor); 
      this.classificacao.percentual = Number(percentual.toFixed(2));
    }
  }
 
  CalcularValorPercentual(valor){
    let valorClassificado = (this.item.valor * valor) / 100; 
    this.classificacao.valor = Number(valorClassificado.toFixed(2));
  }

  Reset(){
    this.tabActive = 0;
    this.numeroParcelas = 0;
    this.valorInicialParcelas = 0;
    this.classificacaoIndex = -1;
  }

  AtualizarPessoas(){
    new PessoaService().Listar(-1, -1, ['nome'],[],'',[], '', '' , 'Id,nome,cnpjCpf, nomeCnpjCpf', '').then(
      (res) => { this.pessoas = res.data.items })
  }

  ObterEmpreendimentosPorEmpresa(){
    let filter = {};
    new EmpreendimentoService().Listar(-1, -1, ['nome'],[],'',[''],  filter = {empresaId:this.item.empresaId}, '' , 'Id,Nome, EmpresaId', '').then(
      (res) => { this.empreendimentos = res.data.items });
  }

  mounted() {
    this.AtualizarPessoas();
  
    new TipoDocumentoService().ListarTudo().then(
      (res) => {this.tipoDocumentos = res.data.items;},
    );

    new EmpresaService().Listar(-1, -1, ['nomeFantasia'],[],'',[], '', '' , 'Id, nomeFantasia', '').then(
      (res) => {this.empresas = res.data.items},
    );

    new TipoDespesaService().ListarTudo().then(
      (res) => {this.tipoDespesas = res.data.items},
    );
  
    new SituacaoDespesaParcelaService().ListarTudo().then(
      (res) => {this.situacoes = res.data.items},
    );
 
    new CentroCustoService().Listagem().then(
      (res) => {this.centroCustosOrdenada = res.data;},
    );

    new ContaGerencialService().Listagem().then(
      (res) => {this.contaGerenciaisOrdenada = res.data},
    );
  }
}
class ModelDespesaPedido{
  despesa  = new Despesa();
  pedidos: Pedido[] = [];
}
</script>

<style>
#campos{
  color: red;
}
.custom-hint-color .v-messages__message {
  color: red !important; /* Substitua "sua-cor-desejada" pela cor que deseja */
}

.campo-desabilitado {
  opacity: 0.6;
  pointer-events: none;
}
 
</style>