 <template>
  <v-dialog persistent v-model="dialog" width="950" no-click-animation>
    <v-card v-if="item.receita">
      <v-toolbar>
        <v-btn @click="Close()" icon color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="title-toolbar">{{ titulo }}</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn
            :disabled="
              !!item.urlBoleto ||
              !!item.qrCode ||
              item.situacaoId != 1 ||
              item.agrupadorId > 0
            "
            color="primary"
            text
            @click="Salvar(item)"
            >Salvar</v-btn
          >
        </v-toolbar-items>
      </v-toolbar>

      <v-form v-model="valid" lazy-validation ref="form">
        <v-card
          elevation="1"
          :disabled="
            !!item.urlBoleto ||
            !!item.qrCode ||
            item.situacaoId != 1 ||
            item.agrupadorId > 0
          "
        >
          <v-card-text>
            <v-card-title>
              <span class="title-span">Informação da Parcela</span>
            </v-card-title>

            <div
              v-if="item.parcelasAgrupadasNumero"
              class="pl-6 text-subtitle-1"
            >
              Parcelas Agrupadas: {{ item.parcelasAgrupadasNumero }}
            </div>

            <v-row dense class="px-3 pt-3">
              <v-col cols="12" md="2">
                <span class="font-weight-bold">Parcela</span>
                <v-text-field
                  outlined
                  v-model="item.parcela"
                  disabled
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <span class="font-weight-bold">Valor da parcela</span>
                <money-input
                  v-model="item.valor"
                  @ValorFormatado="(valor) => (item.valor = valor)"
                  dense
                ></money-input>
              </v-col>

              <v-col cols="12" md="6">
                <span class="font-weight-bold">Novo vencimento</span>
                <v-text-field
                  outlined
                  v-model="item.dataVencimento"
                  type="date"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <br />

        <v-card
          elevation="1"
          :disabled="
            !!item.urlBoleto || item.situacaoId != 1 || item.agrupadorId > 0
          "
        >
          <v-card-text>
            <v-card-title>
              <span class="title-span"> Encargos Financeiros</span>
            </v-card-title>

            <v-row dense class="px-3 pt-3">
              <v-col cols="12" md="6">
                <span class="font-weight-bold">Instituição Financeira*</span>
                <v-select
                  outlined
                  clearable
                  v-model="item.tipoOperacaoId"
                  :items="tiposOperacaoContrato"
                  item-text="nome"
                  item-value="id"
                  dense
                ></v-select>
              </v-col>

              <v-col cols="12" md="4" v-if="item.tipoOperacaoId == 1">
                <span class="font-weight-bold">Selecione*</span>
                <v-select
                  outlined
                  clearable
                  v-model="item.tipoGatewayId"
                  @change="
                    (e) => {
                      ObterParametroGatway(item.tipoGatewayId);
                    }
                  "
                  return-object
                  :items="listaGateway"
                  item-text="tipo.nome"
                  item-value="tipo.id"
                  dense
                ></v-select>
              </v-col>

              <v-col
                cols="12"
                md="4"
                v-if="item.tipoOperacaoId == 2 || item.tipoOperacaoId == 3"
              >
                <span class="font-weight-bold">Conta Corrente*</span>
                <v-select
                  outlined
                  clearable
                  v-model="item.contaCorrenteId"
                  :items="listaContaCorrentes"
                  item-text="nome"
                  item-value="id"
                  dense
                  :menu-props="{ offsetY: true, offsetOverflow: true }"
                ></v-select>
              </v-col>

              <v-col cols="12" md="2" style="margin-top: -20px">
                <v-switch
                  color="primary"
                  class="pt-6"
                  v-model="aplicarJuros"
                  :label="`Aplicar juros e multa`"
                ></v-switch>
              </v-col>
            </v-row>

            <v-row dense class="px-3">
              <v-col cols="12" md="2">
                <span class="font-weight-bold">Juros ao dia</span>
                <v-text-field
                  suffix="%"
                  outlined
                  v-model="item.encargoFinanceiro.jurosDia"
                  dense
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <span class="font-weight-bold"> Multa</span>
                <v-text-field
                  suffix="%"
                  outlined
                  v-model="item.encargoFinanceiro.multa"
                  dense
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <span class="font-weight-bold">Dias</span>
                <v-text-field
                  outlined
                  v-model="item.encargoFinanceiro.diasDescontoVencimento"
                  dense
                  type="number"
                  hint="Nº de dias necessário antes do vencimento para ter o desconto."
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col
                cols="12"
                md="2"
                v-if="item.encargoFinanceiro.isDescontoVencimentoPercentual"
              >
                <span class="font-weight-bold">Desconto</span>
                <v-text-field
                  suffix="%"
                  outlined
                  v-model="item.encargoFinanceiro.descontoVencimento"
                  dense
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2" v-else>
                <span class="font-weight-bold">Desconto</span>
                <v-text-field
                  prefix="R$"
                  outlined
                  v-model="item.encargoFinanceiro.descontoVencimento"
                  dense
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-switch
                  v-model="
                    item.encargoFinanceiro.isDescontoVencimentoPercentual
                  "
                  class="pt-2"
                  :label="
                    item.encargoFinanceiro.isDescontoVencimentoPercentual !=
                    false
                      ? 'Percentual'
                      : 'Fixo'
                  "
                />
              </v-col>
            </v-row>

            <v-row dense class="px-3">
              <v-col cols="12" md="3">
                <span class="font-weight-bold">Antecipação/Quitação*</span>
                <v-text-field
                  suffix="%"
                  outlined
                  v-model="item.encargoFinanceiro.descontoAntecipacao"
                  dense
                  type="number"
                  hint="% Desconto Antecipação/Quitação"
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <span class="font-weight-bold">Nº de dias</span>
                <v-text-field
                  outlined
                  v-model="item.encargoFinanceiro.diasAposVencimentoNaoReceber"
                  dense
                  type="number"
                  hint="Para não receber após o vencimento"
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <span class="font-weight-bold">Nº de dias</span>
                <v-text-field
                  outlined
                  v-model="item.encargoFinanceiro.diasProtesto"
                  dense
                  type="number"
                  hint="Necessário para protestar após o vencimento."
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3" v-if="codigoBanco == '748'">
                <span class="font-weight-bold"
                  >Nº de Dias para Negativação</span
                >
                <v-text-field
                  outlined
                  v-model="item.encargoFinanceiro.diasNegativacao"
                  dense
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text>
            <v-card-title>
              <span class="title-span">Taxas Adicionais</span>
            </v-card-title>

            <v-row dense class="px-3">
              <v-col cols="12" md="3">
                <span class="font-weight-bold">Taxa do boleto</span>
                <v-text-field
                  v-model="item.valoresAdicionais.taxaBoleto"
                  outlined
                  prefix="R$"
                  dense
                  type="number"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <span class="font-weight-bold">Nome taxa Adicional</span>
                <v-text-field
                  v-model="item.valoresAdicionais.nomeTaxaAdicional"
                  outlined
                  dense
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <span class="font-weight-bold">Valor taxa Adicional</span>
                <v-text-field
                  v-model="item.valoresAdicionais.valorFixoTaxaAdicional"
                  outlined
                  prefix="R$"
                  dense
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  ContaCorrenteService,
  ParametroFinanceiroService,
  ReceitaService,
} from "@/core/services/financeiro";
import { Encargo, ReceitaParcela } from "@/core/models/financeiro";
import { TipoOperacaoFinanceiraService } from "@/core/services/contratos";

@Component
export default class EditarParcelaManual extends Vue {
  @Prop() public item!: ReceitaParcela;
  @Prop() public value!: string;

  receitaService = new ReceitaService();
  valid = true;
  dialog = false;

  aplicarJuros: boolean = false;

  listaGateway: any = [];
  tiposOperacaoContrato = [];
  listaContaCorrentes: any = [];

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

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
    } else {
      this.ObterParametroPorId(this.item.receita!.empresaId);
    }
  }

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  ObterParametroPorId(id) {
    new ParametroFinanceiroService()
      .ObterParametroEmpresaPorId(id, "Gatways.Tipo")
      .then((res) => {
        this.listaGateway = res.data.gatways;
      });
  }

  ObterParametroGatway(item) {
    if (item) {
      this.item.encargoFinanceiro = item.encargoFinanceiro;
      this.item.tipoGatewayId = item.tipoId;
    } else {
      this.item.encargoFinanceiro = new Encargo();
      this.item.tipoGatewayId = 0;
    }
  }

  get titulo() {
    if (
      !!this.item.urlBoleto ||
      this.item.situacaoId == 2 ||
      this.item.situacaoId == 3 ||
      this.item.situacaoId == 4 ||
      this.item.agrupadorId > 0
    ) {
      return "Visualizar";
    } else {
      return "Editar";
    }
  }

  Salvar() {
    if (this.$refs.form.validate()) {
      let modelo = this.item;
      this.receitaService
        .EditarParcela(modelo.id, modelo, this.aplicarJuros)
        .then(
          (res) => {
            this.$swal(
              "Aviso",
              "Operação realizada com sucesso!",
              res.status == 201 || res.status == 200 ? "success" : "warning"
            );
            this.$emit("salvou");
            this.Close();
          },
          (err) => {
            if (!err.response) {
              this.$swal("Aviso", "Não foi possível acessar a API", "error");
            } else if (err.response.status == 403) {
              this.$swal("Aviso", err.response.data.message, "warning");
            } else {
              this.$swal(
                "Aviso",
                err.response.data,
                err.response.status == 400 ? "warning" : "error"
              );
            }
          }
        );
    }
  }

  Close() {
    this.aplicarJuros = false;
    this.dialog = false;
  }

  get codigoBanco() {
    const contaCorrente = this.listaContaCorrentes.find(
      (x: any) => this.item.contaCorrenteId == x.id
    );
    return contaCorrente ? contaCorrente.banco.codigo : "";
  }

  mounted() {
    const tipoOperacaoContrato = new TipoOperacaoFinanceiraService();
    tipoOperacaoContrato.ListarTudo().then((res) => {
      this.tiposOperacaoContrato = res.data.items;
    });

    const contaCorrenteService = new ContaCorrenteService();
    contaCorrenteService
      .Listar(-1, -1, ["id"], [], "", [], "", "", "", "Banco")
      .then((res) => {
        this.listaContaCorrentes = res.data.items;
      });
  }
}
</script>