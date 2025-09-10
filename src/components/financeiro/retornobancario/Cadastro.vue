<template>
  <v-dialog persistent v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" no-click-animation>
    <v-card class="fundo">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>Retorno Bancário</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn dark text @click="Processar()" :disabled="!valid">Processar</v-btn>
          <v-btn dark text @click="Baixar()" :disabled="!valid">Baixar</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    <!--bancario-->
      <v-card outlined> 
        <v-card-text>
          <v-card-title> 
            <v-icon large left color="primary">mdi-information</v-icon>
            <span class="title-span">Informação Retorno Bancário</span>
          </v-card-title> 

          <v-form ref="formRetornoBancario" v-model="valid" lazy-validation>
            <v-row dense class="pt-3 px-3">
              <v-col cols="12" md="4">
                <v-select placeholder="Selecione" :items="listaBancos" item-value="codigo" item-text="nome" value  outlined v-model="codigoBancario" dense :rules="fieldRules"></v-select>
              </v-col>

              <v-col cols="15" md="4"> 
                <div v-if="!arquivoRetorno"> 
                  <v-file-input  label="Arquivo de retorno" append-icon="mdi-file-outline" color="primary" show-size accept=".RET" v-model="arquivoRetorno" outlined dense  :rules="fieldRules"></v-file-input>
                </div>
              
                <div class="ml-1 pt-1" v-else>
                  <v-btn color="primary" outlined @click="RemoveArquivo()">
                    Remover <v-icon right color="primary">mdi-close</v-icon>
                  </v-btn>   
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
  
         <v-data-table item-key="NumeroDocumento" v-model="selected" show-select  item-value="text"  :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50, -1], showFirstLastPage: true}" :headers="headers" sort-by="dataVencimentoParcela" :items="listaRetorno" :options.sync="options" :server-items-length="totalLista" :loading="loading" class="elevation-1" dense>
           <template v-slot:top>
            <v-card flat>
              <v-card-title>
                <v-icon color="primary">mdi-filter</v-icon> 
                 Filtros
              </v-card-title>
            </v-card>
           </template>

          <template v-slot:[`item.NumeroDocumento`] = "{item}">
            {{ item.NumeroDocumento }}
          </template>
           
          <template v-slot:[`item.Pagador.nome`] = "{item}">
            {{ item.Pagador.nome }}
          </template>

          <template v-slot:[`item.DataVencimento`] = "{item}">
            {{ new Date(item.DataVencimento).ddmmyyyy() }}
          </template>

          <template v-slot:[`item.DataCredito`] = "{item}">
            {{ new Date(item.DataCredito).ddmmyyyy() == "01/01/1" ? '-' : new Date(item.DataCredito).ddmmyyyy()}}
          </template>

          <template v-slot:[`item.ValorTitulo`] = "{item}">
            {{ Number(item.ValorTitulo).toMoeda(true) }}
          </template>

          <template v-slot:[`item.ValorJurosDia`] = "{item}">
            {{ Number(item.ValorJurosDia).toMoeda(true) }}
          </template>

          <template v-slot:[`item.ValorDesconto`] = "{item}">
            {{ Number(item.ValorDesconto).toMoeda(true) }}
          </template>

          <template v-slot:[`item.ValorPago`] = "{item}">
            {{ Number(item.ValorPago).toMoeda(true) }}
          </template>

          <template v-slot:[`item.codigoDescricaoOcorrencia`] = "{item}">
            {{ item.codigoDescricaoOcorrencia }}
          </template>

           <template v-slot:[`item.ParcelaInformativo`] = "{item}">
            {{ item.ParcelaInformativo ? item.ParcelaInformativo : '-' }}
          </template>          
        </v-data-table>  
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { BancoService, ReceitaService} from "@/core/services/financeiro";

@Component
export default class CadastroRetornoBancario extends Vue {
  @Prop() public value!: string;
  
  service = new ReceitaService();
  codigoBancario:number = 0;

  loading:boolean = false;
  valid:boolean = true;
  dialog:boolean = false;
  arquivoRetorno:any = null;

  options: any = {
    itemsPerPage: 50,
  };

  totalLista:number = 0;

  listaBancos = [];
  listaRetorno = [];

  selected = [];

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  $refs!: {
    formRetornoBancario: HTMLFormElement;
  };
 
  headers: any[] = [
    { text: '', value: 'actions', sortable: false },
    { text: "Documento",value: "NumeroDocumento"},
    { text: "Doador", value: "Pagador.nome" },
    { text: "Vencimento", value: "DataVencimento" },
    { text: "Pagamento", value: "DataCredito" },
    { text: "Valor Título", value: "ValorTitulo" },
    { text: "Juros ao dia", value: "ValorJurosDia" },
    { text: "Desconto", value: "ValorDesconto" },
    { text: "Valor Pago", value: "ValorPago" },
    { text: "Ocorrência", value: "codigoDescricaoOcorrencia" },
    { text: "Situação", value: "ParcelaInformativo"}
  ];

  @Watch("codigoBancario")
  Item() {
    if (this.$refs.formRetornoBancario)
      this.$refs.formRetornoBancario.resetValidation();
  };

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }
  };

  Processar(){
    if (this.$refs.formRetornoBancario.validate()) {
      let arquivo = this.arquivoRetorno;
      this.loading = true;

      this.service.ProcessarRetorno(this.codigoBancario, arquivo).then(
        (res) => {
          this.listaRetorno = res.data;
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
        }
      ).finally(() => this.loading = false);
    }
  };

  RemoveArquivo(){
    this.arquivoRetorno = null;
  };

  Baixar(){
    if (this.$refs.formRetornoBancario.validate()) {
      if(this.selected.length == 0){
        this.$swal( "Aviso","É nessário selecionar a parcela que deseja baixar","warning");
        return;
      }
      
      let parcelas = this.selected;
      this.service.BaixarParcelas(parcelas).then(
        (res) => {
          this.$swal( "Aviso","Operação realizada com sucesso!", res.status == 201 || res.status == 200 ? "success" : "warning");
          this.Close();
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
  };

  Close() {
    this.dialog = false;
    this.selected = [];
    this.listaRetorno = [];
    this.RemoveArquivo();
  };

  mounted(){
   const bancoService = new BancoService();
    bancoService.ListarTudo().then(
      (res) => {
        this.listaBancos = res.data.items;
      }
    )
  }
}
</script>