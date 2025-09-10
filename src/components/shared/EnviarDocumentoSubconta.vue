<template>
    <v-dialog v-model="dialog" width="1000" no-click-animation persistent>
      <v-card>
        <v-toolbar flat color="primary" dark elevation="0" 
        style="position: sticky; top: 0; z-index: 1;" 
        >
          <v-btn icon @click="Close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="title font-weight-regular">Enviar Documentos SubConta</v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        
        <v-card-text>
          
          <v-form ref="form" v-model="valid">
            <v-container>              
              <v-row v-if="tipo == 'Celcoin'">
              <v-col cols="12" md="12">
                 <v-card-title>Informações necessárias</v-card-title>
              </v-col>
                 <v-col cols="12" md="12">
                  <span class="font-weight-bold">Nome do responsável da empresa</span>
                  <v-text-field v-model="documento.nomeResponsavel" outlined dense></v-text-field>
                </v-col>
                <!-- Campos do formulário -->
                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Site ou rede social da Empresa</span>
                  <v-text-field v-model="documento.siteDaEmpresa" outlined dense></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Nome completo da mãe do responsável</span>
                  <v-text-field
                    v-model="documento.nomeDaMae"
                    outlined
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Renda mensal da empresa</span>
                  <money-input outlined @ValorFormatado="valor => documento.rendaMensalEmpresa = valor" dense required/>
                </v-col>
                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Data de nascimento do responsável</span>
                  <v-text-field
                    v-model="documento.dataNascimento"
                    outlined
                    dense
                    type="date"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="12">
                  <span class="font-weight-bold">Descreva com poucas palavras a área de atuação da empresa</span>
                  <v-textarea
                    v-model="documento.sobreNos"
                    outlined
                    dense
                  ></v-textarea>
                </v-col>
                <v-divider class="mb-5"></v-divider>
              </v-row>
              
              <v-card-title>Documentos necessárias</v-card-title>
              <v-divider class="mb-5"></v-divider>
              <v-row>
                <v-col cols="12" md="6" >
                  <v-select v-model="documento.tipoDocumento" :items="['CNH', 'RG']" label="Tipo de Documento" outlined dense required></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="documento.cpfCnpjResponsavel" label="Número do documento" outlined dense required></v-text-field>
                </v-col>
  
                <!-- Selfie segurando o documento -->
                <!-- Foto do Documento -->
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="frenteDocumentoFile"
                    :label="`Foto do documento ('Frente' ${documento.tipoDocumento})`"
                    outlined
                    dense
                    accept="image/*"
                    required
                  ></v-file-input>
                </v-col>
                <!-- Verso do Documento -->
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="versoDocumentoFile"
                    :label="`Foto do documento ('Verso' ${documento.tipoDocumento})`"
                    outlined
                    dense
                    accept="image/*"
                    required
                  ></v-file-input>
                </v-col>

                <v-col cols="12">
                  <v-file-input
                    v-model="selfieFile"
                    :label="`Selfie segurando ${documento.tipoDocumento}`"
                    outlined
                    dense
                    accept="image/*"
                    required
                  ></v-file-input>
                </v-col>
                <!-- Contrato Social (se aplicável) -->
                <v-col cols="12">
                  <v-file-input
                    v-model="contratoSocialFile"
                    label="Contrato Social da empresa em pdf"
                    outlined
                    dense
                    accept="application/pdf"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            color="primary"
            @click="enviarDocumentos"
            :loading="loadingSubConta"
            :disabled="loadingSubConta"
          >
            Enviar documentos
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";
  import { ParametroFinanceiroService } from "@/core/services/financeiro";
  import { EmpresaService } from "@/core/services/compras/EmpresaService";
import { SubcontaGlobalDocumentos } from "@/core/models/financeiro/SubcontaGlobalDocumentos";
  
  @Component
  export default class EnviarDocumentoSubconta extends Vue {
    @Prop() private value!: string;
    @Prop() private tipo!: string;
     @Prop() private parametroId!: number;

    service = new ParametroFinanceiroService();
    serviceEmpresa = new EmpresaService();
    documentosGlobal = new SubcontaGlobalDocumentos();
  
    valid = true;
    dialog = false;
    loadingSubConta = false;
    permitirCriarSubConta =false;
    rendaMensal = 0;
  
    responseDocumentos = "";
    responseType: "success" | "error" = "success";
    fileNames: any = {};
    documento = new documentoSubconta();
  
    @Watch("value")
    Value() {
      this.dialog = this.value ? true : false;
    }

    selfieFile: File | null = null;
    frenteDocumentoFile: File | null = null;
    versoDocumentoFile: File | null = null;
    contratoSocialFile: File | null = null;
      
    @Watch("dialog")
    Dialog() {
      if (!this.dialog) {
        this.$emit("fechou");
      }
    }
    mounted() {
    }
  
  
    Close() {
      this.dialog = false;
    }
  
    async toBase64(file: File | null): Promise<string> {
      return new Promise((resolve, reject) => {
        if (!file) return resolve("");

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = (reader.result as string).split(",")[1]; // remove 'data:...;base64,'
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
      });
    }
  

  async enviarDocumentos() {
  if (!this.$refs.form || !(this.$refs.form as any).validate()) {
    this.$swal("Erro", "Preencha os campos obrigatórios", "warning");
    return;
  }

  this.loadingSubConta = true;

  try {
    this.documento.selfieDocumento = await this.toBase64(this.selfieFile);
    this.documento.fotoDocumentoResponsavel = await this.toBase64(this.frenteDocumentoFile);
    this.documento.versoDocumentoResponsavel = await this.toBase64(this.versoDocumentoFile);
    this.documento.contratoSocial = await this.toBase64(this.contratoSocialFile);

    this.documento.type = this.tipo;

    const res = await this.service.EnviarDocumentoSubconta(this.parametroId, this.tipo == 'Celcoin' ? 2 : 6, this.documento);

    this.$swal("Sucesso", "Documentos enviados com sucesso!", "success");
    this.Close();
  } catch (err) {
    console.error(err);
    this.$swal("Erro", "Falha ao enviar documentos", "error");
  } finally {
    this.loadingSubConta = false;
  }
}
  }
  class documentoSubconta{
    tipoDocumento: string = "";
    selfieDocumento: string = "";
    fotoDocumentoResponsavel: string = "";
    versoDocumentoResponsavel: string = "";
    contratoSocial: string = "";
    sobreNos: string = "";
    rendaMensalEmpresa: number = 0;
    siteDaEmpresa: string = "";
    nomeResponsavel: string = "";
    cpfCnpjResponsavel: string = "";
    nomeDaMae: string = "";
    dataNascimento: Date = new Date();
    type: string = "";
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
  