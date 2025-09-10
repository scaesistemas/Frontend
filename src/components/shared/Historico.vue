<template>
  <v-card elevation="1" v-model="dialog">
    <v-card-text>
      <v-card-title>
        <span class="title-span">Histórico</span>               
      </v-card-title> 

        <v-row dense class="px-3">
          <v-col cols="12" md="12">
            <v-data-table 
            class="elevation-1"
            :options.sync="options" 
            item-key="item.key" 
            :headers="headers" 
            :items="listaObservacoes" 
            :footer-props="{ showFirstLastPage: false}">
        
            <template v-slot:[`item.situacaoId`] = "{item}">
            {{ item.situacao ? item.situacao.nome : '-' }}
            </template>

            <template v-slot:[`item.dataAlteracao`] = "{item}">
            {{ item.dataAlteracao.toDateDDMMYYYY()}}
            </template>

            <template v-slot:[`item.usuario.login`] = "{item}">
            {{ item.usuario ? item.usuario.login : '-' }}
            </template> 
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class Historico extends Vue {
  @Prop() lista?: any[];

  listaObservacoes:any = [];
  usuarios = [];
  observacaoIndex = -1;
  dialog = false;

  options = {
    itemsPerPage: 5
  };

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Situação", value: "situacaoId" },
    { text: "Data de Alteração", value: "dataAlteracao" },
    { text: "Responsável", value: "usuario.login" },
  ];

 
  AtualizarLista(novoValor: any) {
    this.$emit("update:lista", novoValor);
  }

  @Watch("lista")
  ObservadorLista(novoValor: any) {
    this.listaObservacoes = Object.assign([], this.lista);
  }

  mounted() {
    this.listaObservacoes = Object.assign([], this.lista);
  }
}
</script>

 