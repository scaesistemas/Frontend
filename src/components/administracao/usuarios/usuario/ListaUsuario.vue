<template>
  <v-card elevation="1">
    <v-card-text>
      <v-card-title>
        <v-spacer/> 
       

         <template>
          <div class="text-center">
            <v-bottom-sheet v-model="sheet">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="primary" class="mb-2" dark>  
                  <v-icon>mdi-filter-outline</v-icon>
                </v-btn>
              </template> 
  
              <v-sheet class="text-center" height="auto">
                <v-toolbar dense flat>
                  <v-icon>mdi-filter</v-icon>
                  <v-toolbar-title class="pl-3">Filtros</v-toolbar-title>
                </v-toolbar>

                  <v-card-text>
                    <v-row>  
                      <v-col cols="12" md="6">
                        <v-autocomplete placeholder="Selecione" clearable :items="usuarios" v-model="filter.id" item-text="login" item-value="id" label="Login"  dense outlined />
                      </v-col>   <v-spacer/>           

                      <div class="pt-6 px-3">
                        <v-btn color="primary" @click="Consultar()">Consultar</v-btn>
                      </div>
                    </v-row>
                  </v-card-text>
                </v-sheet>
              </v-bottom-sheet>
            </div>
          </template>

        <v-tooltip bottom> 
          <template v-slot:activator="{ on }">
            <v-btn
              icon 
              small
              color="primary"
              class="mb-2"
              v-on="on"
              @click="Novo()"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Cadastrar Novo</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="primary"
              class="mb-2 mr-2"
              @click="ResetFiltro(),Atualizar()"
              v-on="on"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Atualizar</span> 
        </v-tooltip>
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
          class="elevation-0"
        >
          <template v-slot:[`item.actions`] = "{item}">
            <v-menu offset-y transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn dense outlined v-bind="attrs" v-on="on" tile color="primary">
                  <v-icon left>mdi-menu-down</v-icon> Ações
                </v-btn>
              </template>
    
              <v-list>
                <v-list-item @click="Editar(item)" :disabled="item.id === 1 && !isUsuarioMaster">
                  <v-list-item-title>
                    <v-icon left :disabled="item.id === 1 && !isUsuarioMaster">mdi-pencil</v-icon> Editar
                  </v-list-item-title>
                </v-list-item>
                          
                <v-divider/>
                <v-list-item @click="Excluir(item)" :disabled="item.id === 1 && !isUsuarioMaster">
                  <v-list-item-title>
                    <v-icon left :disabled="item.id === 1 && !isUsuarioMaster">mdi-delete</v-icon> Excluir
                  </v-list-item-title>
                </v-list-item>  

                <v-divider/>
                <v-list-item @click="ResetarSenha(item)" :disabled="item.id === 1 && !isUsuarioMaster">
                  <v-list-item-title>
                    <v-icon left :disabled="item.id === 1 && !isUsuarioMaster">mdi-account-key</v-icon> Resetar senha
                  </v-list-item-title>
                </v-list-item>        
              </v-list>
            </v-menu> 
          </template>

          <template v-slot:[`item.complementar.nome`] = "{item}">
            {{item.login}}
          </template>

          <template v-slot:[`item.complementar.celular`] = "{item}">
            {{item.complementar.celular}}
          </template>

          <template v-slot:[`item.complementar.email`] = "{item}">
            {{item.complementar.email}}
          </template>  
        </v-data-table>
      </v-card-text>

    <v-row justify="center">
      <cadastro-usuario
        v-model="dialogCadastro"
        :item="item"
        @fechou="dialogCadastro = false, Atualizar()"
        @salvou="Atualizar()"
      ></cadastro-usuario>
    </v-row>  
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Usuario } from "@/core/models/cadastros";
import { UsuarioService } from "@/core/services/cadastros";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class Historico extends Vue {
  item = new Usuario();
  service = new UsuarioService();

  tabActive = 0;
  
  get isUsuarioMaster() {
    try {
      const dados =  JSON.parse(localStorage.sessionApp.split(".")).dados;
       return dados.login == 'master' && dados.permissoes.includes(0);
    } catch {
      return false;
    }
  }
  search ='';
  lista =[];
  sheet:boolean = false;
  loading: boolean = false;
  dialogCadastro: boolean = false;
  dialog = false
  totalLista: number = 0;

  localBuscaRapida: string = "";
  titulo: string = 'Usuarios';
  subTitulo: string = 'Lista dos cadastros de usuários para uso no sistema';
  temBuscaRapida: boolean = true;
  icone: string = 'mdi-cash';  

  options: any = {
    itemsPerPage: 15 
  };

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Login", value: "login" },
    { text: "Celular", value: "complementar.celular" },
    { text: "Email", value: "complementar.email" }
  ];
  
  @Watch("options", { deep: true })
  Atualizar() {
    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;
    this.loading = true;

    this.service.Listar(page,itemsPerPage,sortBy,sortDesc,search, columns, this.filter, 'Complementar/Celular,Complementar/Email', 'Id, Login, Complementar', '').then(
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

  filter : {
    id: number ,
  } = {
    id:0 , 
  }

  
  breadCrumbLinks: any[] = [
    { text: 'Home', href: '/financeiro/painel/kpi',},
    { text: 'Lista de Usuario', disabled: true, href: '/financeiro/painel/despesas'}
  ]

  Consultar(){
    this.options.page = 1;
    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;
    this.loading = true

    //expands=> Complementar/celular,nome
    this.service.Listar(page,itemsPerPage,sortBy,sortDesc,search,columns, this.filter, 'Complementar/Celular,Complementar/Email', 'Id, Login, Complementar', '').then(
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

  ResetFiltro(){
    this.filter = {id:0}
  }
 
  Novo() {
    this.item = new Usuario();
    this.item.assinanteId = JSON.parse(localStorage.sessionApp.split(".")).dados.assinanteId;
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
            this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
          }
        }); 
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading()
    }).then(result => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
        this.Atualizar();
      }
    });
  }
  
  ResetarSenha(item){
    this.$swal({
    title: "Atenção!",
    text: "Tem certeza que deseja resetar a senha do registro atual?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sim",
    cancelButtonText: "Não",
    showCloseButton: true,
    showLoaderOnConfirm: true,
    preConfirm: () => {
      return this.service.ResetarSenha(item.id).then(
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
            this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
          }
       }); 
    },
    // @ts-ignore: Unreachable code error
    allowOutsideClick: () => !this.$swal.isLoading()
    }).then(result => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
        this.Atualizar();
      }
    });
  }

  Editar(item){
    this.service.ObterPorId(item.id).then(
        res =>{
            this.item = res.data;
            this.dialogCadastro = true
        }
    )
  }

  usuarios = [];

  mounted(){ 
    new UsuarioService().Listar(-1, -1, ['login'],[],'',[], '', '' , 'Id, Login', '').then(
      res => {
        this.usuarios = res.data.items;
      }
    )
  }
}
</script>

 