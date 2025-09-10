<template>
  <v-dialog v-model="dialog" fullscreen persistent no-click-animation hide-overlay
    transition="dialog-bottom-transition">
    <v-card> 
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Cadastro de Pessoa</v-toolbar-title>
        <v-spacer/>  
           
        <v-toolbar-items>
          <v-btn dark text @click="Salvar()">Salvar</v-btn>
        </v-toolbar-items> 

        <template v-slot:extension>
          <v-tabs v-model="tabActive" background-color="primary" dark>
            <v-tab>Geral</v-tab>
            <v-tab v-show="item.isCorretor">Empreendimentos</v-tab>
            <v-tab v-show="item.isProprietario || item.isCorretor || item.isFornecedor">Dados Adicionais</v-tab>
            <v-tab>Documentos</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-form v-model="valid" ref="form" lazy-validation>
        <v-tabs-items v-model="tabActive">
          <v-tab-item>
            <v-card elevation="1">
              <v-card-text>
                <v-card-title>
                  <span class="title-span">Informação da Pessoa</span>
                </v-card-title>

                <div class="d-flex justify-start">
                  <v-row dense class="px-3" no-gutters justify="end">
                    <v-col cols="12" md="2" sm="6">
                      <v-checkbox v-model="item.isCliente" label="Cliente" color="primary" />
                    </v-col>

                    <v-col cols="12" md="2" sm="6">
                      <v-checkbox v-model="item.isProprietario" label="Proprietario" hint="Proprietário"
                        color="primary" />
                    </v-col>

                    <v-col cols="12" md="2" sm="6">
                      <v-checkbox v-model="item.isFornecedor" label="Fornecedor" color="primary" />
                    </v-col>

                    <v-col cols="12" md="2" sm="6">
                      <v-checkbox v-model="item.isCorretor" label="Corretor" color="primary" />
                    </v-col>

                    <!-- <v-col cols="12" md="2" sm="6">
                      <v-checkbox v-model="item.isSeguradora" label="Seguradora" color="primary" />
                    </v-col> -->
                  </v-row>
                </div>

                <v-row dense class="px-3">
                  <v-col cols="12" sm="2">
                    <span class="font-weight-bold">Física/Jurídica*</span>
                    <v-select outlined v-model="item.tipoPessoaId" :rules="fieldRules" item-value="id" item-text="nome"
                      :items="tipoPessoas" dense />
                  </v-col>

                  <v-col cols="12" sm="2">
                    <span class="font-weight-bold">Nome*</span>
                    <v-text-field outlined v-model="item.nome" :rules="fieldRules" :counter="100" maxlength="100"
                      dense />
                  </v-col>

                  <v-col cols="12" sm="2" v-if="item.tipoPessoaId == 1">
                    <span class="font-weight-bold">CPF*</span>
                    <v-text-field outlined v-model="item.cnpjCpf" maxlength="14" :rules="fieldRules" v-mask="'###.###.###-##'" dense/>
                  </v-col>
                              
                  <v-col cols="12" sm="6" md="2" v-if="item.tipoPessoaId == 1">
                    <span class="font-weight-bold">Data de Nascimento*</span>
                    <v-text-field outlined :rules="fieldRules" v-model="item.dataNascimento" dense max="9999-12-31" type="date"/>
                  </v-col>

                  <v-col v-if="item.tipoPessoaId == 1" cols="12" sm="2">
                    <span class="font-weight-bold">Sexo*</span>
                    <v-autocomplete placeholder="Selecione" outlined v-model="item.sexoId" :rules="fieldRules" dense item-value="id" item-text="nome" :items="listaSexo"/>
                  </v-col>

                  <v-col v-if="item.tipoPessoaId == 1" cols="12" sm="2">
                    <span class="font-weight-bold">Profissão*</span>
                    <v-autocomplete placeholder="Selecione" outlined v-model="item.qualificacao.profissaoId" :rules="fieldRules" dense item-value="id" item-text="nome" :items="profissoes" />
                  </v-col>

                  <v-col v-if="item.tipoPessoaId == 1" cols="12" sm="2">
                    <span class="font-weight-bold">Nacionalidade*</span>
                    <v-autocomplete placeholder="Selecione" outlined v-model="item.qualificacao.nacionalidadeId" :rules="fieldRules" dense item-value="id" item-text="nome" :items="nacionalidades"/>
                  </v-col>

                  <v-col v-if="item.tipoPessoaId == 1" cols="12" sm="4">
                    <span class="font-weight-bold">Estado Civil*</span>
                    <v-select placeholder="Selecione" outlined v-model="item.qualificacao.estadoCivilId" :rules="fieldRules" dense item-value="id" item-text="nome" :items="estadosCivis" :menu-props="{ offsetY: true, offsetOverflow: true }"/>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <template>
                        <span class="font-weight-bold">Email principal
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on" color="#f98038" small>
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>Cadastre um email principal para que possamos contatá-lo com informações
                            importantes.</span>
                        </v-tooltip>
                        </span>
                      </template>
                    
                    <v-text-field outlined v-model="item.email" dense>
                      
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" sm="2">
                    <span class="font-weight-bold">Celular</span>
                    <template v-if="item.qualificacao.nacionalidadeId == 10">
                      <v-text-field outlined v-model="item.telefone" v-mask="'(##) #####-####'" dense />
                    </template>

                    <template v-else>
                      <v-text-field outlined v-model="item.telefone" dense :rules="fieldRules" />
                    </template>
                  </v-col>
                </v-row>

                  <v-row class="px-3">
                    <v-col cols="12" sm="6" v-if="item.tipoPessoaId == 2">
                      <span class="font-weight-bold">Fantasia*</span>
                      <v-text-field outlined v-model="item.fantasia" :rules="fieldRules" :counter="100" maxlength="100" dense/>
                    </v-col> 
                    
                    <v-col cols="12" sm="2" v-if="item.tipoPessoaId == 2">
                      <span class="font-weight-bold">CNPJ*</span>
                      <v-text-field outlined v-model="item.cnpjCpf" maxlength="18" :rules="fieldRules" v-mask="'##.###.###/####-##'" dense />
                    </v-col>
                  </v-row>

                <v-expansion-panels v-if="item.tipoPessoaId == 1">
                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-medium">Informações Complementares</v-expansion-panel-header>
                  
                    <v-expansion-panel-content>
                      <v-row dense>
                        <v-col cols="12" sm="2">
                          <span>RG</span>
                          <v-text-field outlined v-model="item.rg" dense counter="15" maxlength="15"/>
                        </v-col>

                        <v-col cols="12" sm="2">
                          <span>Órgão Expedidor</span>
                          <v-text-field outlined v-model="item.orgaoExpedido" dense  :counter="15" maxlength="15" />
                        </v-col>

                        <v-col cols="12" sm="6" md="2">
                          <span>Data de Expedição</span>
                          <v-text-field outlined v-model="item.dataExpedicao" dense max="9999-12-31" type="date"/>
                        </v-col>    

                        <v-col cols="12" sm="2">
                          <span>Renda Bruta</span>
                          <money-input v-model="item.qualificacao.rendaBruta" @ValorFormatado="valor => item.qualificacao.rendaBruta = valor" dense />
                        </v-col>

                        <v-col cols="12" sm="2">
                          <span>Renda Líquida</span>
                          <money-input v-model="item.qualificacao.rendaLiquida" @ValorFormatado="valor => item.qualificacao.rendaLiquida = valor" dense />
                        </v-col>     

                        <v-col cols="12" sm="2">
                          <span>Telefone 2</span>
                          <template v-if="item.qualificacao.nacionalidadeId == 10">
                            <v-text-field outlined v-model="item.telefone2" v-mask="'(##) #####-####'" dense />
                          </template>
                       </v-col>   
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                
                <v-expansion-panels    hover accordion v-if="item.tipoPessoaId == 2 && item.juridicaResponsavel">
                  <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-medium">Pessoa Responsável</v-expansion-panel-header>
                  
                    <v-expansion-panel-content>
                      <v-row dense>
                        <v-col cols="12" md="6">
                          <span>Nome</span>
                          <v-text-field v-model="item.juridicaResponsavel.nome" outlined dense></v-text-field>
                        </v-col>

                        <v-col cols="12" md="2">
                          <span>CPF</span>
                          <v-text-field v-model="item.juridicaResponsavel.cnpjCpf" v-mask="'###.###.###-##'"  outlined dense></v-text-field>
                        </v-col>

                        <v-col cols="12" md="2">
                          <span>RG</span>
                          <v-text-field v-model="item.juridicaResponsavel.rg" outlined dense></v-text-field>
                        </v-col>

                        <v-col cols="12" md="2">
                          <span>Orgão Expedidor</span>
                          <v-text-field v-model="item.juridicaResponsavel.orgaoExpedido" outlined dense></v-text-field>
                        </v-col>

                        <v-col cols="12" md="2">
                          <span>Data de Expedição</span>
                          <v-text-field v-model="item.juridicaResponsavel.dataExpedicao" outlined dense max="9999-12-31" type="date"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="2">
                          <span>Data de Nascimento</span>
                          <v-text-field v-model="item.juridicaResponsavel.dataNascimento" outlined dense max="9999-12-31" type="date"></v-text-field>
                        </v-col>
                       
                        <v-col cols="12" md="2">
                          <span>Sexo</span>
                          <v-select v-model="item.juridicaResponsavel.sexoId" :items="listaSexo" item-value="id" item-text="nome" outlined dense></v-select>
                        </v-col>

                        <v-col cols="12" md="2">
                          <span>Nacionalidade</span>
                          <v-select v-model="item.juridicaResponsavel.qualificacao.nacionalidadeId" :items="nacionalidades" item-value="id" item-text="nome" outlined dense></v-select>
                        </v-col>

                        <v-col cols="12" md="2"> 
                          <span>Profissão</span>
                          <v-autocomplete v-model="item.juridicaResponsavel.qualificacao.profissaoId" :items="profissoes" item-value="id" item-text="nome"  outlined dense/>
                        </v-col>

                        <v-col cols="12" md="2"> 
                          <span>Celular</span>
                          <v-text-field outlined v-model="item.juridicaResponsavel.telefone" v-mask="'(##) #####-####'" dense />
                        </v-col>

                        <v-col cols="12" sm="6">
                          <span>Email</span>
                          <v-text-field outlined v-model="item.juridicaResponsavel.email" dense append-icon="mdi-email"></v-text-field>
                        </v-col>
                      </v-row>
                    <v-divider></v-divider>
                      <vcard-endereco  style="margin-inline:-30px" :item="item.juridicaResponsavel.endereco"/>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
            <br> 

            <v-card elevation="1" v-if="item.isCliente && item.tipoPessoaId == 1 && item.qualificacao.estadoCivilId == 2 || item.qualificacao.estadoCivilId == 6">
              <v-card-text>
                <v-card-title>
                  <span class="title-span">Cônjuge</span>
                </v-card-title>

                  <v-row dense class="pa-3">
                    <v-col cols="12" md="4">
                      <span class="font-weight-bold">Nome</span>
                      <v-text-field outlined v-model="item.conjuge.nome" dense></v-text-field>
                    </v-col>

                    <v-col cols="12" md="2">
                      <span class="font-weight-bold">CPF</span>
                      <v-text-field outlined type="text" v-model="item.conjuge.cpf" maxlength="14" v-mask="'###.###.###-##'" dense ></v-text-field>
                    </v-col> 

                    <v-col cols="12" md="2">
                      <span class="font-weight-bold">Data de Nascimento</span>
                      <v-text-field outlined v-model="item.conjuge.dataNascimento" max="9999-12-31" dense type="date"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                          <span>RG</span>
                          <v-text-field outlined counter="15" maxlength="15" v-model="item.conjuge.rg" dense></v-text-field>
                        </v-col>

                        <v-col cols="12" md="2">
                          <span>Orgão Expedidor</span>
                          <v-text-field outlined v-model="item.conjuge.orgaoExpedidor" dense></v-text-field>
                        </v-col>

                        <v-col cols="12" md="2">
                          <span>Data de Expedição</span>
                          <v-text-field outlined dense v-model="item.conjuge.dataEmissaoRg" max="9999-12-31" type="date"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="2">
                          <span>Sexo</span>
                          <v-select v-model="item.conjuge.sexoId" :items="listaSexo" item-value="id" item-text="nome" outlined dense></v-select>
                        </v-col>

                        <v-col cols="12" md="2" v-if="item.conjuge">
                          <span>Nacionalidade</span>
                          <v-autocomplete v-model="item.conjuge.qualificacao.nacionalidadeId" :items="nacionalidades" item-value="id" item-text="nome" outlined dense/>
                        </v-col>

                        <v-col cols="12" md="2" v-if="item.conjuge"> 
                          <span>Profissão</span>
                          <v-autocomplete v-model="item.conjuge.qualificacao.profissaoId" :items="profissoes" item-value="id" item-text="nome"  outlined dense/>
                        </v-col>

                        <v-col cols="12" md="2">
                          <span>Renda Bruta</span>
                          <v-text-field v-model="item.conjuge.rendaBruta" outlined dense type="number"></v-text-field>
                        </v-col>
                  </v-row>
              </v-card-text>
            </v-card>

            <v-card elevation="1">
              <vcard-endereco :item="item.endereco" />
            </v-card>
          </v-tab-item>

          <v-tab-item v-show="item.isCorretor">
            <v-form v-model="valid" ref="formEmpreendimento" lazy-validation>
            <v-card elevation="1"> 
              <v-card-text>
                <v-card-title>
                  <span class="title-span">Empreendimentos disponíveis</span>
                </v-card-title>
 
                <v-row dense class="px-3">
                  <v-col cols="12" md="6">
                    <v-select v-model="empreendimentoPessoa.empreendimentoId" dense outlined label="Empreendimentos" item-text="nome" item-value="id" :items="listaEmpreendimentos"></v-select>
                  </v-col>

                  <v-col>
                    <v-btn color="primary" @click="AdicionarEmpreendimento()"><v-icon left> mdi-plus</v-icon> Adicionar</v-btn>
                  </v-col>
                </v-row>
                                
                  <v-col cols="6">
                    <v-data-table class="elevation-1" :headers="headersEmpreendimentos" :items="item.empreendimentosPessoas"  item-key="item.id" dense>
                      <template v-slot:[`item.actions`] = "{item}">
                          <v-tooltip right>
                          <template v-slot:activator="{ on }">
                            <v-icon :disabled="item.excluido" small @click="Editar(item)" v-on="on">mdi-pencil</v-icon>
                          </template>
                          <span>Editar</span>
                        </v-tooltip> 

                        <v-tooltip right>
                          <template v-slot:activator="{ on }">
                            <v-icon :disabled="item.excluido" small @click="Excluir(item)" v-on="on">mdi-delete</v-icon>
                          </template>
                          <span>Excluir</span>
                        </v-tooltip>
                      </template>

                      <template v-slot:[`item.nome`] = "{item}">
                       {{ listaEmpreendimentos.find(x=>x.id == item.empreendimentoId) ? listaEmpreendimentos.find(x=>x.id == item.empreendimentoId).nome : '' }} 
                      </template>
                    </v-data-table>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-form>
           </v-tab-item>

          <v-tab-item v-show="item.isProprietario || item.isCorretor || item.isFornecedor">
            <v-card elevation="1">
              <v-card-text>
                <v-card-title>
                  <span class="title-span">Conta principal</span>
                </v-card-title>

                <v-row class="px-3" dense>
                  <v-col cols="12" sm="2" md="2">
                    <span class="font-weight-bold">Banco</span>
                    <v-text-field outlined v-model="item.bancario.banco" type="text" dense :counter="40"
                      maxlength="40" />
                  </v-col>

                  <v-col cols="12" sm="2" md="2">
                    <span class="font-weight-bold">Agência (Número)</span>
                    <v-text-field outlined v-model="item.bancario.agencia" v-mask="'##########'" type="text" dense
                      :counter="10" maxlength="10" />
                  </v-col>

                  <v-col cols="12" sm="2" md="2">
                    <span class="font-weight-bold">Agência (Digito)</span>
                    <v-text-field outlined v-model="item.bancario.agenciaDigito" v-mask="'##'" dense :counter="2"
                      maxlength="2" />
                  </v-col>

                  <v-col cols="12" sm="2" md="2">
                    <span class="font-weight-bold">Conta (Número)</span>
                    <v-text-field outlined v-model="item.bancario.conta" type="text" v-mask="'##########'" dense
                      :counter="10" maxlength="10" />
                  </v-col>

                  <v-col cols="12" sm="2" md="2">
                    <span class="font-weight-bold">Conta (Digito)</span>
                    <v-text-field outlined v-model="item.bancario.contaDigito" v-mask="'##'" type="text" dense
                      :counter="2" maxlength="2" />
                  </v-col>

                  <v-col cols="12" sm="2" md="2">
                    <span class="font-weight-bold">Chave PIX</span>
                    <v-text-field outlined v-model="item.bancario.pix" dense />
                  </v-col>
                  
                  <v-col cols="12" sm="2" md="2" v-if="item.isCorretor">
                    <span class="font-weight-bold">Creci</span>
                    <v-text-field outlined v-model="item.creci" type="text" dense />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <br>

            <v-card elevation="1">
              <vcard-contato :lista.sync="item.contatos"/>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card elevation="1">
              <vcard-documento :lista.sync="item.documentos" :exibirCampos="true" />
            </v-card>
          </v-tab-item>
        </v-tabs-items> 
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import comprasServices from "@/core/services/compras";
import geralServices from "@/core/services/geral/index";
import { PessoaService } from "@/core/services/cadastros/PessoaService";
import Pessoa from "@/core/models/cadastros/Pessoa";
import * as jsonpatch from 'fast-json-patch';
import { EmpreendimentoPessoa, PessoaFamiliar } from "@/core/models/cadastros";
import { EmpreendimentoService, GrauParentescoService } from "@/core/services/cadastros";
import { EscolaridadeService } from "@/core/services/geral/EscolaridadeService";

@Component
export default class CadastroCliente extends Vue {
  @Prop() public item!: Pessoa;
  @Prop() public value!: string;

  service = new PessoaService();
   
  tipoPessoas:any = [];
  profissoes:any = [];
  nacionalidades:any = [];
  estadosCivis:any = [];
  listaSexo:any = [];
  listaGrauParentesco:any = [];
  listaEscolaridade:any = [];
  
  valid = true;
  dialog = false;
  tabActive = 0;

  options: any = {
    itemsPerPage: 15,
  };

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  $refs!: {
    form: HTMLFormElement;
    formFamiliar: HTMLFormElement;
    formEmpreendimento: HTMLFormElement;
  };

  observer! : jsonpatch.Observer<Pessoa>; 

  headersEmpreendimentos: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome" },
  ]

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome" },
    { text: "CPF", value: "cpf" },
    { text: "RG", value: "rg" },
    { text: "Orgão Expedidor", value: "orgaoExpedidor" },
    { text: "Data de Nascimento", value: "dataNascimento" },
    { text: "Grau de Parentesco", value: "grauParentescoId" },
    { text: "Escolaridade", value: "escolaridadeId" },
    { text: "Profissão", value: "profissaoId" },
    { text: "Dependente", value: "dependente" }
  ];

  listaEmpreendimentos = [];
  empreendimentosSelecionados = [];
  empreendimentoIndex = -1;
  empreendimentoPessoa = new EmpreendimentoPessoa();

  @Watch("empreendimentoPessoa")
  EmpreendimentoPessoa() {
    if (this.$refs.formEmpreendimento) {
      this.$refs.formEmpreendimento.resetValidation();
    }
  }

  AdicionarEmpreendimento(){
  if (this.$refs.formEmpreendimento.validate()) {
    if (this.empreendimentoIndex > -1) {
      Object.assign(this.item.empreendimentosPessoas[this.empreendimentoIndex], this.empreendimentoPessoa)
    }else{
      this.item.empreendimentosPessoas.push(this.empreendimentoPessoa);
    }
    this.empreendimentoPessoa = new EmpreendimentoPessoa();
    this.empreendimentoIndex = -1;
    }
  }

  Editar(item) {
    this.empreendimentoIndex = this.item.empreendimentosPessoas.indexOf(item);
    this.empreendimentoPessoa = Object.assign({}, item);;
  }

  Excluir(item) {
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja excluir o registro atual?",
      icon: "question",
      showCancelButton: true, 
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm:true,
      focusConfirm:true,
      preConfirm:() => {
        if(item.id > 0){
          item.excluido = true;
          const index = this.item.empreendimentosPessoas!.indexOf(item);
          delete this.item.empreendimentosPessoas![index]
          this.dialog = false;
          this.dialog = true;
          return true;
        }else{
          const index = this.item.empreendimentosPessoas!.indexOf(item);
          this.item.empreendimentosPessoas!.splice(index, 1);
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


 
  @Watch('item')
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;

    if (this.dialog) {
      this.observer = jsonpatch.observe(this.item);
    }
    else {
      jsonpatch.unobserve(this.item, this.observer);
    }
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }
  }

  Validacoes(){  
   if(this.item.tipoPessoaId == 1){
     if(!this.item.tipoPessoaId  || !this.item.nome || !this.item.cnpjCpf  ||  !this.item.dataNascimento ||  !this.item.sexoId || !this.item.qualificacao!.profissaoId   || !this.item.qualificacao!.nacionalidadeId  || !this.item.qualificacao!.estadoCivilId){
       this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
        this.tabActive = 0;
        return true;
      }
    } else if (this.item.tipoPessoaId == 2) {
      if (!this.item.tipoPessoaId || !this.item.nome || !this.item.cnpjCpf || !this.item.fantasia) {
        this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
        this.tabActive = 0;
        return true;
      }
    }
    if (!this.item.endereco.cep || !this.item.endereco.logradouro || !this.item.endereco.bairro || !this.item.endereco.estadoId || !this.item.endereco.municipioId) {
      this.$swal("Atenção", "Atenção é necessário preencher o endereço completo.", "warning");
      this.tabActive = 0;
      return true;
    }
  }
  
   
  Salvar() { 
    this.$refs.form.validate();

    if (!this.Validacoes()) {
      let pacthModel = jsonpatch.generate(this.observer);
      if(this.item.juridicaResponsavel.endereco.municipioId == 0){
      this.item.juridicaResponsavel.endereco.municipioId = 1303502
    }
      (this.item.id > 0 ? this.service.Patch(pacthModel, this.item.id) : this.service.Salvar(this.item)).then( 
        (res) => {
          this.$swal("Aviso", "Operação realizada com sucesso!", res.status == 201 || res.status == 200 ? "success" : "warning");
          this.$emit("salvou");
          this.Close();
        },  
        (err) => {
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status == 403) {
            this.$swal("Aviso", err.response.data.message, "warning");
          } else if (err.response.data.length == 94) {
            this.$swal("Aviso", "Campo CPF/CNPJ está incorreto.", "warning");
          } else {
            this.$swal("Aviso", err.response.data, err.response.status == 400 ? "warning" : "error");
          }
        });
    }
  }

  Close() {
    this.dialog = false;
    this.tabActive = 0;
  }

  @Watch("pessoaFamiliar")
  PessoaFamiliar() {
    if (this.$refs.formFamiliar) {
      this.$refs.formFamiliar.resetValidation();
    }
  }

  parentescoIndice: number = -1;
  pessoaFamiliar = new PessoaFamiliar();

  AdicionarParentesco() {
    if (this.$refs.formFamiliar.validate()) {
      if (this.parentescoIndice > -1) {
        Object.assign(this.item.familiares[this.parentescoIndice], this.pessoaFamiliar)
      }else{
        this.item.familiares.push(this.pessoaFamiliar);
      }
      this.pessoaFamiliar = new PessoaFamiliar();
      this.parentescoIndice = -1;
    }
  } 
 
  EditarParentesco(item) {
    this.parentescoIndice = this.item.familiares.indexOf(item);
    this.pessoaFamiliar = Object.assign({}, item);
  }

  ExcluirParentesco(item) {
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja excluir o registro atual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
    }).then((result) => {
      if (result.value) {
        const index = this.item.familiares.indexOf(item);
        this.item.familiares.splice(index, 1);
        this.$swal("Aviso", "Registro excluído com sucesso!", "success");
      }
    });
  }

  mounted() {
    const grauParentesco = new GrauParentescoService();
    grauParentesco.ListarTudo().then(
      res => {
        this.listaGrauParentesco = res.data.items;
      }
    )
  

    new comprasServices.TipoPessoaService().ListarTudo().then(
      res => this.tipoPessoas = res.data.items);

    new geralServices.SexoService().ListarTudo().then(
      res => this.listaSexo = res.data.items);

    new comprasServices.EstadoCivilService().ListarTudo().then(
      res => this.estadosCivis = res.data.items);

    new comprasServices.NacionalidadeService().ListarTudo().then(
      (res) => this.nacionalidades = res.data.items);

    new comprasServices.ProfissaoService().ListarTudo().then(
    (res) => this.profissoes = res.data.items);

    new EscolaridadeService().ListarTudo().then(
    (res) => this.listaEscolaridade = res.data.items);    
    
    new EmpreendimentoService().Listar(-1, -1, ['nome'],[],'',[], '', '' , 'Id, nome', '').then(
    (res) => this.listaEmpreendimentos = res.data.items); 
  }
} 
</script>
