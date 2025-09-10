<template>
  <v-card>
    <!-- Entrada de arquivo -->
    <v-file-input
      v-model="file"
      :label="label"
      :accept="accept"
      :prepend-icon="icon"
      outlined
      dense
      @change="onFileChange"
    ></v-file-input>

    <div class="pa-2 d-flex flex-column align-center">
      <!-- Exibição da imagem (opcional) -->
      <img
        v-if="isImage"
        class="mt-2"
        :src="image"
        :alt="alt"
        width="250"
        height="250"
      />

      <!-- Exibição de arquivos não-imagem -->
      <div v-else-if="fileName" class="mt-2">
        <v-icon>mdi-file-document-outline</v-icon>
        <span>{{ fileName }}</span>
      </div>

      <!-- Botão de exclusão -->
      <v-btn
        small
        icon
        class="delete-icon"
        color="red"
        @click="deleteFile"
        aria-label="Excluir Documento"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Usuario } from "@/core/models/cadastros";
import { PageBase } from "@/core/models/shared";
import Arquivo from "@/core/models/shared/Arquivo";
import { Component, Prop, Vue } from "vue-property-decorator";
 // Importe a classe Arquivo do seu projeto

@Component
export default class DocumentCard extends PageBase {
  @Prop() public item!: any; // Objeto que contém o campo do modelo Arquivo
  @Prop() public campo!: string; // Nome do campo do modelo Arquivo
  @Prop() public label!: string; // Rótulo do input
  @Prop({ required: false, default: "image/*, .pdf, .doc, .docx" }) public accept!: string; // Tipos aceitos para o arquivo
  @Prop({ required: false }) public icon!: string; // Ícone do input
  @Prop({ required: false }) public alt!: string;

  private file: File | null = null; // Arquivo selecionado
  private image: string = ""; // Dados base64 para imagens
  private fileName: string | null = null; // Nome do arquivo selecionado
  arquivoX: any = this.item[this.campo];

  get isImage(): boolean {
    return this.image !== "";
  }

  mounted() {
    this.fileName = this.arquivoX.nome;
    const arquivo: Arquivo | null = this.item[this.campo];
    if (arquivo && arquivo.dados) {
      // Se for uma imagem, converte para Base64
      if (arquivo.tipo.startsWith("image/")) {
        this.image = arquivo.dados; // Já é base64
      } else {
        this.fileName = arquivo.nome;
      }
    }
  }

  private onFileChange(): void {
    if (this.file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result as string;
        const arquivo = new Arquivo({
          nome: this.file?.name || "",
          tamanho: this.file?.size || 0,
          tipo: this.file?.type || "",
          dados: base64.split(',')[1], // Dados agora são base64
          dataEmissao: new Date()
        });

        // Se for uma imagem, exibe
        if (arquivo.tipo.startsWith("image/")) {
          this.image = base64;
        } else {
          this.fileName = arquivo.nome;
        }

        // Atualiza o modelo no item
        this.item[this.campo] = arquivo;
      };

      reader.readAsDataURL(this.file);
    }
  }

  private deleteFile(): void {
    this.file = null;
    this.image = "";
    this.fileName = null;
    this.item[this.campo] = null;
  }
}
</script>

<style scoped>
.delete-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  padding: 4px;
}
</style>
