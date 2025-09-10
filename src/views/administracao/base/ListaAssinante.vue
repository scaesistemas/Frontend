<template>
  <master-page  :titulo="titulo" :subTitulo="subTitulo">
     <v-card> 
      <v-card-title>
        <v-icon large left></v-icon>
        <span class="title font-weight-light"></span>
 
        <v-spacer></v-spacer> 
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="Novo()">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Novo {{titulo}}</span>
        </v-tooltip>
  
         <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="Atualizar()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Atualizar</span>
        </v-tooltip> 
 
        <slot name="botoes" />
      </v-card-title>

        <v-card-text>
          <v-data-table 
            :search="search"
            :headers="headers"
            :items="lista"
            :options.sync="options" 
            :footer-props="{ showFirstLastPage: true}"
            :server-items-length="totalLista"
            :loading="loading"
            class="elevation-0">
            
            <template v-slot:[`item.actions`] = "{item}">
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

            <template v-slot:[`item.nomeFantasia`] = "{item}">
              {{ item.nomeFantasia  }}
            </template>

            <template v-slot:[`item.cpfCnpj`] = "{item}">
              {{ item.cpfCnpj ? item.cpfCnpj.cpfCnpjRg() : 'Não registrado' }}
            </template>
            
            <template v-slot:[`item.email`] = "{item}">
              {{ item.email  }}
            </template>

            <template v-slot:[`item.telefone1`] = "{item}">
              {{ item.telefone1  }}
            </template>
           </v-data-table>
        </v-card-text> 
      </v-card>

     <v-row justify="center"> 
        <cadastro-assinante v-model="dialogCadastro" :item="item" @fechou="dialogCadastro = false, Atualizar()" @salvou="Atualizar()"> </cadastro-assinante>
     </v-row>

  </master-page>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Assinante } from '@/core/models/cadastros';
import { mixins } from 'vue-class-component';
import ListPage from '@/components/shared/ListPage';
import { AssinanteService } from '@/core/services/cadastros';

@Component
export default class ListaEmpresa extends mixins(Vue,ListPage) {

  item = new Assinante();
  service = new AssinanteService();

  loading: boolean = false;
  dialogCadastro: boolean = false;
  totalLista: number = 0;
  
  public localBuscaRapida: string = "";
  public titulo: string = 'Assinante';
  public subTitulo: string = 'Lista das Assinantes para o uso no sistema';
  public temBuscaRapida: boolean = true;
  public icone: string = 'mdi-cash';
  //lista: any[] = [];


  options: any = {
    itemsPerPage: 15
  };
    
  headers: any[] = [
    { text: '', value: 'actions', sortable: false },
    { text: 'Fantasia', value: 'nomeFantasia' },
    { text: 'CPF/CNPJ', value: 'cpfCnpj' },
    { text: 'Email', value: 'email' },
    { text: 'Telefone', value: 'telefone1' },
  ];
   
  @Watch("options", { deep: true }) 
  Atualizar() { 
    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;
    this.loading = true;

    this.service.Listar(page, itemsPerPage, sortBy, sortDesc, this.search, this.headers).then(
      res => {
        this.lista = res.data.items;
        this.totalLista = res.data.count;
      },
       (err) => {
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status == 403) {
            this.$swal("Aviso", err.response.data.message, "warning" );
          } else {
            this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
          }
        })
    .finally(() => (this.loading = false));
  }
 
  Novo(){
    this.item = new Assinante();
    this.dialogCadastro = true;
  }

  Editar(item: Assinante) {
  this.service.ObterPorId(item.id, 'Dominios, Contatos')
    .then(
      res => {
        this.item = res.data;
        this.dialogCadastro = true;
    });
  } 
  mounted(){
    this.Atualizar();
  }
}

</script>

<style>

</style>