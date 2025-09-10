<template>
  <v-card v-model="dialog" elevation="1">
    <v-card-text> 
 
    <v-card-title>
      <span class="title-span">Documentos</span>
    </v-card-title>
      
    <v-row dense class="pt-3 px-3" v-if="exibirCampos"> 
      <v-col cols="12" md="5">
        <span class="font-weight-bold">Descrição do arquivo</span>
        <v-text-field dense outlined v-model="documento.nome"/>
      </v-col> 
    
      <v-col cols="12" md="3" xl="3" sm="3" lg="3">
        <span class="font-weight-bold pl-8">Arquivo</span>
        <v-file-input outlined chips accept="image/*,application/pdf"  label="Selecione o arquivo" v-model="inputDocumento" show-size counter dense/>
      </v-col>

        <v-col cols="2" md="2" class="mt-6">
          <v-btn color="primary" @click="AdicionarArquivo()">
            <v-icon>mdi-plus</v-icon>
            Adicionar
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table class="elevation-1" item-key="item.key" :headers="headersDocumentos" :items="lista">
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom v-if="exibirCampos">
            <template v-slot:activator="{ on }">
              <v-icon small @click="ExcluirDocumento(item)" v-on="on" :disabled="item.excluido">mdi-delete</v-icon>
            </template>
            <span>Excluir</span>
          </v-tooltip>

          <!-- <v-tooltip bottom v-if="exibirCampos">
            <template v-slot:activator="{ on }">
              <v-icon class="ml-2" small @click="CompartilharArquivo(item)" v-on="on"
                :disabled="item.excluido">mdi-share</v-icon>
            </template>
            <span>Compartilhar</span>
          </v-tooltip> -->

           <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon class="ml-2" small @click="BaixarArquivo(item)" v-on="on"
                :disabled="item.excluido">mdi-download</v-icon>
            </template>
            <span>Download</span>
          </v-tooltip>
        </template>

        <template v-slot:[`item.nome`]="{ item }">
          {{ item.nome }}
        </template>

        <template v-slot:[`item.dados`]="{ item }">
          <v-icon v-if="item.tipo == 'application/pdf'" large color="primary">mdi-file</v-icon>
          <img v-else class="mt-2" :src="'data:image/gif;base64,' + item.dados" alt="Img" width="100" height="100" />
        </template>

        <template v-slot:[`item.dataEmissao`]="{ item }">
          {{ item.dataEmissao != null ? new Date(item.dataEmissao).ddmmyyyy() : '-' }}
        </template>

        <template v-slot:[`item.usuarioId`]="{ item }">
          {{ usuarios.find(x => x.id == item.usuarioId) != undefined ? usuarios.find(x => x.id == item.usuarioId).login :
          '-' }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Documento } from '@/core/models/geral'
import { UsuarioService } from '@/core/services/cadastros';
import { ArquivoService } from '@/core/services/geral/ArquivoService';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class VCardDocumento extends Vue {
  @Prop() private lista?: any[];
  @Prop() private exibirCampos;

  documento: Documento = new Documento();
  inputDocumento: any = null;
  dialog = false;
  usuarios:any = [];

  headersDocumentos: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome", align: "center" },
    { text: "Arquivo", value: "dados", align: "center", sortable: false },
    { text: "Data", value: "dataEmissao", align: "center", sortable: false },
    { text: "Usuário", value: "usuarioId", align: "center", sortable: false },
  ];

  async AdicionarArquivo() {
    if (!this.inputDocumento)
      return this.$swal("Aviso", "É necessário selecionar um arquivo.", "warning");

    if (this.documento.nome == '')
      return this.$swal("Aviso", "É necessário nomear o arquivo.", "warning");

    if (this.lista!.some(s => s.nome == this.documento.nome))
      return this.$swal("Aviso", "Já existe um arquivo com esse nome na lista.", "warning");


    let dados = await new ArquivoService().Ler(this.inputDocumento);
    this.documento.usuarioId = JSON.parse(localStorage.sessionApp.split(".")).dados.usuarioId;
    this.documento.dados = dados.replace(/^[^,]*,/, "");
    this.documento.nome = this.documento.nome != "" ? this.documento.nome : this.inputDocumento.name;
    this.documento.tamanho = this.inputDocumento.size;
    this.documento.tipo = this.inputDocumento.type;
    this.lista!.push(this.documento);
    this.documento = new Documento();
    this.inputDocumento = null;
  }

  ExcluirDocumento(documento: any) {
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja excluir o registro atual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        if (documento.id > 0) {
          documento.excluido = true;
          const index = this.lista!.indexOf(documento);
          delete this.lista![index]
          this.dialog = false;
          this.dialog = true;
          return true;
        } else {
          const index = this.lista!.indexOf(documento);
          this.lista!.splice(index, 1);
          return this.$swal("Aviso", "Registro excluído com sucesso!", "success");
        }
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if (result.value) {
      }
    })
  }

  BaixarArquivo(arquivo) {
    new ArquivoService().Download(arquivo);
  }

  async CompartilharArquivo(item) {
    new ArquivoService().Compartilhar(item);
  }

  @Watch("lista")
  AtualizarLista() {
    this.documento = new Documento();
    this.inputDocumento = null;
  }

  mounted() {
    new UsuarioService().ListarTudo().then(
      res => this.usuarios = res.data.items
    )
  }
}
</script>