 <template>
  <v-dialog persistent v-model="dialog" width="700"  no-click-animation>
  <v-card>
    <v-toolbar>
      <v-btn icon color="primary" @click="Close()">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-toolbar-title class="title font-weight-regular">{{item.nome}}</v-toolbar-title>
        <v-spacer/>
      </v-toolbar>

    <v-card outlined>
    <v-card-text>
      <v-row class="mt-1">
        <v-col cols="12" md="6">
          <strong>Intervalo de Reajuste:</strong> {{ item.intervaloReajuste.nome }}
        </v-col>
        <v-col cols="12" md="6">
          <strong>Tipo de Índice:</strong> {{ item.tipoIndice.nome }}
        </v-col>
        <v-col cols="12" md="6">
          <strong>Tipo de Amortização:</strong> {{ item.tipoAmortizacao.nome }}
        </v-col>
        <v-col cols="12" md="6">
          <strong>Mês de Reajuste:</strong> {{ item.tipoMesReajuste.nome }}
        </v-col>
        <v-col cols="12" md="6">
          <strong>Ano de Início de Reajuste:</strong> {{ item.tipoAnoInicioReajuste.nome }}
        </v-col>
        <v-col cols="12" md="6">
          <strong>Tipo de Valor Total:</strong> {{ item.tipoValorTotal.nome }}
        </v-col>
        <v-col cols="12" md="6">
          <strong>Valor da Unidade:</strong> <span class="span"> {{ item.valorUnidade.toMoeda(true) }}</span>
        </v-col>
        <v-col cols="12" md="6">
          <strong>Entrada:</strong> <span class="span"> {{ item.entrada.valor.toMoeda(true) }}</span> em {{ item.entrada.prazo }} meses
        </v-col>
        <v-col cols="12" md="6">
          <strong>Intermediária:</strong> <span class="span"> {{ item.intermediaria.valor.toMoeda(true) }} </span> em {{ item.intermediaria.prazo }} meses
        </v-col>
        <v-col cols="12" md="6">
          <strong>Financiamento:</strong> <span class="span"> {{ item.financiamento.valor.toMoeda(true) }} </span>
           em {{ item.financiamento.prazo }} meses
        </v-col>
        <v-col cols="12" md="6">
          <strong>Operação:</strong> {{ item.tipoOperacao.nome }}
          
        </v-col>
        <v-col cols="12" md="6" v-if="item.tipoOperacaoId == 1">
          <strong>Gateway:</strong> {{ item.tipoGateway.nome }}
        </v-col>

         <v-col cols="12" md="6" v-if="item.tipoOperacaoId == 2 || item.tipoOperacaoId == 3">
          <strong>Conta Corrente:</strong> {{ item.contaCorrente.nome }}
         </v-col>

       <v-col cols="12" md="12">
       <v-divider ></v-divider>
       </v-col>
        <v-col cols="12" md="6">
          <strong>Encargos Financeiros:</strong>
          <ul>
            <li>Juros por Dia: {{ item.encargoFinanceiro.jurosDia }}%</li>
            <li>Multa: {{ item.encargoFinanceiro.multa }}%</li>
            <li>Desconto no Vencimento: {{ item.encargoFinanceiro.descontoVencimento }}%</li>
            <li>Dias de Desconto no Vencimento: {{ item.encargoFinanceiro.diasDescontoVencimento }} dias</li>
            <li>Dias para Protesto: {{ item.encargoFinanceiro.diasProtesto }} dias</li>
          </ul>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
    </v-card> 
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Empreendimento,  } from "@/core/models/cadastros";
import { EmpreendimentoService } from "@/core/services/cadastros";


@Component
export default class VisualizarPlano extends Vue {
  @Prop() public item!: Empreendimento;
  @Prop() public value!: string;


  service = new EmpreendimentoService();
  qtdeQuadras = 0;
   
  valid = true;
  dialog = false;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];
  
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

  $refs!: { 
    form: HTMLFormElement;
  }; 

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    } 
  }

  Close() { 
    this.dialog = false;
  }


 
}
</script>
<style scoped>
.span{
    color:#E05A1B
}
</style>