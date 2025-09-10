<template>
  <v-card v-model="dialog" elevation="1"> 
    <v-card-text>
      <v-card-title>
        <span class="title-span">Observações</span>               
      </v-card-title> 

      <v-row dense class="px-3">
        <v-col cols="10" md="6">
          <span class="font-weight-bold">Descrição</span>
          <v-text-field outlined v-model="observacao.observacao" dense/> 
        </v-col>  

        <v-col cols="2" md="2" class="pt-7">
          <v-btn color="primary" @click="Adicionar()">
            <v-icon left>mdi-plus</v-icon>  Adicionar
          </v-btn>
        </v-col>  
      </v-row>
 
      <v-row dense>
        <v-col cols="12" md="12">
          <v-data-table :options.sync="options" class="elevation-1" item-key="item.key" :headers="headers" :items="listaObservacoes" :footer-props="{ showFirstLastPage: false }">
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-icon small :disabled="!item.ativo" @click="Excluir(item)" v-on="on">mdi-delete</v-icon>
                </template>
                <span>Excluir</span>
              </v-tooltip> 
            </template>

            <template v-slot:[`item.observacao`]="{ item }">
              {{ item.observacao }}  
            </template>

            <template v-slot:[`item.usuarioId`]="{ item }"> 
              {{ usuarios.find(x => x.id == item.usuarioId) ? usuarios.find(x => x.id == item.usuarioId).login : '-' }}   
            </template>

            <template v-slot:[`item.dataHora`]="{ item }">
              {{ new Date(item.dataHora).ddmmyyyy() }}
            </template>  
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import ContratoObservacao from "@/core/models/cadastros/ContratoObservacao";
import { UsuarioService } from "@/core/services/cadastros";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class VCardObservacao extends Vue {
  @Prop() lista?: any[];

  observacao = new ContratoObservacao();
  listaObservacoes:ContratoObservacao[] = [];
  usuarios = [];
  observacaoIndex = -1;
  dialog = false;

  options = {
    itemsPerPage: 5
  };

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Observação", value: "observacao" },
    { text: "Usuário", value: "usuarioId" },
    { text: "Data", value: "dataHora" },
  ];

  Adicionar() {
    this.observacao.usuarioId = JSON.parse(localStorage.sessionApp.split(".")).dados.usuarioId;
    var objeto = Object.assign({}, this.observacao);
    objeto.usuarioId = this.observacao.usuarioId;
  
    if (this.observacaoIndex == -1) {
      this.listaObservacoes.push(objeto);
      this.AtualizarLista(this.listaObservacoes);
    }
    this.observacao = new ContratoObservacao();
    this.observacaoIndex = -1;
  }

  Excluir(item: any) {
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
        if (item.id > 0) {
          const index = this.lista!.indexOf(item);
          item.ativo = false;
          this.dialog = false;
          this.dialog = true;
          return true;
        } else {
          const index = this.lista!.indexOf(item);
          this.lista!.splice(index, 1);
          return this.$swal("Aviso", "Registro excluído com sucesso!", "success");
        }
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if (result.value) {
      }
    });
  }

  AtualizarLista(novoValor: any) {
    this.$emit("update:lista", novoValor);
  }

  @Watch("lista")
  ObservadorLista(novoValor: any) {
    this.listaObservacoes = Object.assign([], this.lista);
  }

  mounted() {
    new UsuarioService().Listar(-1, -1, ['Login'],[],'',[], '', '' , 'Id,Login', '').then(
      res => {this.usuarios = res.data.items});

      this.listaObservacoes = Object.assign([], this.lista);
  }
}
</script>

 