 <template>
  <v-dialog persistent v-model="dialog" width="1200" no-click-animation>
    <v-card>
      <v-toolbar flat>
        <v-btn icon color="primary" @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>

          <v-toolbar-title class="title-toolbar">Gerenciar Parcelas</v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
  
          <v-card-actions>
            <v-btn outlined color="primary" @click="AbrirDialogBaixarParcelas(SelecionarParcelas)">
              Baixar Parcelas
            </v-btn>  

          </v-card-actions>
          </v-toolbar-items>
        </v-toolbar>
        

       <v-row dense class="mt-4 pa-4">
        <!-- Total de Parcelas Selecionadas -->
        <v-col cols="12" md="2">
          <v-card  outlined class="pa-3"  flat  >
            <v-row align="center">
              <v-col>
                <div class="font-weight-regular text-h6">
                  Parcelas Selec.
                </div>
                <div class="font-weight-bold text-h5">
                  {{ SelecionarParcelas.length }}
                </div>
              </v-col>
            </v-row> 
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card outlined  class="pa-3" flat>
            <v-row align="center">
              <v-col>
                <div class="font-weight-regular text-h6">
                  Total das Parcelas
                </div>
                <div class="font-weight-bold text-h5">
                  {{ SelecionarParcelas.reduce((total, x) => total + (x.saldoParcela || 0), 0).toMoeda(true) }}
                </div>
              </v-col>
            </v-row>  
          </v-card>
        </v-col>

 
    </v-row>

      <v-card flat> 
        
          <v-card-text> 
           <!-- {{ SelecionarParcelas }} -->
            <v-col cols="12">
              <v-data-table class="elevation-1" fixed-header height="320" :headers="headers" v-model="SelecionarParcelas" :items="parcelas" :options.sync="optionsParcelas" :footer-props="{ showFirstLastPage: true}" item-key="id" show-select sort-by="parcela" :loading="loading">
                 <!-- <template v-slot:[`item.editar`] = "{item}">
                   <v-btn style="margin-left:-50px" icon @click="EditarParcela(item)"> <v-icon>mdi-pencil</v-icon> </v-btn>  
                </template> -->

                <template v-slot:[`item.parcelaNumero`] = "{item}">
                  {{ item.parcelaNumero }}  
                </template> 
 
                <template v-slot:[`item.valorParcela`] = "{item}">
                  {{ item.valorParcela  ? Number(item.valorParcela).toMoeda(true) : new Number(0).toMoeda(true) }}
                </template> 
 
  
 
                <template v-slot:[`item.situacao.nome`] = "{item}">  
                  <v-chip :color="SituacaoColor(item)">
                    {{ listaSituacao.find(x=>x.id == item.situacaoId).nome }} 
                  </v-chip>   
                </template>    
                
                <template v-slot:[`item.dataVencimentoParcela`] = "{item}">                                    
                  {{ item.dataVencimentoParcela != undefined ? item.dataVencimentoParcela.toDateDDMMYYYY() : '-'}} 
                </template> 
              </v-data-table>
            </v-col>
          </v-card-text>
      
      </v-card>
    </v-card> 
 
      <v-dialog v-model="dialogBaixa" persistent max-width="800px">
        <v-card>
          <v-card-title>
            <v-btn icon color="primary"  @click="dialogBaixa = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <span class="text-h5">Baixar Múltiplas Parcelas</span>
          </v-card-title>
          <br>
        
          <v-card-text> 
          <v-form v-model="valid" lazy-validation ref="form"> 
            <v-container>
              <v-row dense>
                <v-col cols="12" sm="6" md="6">
                  <span>Forma de Pagamento*</span>
                  <v-select :rules="fieldRules" v-model="baixa.formaPagamentoId" :items="listaFormaPagamento" item-text="nome" item-value="id" outlined dense label="Selecione" required></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <span>Conta Corrente*</span>
                  <v-select :rules="fieldRules" v-model="baixa.contaCorrenteId" :items="contaCorrentes" item-text="nome" item-value="id" outlined dense label="Selecione"></v-select>
                </v-col>

                <v-col cols="12" sm="7" md="7">
                  <span>Data de Pagamento*</span>
                  <v-text-field :disabled="PagarNoVencimento" :rules="fieldRules" v-model="baixa.dataPagamento" type="date" outlined dense></v-text-field>
                </v-col>

                <v-col cols="12" sm="5" md="5">
                  <span>Total a Pagar</span>
                  <money-input disabled v-model="valorTotal" @ValorFormatado="valor => valorTotal = valor"/>
                </v-col>

                <v-switch v-model="PagarNoVencimento" :label="`Pagar no vencimento das parcelas`"></v-switch>
              </v-row>
            </v-container>
            <small>*indica campos obrigatórios</small>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
          
            <v-btn color="primary" @click="BaixarParcelas(SelecionarParcelas)">
              Baixar Parcelas
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    

    <!-- <antecipar-contrato v-model="dialogAnteciparContrato" :item="contratoAntecipacao" @fechou="dialogAnteciparContrato = false" @salvou="ObterReceitaId()"/>
    <agrupar-parcela v-model="dialogAgrupar" :item="agruparParcela" @fechou="dialogAgrupar = false" @salvou="ObterReceitaId()"/>
    <editar-parcelaManual v-model="dialogParcela" :item="parcela" @fechou="dialogParcela = false" @salvou="ObterReceitaId()"/>         -->

  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ContaCorrenteService, DespesaService, FormaPagamentoService, ReceitaService, SituacaoReceitaParcelaService } from "@/core/services/financeiro";
import {  DespesaBaixa, DespesaParcela } from "@/core/models/financeiro";
import { SituacaoColor } from '@/assets/scripts/helper';

@Component
export default class GerenciarParcelas extends Vue {
  @Prop() public parcelas!: [];
  @Prop() public value!: string;

 despesaService = new DespesaService();
  parcela = new DespesaParcela();

  baixa = new DespesaBaixa();

  PagarNoVencimento = false;

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];
  
  dialogBaixa = false;
  valid = true;
  dialog = false;
 
  $refs!: {
    form: HTMLFormElement;
  };

  headers: any[] = [
    {text: "", value: "actions", sortable: false },
    {text: "ID", value: "despesa.id", align: "center",sortable: false},
    {text: "Código do Documento", value: "numeroDocumento", align: "center",sortable: false},
    {text: "Nº", value: "parcelaNumero", align: "center",sortable: false},
    {text: "Valor da Parcela", value: "valorParcela", align: "center",sortable: false},
    {text: "Situação", value: "situacao.nome", align: "center",sortable: false},
    {text: "Vencimento", value: "dataVencimentoParcela", align: "center",sortable: false},
  ];

   get valorTotal (){
    const saldoTotal = this.SelecionarParcelas.reduce((total, x:any) => total + (x.saldoParcela || 0), 0);
    return saldoTotal;
  }


  contaCorrentes = [];
  listaFormaPagamento = [];

  SelecionarParcelas = [];
  listaSituacao = [];

  pdfUrl: string = "";
  dialogAgrupar:boolean = false;
  dialogAnteciparContrato:boolean = false;
  loading:boolean = false;
  dialogParcela:boolean = false;
     
  optionsParcelas: any = {
    itemsPerPage: -1
  }; 


  AbrirDialogBaixarParcelas(listaParcela){
    if(listaParcela[0] == undefined)
      return this.$swal("Aviso", "É necessário selecionar uma ou mais parcelas.", "warning");


      this.baixa.valor = listaParcela[0].saldoParcela.toFixed(2);
      this.dialogBaixa = true;
  }

  BaixarParcelas(listaParcela) {
  let modelo = {
    parcelaIds: listaParcela.map(x => x.id),
    modeloBaixa: this.baixa,
    PagarNoVencimento: this.PagarNoVencimento
  }

  if (this.$refs.form.validate()) {
    this.despesaService.BaixarMultiplasParcelas(modelo).then(
      (res) => {
        this.$swal("Aviso","Operação realizada com sucesso!",res.status == 201 || res.status == 200 ? "success" : "warning");
        this.$emit("salvou");
        // this.ObterReceitaId();
        this.Reset()
        this.dialogBaixa = false;
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
    }
  }
  

  
  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }
  }

  @Watch("baixa")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  Reset(){
    this.SelecionarParcelas = [];
    this.baixa = new DespesaBaixa();
    this.PagarNoVencimento = false;
  }

  Close() {
    this.Reset();
    this.dialog = false;
  }

  SituacaoColor(item){
    return SituacaoColor(item)
  }

  mounted(){
    new ContaCorrenteService().ListarTudo().then(res => {
      this.contaCorrentes = res.data.items;
    })

    new FormaPagamentoService().ListarTudo().then(
    (res) => {
      this.listaFormaPagamento = res.data.items;
    });

    new SituacaoReceitaParcelaService().ListarTudo().then(
      res => {this.listaSituacao = res.data.items}
    )
  }
}
</script>