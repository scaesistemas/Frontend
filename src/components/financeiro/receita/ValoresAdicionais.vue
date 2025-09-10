 <template>
  <v-dialog persistent v-model="dialog" width="900" no-click-animation>
    <v-card>
      <v-toolbar flat>
        <v-btn icon color="primary" @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="title font-weight-regular">Valores adicionais</v-toolbar-title>
        <v-spacer/>

        <v-toolbar-items>
          <v-btn color="primary" text @click="ObterValoresPriceSac()" :disabled="!valid">Confirmar</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    <br>
    
     <v-card elevation="1">
      <v-card-text>  
        <v-card-title>
          <v-icon large left color="primary">mdi-information</v-icon>
          <span class="title-span">Informação da Parcela</span>
        </v-card-title> 

        <v-row dense class="px-3 pt-3">
          <v-col cols="12" md="2">
            <v-text-field outlined disabled v-model="valoresParcela.parcela" label="Parcela" dense/>
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field outlined disabled v-model="valoresParcela.valor" prefix="R$" label="Valor" dense/>
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field outlined disabled v-model="valoresParcela.dataVencimento" type="date" label="Vencimento" dense/>
          </v-col>
        </v-row>

        <v-row dense class="px-3" :disabled="item.tipoAmortizacaoId ==1">
          <v-col cols="12" md="4">
            <v-text-field outlined v-model="valoresParcela.valoresAdicionais.valorMPI" prefix="R$" label="MPI" disabled dense/>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field outlined v-model="valoresParcela.valoresAdicionais.valorDFI" prefix="R$" label="DFI" disabled dense/>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field outlined v-model="valoresParcela.valoresAdicionais.correcaoIndice" prefix="R$" label="Correção índice" disabled dense/>
          </v-col>
        </v-row>
        </v-card-text>
      </v-card>
    <br>

    <v-card elevation="1">
      <v-card-text>
        <v-card-title>
          <span class="title-span">Alterar Valores Adicionais</span>
        </v-card-title> 

        <v-form v-model="valid" lazy-validation ref="form">
          <v-row dense class="pt-3 px-3">
            
            <v-col cols="12" md="3">
              <v-text-field type="number" outlined v-model="valoresParcela.valoresAdicionais.gestao" prefix="R$" label="Gestão" :disabled="item.tipoAmortizacaoId ==1" dense/>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field type="number" outlined v-model="valoresParcela.valoresAdicionais.percentualMPI" suffix="%" label="MPI" :disabled="item.tipoAmortizacaoId ==1" dense/>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field type="number" outlined v-model="valoresParcela.valoresAdicionais.percentualDFI" suffix="%" label="DFI" :disabled="item.tipoAmortizacaoId ==1" dense/>
            </v-col>

            <v-col cols="12" md="4">
               <v-switch  :disabled="item.tipoAmortizacaoId==1" v-model="aplicar" color="primary" label="Aplicar para essa parcela e as subsequentes."/>
            </v-col>
          </v-row> 
        </v-form>
      </v-card-text>
     </v-card>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ReceitaService } from "@/core/services/financeiro";
import { Receita, ReceitaParcela, TipoAmortizacao } from "@/core/models/financeiro";
import { TratarErroApi } from "@/assets/scripts/helper";

@Component
export default class valoresAdicionais extends Vue {
  @Prop() public item!: Receita;
  @Prop() public valoresParcela!: ReceitaParcela;
  @Prop() public value!: string;

  receitaService = new ReceitaService();
  valid = true;
  dialog = false;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  aplicar = false;

  $refs!: {
    form: HTMLFormElement;
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
  }

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  Close() {
    this.dialog = false;
    this.aplicar = false;
  }
 
  parcelas: any = [];

  AtualizarValores(resultado){
    /* aplica para todas as parcelas subsequentes */
    if(this.aplicar){
      for(let i = 0; i < this.item.parcelas.length; i++){
        if(this.item.parcelas[i].parcela >= this.valoresParcela.parcela){
          this.item.parcelas[i].valor = resultado[i].valorParcela;
          this.item.parcelas[i].juros = resultado[i].juros;
          this.item.parcelas[i].amortizacao = resultado[i].amortizacao;
          this.item.parcelas[i].saldoAmortizacaoPeriodoOriginal = resultado[i].saldoInicialPeriodo;
          this.item.parcelas[i].saldoAmortizacaoInicioPeriodoCorrigido = resultado[i].saldoInicialPeriodo;
          this.item.parcelas[i].saldoAmortizacaoFimPeriodoCorrigido = resultado[i].saldoFinalPeriodo;

          this.item.parcelas[i].valoresAdicionais = resultado[i].valoresAdicionais;
        }
      } 
    }else{
      /* Aplica somente a parcela selecionada */
      for(let i = 0; i < this.item.parcelas.length; i++){
        if(this.item.parcelas[i].parcela == this.valoresParcela.parcela){
          this.item.parcelas[i].valor = resultado[i].valorParcela;
          this.item.parcelas[i].juros = resultado[i].juros;
          this.item.parcelas[i].amortizacao = resultado[i].amortizacao;
          this.item.parcelas[i].saldoAmortizacaoPeriodoOriginal = resultado[i].saldoInicialPeriodo;
          this.item.parcelas[i].saldoAmortizacaoInicioPeriodoCorrigido = resultado[i].saldoInicialPeriodo;
          this.item.parcelas[i].saldoAmortizacaoFimPeriodoCorrigido = resultado[i].saldoFinalPeriodo;
          this.item.parcelas[i].valoresAdicionais = resultado[i].valoresAdicionais;
        }
      }
    }
  }

  ObterValoresPriceSac() {
    let resultado = [];

    if(this.item.tipoAmortizacaoId == TipoAmortizacao.Price){
      this.receitaService.ParcelamentoPrice(this.item.valor, this.item.jurosAmortizacao,this.item.parcelas.length,this.item.valoresAdicionaisParcela.isDFIFixo,this.valoresParcela.valoresAdicionais.percentualMPI,this.valoresParcela.valoresAdicionais.percentualDFI,this.valoresParcela.valoresAdicionais.gestao).then(
        res => {
          resultado = res.data;
          this.AtualizarValores(resultado);
        },
        (err) => TratarErroApi(err)
      ).finally(() => this.Close())
    }else{
      this.receitaService.ParcelamentoSac(this.item.valor,this.item.jurosAmortizacao, this.item.parcelas.length, this.item.valoresAdicionaisParcela.isDFIFixo, this.valoresParcela.valoresAdicionais.percentualMPI,this.valoresParcela.valoresAdicionais.percentualDFI,this.valoresParcela.valoresAdicionais.gestao).then(
        res => {
          resultado = res.data;
          this.AtualizarValores(resultado);
        },
      (err) => TratarErroApi(err)
      ).finally(() => this.Close())  
    }  
  }
}

</script>