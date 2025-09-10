<template>
  <master-page :titulo="titulo" :subTitulo="subTitulo">

    <v-row>
     <v-col cols="12">
        <v-breadcrumbs :items="breadCrumbLinks" divider="/"></v-breadcrumbs>
      </v-col>
    </v-row>

    <h3>Empresas</h3>
    <br>


     <v-card> 
      <v-card-title>
        <v-spacer></v-spacer> 
         <!-- <v-text-field
          v-if="temBuscaRapida"
          v-model="search"
          label="Busca rápida"
          clearable
          single-linehide-details 
          @keyup="Atualizar()"  
        />     -->  
 
         <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="ExportarExcel('tabela')"> 
              <v-icon>mdi-file-excel-outline</v-icon>
            </v-btn>
          </template> 
          <span>Exportar Excel</span> 
        </v-tooltip> 

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
          id="tabela"
          :search="search"
          :headers="headers" 
          sort-by="nome"
          :items="lista" 
          :options.sync="options" 
          :footer-props="{ showFirstLastPage: true}"
          :server-items-length="totalLista"
          :loading="loading"
          class="elevation-0">

            <template v-slot:[`item.actions`] = "{item}">
              <v-menu offset-y transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn dense outlined v-bind="attrs" v-on="on" tile color="primary">
                    <v-icon left>mdi-menu-down</v-icon> Ações
                  </v-btn>
                </template>
      
                <v-list>
                    <v-list-item @click="Editar(item)">
                    <v-list-item-title>
                      <v-icon left>mdi-pencil</v-icon> Editar
                    </v-list-item-title>
                  </v-list-item>
                            
                  <v-divider/>
                  <v-list-item :disabled="item.id == 1" @click="Excluir(item)">
                    <v-list-item-title>
                      <v-icon :disabled="item.id == 1" left>mdi-delete</v-icon> Excluir
                    </v-list-item-title>
                  </v-list-item>         
                </v-list>
              </v-menu> 
            </template>

            <template v-slot:[`item.cpfCnpj`] = "{item}">
              {{item.cpfCnpj ? item.cpfCnpj.cpfCnpjRg() : 'Não registrado' }}
            </template>

            <template v-slot:[`item.nome`] = "{item}">
             {{item.nome}}
            </template>

            <template v-slot:[`item.telefone1`] = "{item}">
              {{item.telefone1}}
            </template>

            <template v-slot:[`item.email`] = "{item}">
              {{item.email}}
            </template>
          </v-data-table>
        </v-card-text> 
      </v-card>
 
     <v-row justify="center"> 
        <cadastro-empresa v-model="dialogCadastro" :item="item" @fechou="dialogCadastro = false, Atualizar()" @salvou="Atualizar()"> </cadastro-empresa>
     </v-row>
    
  </master-page>
</template> 

<script lang="ts">
import { Vue, Component, Watch, Ref } from 'vue-property-decorator';
import { EmpresaService } from '@/core/services/compras/EmpresaService';
import { Empresa } from '@/core/models/cadastros';
import { mixins } from 'vue-class-component';
import ListPage from '@/components/shared/ListPage';
import { TableToExcel } from '@/assets/scripts/helper';
 
@Component
export default class ListaEmpresa extends mixins(Vue,ListPage) {
  item = new Empresa();
  service = new EmpresaService();
 
  loading: boolean = false;
  dialogCadastro: boolean = false;
  totalLista: number = 0;
  
  titulo: string = 'Empresa';
  subTitulo: string = 'Lista das Empresas para o uso no sistema';
  temBuscaRapida: boolean = true;
 
  options: any = {
    itemsPerPage: 15
  }; 
   
  headers: any[] = [
    { text: '', value: 'actions', sortable: false },
    { text: 'Cnpj', value: 'cpfCnpj' },
    { text: 'Razão social', value: 'nome' },
    { text: 'Telefone', value: 'telefone1' },
    { text: 'Email', value: 'email' },
  ]; 

   breadCrumbLinks: any[] = [
    { text: 'Home', href: '/financeiro/painel/kpi',},
    { text: 'Lista de Empresas', disabled: true, href: '/financeiro/painel/despesas'}
  ]
  
  @Watch("options", { deep: true })
  Atualizar() {
    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;
    this.loading = true; 

    this.service.Listar(page,itemsPerPage,sortBy,sortDesc,search, columns, undefined, '', 'id, nome, telefone1,email,cpfCnpj', '').then(
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
    this.item = new Empresa();
    this.item.responsavel.dataNascimento = new Date().yyyymmdd();
    this.dialogCadastro = true;
  } 

  Editar(item){
    this.service.ObterPorId(item.id, "Documentos, ContratoSocialLtda, FotoDocumentoResponsavel, SelfieResponsavel, VersoDocumentoResponsavel").then(res => {    
      this.service.CarregarFoto(item.id).then(image => {
        this.item = res.data;
        this.item.responsavel.dataNascimento = new Date(res.data.responsavel.dataNascimento).yyyymmdd();
        this.item.logo = image.data;
        this.dialogCadastro = true;
      })
   })
  }

  ExportarExcel(tabela: any, worksheet?: string) {
    TableToExcel(tabela, worksheet);
  }
 
  mounted(){ 
    //this.Atualizar();
  }
}
</script>

 