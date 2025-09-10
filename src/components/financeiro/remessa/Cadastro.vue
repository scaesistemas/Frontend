<template>
  <v-dialog persistent v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" no-click-animation>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>Remessa Bancária</v-toolbar-title>
        <v-spacer/>

        <v-toolbar-items>
          <v-btn dark text @click="Processar()" :disabled="!valid" v-if="item.id > 0">Processar</v-btn>
          <v-btn dark text @click="Salvar()" :disabled="!valid || item.id > 0">Salvar</v-btn>
          <v-btn dark text @click="SalvarProcessar()" :disabled="!valid || item.id > 0">Salvar e Processar</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card elevation="1"> 
        <v-card-text> 
          <v-card-title> 
            <v-icon large left color="primary">mdi-information</v-icon>
            <span class="title-span">Informação Remessa Bancária</span>
          </v-card-title> 

          <v-form ref="form" v-model="valid" lazy-validation> 
            <v-row dense class="pt-3 px-3">
              <v-col cols="12" md="4">
                <v-text-field v-model="item.nome" label="Nome" outlined dense :rules="fieldRules"></v-text-field>
              </v-col>
          
              <v-col cols="12" md="3">
                <v-select v-model="item.tipoId" label="Tipo Remessa" :items="tiposRemessa" item-value="id" item-text="nome" outlined dense :rules="fieldRules"></v-select>
              </v-col>
  
              <v-col cols="12" md="3">
                <v-select v-model="item.tipoCnab" label="Cnab" :items="listaCnab" item-value="id" item-text="nome" outlined dense></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-data-table class="px-3" v-if="item.transacoes.length > 0 && item.id > 0" :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50, -1], showFirstLastPage: true}" :headers="headers" sort-by="dataVencimentoParcela" :items="item.transacoes">
          <template v-slot:top>
            <v-card flat>
              <v-card-title> 
                <v-icon color="primary" large>mdi-bank-transfer</v-icon> Transações 
              </v-card-title>
              
              <v-divider></v-divider>  
            </v-card>
          </template>
          
          <template v-slot:[`item.parcela.parcela`] = "{item}">
            {{ item.parcela.parcela }}
          </template>

          <template v-slot:[`item.vencimento`] = "{item}">
            {{ new Date(item.vencimento).ddmmyyyy()  }}
          </template>

          <template v-slot:[`item.valor`] = "{item}">
            {{ Number(item.valor).toMoeda(true) }}
          </template>

          <template v-slot:[`item.parcela.saldo`] = "{item}">
            {{ Number(item.parcela.saldo).toMoeda(true) }}
          </template>

          <template v-slot:[`item.parcela.valorPago`] = "{item}">
            {{ Number(item.parcela.valorPago).toMoeda(true) }}
          </template>

          <template v-slot:[`item.situacao.nome`] = "{item}">
            {{ item.situacao.nome }}
          </template>

          <template v-slot:[`item.desconto`] = "{item}">
            {{ Number(item.desconto).toMoeda(true) }}
          </template>

          <template v-slot:[`item.juros`] = "{item}">
            {{ Number(item.juros).toMoeda(true) }}
          </template>

          <template v-slot:[`item.multa`] = "{item}">
            {{ Number(item.multa).toMoeda(true) }}
          </template>
        </v-data-table>               
         
        <v-data-table v-else v-model="selectParcelas" show-select :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50, -1], showFirstLastPage: true}" :headers="headers" sort-by="dataVencimentoParcela" :items="lista" :options.sync="options" :server-items-length="totalLista" :loading="loading" class="elevation-1" dense>
          <template v-slot:top>
            <v-card flat>
              <v-card-title>
                <v-icon color="primary">mdi-filter</v-icon> 
                 Filtros
              </v-card-title>
              
            <v-divider></v-divider>

              <v-card-text>
                <p>Para prosseguir, é obrigatório informar nos filtros:</p>

                <v-row dense class="px-3 pt-3">
                  <v-col cols="12" md="6"> 
                    <v-select v-model="contaCorrente" label="Conta Corrente" :items="listaContasCorrente" return-object item-value="id" item-text="nome" outlined dense></v-select>
                  </v-col>
                </v-row>

                <v-row dense class="px-3">
                  <v-col cols="12" md="3">
                    <v-text-field v-model="filter.dataVencimentoInicial" type="date" dense outlined label="Vencimento Inicial"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="1" class="text-center">
                    <p class="pt-3">Até</p>
                  </v-col> 

                  <v-col cols="12" md="3">
                    <v-text-field v-model="filter.dataVencimentoFinal" type="date" dense outlined label="Vencimento Final"></v-text-field>
                  </v-col> 
                
                  <v-col cols="12" md="2">
                    <v-btn color="primary" @click="Consultar()"> <v-icon left>mdi-magnify</v-icon>Consultar</v-btn>
                  </v-col>
                </v-row> 
              </v-card-text>
            </v-card>
          </template>

          <template v-slot:[`item.parcela.parcela`] = "{item}">
            {{ item.parcela.parcela }}
          </template>

          <template v-slot:[`item.vencimento`] = "{item}">
            {{ new Date(item.vencimento).ddmmyyyy()  }}
          </template>

           <template v-slot:[`item.valor`] = "{item}">
            {{ Number(item.valor).toMoeda(true) }}
          </template>

          <template v-slot:[`item.parcela.saldo`] = "{item}">
            {{ Number(item.parcela.saldo).toMoeda(true) }}
          </template>

          <template v-slot:[`item.parcela.valorPago`] = "{item}">
            {{ Number(item.parcela.valorPago).toMoeda(true) }}
          </template>

          <template v-slot:[`item.situacao.nome`] = "{item}">
            {{ item.situacao.nome }}
          </template>

          <template v-slot:[`item.desconto`] = "{item}">
            {{ Number(item.desconto).toMoeda(true) }}
          </template>

          <template v-slot:[`item.juros`] = "{item}">
            {{ Number(item.juros).toMoeda(true) }}
          </template>

          <template v-slot:[`item.multa`] = "{item}">
            {{ Number(item.multa).toMoeda(true) }}
          </template>
        </v-data-table>
      </v-card>

      <v-snackbar shaped :timeout="6000" v-model="errorAlert" color="primary" v-if="item.tipoCnab == null">
       Selecione um CNAB para processar a Remessa.
      </v-snackbar>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ContaCorrenteService, ReceitaService, RemessaService, TipoRemessaService} from "@/core/services/financeiro";
import { Remessa } from "@/core/models/financeiro";
import * as jsonpatch from 'fast-json-patch';

@Component
export default class CadastroRemessa extends Vue {
  @Prop() public item!: Remessa;
  @Prop() public value!: string;
  
  service = new RemessaService();
  receitaService = new ReceitaService();

  filter = new Model();
  totalLista:number = 0;
  contaCorrente:any = null;
  loading:boolean = false;
  valid:boolean = true;
  dialog:boolean = false;
  errorAlert:boolean = true;
 
  lista = [];
  selectParcelas:any = [];
  listaContasCorrente = [];
  tiposRemessa = [];
  listaCnab = [{id:0, nome:"CNAB240"}, {id:1, nome:"CNAB400"},{id:2, nome:"CNAB150"}]

  options: any = {
    itemsPerPage: 50,
  };

  @Watch('contaCorrente')
  ContaCorrente(codigo){
    if(codigo == null)
     return;

    this.filter.contaCorrenteId = this.contaCorrente.id;
    this.item.contaCorrenteId = this.contaCorrente.id;
    this.item.numeroSequencia = this.contaCorrente.remessaSequencia;
  }

  observer! : jsonpatch.Observer<Remessa>; 
  fieldRules: any[] = [(v: any) => (!!v) || "Campo obrigatório"];

  $refs!: {
    form: HTMLFormElement;
  };

  headers: any[] = [ 
    { text: "Parcela", value: "parcela.parcela"},
    { text: "Vencimento", value: "vencimento"},
    { text: "Valor", value: "valor"},
    { text: "Saldo", value: "parcela.saldo"},
    { text: "Valor Pago", value: "parcela.valorPago"},
    { text: "Situação", value: "situacao.nome"},
    { text: "Desconto", value: "desconto", sortable: false},
    { text: "Juros", value: "juros", sortable: false},
    { text: "Multa", value: "multa", sortable: false}
  ];  

  @Watch("item")
  Item() {
    if (this.$refs.form)
      this.$refs.form.resetValidation();
  } 

  @Watch("value") 
  Value() {
    this.dialog = this.value ? true : false; 

    if (this.dialog){
      this.observer = jsonpatch.observe(this.item);
    }else {
      jsonpatch.unobserve(this.item, this.observer);
    } 
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }
  } 

  Consultar(){
    if(!this.filter.dataVencimentoInicial || !this.filter.dataVencimentoFinal || !this.filter.contaCorrenteId){
      this.$swal({title: 'Aviso', html: `<div style="text-align: left;"> Para prosseguir, é obrigatório informar nos filtros: ${this.filter.dataVencimentoInicial == '' ? "<br> - Vencimento inicial" : ''} ${this.filter.dataVencimentoFinal == '' ? "<br> - Vencimento final" : ''}  ${this.filter.contaCorrenteId == 0 ? "<br> - Conta Corrente" : ''} </div>`, icon: "warning"}); 
      return;
    }

    if(this.item.tipoId == 2){
      this.filter.situacaoId = 2;
    }
    
    const { page, itemsPerPage, sortBy, sortDesc } = this.options;
    this.loading = true;    
    this.receitaService.ListarTransacoes(page, itemsPerPage, ['vencimento'], sortDesc, '', this.headers, this.filter, '' , '', 'Parcela.Baixas, Situacao').then(
      res => {
        this.lista = res.data.items
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

  Processar(){
    this.service.Processar(this.item, this.item.id).then(
      (res) => {
        this.$swal("Aviso", "Operação realizada com sucesso!", "success");
        this.$emit("salvou");
        this.Close();
        this.DownloadArquivo(res.data);
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
    )
  }
 
  SalvarProcessar(){
    this.$refs.form.validate(); 

      if(this.item.nome == "" || this.item.tipoId == 0 || this.item.contaCorrenteId == 0){
        this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
        return;
      }
  
      this.item.transacoes = this.selectParcelas
      let modelo = this.item;   
      this.service.SalvarProcessar(modelo).then(
        (res) => {
          this.$swal("Aviso", "Operação realizada com sucesso!", res.status == 201 || res.status == 200 ? "success" : "warning");
          this.$emit("salvou");
          this.Close();
          this.DownloadArquivo(res.data);
          this.AtualizarContaCorrente();
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
      )
  }

  Salvar() {
    this.$refs.form.validate();

      if(this.item.nome == "" || this.item.tipoId == 0 || this.item.contaCorrenteId == 0){
        this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
        return;
      }

      this.item.transacoes = this.selectParcelas;
      let pacthModel = jsonpatch.generate(this.observer);

      (this.item.id > 0 ? this.service.Patch(pacthModel, this.item.id) : this.service.Salvar(this.item)).then(
        (res) => {
        this.$swal("Aviso","Operação realizada com sucesso!",res.status == 201 || res.status == 200 ? "success" : "warning");
        this.$emit("salvou");
        this.Close(); 
        this.AtualizarContaCorrente();
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
    )
  }

  Close() {
    this.dialog = false;
    this.contaCorrente = null;
    this.filter = new Model();
    this.selectParcelas = [];
    this.lista = [];
  } 
 
  DownloadArquivo(arquivo){
    const link = document.createElement("a");
    link.href = `data:${arquivo.tipo};base64,${arquivo.dados}`;
    link.type = arquivo.tipo;
    link.download = arquivo.nome;
    link.click();
    link.remove();
  };

  AtualizarContaCorrente(){
    const contaCorrenteService = new ContaCorrenteService();
      contaCorrenteService.Listar(-1, -1, ['nome'],[],'',[], '', '' , '', 'Banco').then(
        (res) => {
          this.listaContasCorrente = res.data.items;
        } 
      )
  }

  mounted(){
    this.AtualizarContaCorrente();

    const tiposRemessa = new TipoRemessaService();
      tiposRemessa.ListarTudo().then(
        (res) => {
          this.tiposRemessa = res.data.items;
        }
      )
    }
}

class Model {
  situacaoId = 1;
  contaCorrenteId:number = 0;
  dataVencimentoInicial:string = "";
  dataVencimentoFinal:string = "";
  boletoGerado:boolean = true;
}
</script> 