<template>
<v-card>

  <!-- <v-row>
     <v-col cols="12">
        <v-breadcrumbs :items="breadCrumbLinks" divider="/"></v-breadcrumbs>
      </v-col>
    </v-row>

    <h3>Categoria</h3>
    <br> -->
   
     <v-card flat>
      <v-card-title> 
        <v-icon large left></v-icon>
        <span class="title font-weight-light"></span>

        <v-spacer></v-spacer>

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
            <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="addItem()">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template> 
          <span>Novo {{titulo}}</span>
        </v-tooltip>
   
         <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" class="mb-2" dark v-on="on" @click="Listar()">
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

      <v-treeview hoverable dense :items="tree" item-text="codigoDescricao" activatable :active.sync="active" :open.sync="open"  :search="localBuscaRapida" >
        <template slot="label" slot-scope="{ item }" >
           <v-layout   >
              <v-icon small @click="Editar(item)"  :class="{'red--text': !item.ativo}">mdi-pencil</v-icon>
              <v-icon small @click="Excluir(item)" :class="{'red--text': !item.ativo}">mdi-delete</v-icon>
              <v-icon small @click="addItem(item)" :class="{'red--text': !item.ativo}">mdi-plus</v-icon>
              <span :class="{ 'red--text': !item.ativo }">{{ item.codigoDescricao }}</span>
            </v-layout> 

          <!-- <v-layout  >
              <v-icon small @click="Editar(item)" :class="{'orange--text': !item.ativo}">mdi-pencil</v-icon>
              <v-icon small @click="Excluir(item)" :class="{'orange--text': !item.ativo}" class="mr-2">mdi-delete</v-icon>
              <v-icon small @click="addItem(item)" :class="{'orange--text': !item.ativo}" class="mr-2">mdi-plus</v-icon>
              <span  :class="{ 'red--text': !item.ativo }">
              {{ item.codigoDescricao }}
              </span>
          </v-layout> -->

          <!-- <v-layout v-else>
              <v-icon >mdi-home-circle</v-icon>
              <span>{{ item.codigoDescricao }}</span>
          </v-layout> -->
        </template>
      </v-treeview>
      </v-card-text>
    </v-card>

        <v-dialog  
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition">

          <v-card>
             <v-toolbar dark color="primary">
              <v-btn icon dark @click="close()"><v-icon>mdi-close</v-icon></v-btn>
              <v-toolbar-title>Cadastro de Categoria</v-toolbar-title>
              <v-spacer/>

              <v-toolbar-items>
                <v-btn dark text @click="Salvar()" :disabled="!valid">Salvar</v-btn>
              </v-toolbar-items>
            </v-toolbar>  

            <v-card elevation="1">
              <v-card-text>
                <v-card-title>
                  <v-icon large left color="primary">mdi-information</v-icon>
                  <span class="title-span">Informação da Categoria</span>
                </v-card-title>

                <v-form ref="form" v-model="valid" lazy-validation >
                  <v-row dense class="pt-3 px-3">  
                    <v-col cols="12" md="6">
                      <span class="font-weight-bold">Origem</span>
                      <v-text-field dense outlined v-model="nomePai" value="nome"  disabled=""/>
                    </v-col>
                    
                    <v-col cols="12" md="2" class="pt-4">
                      <v-switch color="primary" v-model="item.ativo" label="Ativo" value input-value="Sim"/>
                    </v-col>
                  </v-row>

                  <v-row dense class="px-3">  
                    <v-col cols="12" md="6">
                      <span class="font-weight-bold">Nome*</span>
                      <v-text-field dense outlined v-model="item.nome" :rules="fieldRules" :counter="60" maxlength="60"/>
                    </v-col>

                    <v-col cols="12" md="6">
                      <span class="font-weight-bold">Tipo</span>
                      <v-select dense outlined v-model="item.tipo"  :rules="fieldRules" :items="tipos" item-value="id" item-text="name" :menu-props="{ offsetY: true, offsetOverflow: true }"/>    
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
import { Vue, Component, Watch } from 'vue-property-decorator';
import { ContaGerencialService} from '@/core/services/financeiro';
import { ContaGerencial} from '@/core/models/financeiro';

@Component
export default class ListaContaGerencial extends Vue {

    public service = new ContaGerencialService();
    public item = new ContaGerencial();

    public localBuscaRapida: string = "";
    public titulo: string = 'Categoria';
    public subTitulo: string = 'Categoria cadastrados no Sistema';
    public temBuscaRapida: boolean = true;
    public icone: string = 'mdi-cash';
    public pai:string='';

    loading: boolean = false;
    dialogCadastro: boolean = false;

    dialog:boolean =  false;
    valid: boolean =  true;
    search: string = '';
    nomePai:string = '';
    editedIndex: number = -1;
    contaGerencialPaiId:string='';

    tree:any[] = [];
    open: any[0] = [];
    active:any[] = [];
    lista:any[] = [];
    options: any = {
    itemsPerPage: -1
    };

    breadCrumbLinks: any[] = [
    { text: 'Home', href: '/financeiro/painel/kpi',},
    { text: 'Arvore de Categoria', disabled: true, href: '/financeiro/painel/despesas'}
  ]

  filter : {
    id: number,
  } = {
    id:0 ,
  }
   sheet:boolean = false;

   Consultar(){
    if(this.filter.id > 0){

    this.options.page = 1;
    
    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;
    this.loading = true
    this.service.ListarComFiltro(page,itemsPerPage,sortBy,sortDesc,search,columns,this.filter, '').then(
    
    (res) => { 
     // let treeAux = [{ id: -1, codigoDescricao: 'RAIZ',children: []}];
     // treeAux[0].children = res.data.items;
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
      this.Listar();
    }
    this.sheet = false;
  }

  ResetFiltro(){
    this.filter = {id:0}
  }


  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  $refs!: {
    form: HTMLFormElement
  }

  @Watch('item') 
  Item(){
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

    headers: any[] = [
        { text: '', value: 'actions', sortable: false },
        { text: 'Código', value: 'id' },
        { text: 'Nome', value: 'nome' }
    ];
 
    tipos:any[]= [
        { id: 'R', name: 'Receita'},
        { id: 'D', name: 'Despesa'}
    ]

    totalLista: number = 0;
 

    abrirDialog(item = new ContaGerencial){       
        this.item = new ContaGerencial;
        this.dialog = true;
    }
    

    Salvar() {
       if (this.$refs.form.validate()) {
        let modelo = this.item;
        this.service.Salvar(modelo)
            .then(
                res => {
                    this.$swal('Aviso', 'Operação realizada com sucesso!', res.status == 201 || res.status == 200 ? 'success' : 'warning');
                    this.$emit('salvou');
                     if (res.status == 201 || res.status == 200){
                          this.Listar();
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
                
        this.close();
      }
    }

    close(){
        this.dialog = false;
    }

    addItem(item: ContaGerencial) {
        let pai = Object.assign({}, this.lista.find(x => x.id === this.contaGerencialPaiId[0]), item );

        this.item = new ContaGerencial();
        this.editedIndex = -1
        this.item.codigo = ''; 
        this.item.contaGerencialPaiId = pai.id === -1 ? null : pai.id;
        this.item.ativo= true;
        this.nomePai = pai.codigoDescricao;
        this.dialog = true;
    }
                
    items: ContaGerencial[] = [];
    total = 0;

    Listar(){
        this.loading = true;

      this.service.TreeView().then(
          res => { 
           // let treeAux = [{ id: -1, codigoDescricao: 'RAIZ', children: []}];
         // treeAux[0].children = res.data;
          //this.tree = treeAux;

           this.tree = res.data; 
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
        
        this.service.ListarTudo().then(
          res => { let aux = //{ id: -1, codigoDescricao: 'RAIZ' };
              this.lista = res.data.items;
             // this.lista.unshift(aux);
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
        }
        
    Excluir(item: ContaGerencial){
        this.$swal({
        title: 'Atenção!',
        text: 'Tem certeza que deseja excluir o registro atual?',
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        showCloseButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.service.Excluir(item.id)
            .then(res => {
                if (res.status == 200){
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
        })
        .then((result) => {
            if(result.value) {
                this.$swal('Aviso', result.value.data, result.value.status == 200 ? 'success' : 'warning');
                this.Listar();
            }
        })
    } 
    
    Editar(item = new ContaGerencial){
      this.editedIndex = 1;
      let pai = this.lista.find(x => x.id == item.contaGerencialPaiId);
      this.item = new ContaGerencial();
      this.nomePai = pai ? pai.codigoDescricao : 'RAIZ';
      this.item = item;
      this.dialog = true;
    }

    mounted() {
      this.Listar();
    }
}

</script>

 