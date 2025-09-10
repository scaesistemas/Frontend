<template>
    <v-dialog v-model="dialog" width="1000" no-click-animation persistent>
      <v-card>
        <v-toolbar flat color="primary" dark elevation="0" 
        style="position: sticky; top: 0; z-index: 1;" 
        >
          <v-btn icon @click="Close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title v-if="operacao == 'gerar'" class="title font-weight-regular">Criar SubConta</v-toolbar-title>
          <v-toolbar-title v-else class="title font-weight-regular">Criar SubConta</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        
        <div v-if="operacao == 'gerar'">
            <v-stepper v-model="step">
              <v-stepper-header elevation="0" class="no-border">
                  <v-stepper-step :complete="step > 1" step="1"
                    >Instituição Financeira</v-stepper-step
                  >

                  <v-divider :style="dividerStyle(1)" />

                  <v-stepper-step :complete="step > 2" step="2"
                    >Informações necessárias</v-stepper-step
                  >

                  <v-divider :style="dividerStyle(2)" />

                  <v-stepper-step :complete="step > 3" step="3"
                    >Finalizar</v-stepper-step
                  >
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-form ref="form1" v-model="valid">
                    <v-row>
                    <v-col cols="12" md="6">
                      <v-card flat>
                         <v-card-text style="margin-bottom: 10px;">Para qual instituição financeira deseja gerar a subconta?</v-card-text>
                        <v-select
                          v-model="tipo"
                          :items="['Celcoin', 'Global Pay']"
                          label="Instituição financeira"
                          outlined
                          dense
                          :rules="[v => !!v || 'Campo obrigatório']"
                          required
                        ></v-select>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-card-actions class="pr-0">
                        <v-spacer></v-spacer>
                        <v-btn
                          class="text-none"
                          color="primary"
                          @click="nextStep(2)"
                          >Próximo</v-btn
                        >
                      </v-card-actions>
                    </v-col>
                  </v-row>
                  </v-form>              
                </v-stepper-content>
                 <v-stepper-content step="2">
                  <v-form ref="form2" v-model="valid">
                    <v-card class="mt-3">
                     <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="subcontaModel.nome"
                          label="Nome da Empresa"
                          outlined
                          dense
                          :rules="[v => !!v || 'Campo obrigatório']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="subcontaModel.NomeFantasia"
                          label="Nome fantasia"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="subcontaModel.Email"
                          label="Email do responsável"
                          outlined
                          dense
                          :rules="[v => !!v || 'Campo obrigatório']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="subcontaModel.Telefone"
                          label="Telefone do responsável"
                          outlined
                          dense
                          v-mask="'(##)#-####-####'"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="subcontaModel.cPFCNPJ"
                          label="CNPJ da empresa"
                          outlined
                          dense
                          :rules="[v => !!v || 'Campo obrigatório']"
                          required
                          v-mask="'##.###.###/####-##'"
                        ></v-text-field>
                      </v-col>
                      <v-col v-if="tipo == 'Celcoin'" cols="12" md="6">
                        <v-text-field
                          v-model="subcontaModel.cPFCNPJResponsavel"
                          label="CPF do responsável"
                          outlined
                          dense
                          v-mask="'###.###.###-##'"
                        ></v-text-field>
                      </v-col>
                      
                      <vcard-endereco :item="subcontaModel.subcontaEndereco" />

                      <template v-if="tipo == 'Global Pay'">
                        <v-card-text>
                        <v-row>
                        <v-col cols="12" md="12">
                          <v-card-title>
                            <!-- <v-icon color="primary" large left>mdi-map</v-icon> -->
                            <span class="title-span">Informações do Responsável</span>
                          </v-card-title>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6">
                        <v-text-field
                          v-model="subcontaModel.ResponsavelModel.nome"
                          label="Nome do responsável"
                          outlined
                          dense
                          :rules="[v => !!v || 'Campo obrigatório']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="subcontaModel.ResponsavelModel.cpf"
                          label="Cpf do responsável"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="subcontaModel.ResponsavelModel.telefone"
                          label="Telefone do responsável"
                          outlined
                          dense
                          v-mask="'(##)#-####-####'"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="subcontaModel.ResponsavelModel.dataNascimento"
                          label="Data de nascimento"
                          outlined
                          dense
                          v-mask="'##/##/####'"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-text-field
                          v-model="subcontaModel.ResponsavelModel.email"
                          label="Email do responsável"
                          outlined
                          dense
                          :rules="[v => !!v || 'Campo obrigatório']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-text-field
                          v-model="subcontaModel.ResponsavelModel.senha"
                          label="Senha da subconta"
                          outlined
                          dense
                          :rules="[v => !!v || 'Campo obrigatório']"
                          type="password"
                        ></v-text-field>
                      </v-col>
                      </v-row>
                      <vcard-endereco :item="subcontaModel.ResponsavelModel.subcontaResponsavelEndereco" /></v-card-text>

                      </template>
                      
                      <v-col cols="12" md="12">
                      <v-card-actions class="pr-0">
                        <v-spacer></v-spacer>
                        <v-btn class="text-none" text @click="step--"
                          >Voltar</v-btn
                        >
                        <v-btn
                          class="text-none"
                          color="primary"
                          @click="nextStep(3)"
                          >Próximo</v-btn
                        >
                      </v-card-actions>
                    </v-col>
                  </v-row>
                    </v-card>
                    
                  </v-form>
                   
                 </v-stepper-content>
                 <v-stepper-content step="3">
                  <v-form ref="form3" v-model="valid">
                    <v-row>
                      <v-col cols="12" md="12">
                          <v-card flat>
                          <v-card-title>
                            Revisar e gerar a SubConta:
                          </v-card-title>

                          <v-row>
                            <v-col cols="12" md="6" v-for="(item, index) in infos" :key="index">
                              <div class="d-flex">
                                <strong class="mr-2">{{ item.label }}:</strong>
                                <span>{{ item.value }}</span>
                              </div>
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-col>
                                       
                    <v-col cols="12" md="12">
                      <v-card-actions class="pr-0">
                        <v-spacer></v-spacer>
                        <v-btn class="text-none" text @click="step--"
                          >Voltar</v-btn>
                          <v-btn color="primary" @click="GerarSubConta()" :loading="loadingSubConta" :disabled="loadingSubConta">Gerar SubConta</v-btn>
                        </v-card-actions>
                    </v-col>
                  </v-row>
                  </v-form>         
                 </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
        </div>        
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";
  import * as jsonpatch from "fast-json-patch";
  import { ParametroFinanceiroService } from "@/core/services/financeiro";
  import { EmpresaService } from "@/core/services/compras/EmpresaService";
import { SubcontaGlobalDocumentos } from "@/core/models/financeiro/SubcontaGlobalDocumentos";
import { Empresa } from "@/core/models/cadastros";
import { EnderecoService } from "@/core/services/geral/EnderecoService";
import { Estado, Municipio } from "@/core/models/geral";
import { Endereco } from "@/core/models/shared";
  
  @Component
  export default class DocumentoSubConta extends Vue {
    @Prop() public item!: Empresa;
    @Prop() public parametroId!: number;
    @Prop() private value!: string;

    @Prop() private operacao!: string;
  
    service = new ParametroFinanceiroService();
    serviceEmpresa = new EmpresaService();
    serviceEndereco = new EnderecoService()
    documentosGlobal = new SubcontaGlobalDocumentos();
    tipo = "";
  
    valid = true;
    dialog = false;
    loadingSubConta = false;
    loadingSalvar = false;
    permitirCriarSubConta =false;
    mostrarSenha = false;
    tabActive = null;
    emailCadastro = "";
    senhaCadastro = "";
    step: number = 1;
    carregando = false;
    estado = "";
    municipio = "";
    infos: any = [];
  
    responseDocumentos = "";
    responseType: "success" | "error" = "success";
    fileNames: any = {};

    //fieldRules: any[] = [(v: any) => !!v,"Campo obrigatório"];

  fieldRulesNumber: any[] = [
    (v: any) =>
      (v !== null && v !== undefined && v !== ""),  "Campo obrigatório",
    (v: any) => Number(v) > 0 , "Deve ser maior que zero",
  ];


     async nextStep(formNumber: number) {
        const form = this.$refs[`form${formNumber - 1}`] as any;

        if (form) {
          const isValid = await form.validate();
          if (isValid) {
            this.step++;
          }
        }
}

    $refs!: {
      form: Vue & { validate: () => Promise<boolean> };
      form1: Vue & { validate: () => Promise<boolean> };
      form2: Vue & { validate: () => Promise<boolean> };
      form3: Vue & { validate: () => Promise<boolean> };
    };

    dividerStyle(index: number) {
    return {
      backgroundColor: this.step > index ? "#F5621D" : "#E0E0E0",
      height: "6px",
      borderRadius: "4px",
      alignSelf: "center",
      border: "border solid red !important",
      flex: 1,
      margin: "0px 0px",
      transition: "background-color 0.3s ease",
    };
  }
  @Watch("step")
  Step(){
    if(this.step == 3){
    this.serviceEndereco.BuscarEstadoPorId(this.subcontaModel.subcontaEndereco.estadoId).then(res => {
      this.estado = res.data.nome;
      this.infos = [
      { label: "Instituição", value: this.tipo },
      { label: "Empresa", value: this.subcontaModel.nome },
      { label: "Email", value: this.subcontaModel.Email },
      { label: "Estado", value: this.estado },
      { label: "Responsável", value: this.subcontaModel.ResponsavelModel.nome }
    ]
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

      this.serviceEndereco.BuscarMunicipioPorId(this.subcontaModel.subcontaEndereco.municipioId).then(res => {
      this.municipio = res.data.nome;
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
     
  }
    @Watch("value")
    Value() {
      this.dialog = this.value ? true : false;
      if (this.dialog) {
        this.carregarInformacoes()
        
        this.observer = jsonpatch.observe(this.item);
      } else {
        jsonpatch.unobserve(this.item, this.observer);
      }
    }

    @Watch("subcontaModel")
    Item(){
      const refs = ["form1", "form2", "form3"];

      refs.forEach((ref) => {
        const form = this.$refs[ref] as Vue & { resetValidation: () => void };
        if (form) form.resetValidation();
      });
    }

    carregarInformacoes(){
      this.subcontaModel.nome = this.item.nome;
      this.subcontaModel.NomeFantasia = this.item.nomeFantasia;
      this.subcontaModel.cPFCNPJ = this.item.cnpj;
      this.subcontaModel.cPFCNPJResponsavel = this.item.responsavel.cpf;
      this.subcontaModel.Email = this.item.responsavel.email;
      this.subcontaModel.Telefone = this.item.telefone1;
      this.subcontaModel.subcontaEndereco = this.item.endereco;
      this.subcontaModel.ResponsavelModel.nome = this.item.responsavel.nome;
      this.subcontaModel.ResponsavelModel.cpf = this.item.responsavel.cpf;
      this.subcontaModel.ResponsavelModel.dataNascimento = this.item.responsavel.dataNascimento ?? "";
      this.subcontaModel.ResponsavelModel.telefone = this.item.responsavel.telefone;
      this.subcontaModel.ResponsavelModel.subcontaResponsavelEndereco = this.item.responsavel.endereco;
    }

    subcontaModel: subcontaModel = new subcontaModel();
    subcontaDocumentoModel = {};

    versodocumentoNome:string= "";
    SelfieNome:string= "";
    frentedocumentoNome:string= "";
    documentoNome:string= "";
  
    @Watch("dialog")
    Dialog() {
      if (!this.dialog) {
        this.$emit("fechou");
      }
    }
  
  
    observer!: jsonpatch.Observer<any>;
  
    Close() {
      this.dialog = false;
    }
    
  
    GerarSubConta() {
      this.loadingSubConta = true;
      this.service.CriarSubConta(this.parametroId, this.tipo == 'Celcoin' ? 2 : 6, this.subcontaModel)
        .then((res) => {
          this.$swal(
            "Aviso",
            `Operação realizada com sucesso! A subconta deve ser aceita pela ${this.tipo} antes de ser utilizada. Agora envie os arquivos necessários para a ${this.tipo}`,
            res.status === 201 || res.status === 200 ? "success" : "warning"
          );
          this.step = 1;
          this.$emit("salvou");
          this.$emit("subconta-criada-com-sucesso", this.tipo);
        })
        .catch((err) => {
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status === 403) {
            this.$swal("Aviso", err.response.data.message, "warning");
          } else {
            this.$swal(
              "Aviso",
              err.response.data,
              err.response.status === 400 ? "warning" : "error"
            );
          }
        })
        .finally(() => {
          this.loadingSubConta = false;
        });
    }

  }
  

  class subcontaModel{
    nome: string = "";
    cPFCNPJ: string = "";
    NomeFantasia: string = "";
    Telefone: string = "";
    Email: string = "";
    cPFCNPJResponsavel: string = "";
    subcontaEndereco: Endereco = new Endereco();
    ResponsavelModel: ResponsavelSubcontaModel = new ResponsavelSubcontaModel();
  }

  class ResponsavelSubcontaModel {
    nome: string = "";
    cpf: string = "";
    senha: string = "";
    email: string = "";
    dataNascimento: string = "";
    telefone: string = ""
    subcontaResponsavelEndereco: Endereco = new Endereco()
  }
  </script>
  <style scoped>
  .file-link {
  color: #007bff; /* Azul */
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s;
}

.file-link:hover {
  color: #0056b3; /* Azul mais escuro no hover */
  text-decoration: none; /* Remove sublinhado no hover */
}
  </style>

  