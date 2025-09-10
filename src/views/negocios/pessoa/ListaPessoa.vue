<template>
  <master-page class="mb-5"
    titulo="Pessoas"
    subTitulo="Lista dos cadastros de pessoas para uso no sistema."
  >
    <v-row>
     <v-col cols="12">
        <v-breadcrumbs :items="breadCrumbLinks" divider="/"></v-breadcrumbs>
      </v-col>
    </v-row>

    <h3>Pessoas</h3>
    <br>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <template> 
          <div class="text-center">
            <v-bottom-sheet v-model="sheet">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on"  icon color="primary" class="mb-2" dark>  
                  <v-icon>mdi-filter-outline</v-icon>
                </v-btn>
              </template>
  
              <v-sheet class="text-center" height="auto">
                <v-toolbar dense flat>
                  <v-icon>mdi-filter</v-icon>
                  <v-toolbar-title class="pl-3">Filtros</v-toolbar-title>
                </v-toolbar>
 
                  <v-card-text>
                    <v-row dense> 
                      <v-col cols="12" md="6">
                        <v-autocomplete clearable :items="pessoas" v-model="filter.id"  item-text="nome" item-value="id" label="Nome"  dense outlined ></v-autocomplete>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-autocomplete clearable :items="pessoas" v-model="filter.cnpjCpf"  item-text="cnpjCpf" item-value="cnpjCpf" label="CPF/CNPJ"  dense outlined ></v-autocomplete>
                      </v-col>

                       <v-col cols="12" md="3">
                        <v-select multiple v-model="filter.selectedOptions" :items="filterOptions" item-text="label" item-value="value" label="Selecione opções" clearable outlined dense></v-select>
                      </v-col>
                   
                      <v-col cols="12" md="5">
                        <v-autocomplete clearable :items="pessoas" v-model="filter.rg"  item-text="rg" label="RG" dense outlined></v-autocomplete>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field label="Data nascimento" clearable v-model="filter.dataNascimento" type="date" dense outlined></v-text-field>
                      </v-col> 
                      <v-spacer/>

                      <v-col cols="12" md="3">
                        <v-autocomplete clearable :items="pessoas" v-model="filter.email"  item-text="email" label="Email" dense outlined></v-autocomplete>
                      </v-col>

                      <v-col cols="12" md="1">
                        <v-btn block color="primary" @click="Consultar()">Consultar</v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-sheet>
              </v-bottom-sheet>
            </div>
          </template>

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
            <v-btn icon  small color="primary" class="mb-2" v-on="on" @click="Novo()">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Cadastrar Novo</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" class="mb-2 mr-2" @click="ResetFiltro(), Atualizar()" v-on="on"> 
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Atualizar</span> 
        </v-tooltip> 
      </v-card-title>

      <v-card-text> 
        <v-data-table
          id="tabela"
          :search="search"
          :headers="headers"
          :items="lista"
          sort-by="nome"
          :options.sync="options" 
          :footer-props="{ showFirstLastPage: true}"
          :server-items-length="totalLista"
          :loading="loading"
          class="elevation-0" 
        > 
          <template v-slot:[`item.actions`] = "{item}">
            <v-menu offset-y transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined v-bind="attrs" v-on="on" tile color="primary">
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
                <v-list-item @click="Excluir(item)">
                  <v-list-item-title>
                    <v-icon left>mdi-delete</v-icon> Excluir
                  </v-list-item-title>
                </v-list-item>

                <v-divider/>
                <v-list-item @click="ObterRelatorio(item)">
                  <v-list-item-title>
                    <v-icon left>mdi-file-document</v-icon> Relatório
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu> 
          </template>
        
          <template v-slot:[`item.nome`] = "{item}">
            {{ item.nome }}
          </template>

          <template v-slot:[`item.cnpjCpf`] = "{item}">
            {{ item.cnpjCpf ? item.cnpjCpf  : 'Não registrado' }} 
          </template>

          <template v-slot:[`item.email`] = "{item}">
            {{ item.email }} 
          </template>

          <template v-slot:[`item.telefone`] = "{item}">
            {{ item.telefone }} 
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
 
    <v-row justify="center">
      <cadastro-pessoa v-model="dialogCadastro" :item="item" @fechou="dialogCadastro = false, Atualizar()" @salvou="Atualizar()"></cadastro-pessoa>
    </v-row>
    
  </master-page>
</template> 

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Pessoa from "@/core/models/cadastros/Pessoa";
import { PessoaService } from "@/core/services/cadastros/PessoaService";
import { mixins } from 'vue-class-component';
import ListPage from '@/components/shared/ListPage';
import { TableToExcel } from "@/assets/scripts/helper";
 
@Component
export default class ListaCliente extends mixins(Vue, ListPage) {
  item = new Pessoa();
  filter = new Filtro();
  service = new PessoaService();
  pessoa = new Pessoa(); 
  pessoas = [];
  
  loading: boolean = false;
  dialogCadastro: boolean = false;
  totalLista: number = 0; 
  sheet:boolean = false;
  
  filterOptions = [
    { value: 'isCliente', label: 'Cliente' },
    { value: 'isProprietario', label: 'Proprietário' },
    { value: 'isFornecedor', label: 'Fornecedor' },
    { value: 'isCorretor', label: 'Corretor' },
    { value: 'isSeguradora', label: 'Seguradora' }
  ];

  ResetFiltro(){
    this.filter = {id:0, nome:'', cnpjCpf:'', rg:'', dataNascimento:'', email:'', selectedOptions:[]}
  }
 
  options: any = {
    itemsPerPage: 15
  };
   breadCrumbLinks: any[] = [
    { text: 'Home', href: '/financeiro/painel/kpi',},
    { text: 'Lista de Pessoas', disabled: true, href: '/financeiro/painel/despesas'}
  ]

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome" },
    { text: "CPF/CNPJ", value: "cnpjCpf" },
    { text: "E-mail", value: "email" },
    { text: "Telefone", value: "telefone" },
  ];
 
  @Watch("options", { deep: true })
  Atualizar() { 
    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;
    this.loading = true;
    
    this.service.Listar(page,itemsPerPage,sortBy,sortDesc,search, columns, this.filter, '', 'id, nome, cnpjCpf, email, telefone', '').then(
      res => {
        this.lista = res.data.items;
        this.totalLista = res.data.count;
      },
      err => {
        if (!err.response) {
          this.$swal("Aviso", "Não foi possível acessar a API", "error");
        } else {
          this.$swal("Aviso", err.response.data, "error");
        }
      }
    ).finally(() => (this.loading = false));
  }
  
  Consultar() {
    this.options.page = 1;

    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;
    this.loading = true
    this.service.Listar(page,itemsPerPage,sortBy,sortDesc,search, columns, this.filter, '', 'id, nome, cnpjCpf, email, telefone', '').then(
    
    (res) => {  
      this.lista = res.data.items
      this.totalLista = res.data.count;
      this.loading = false; 
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
    this.sheet = false;
  }
   
  Novo() {
    this.item = new Pessoa();
    this.dialogCadastro = true;
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
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.service.Excluir(item.id).then(
          res => {
            if (res.status == 200) {
              return res;
            }
          },
        (err) => {
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status == 403) {
            this.$swal("Aviso", err.response.data.message, "warning" );
          } else {
            this.$swal("Aviso",  err.response.data, err.response.status == 500 ? "warning" : "error");
          }
        }); 
      }, 
      // @ts-ignore: Unreachable code error 
      allowOutsideClick: () => !this.$swal.isLoading()
    }).then((result:any) => {
      if (result.value.status == 200) {
        this.$swal("Aviso",result.value.data, "success");
        this.Atualizar();
      }else{
         this.$swal("Aviso","Não é possível excluir esse registro, essa pessoa tem vínculo no sistema.", "error");
      }
    }); 
  }  
 
  Editar(item){
    this.service.ObterPorId(item.id, 'Documentos, Contatos, Familiares, EmpreendimentosPessoas').then(
      res => { 
        this.item = new Pessoa(res.data);
        
         this.item.dataExpedicao =  new Date(res.data.dataExpedicao).yyyymmdd();
         this.item.dataNascimento = new Date(res.data.dataNascimento).yyyymmdd();
         this.item.conjuge.dataNascimento = new Date(res.data.conjuge.dataNascimento).yyyymmdd();
         this.item.juridicaResponsavel.dataExpedicao = new Date(res.data.juridicaResponsavel.dataExpedicao).yyyymmdd();
         this.item.juridicaResponsavel.dataNascimento = new Date(res.data.juridicaResponsavel.dataNascimento).yyyymmdd();
        
        if (Array.isArray(this.item.familiares)) {
          const sortedFamiliares = [...this.item.familiares].sort((a, b) => a.id - b.id);
          this.item.familiares = sortedFamiliares;
        }
        this.dialogCadastro = true;
    },
     (err) => {
        if (!err.response) {
          this.$swal("Aviso", "Não foi possível acessar a API", "error");
        } else if (err.response.status == 403) {
          this.$swal("Aviso", err.response.data.message, "warning" );
        } else {
          this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
        }
      }
    ); 
  } 

  ObterRelatorio(item){
     let routeLink = this.$router.resolve({name: 'relPessoa',
      query:{
        pessoaId: item.id ? item.id.toString() : '',
       }
    });

    window.open(routeLink.href, '_blank');
  }

  ExportarExcel(tabela: any, worksheet?: string) {
    TableToExcel(tabela, worksheet);
  }

  mounted(){
    new PessoaService().Listar(-1, -1, ['nome'],[],'',[], '', '' , 'id, Nome, CnpjCpf,Rg, Email', '').then(
      res => {
        this.pessoas = res.data.items;
      }
    )
  } 
}

class Filtro {
  public id:number = 0;
  public nome:string = '';
  public cnpjCpf: string ='';
  public rg: string ='';
  public dataNascimento:string = '';
  public email:string = '';
  selectedOptions = [];
}
</script>
 