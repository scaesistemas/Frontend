<template>
  <v-card elevation="1">
    <v-card-text>
      <v-card-title>
        <span class="title-span">Contato</span>               
      </v-card-title>   

        <v-form v-model="valid" lazy-validation ref="formContato">
          <v-row class="pa-3" dense>
            <v-col cols="12" md="6">
              <span class="font-weight-bold">Nome</span>
              <v-text-field outlined v-model="contatoPessoa.nome" :counter="60" maxlength="60" dense/>
            </v-col>

            <v-col cols="12" md="6">
              <span class="font-weight-bold">Email</span>
              <v-text-field outlined v-model="contatoPessoa.email" :counter="120" maxlength="120" dense/>
            </v-col>

            <v-col cols="12" md="3">
              <span class="font-weight-bold">Telefone</span>
              <v-text-field outlined v-model="contatoPessoa.telefone" v-mask="'(##) ####-####'" dense/>
            </v-col>

            <v-col cols="12" md="3">
              <span class="font-weight-bold">Celular</span>
              <v-text-field outlined v-model="contatoPessoa.celular" v-mask="'(##) #####-####'" dense/>
            </v-col>

            <v-col cols="12" md="3">
              <span class="font-weight-bold">Ramal</span>
              <v-text-field outlined v-model="contatoPessoa.ramal" :counter="10" maxlength="10" dense/>
            </v-col>

            <v-col cols="12" md="3" class="pt-7">
              <v-btn color="primary" @click="AdicionarContato()">
                  <v-icon>mdi-plus</v-icon>
                  Adicionar
              </v-btn> 
            </v-col>
          </v-row>
        </v-form>

        <v-row dense class="px-3">
            <v-col cols="12" md="12">
                <v-data-table
                  class="elevation-1"
                  :headers="headers"
                  :items="listaObservacoes"
                  :items-per-page="5"
                  item-key="item.id">
                    
                    <template v-slot:[`item.actions`] = "{item}">
                        <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-icon small @click="Editar(item)" v-on="on">
                                    mdi-pencil</v-icon>
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

                    <template v-slot:[`item.nome`] = "{item}">
                        {{item.nome}}
                    </template>

                    <template v-slot:[`item.celular`] = "{item}">
                        {{item.celular}}
                    </template>

                    <template v-slot:[`item.telefone`] = "{item}">
                        {{item.telefone}}
                    </template>

                    <template v-slot:[`item.ramal`] = "{item}"> 
                        {{item.ramal}}
                    </template>

                    <template v-slot:[`item.email`] = "{item}">
                        {{item.email}}
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
     </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Contato } from "@/core/models/geral";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class Historico extends Vue {
  @Prop() lista?: any[];

  contatoPessoa = new Contato();
  valid = true;

  listaObservacoes:any = [];
  contatoIndex: number = -1;

  $refs!: {
    formContato: HTMLFormElement;
  };

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome" },
    { text: "Telefone", value: "telefone" },
    { text: "Celular", value: "celular" },
    { text: "Ramal", value: "ramal" },
    { text: "Email", value: "email" },
  ];

  @Watch("contatoPessoa")
  ContatoPessoa() {
    if (this.$refs.formContato) {
      this.$refs.formContato.resetValidation();
    }
  }

   AdicionarContato() {
    if (this.contatoIndex > -1) {
      Object.assign(this.listaObservacoes[this.contatoIndex], this.contatoPessoa)
    }else{
      this.listaObservacoes.push(this.contatoPessoa);
      this.AtualizarLista(this.listaObservacoes);
    }
    this.contatoPessoa = new Contato();
    this.contatoIndex = -1;
  } 
 
  Editar(item) {
    this.contatoIndex = this.listaObservacoes.indexOf(item);
    this.contatoPessoa = Object.assign({}, item);
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
    }).then((result) => {
      if (result.value) {
        const index = this.listaObservacoes.indexOf(item);
        this.listaObservacoes.splice(index, 1);
        this.$swal("Aviso", "Contato excluído com sucesso!", "success");
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
    this.listaObservacoes = Object.assign([], this.lista);
  }
}
</script>

 