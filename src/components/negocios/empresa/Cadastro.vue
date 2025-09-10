<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
    no-click-animation
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>Cadastro Empresa</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn dark text @click="Salvar()">Salvar</v-btn>
        </v-toolbar-items>

        <template v-slot:extension>
          <v-tabs v-model="tabActive" background-color="primary" dark>
            <v-tab>Empresa</v-tab>
            <v-tab>Documentos</v-tab>
            <v-tab>Pessoa Responsável</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-form v-model="valid" lazy-validation ref="form">
        <v-tabs-items v-model="tabActive">
          <v-tab-item>
            <v-card elevation="1">
              <v-card-text>
                <v-card-title>
                  <v-icon large left color="primary">mdi-information</v-icon>
                  <span class="title-span">Informação da Empresa</span>
                  <v-spacer></v-spacer>
                 
                </v-card-title>

                <v-row dense no-gutters>
                  <v-col cols="12" md="2">
                    <v-row no-gutters justify="center">
                      <v-card flat :loading="loading">
                        <v-row justify="center" class="mt-8">
                          <v-img
                            v-if="item.logo"
                            :src="`data:image/jpeg;base64,${item.logo}`"
                            max-width="75%"
                            height="180"
                          />
                          <v-img
                            v-else
                            src="../../../assets/images/default/default-img2.jpg"
                            max-width="75%"
                            height="180"
                          />
                        </v-row>

                        <v-col cols="12" md="12" class="pt-9">
                          <div v-if="!item.logo">
                            <v-file-input
                              color="primary"
                              prepend-icon="mdi-camera"
                              show-size
                              accept="image/png, image/jpeg"
                              label="Anexar Logo"
                              v-model="arquivoLogo"
                              outlined
                              dense
                              @change="LoadImage()"
                            />
                          </div>

                          <div v-else>
                            <v-btn icon @click="RemoveImage()">
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </div>
                        </v-col>
                      </v-card>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="10" class="py-6">
                    <v-row dense>
                      <v-col cols="12" sm="4">
                        <span class="font-weight-bold">Razão social*</span>
                        <v-text-field
                          outlined
                          v-model="item.nome"
                          dense
                          :rules="fieldRules"
                          :counter="60"
                          maxlength="60"
                          required
                        />
                      </v-col>

                      <v-col cols="12" sm="4">
                        <span class="font-weight-bold">Tipo de Empresa</span>
                        <v-select
                          outlined
                          v-model="item.tipoEmpresaId"
                          :items="listaTipoEmpresa"
                          item-value="id"
                          item-text="nome"
                          dense
                          :rules="fieldRules"
                        />
                      </v-col>

                      <v-col cols="12" sm="2">
                        <span class="font-weight-bold">Celular*</span>
                        <v-text-field
                          outlined
                          v-model="item.telefone1"
                          dense
                          v-mask="'(##) #####-####'"
                          :rules="fieldRules"
                        />
                      </v-col>

                      <v-col cols="12" sm="2">
                        <span class="font-weight-bold">Fixo</span>
                        <v-text-field
                          outlined
                          v-model="item.telefone2"
                          dense
                          v-mask="'(##) ####-####'"
                        />
                      </v-col>
                    </v-row>

                    <v-row dense>
                      <v-col cols="12" md="6">
                        <span class="font-weight-bold">Fantasia*</span>
                        <v-text-field
                          outlined
                          v-model="item.nomeFantasia"
                          dense
                          :rules="fieldRules"
                          :counter="30"
                          maxlength="30"
                          required
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <span class="font-weight-bold">Renda Mensal*</span>
                        <money-input
                          outlined
                          v-model="item.rendaMensal"
                          @ValorFormatado="
                            (valor) => (item.rendaMensal = valor)
                          "
                          dense
                          :rules="fieldRules"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <span class="font-weight-bold">Email*</span>
                        <v-text-field
                          outlined
                          v-model="item.email"
                          :rules="fieldRules"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <span class="font-weight-bold">Site da empresa*</span>
                        <v-text-field
                          outlined
                          v-model="item.siteDaEmpresa"
                          :rules="fieldRules"
                          dense
                        />
                      </v-col>
                    </v-row>

                    <v-row dense>
                      <v-col cols="12" sm="6">
                        <span class="font-weight-bold">CNPJ*</span>
                        <v-text-field
                          outlined
                          v-model="item.cpfCnpj"
                          dense
                          maxlength="18"
                          :rules="fieldRules"
                          required
                          v-mask="'##.###.###/####-##'"
                        />
                      </v-col>

                      <v-col cols="12" sm="3">
                        <span class="font-weight-bold"
                          >Inscrição Municipal</span
                        >
                        <v-text-field
                          outlined
                          v-model="item.inscricaoMunicipal"
                          dense
                          :counter="11"
                          maxlength="11"
                        />
                      </v-col>

                      <v-col cols="12" sm="3">
                        <span class="font-weight-bold">Inscrição Estadual</span>
                        <v-text-field
                          outlined
                          v-model="item.inscricaoEstadual"
                          dense
                          :counter="9"
                          maxlength="9"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <br />

            <vcard-endereco :item="item.endereco" />
          </v-tab-item>

          <v-tab-item>
            <vcard-documento
              :lista.sync="item.documentos"
              :exibirCampos="true"
            />
          </v-tab-item>

          <v-tab-item>
            <v-card elevation="1">
              <v-card-text>
                <v-card-title>
                  <v-icon large left color="primary">mdi-information</v-icon>
                  <span class="title-span">Informação do Responsável</span>
                </v-card-title>

                <v-row class="px-3" dense
                  ><v-col cols="12" md="6">
                    <span class="font-weight-bold">Nome*</span>
                    <v-text-field
                      v-model="item.responsavel.nome"
                      outlined
                      dense
                      :rules="fieldRules"
                      @change="buscarPessoaPorNome"
                    />
                  </v-col>

                  <!-- <v-col cols="12" md="6">
                    <span class="font-weight-bold">Nome*</span>
                    <v-text-field type="string" outlined v-model="item.responsavel.nome" dense :rules="fieldRules"/>
                  </v-col> -->
                  <!-- 
                  -->

                  <v-col cols="12" md="3">
                    <span class="font-weight-bold">Sobrenome*</span>
                    <v-text-field
                      outlined
                      v-model="item.responsavel.sobrenome"
                      dense
                      :counter="60"
                      maxlength="60"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <span class="font-weight-bold">CPF*</span>
                    <v-text-field
                      outlined
                      v-model="item.responsavel.cpf"
                      dense
                      v-mask="'###.###.###-##'"
                      :rules="fieldRules"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <span class="font-weight-bold">Data nascimento*</span>
                    <v-text-field
                      outlined
                      v-model="item.responsavel.dataNascimento"
                      dense
                      type="date"
                      :rules="fieldRules"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <span class="font-weight-bold">Nome da mãe completo*</span>
                    <v-text-field
                      outlined
                      v-model="item.responsavel.nomeDaMae"
                      dense
                      :rules="fieldRules"
                    />
                  </v-col>
                </v-row>

                <v-row dense class="px-3">
                  <v-col cols="12" md="2" class="pt-3">
                    <v-switch
                      label="Gerar Zoop"
                      outlined
                      v-model="item.gerarZoop"
                      dense
                    />
                  </v-col>
                </v-row>

                <v-row dense class="px-3">
                  <v-col cols="12" md="3" v-if="item.gerarZoop">
                    <span class="font-weight-bold">Código Zoop</span>
                    <v-text-field
                      outlined
                      v-model="item.responsavel.codigoZoop"
                      dense
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <br />
            <v-card elevation="1">
              <vcard-endereco :item="item.responsavel.endereco" />
            </v-card>
            <br />
            <v-card elevation="1">
              <v-card-text>
                <v-card-title>
                  <span class="title-span">Contato</span>
                </v-card-title>

                <v-row class="pa-3" dense>
                  <v-col cols="12" md="3">
                    <span class="font-weight-bold">Telefone</span>
                    <v-text-field
                      outlined
                      v-model="item.responsavel.telefone"
                      dense
                      v-mask="'(##)#-####-####'"
                    />
                  </v-col>

                  <v-col cols="12" md="5">
                    <span class="font-weight-bold">Email</span>
                    <v-text-field
                      outlined
                      v-model="item.responsavel.email"
                      dense
                      :counter="60"
                      maxlength="60"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { EmpresaService } from "../../../core/services/compras/EmpresaService";
import { Empresa } from "@/core/models/cadastros";
import * as jsonpatch from "fast-json-patch";
import { ArquivoService } from "@/core/services/geral/ArquivoService";
import { TipoEmpresaService } from "@/core/services/negocios/";
import { PessoaService } from "@/core/services/cadastros";

@Component
export default class CadastroEmpresa extends Vue {
  @Prop() public item!: Empresa;
  @Prop() public value!: string;

  service = new EmpresaService();
  loading = false;
  dialog = false;
  valid = true;
  dialogSubconta = false;

  buscaResponsavel = "";
  listaTipoEmpresa = [];
  arquivoLogo: any = null;

  fotoDocumentoResponsavel: any = this.item.fotoDocumentoResponsavel || null;
  selfieResponsavel: any = this.item.selfieResponsavel || null;
  contratoSocial: any = this.item.contratoSocialLtda || null;
  versoDocumentoResponsavel: any = this.item.selfieResponsavel || null;
  fotoDocumentoNome: string = "";
  selfieNome: string = "";
  tipoDocumento: string = "CNH";
  mostrarSenha = false;
  emailSubconta = "";
  senhaSubconta = "";
  loadingSubConta = false;

  tabActive = 0;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  $refs!: {
    form: HTMLFormElement;
  };

  private Documentos: Record<string, any> = {
    contratoSocialLtda: null,
    selfieResponsavel: null,
    fotoDocumentoResponsavel: null,
  };

  async LoadImage() {
    this.loading = true;
    if (!this.arquivoLogo) return;

    const arquivoService = new ArquivoService();
    const dados = await arquivoService.Ler(this.arquivoLogo);
    this.item.logo = dados.replace(/^[^,]*,/, "");
    this.loading = false;
  }

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  observer!: jsonpatch.Observer<Empresa>;

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;

    if (this.dialog) {
      this.observer = jsonpatch.observe(this.item);
    } else {
      jsonpatch.unobserve(this.item, this.observer);
    }
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    } else {
      this.item.gerarZoop = false;
    }
  }

  RemoveImage() {
    this.item.logo = null;
    this.arquivoLogo = null;
  }

  Validacoes() {
    if (
      !this.item.email ||
      !this.item.nome ||
      !this.item.telefone1 ||
      !this.item.nomeFantasia ||
      !this.item.cpfCnpj ||
      !this.item.tipoEmpresaId
    ) {
      this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
      this.tabActive = 0;
      return true;
    }

    if (
      !this.item.endereco.cep ||
      !this.item.endereco.logradouro ||
      !this.item.endereco.bairro ||
      !this.item.endereco.estadoId ||
      !this.item.endereco.municipioId
    ) {
      this.$swal(
        "Atenção",
        "É necessário preencher o endereço completo da Empresa.",
        "warning"
      );
      this.tabActive = 0;
      return true;
    }
    //!this.item.responsavel.sobrenome ||
    if (
      !this.item.responsavel.nome ||
      !this.item.responsavel.cpf ||
      !this.item.responsavel.dataNascimento
    ) {
      this.$swal("Atenção", "Campos obrigatórios não preenchidos.", "warning");
      this.tabActive = 2;
      return true;
    }

    if (
      !this.item.responsavel.endereco.cep ||
      !this.item.responsavel.endereco.logradouro ||
      !this.item.responsavel.endereco.bairro ||
      !this.item.responsavel.endereco.estadoId ||
      !this.item.responsavel.endereco.municipioId
    ) {
      this.$swal(
        "Atenção",
        "É necessário preencher o endereço completo do Responsável.",
        "warning"
      );
      this.tabActive = 2;
      return true;
    }
  }

  onFileChange(field, file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.item[field] = e.target.result.split(",")[1]; // Remove o prefixo base64
      };
      reader.readAsDataURL(file);
    } else {
      this.item[field] = null; // Limpa o campo caso nenhum arquivo seja selecionado
    }
  }

  excluirDocumento(field) {
    this.item[field] = null;
  }

  Salvar() {
    this.$refs.form.validate();

    if (!this.Validacoes()) {
      let pacthModel = jsonpatch.generate(this.observer);
      (this.item.id > 0
        ? this.service.Patch(pacthModel, this.item.id)
        : this.service.Salvar(this.item)
      ).then(
        (res) => {
          this.$swal(
            "Aviso",
            "Operação realizada com sucesso!",
            res.status == 201 || res.status == 200 ? "success" : "warning"
          );
          this.$emit("salvou");
          this.Close();
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
    }
  }

  Close() {
    this.tabActive = 0;
    this.dialog = false;
    this.arquivoLogo = null;
  }

  pessoasFiltradas = [];
  carregandoPessoas = false;

  preencherPessoaSeExistir(nomeSelecionado) {
    const pessoa = nomeSelecionado;

    if (pessoa) {
      this.item.responsavel.cpf = pessoa.cnpjCpf;
      this.item.responsavel.dataNascimento = new Date(
        pessoa.dataNascimento
      ).yyyymmdd();
      this.item.responsavel.endereco = pessoa.endereco;
      this.item.responsavel.email = pessoa.email;
      this.item.responsavel.telefone = pessoa.telefone;

      const partes = pessoa.nome.trim().split(" ");
      this.item.responsavel.sobrenome = partes.slice(1).join(" ");
    }
  }

  buscarPessoaPorNome(nome) {
    if (!nome || nome.length < 3) return;

    this.carregandoPessoas = true;

    new PessoaService()
      .AutoComplete(
        nome,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      )
      .then((res) => {
        this.preencherPessoaSeExistir(res.data[0]);
      })
      .finally(() => {
        this.carregandoPessoas = false;
      });
  }

  mounted() {
    const tipoEmpresaService = new TipoEmpresaService();
    tipoEmpresaService.ListarTudo().then((res) => {
      this.listaTipoEmpresa = res.data.items.sort((a, b) => {
        return a.nome.localeCompare(b.nome);
      });
    });
    this.fotoDocumentoResponsavel = this.item.fotoDocumentoResponsavel;
    this.selfieResponsavel = this.item.selfieResponsavel;
  }
}
</script>

<style scoped>
.delete-icon {
  position: absolute;
  bottom: 8px;
  right: 8px;
}
</style>
