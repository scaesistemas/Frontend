<template>
 <v-card> 

  <!-- <v-row>
     <v-col cols="12">
        <v-breadcrumbs :items="breadCrumbLinks" divider="/"></v-breadcrumbs>
      </v-col>
    </v-row> -->

    <!-- <h3>Centro de Custo</h3>
    <br>  -->

   <v-card flat>
      <v-card-title>
        <v-icon large left></v-icon>
        <span class="title font-weight-light"></span>

       <v-spacer/>
        <template>
          <div class="text-center">
            <v-bottom-sheet v-model="sheet">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on"   icon color="primary" class="mb-2" dark>  
                  <v-icon @click="ResetFiltro()">mdi-filter-outline</v-icon>
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
                        <v-autocomplete clearable v-model="filter.id" :items="lista"  item-text="codigoDescricao" item-value="id" label="Nome"  dense outlined />
                      </v-col><v-spacer/>

                      <div  class="pa-6" >
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
            <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="addItem(item)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Novo {{titulo}}</span>
        </v-tooltip>
  
         <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="ResetFiltro(),listar()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Atualizar</span>
        </v-tooltip>

        <slot name="botoes" />
      </v-card-title>

      <v-card-text>
        <template>
         <v-progress-linear v-if="loading" :indeterminate="loading" color="primary"></v-progress-linear>
        </template> 
        
        <v-treeview activatable item-key="name"  open-all  hoverable  item-text="codigoDescricao" :active.sync="active" :open.sync="open" :items="tree" :search="localBuscaRapida">
          <template slot="label" slot-scope="{ item }">
            <v-layout   >
              <v-icon small @click="Editar(item)"  :class="{'red--text': !item.ativo}">mdi-pencil</v-icon>
              <v-icon small @click="Excluir(item)" :class="{'red--text': !item.ativo}">mdi-delete</v-icon>
              <v-icon small @click="addItem(item)" :class="{'red--text': !item.ativo}">mdi-plus</v-icon>
              <span :class="{ 'red--text': !item.ativo }">{{ item.codigoDescricao }}</span>
            </v-layout> 

            <!-- <v-layout v-else>
              <v-icon>mdi-home-circle</v-icon>
              <span>{{ item.codigoDescricao }}</span>
            </v-layout> -->
        </template>
      </v-treeview>
    </v-card-text>
   </v-card> 
     
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn dark text @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <v-toolbar-title>Cadastro de Centro de Custo</v-toolbar-title>
          <v-spacer/>

          <v-toolbar-items>
            <v-btn dark text @click="save()" :disabled="!valid">Salvar</v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card elevation="1">
          <v-card-text>
            <v-card-title>
              <v-icon large left color="primary">mdi-information</v-icon>
              <span class="title-span">Informação do Centro de Custo</span>
            </v-card-title>

            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row dense class="pt-3 px-3">  
                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Origem</span>
                  <v-text-field dense outlined v-model="nomePai" disabled/>
                </v-col> 

                <v-col cols="12" md="2" class="pt-4">
                  <v-switch color="primary" v-model="editedItem.ativo" label="Ativo" value input-value="Sim"/>
                </v-col>

                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Nome*</span>
                  <v-text-field outlined dense v-model="editedItem.nome" :rules="fieldRules" :counter="60" maxlength="60"/>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-card>
    </v-dialog>
    </v-card>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { CentroCusto } from '@/core/models/financeiro';
import { CentroCustoService } from '@/core/services/financeiro';

@Component
export default class ListaCentroCusto extends Vue {
  item = new CentroCusto();
  service = new CentroCustoService();
  loading: boolean = false;
  dialogCadastro: boolean = false;
  sheet:boolean = false;

  breadCrumbLinks: any[] = [
    { text: 'Home', href: '/financeiro/painel/kpi',},
    { text: 'Arvore de Centro de Custo', disabled: true, href: '/financeiro/painel/despesas'}
  ]

initiallyOpen= ['RAIZ'];

  filter : {
    id: number,
  } = {
    id:0 ,
  }

  Consultar(){
    if(this.filter.id > 0){

    this.options.page = 1;
    
    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;
    this.loading = true
    this.service.ListarComFiltro(page,itemsPerPage,sortBy,sortDesc,search,columns,this.filter, '').then(
    
    (res) => { 
      //let treeAux:any = [];
      //treeAux[0].children = res.data.items;
      this.tree = res.data.items;  
 

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
    }else{
      this.listar();
    }
    this.sheet = false;
  }

  ResetFiltro(){
    this.filter = {id:0}
  }

  editedItem:any = new CentroCusto();
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  dialog: boolean = false;
  valid: boolean = true;
  search: string = "";
  nomePai: string = "";
  editedIndex: number = -1;

  public localBuscaRapida: string = "";
  public titulo: string = 'Centro custo';
  public subTitulo: string = 'Centro custo cadastrados no Sistema';
  public temBuscaRapida: boolean = true;
  public icone: string = 'mdi-cash';

  totalLista: number = 0;
  lista: any[] = [];

  tree: any[] = [];
  open: any[0] = [];
  active: any[] = [];

  $refs!: {
    form: HTMLFormElement
  }

  @Watch('item') 
  Item(){
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }


  options: any = { itemsPerPage: -1};

  close() {
    this.dialog = false;
  }
  
  pai: string = "";

  addItem(item: CentroCusto) {
      let pai = Object.assign({}, this.lista.find(x => x.id === this.active[0]),item);
      this.editedItem = new CentroCusto();
      this.editedIndex = -1
      this.editedItem.codigo ='';
      this.editedItem.centroCustoPaiId = pai.id === -1 ? null : pai.id;
      this.editedItem.ativo = true;
      this.nomePai = pai.codigoDescricao;
      this.dialog = true;
  }

  listar(){ 
    this.loading = true;
    this.service.TreeView()
        .then(
            res => {
             /// let treeAux = [{ id: -1,codigoDescricao: 'RAIZ',children: []}];
              //treeAux[0].children = res.data;
              this.tree = res.data;         
              this.loading = false;
            },
            err => this.$swal('Aviso', err.response.data, 'error')
        );
       /* this.service.ListarTudo()
          .then( 
            res => {
                let aux = {
                    id: -1,
                    codigoDescricao: 'RAIZ',
                };
                this.lista = res.data.items;
                this.lista.unshift(aux);
            },
          (err) => {
            if (!err.response) {
              this.$swal("Aviso", "Não foi possível acessar a API", "error");
            } else if (err.response.status == 403) {
              this.$swal("Aviso", err.response.data.message, "warning" );
            } else {
              this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
            }
          }); */
    }
 
  Excluir(item: CentroCusto) {
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
          (res) => {
            if (res.status == 200) {
              return res;
            }
          },
          (err) => this.$swal("Aviso", err.response.data, "error")
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result:any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
         this.listar();
      }
    });
  }
  
  Editar(item:CentroCusto) {   
    this.editedIndex = 1;
    let pai = this.lista.find(x => x.id === item.centroCustoPaiId);
    this.editedItem = item
    this.nomePai = pai ? pai.codigoDescricao : 'RAIZ';
    this.dialog = true;
  }

  save() {
    if(this.$refs.form.validate()){
      
      let modelo = this.editedItem;
      
      if(modelo.centroCustoPaiId == 0){
        modelo.centroCustoPaiId = null;
      }
      
     this.service.Salvar(modelo)
      .then(
          res => {
            this.$swal('Aviso', 'Operação realizada com sucesso!', res.status == 201 || res.status == 200 ? 'success' : 'warning');
              if (res.status == 201 || res.status == 200){
                  this.listar();
              }
            }, 
            (err) => {
              if (!err.response) {
                this.$swal("Aviso", "Não foi possível acessar a API", "error");
              } else {
                this.$swal("Aviso", err.response.data, err.response.status == 400 ? "warning" : "error");
              }
            }
        )
    this.close()
    }
  }
   
  mounted(){
    this.listar();
  }
}
</script>

<style>
</style>