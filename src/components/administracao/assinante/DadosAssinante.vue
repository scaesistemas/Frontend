<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" no-click-animation>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>Informações do Assinante</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="Salvar()" :disabled="!valid">Salvar</v-btn>
        </v-toolbar-items>
        <template v-slot:extension>
          <v-tabs v-model="tabActive" background-color="primary" dark>
            <v-tab>Assinante</v-tab> 
            <v-tab>Endereço</v-tab>
            <v-tab>Contato</v-tab>
            <v-tab>Contato Principal</v-tab>
            <v-tab>Empresa Responsável</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

        <v-tabs-items v-model="tabActive">
          <v-form lazy-validation v-model="valid" ref="form">
            <v-tab-item>
              <v-card>
                <v-card-text>                 
                  <!-- <v-row dense>
                    <v-col cols="12" md="2">
                      <v-checkbox v-model="assinante.pessoaJuridica" :label="`Pessoa Juridica`"></v-checkbox>
                    </v-col>
                  </v-row> -->
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <span>Nome</span>
                      <v-text-field v-model="assinante.nomeFantasia" outlined dense :rules="fieldRules" :counter="60"
                        maxlength="60" />
                    </v-col>

                    <v-col cols="12" sm="3" v-if="assinante.pessoaJuridica == false">
                      <span>CPF</span>
                      <v-text-field outlined v-model="assinante.cpfCnpj" dense v-mask="'###.###.###-##'"
                        :rules="fieldRules" />
                    </v-col>

                    <v-col cols="12" sm="3" v-if="assinante.pessoaJuridica == true">
                      <span>CNPJ</span>
                      <v-text-field outlined v-model="assinante.cpfCnpj" dense v-mask="'##.###.###/####-##'"
                        :rules="fieldRules" />
                    </v-col>

                    <v-col cols="12" sm="3">
                      <span>Inscrição Municipal</span>
                      <v-text-field outlined v-model="assinante.inscricaoMunicipal"  dense
                        :rules="fieldRules" :counter="11" maxlength="11" />
                    </v-col>
                    <v-col cols="12" sm="3"> 
                      <span>Inscrição Estadual</span>
                      <v-text-field outlined v-model="assinante.inscricaoEstadual"  dense
                        :rules="fieldRules" :counter="9" maxlength="9" />
                    </v-col>

                    <v-col cols="12" sm="3">
                      <span>Código Cofre D4Sign</span>
                      <v-text-field  outlined v-model="assinante.dFourSignSafeId"  dense />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card>
                <vcard-endereco :item="assinante.endereco" />
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card class="mx-auto">
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <span>Contato</span>
                      <v-text-field outlined v-model="assinante.nome"   dense :counter="60" maxlength="60" />
                    </v-col>

                    <v-col cols="12" sm="3">
                      <span>Telefone</span>
                      <v-text-field outlined v-model="assinante.telefone1"   dense v-mask="'(##) #####-####'"
                        :rules="fieldRules" />
                    </v-col>

                    <v-col cols="12" sm="3">
                      <span>Telefone 2</span>
                      <v-text-field outlined v-model="assinante.telefone2" dense v-mask="'(##) #####-####'" />
                    </v-col>

                    <v-col cols="12" md="6">
                      <span>Email</span>
                      <v-text-field outlined v-model="assinante.email"  :rules="fieldRules" dense />
                    </v-col>

                    <!-- <v-col cols="12" md="6">
                      <span>Sub Dominio</span>
                      <v-text-field outlined v-model="assinante.subDominio"  :rules="fieldRules" dense />
                    </v-col> -->
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item>
              <v-card class="mx-auto">
                <v-card-text> 
                <v-form v-model="validContato" lazy-validation ref="formContato">
                  <v-col cols="auto">
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <span>Nome</span>
                        <v-text-field outlined v-model="contatoPessoa.nome"  :counter="60" maxlength="60"
                          dense />
                      </v-col>
                      <v-col cols="12" md="6">
                        <span>Email</span>
                        <v-text-field outlined v-model="contatoPessoa.email"   :counter="120" maxlength="120"
                          dense :rules="fieldRules" />
                      </v-col>
                      <v-col cols="12" md="3">
                        <span>Telefone</span>
                        <v-text-field outlined v-model="contatoPessoa.telefone"   v-mask="'(##) ####-####'"
                          dense />
                      </v-col>
                      <v-col cols="12" md="3">
                        <span>Celular</span>
                        <v-text-field outlined v-model="contatoPessoa.celular"   v-mask="'(##) #####-####'"
                          dense :rules="fieldRules" />
                      </v-col>
                      <v-col cols="12" md="3">
                        <span>Ramal</span>
                        <v-text-field outlined v-model="contatoPessoa.ramal"   :counter="10" maxlength="10"
                          dense />
                      </v-col>

                      <v-col cols="12" md="9">
                        <span>Observacao</span>
                        <v-text-field outlined v-model="contatoPessoa.observacao"   :counter="100"
                          maxlength="100" dense />
                      </v-col>

                      <v-col cols="12" md="1">
                        <v-checkbox  v-model="contatoPessoa.principal" :label="`Principal:`"></v-checkbox>
                      </v-col>

                      <v-col cols="12" md="2" class="pt-6">
                        <v-btn rounded color="primary" @click="AdicionarContato()">Adicionar</v-btn>
                      </v-col>
                    </v-row>

                    <v-data-table class="elevation-1" :headers="headers" :items="assinante.contatos" :items-per-page="5">
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-tooltip left>
                          <template v-slot:activator="{ on }">
                            <v-icon small @click="Editar(item)" v-on="on">mdi-pencil</v-icon>
                          </template>
                          <span>Editar</span>
                        </v-tooltip>
                        <v-tooltip right>
                          <template v-slot:activator="{ on }">
                            <v-icon small @click="Excluir(item)" v-on="on">mdi-delete</v-icon>
                          </template>
                          <span>Excluir</span>
                        </v-tooltip>
                      </template>

                      <template v-slot:[`item.nome`]="{ item }">
                        {{ item.nome }}
                      </template>

                      <template v-slot:[`item.celular`]="{ item }">
                        {{ item.celular }}
                      </template>

                      <template v-slot:[`item.telefone`]="{ item }">
                        {{ item.telefone }}
                      </template>

                      <template v-slot:[`item.ramal`]="{ item }">
                        {{ item.ramal }}
                      </template>

                      <template v-slot:[`item.email`]="{ item }">
                        {{ item.email }}
                      </template>

                      <template v-slot:[`item.observacao`]="{ item }">
                        {{ item.observacao }}
                      </template>

                      <template v-slot:[`item.principal`]="{ item }">
                        {{ item.principal.toSimNao() }}
                      </template>
                    </v-data-table>
                  </v-col>
                </v-form>
               

                <v-card-title>
                  <span class="title font-weight-light">Domínios</span>
                </v-card-title>

                <v-form v-model="validContato" lazy-validation ref="formDominio">
                  <v-col cols="auto">
                    <!-- <v-row dense>
                      <v-col cols="12" md="6">
                        <span>Nome</span>
                        <v-text-field outlined v-model.trim="dominioPrincipal.nome" :counter="60" maxlength="60"
                          dense />
                      </v-col>

                      <v-col cols="12" md="1" >
                        <v-checkbox v-model="dominioPrincipal.principal" :label="`Principal:`"></v-checkbox>
                      </v-col>

                      <v-col cols="12" md="2">
                        <v-btn rounded color="primary" @click="AdicionarDominio()">Adicionar</v-btn>
                      </v-col>
                    </v-row> -->

                    <v-data-table class="elevation-1" :headers="headersDominio" :items="assinante.dominios" :items-per-page="5">
                      <!-- <template v-slot:[`item.actions`]="{ item }">
                        <v-tooltip left>
                          <template v-slot:activator="{ on }">
                            <v-icon small @click="EditarDominio(item)" v-on="on">mdi-pencil</v-icon>
                          </template>
                          <span>Editar</span>
                        </v-tooltip>
                        <v-tooltip right>
                          <template v-slot:activator="{ on }">
                            <v-icon small @click="ExcluirDominio(item)" v-on="on">mdi-delete</v-icon>
                          </template>
                          <span>Excluir</span>
                        </v-tooltip>
                      </template> -->

                      <template v-slot:[`item.nome`]="{ item }">
                        <a :href="`http://${item.nome}`" target="_blank"> {{ item.nome }}</a>
                      </template>

                      <!-- <template v-slot:[`item.principal`]="{ item }">
                        {{ item.principal.toSimNao() }}
                      </template> -->
                    </v-data-table>
                  </v-col>
                </v-form>
              
              </v-card-text>
              </v-card>
            </v-tab-item>


            <v-tab-item>
              <v-card elevation="1">
                <v-card-text> 
                  <v-card-title> 
                    <span class="title font-weight-bold">Pessoa responsável</span>
                  </v-card-title>

                  <v-row dense class="px-3">
                    <v-col cols="12" sm="6">
                      <span>Nome</span>
                      <v-text-field outlined v-model="assinante.responsavel.nome"  dense :rules="fieldRules" />
                    </v-col>

                    <v-col cols="12" sm="3">
                      <span>Sobrenome</span>
                      <v-text-field outlined v-model="assinante.responsavel.sobrenome"   dense
                        :rules="fieldRules" :counter="60" maxlength="60" />
                    </v-col>

                    <v-col cols="12" sm="3">
                      <span>CPF</span>
                      <v-text-field outlined v-model="assinante.responsavel.cpf"  dense :rules="fieldRules"
                        v-mask="'###.###.###-##'" />
                    </v-col>

                    <v-col cols="12" md="3">
                      <span>Data nascimento</span>
                      <v-text-field outlined :rules="fieldRules" v-model="assinante.responsavel.dataNascimento"
                        dense type="date" />
                    </v-col>

                    <!-- <v-col cols="12" sm="3">
                      <span>Cód Categoria Comerciante</span>
                      <v-text-field disabled outlined v-model="assinante.responsavel.codigoCategoriaComerciante"
                        dense :rules="fieldRules" :counter="60"
                        maxlength="60" />
                    </v-col> -->

                    <!-- <v-col cols="12" sm="3">
                      <span>Categoria Comerciante</span>
                      <v-text-field disabled outlined v-model="assinante.responsavel.categoriaComerciante"
                        dense :rules="fieldRules" :counter="60" maxlength="60" />
                    </v-col> -->

                    <!-- <v-col cols="12" sm="3">
                      <span>Cód Zoop</span>
                      <v-text-field disabled outlined v-model="assinante.responsavel.codigoZoop"  dense
                        :rules="fieldRules" :counter="60" maxlength="60" />
                    </v-col> -->
                  </v-row>
                </v-card-text>

                <v-card>
                  <vcard-endereco :item="assinante.responsavel.endereco" />
                </v-card>

                <v-card>
                  <v-card-text> 
                  <v-card-title> 
                    <span class="title font-weight-bold">Contato</span>
                  </v-card-title>

                    <v-row dense class="px-3">
                      <v-col cols="12" sm="3">
                        <span>Telefone</span>
                        <v-text-field outlined v-model="assinante.responsavel.telefone" dense
                          :rules="fieldRules" v-mask="'(##)#-####-####'" />
                      </v-col>

                      <v-col cols="12" sm="6">
                        <span>Email</span>
                        <v-text-field outlined v-model="assinante.responsavel.email"  dense :rules="fieldRules"
                          :counter="60" maxlength="60" />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card>
            </v-tab-item>
          </v-form>
        </v-tabs-items>

      
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import ExternalServices from "@/core/services/geral/ExternalServices";
import { AssinanteService } from "@/core/services/cadastros";
import { Assinante, AssinanteContato, AssinanteDominio } from "@/core/models/cadastros";

@Component
export default class DadosAssinante extends Vue {
  @Prop() public assinante!: Assinante;
  @Prop() public value!: string;

  service = new AssinanteService();
  contatoPessoa = new AssinanteContato();
  dominioPrincipal = new AssinanteDominio();

  contatoIndex: number = -1;
  dominioIndex: number = -1;
  readonly: boolean = true;
  validContato = true
  valid = true;
  dialog = false;
  tabActive = null;
  tab = null


  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  headersDominio: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome" },
   // { text: "Principal", value: "principal" },
  ];

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome" },
    { text: "Telefone", value: "telefone" },
    { text: "Celular", value: "celular" },
    { text: "Ramal", value: "ramal" },
    { text: "Email", value: "email" },
    { text: "Observaçao", value: "observacao" },
    { text: "Principal", value: "principal" },
  ];


  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }
  }

  $refs!: {
    form: HTMLFormElement;
    formContato: HTMLFormElement
    formDominio: HTMLFormElement
  };

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  @Watch("contatoPessoa")
  ContatoPessoa() {
    if (this.$refs.formContato) {
      this.$refs.formContato.resetValidation();
    }
  }

  @Watch("dominioPrincipal")
  DominioPrincipal() {
    if (this.$refs.formDominio) {
      this.$refs.formDominio.resetValidation();
    }
  }

  async PesquisaCep() {
    if (this.assinante.endereco.cep.length == 8) {
      let endereco: any = await new ExternalServices().PesquisaCep(
        this.assinante.endereco.cep
      );
      endereco
        ? (this.assinante.endereco = endereco)
        : this.$swal("Aviso", "CEP inválido!", "error");
      endereco ? (this.readonly = true) : (this.readonly = false);
    }
  }

  //DOMINIO PRINCIPAL
  AdicionarDominio() {
    if (this.$refs.formDominio.validate()) {
      if (this.dominioIndex == -1) {
        this.assinante.dominios.push(this.dominioPrincipal);
      }
      this.dominioPrincipal = new AssinanteDominio();
      this.dominioIndex = -1;
    }
  }

  EditarDominio(item: AssinanteDominio) {
    if (this.dominioIndex != -1) {
      this.$swal("Atenção!", "Não é possível editar um registro sem finalizar uma edição já em andamento.", "error");
      return;
    }
    this.dominioPrincipal = item;
    this.dominioIndex = this.assinante.dominios.indexOf(item);
    //this.item.contatos = this.item.contatos.filter(f => f.id != item.id);
  }

  ExcluirDominio(item: AssinanteDominio) {
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
        const index = this.assinante.dominios.indexOf(item);
        this.assinante.dominios.splice(index, 1);
        this.$swal("Aviso", "Contato excluído com sucesso!", "success");
      }
    });
  }

  //CONTATO PRINCIPAL
  AdicionarContato() {
    if (this.$refs.formContato.validate()) {
      if (this.contatoIndex == -1) {
        this.assinante.contatos.push(this.contatoPessoa);
      }
      this.contatoPessoa = new AssinanteContato();
      this.contatoIndex = -1;
    }
  }

  Editar(item: AssinanteContato) {
    if (this.contatoIndex != -1) {
      this.$swal("Atenção!", "Não é possível editar um registro sem finalizar uma edição já em andamento.", "error");
      return;
    }
    this.contatoPessoa = item;
    this.contatoIndex = this.assinante.contatos.indexOf(item);
  }

  Excluir(item: AssinanteContato) {
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
        const index = this.assinante.contatos.indexOf(item);
        this.assinante.contatos.splice(index, 1);
        this.$swal("Aviso", "Contato excluído com sucesso!", "success");
      }
    });
  }

  Salvar() {
    if (this.$refs.form.validate()) {
      let modelo = this.assinante;

      this.service.Salvar(modelo).then(
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
          } else {
            this.$swal("Aviso", err.response.data, err.response.status == 400 ? "warning" : "error");
          }
        });
    }
  }

  Close() {
    this.dialog = false;
  }
}
</script>
