<template>
  <v-dialog persistent v-model="dialog" width="900" no-click-animation>
    <v-card>
      <v-toolbar flat>
        <v-btn icon color="primary" @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title class="title-toolbar"
          >Encargos e Descontos
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn color="primary" text @click="salvar" :disabled="!valid"
            >Salvar</v-btn
          >
        </v-toolbar-items>
      </v-toolbar>

      <v-card elevation="1">
        <v-card-text>
          <span class="font-weight-bold">
            <v-subheader>
              <v-icon small color="primary" class="mr-2"
                >mdi-credit-card</v-icon
              >
              Encargos Financeiros
            </v-subheader>
          </span>

          <v-divider class="mb-4"></v-divider>
          <br />

          <v-row dense class="px-3 pt-3">
            <v-col cols="12" md="6">
              <v-select
                label="Instituição Financeira*"
                outlined
                clearable
                v-model="item.tipoOperacaoId"
                :items="tiposOperacaoContrato"
                item-text="nome"
                item-value="id"
                dense
              ></v-select>
            </v-col>

            <v-col cols="12" md="6" v-if="item.tipoOperacaoId == 1">
              <v-select
                label="Fintech"
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
              md="6"
              v-if="item.tipoOperacaoId == 2 || item.tipoOperacaoId == 3"
            >
              <v-select
                label="Conta Corrente*"
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
          </v-row>

          <v-row dense class="px-3 pt-3">
            <v-col cols="12" md="2">
              <v-text-field
                suffix="%"
                label="Juros ao dia"
                outlined
                v-model="item.encargoFinanceiro.jurosDia"
                dense
                type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="2">
              <v-text-field
                suffix="%"
                label="Multa"
                outlined
                v-model="item.encargoFinanceiro.multa"
                dense
                type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3" v-if="item.tipoAmortizacaoId == 1">
              <v-text-field
                label="Dias para desconto"
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
              md="3"
              v-if="item.encargoFinanceiro.isDescontoVencimentoPercentual"
            >
              <v-text-field
                suffix="%"
                label="Desconto"
                outlined
                v-model="item.encargoFinanceiro.descontoVencimento"
                dense
                type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3" v-else>
              <v-text-field
                prefix="R$"
                label="Desconto"
                outlined
                v-model="item.encargoFinanceiro.descontoVencimento"
                dense
                type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="2">
              <v-switch
                v-model="item.encargoFinanceiro.isDescontoVencimentoPercentual"
                class="pa-0 ma-0 pt-2"
                :label="
                  item.encargoFinanceiro.isDescontoVencimentoPercentual != false
                    ? 'Percentual'
                    : 'Fixo'
                "
              ></v-switch>
            </v-col>
          </v-row>

          <v-row dense class="px-3">
            <v-col cols="12" md="3" v-if="item.tipoAmortizacaoId == 1">
              <v-text-field
                label="Desconto"
                outlined
                v-model="item.encargoFinanceiro.descontoAntecipacao"
                suffix="%"
                dense
                type="number"
                hint="Antecipação/Quitação"
                persistent-hint
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="Dias para não receber"
                outlined
                v-model="item.encargoFinanceiro.diasAposVencimentoNaoReceber"
                dense
                type="number"
                hint="Nº de dias para não receber após o vencimento."
                persistent-hint
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="Dias"
                outlined
                v-model="item.encargoFinanceiro.diasProtesto"
                dense
                type="number"
                hint="Nº de dias necessário para protestar após o vencimento."
                persistent-hint
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3" v-if="codigoBanco == '748'">
              <v-text-field
                label="Dias para Negativação"
                outlined
                v-model="item.encargoFinanceiro.diasNegativacao"
                dense
                type="number"
                hint="Nº de Dias para Negativação"
                persistent-hint
              ></v-text-field>
            </v-col>
          </v-row>

          <span class="font-weight-bold">
            <v-subheader>
              <v-icon small color="primary" class="mr-2"
                >mdi-credit-card-search</v-icon
              >
              Taxas Adicionais
            </v-subheader>
          </span>

          <v-divider class="mb-4"></v-divider>
          <br />

          <v-row dense class="px-3">
            <v-col cols="12" md="4">
              <v-text-field
                label="Taxa do boleto"
                v-model="taxaBoleto"
                outlined
                prefix="R$"
                dense
                type="number"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="Nome taxa adicional"
                v-model="taxaAdicionalNome"
                outlined
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="Valor taxa adicional"
                v-model="taxaAdicional"
                outlined
                dense
                prefix="R$"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
</template> 

<script lang="ts">
import { Encargo, Receita } from "@/core/models/financeiro";
import { TipoOperacaoFinanceiraService } from "@/core/services/contratos";
import {
  ContaCorrenteService,
  ParametroFinanceiroService,
  ReceitaService,
} from "@/core/services/financeiro";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class EditarParcelaDespesa extends Vue {
  @Prop() public item!: Receita;
  @Prop() public value!: string;

  service = new ReceitaService();
  valid = true;
  dialog = false;

  listaGateway = [];
  tiposOperacaoContrato = [];
  listaContaCorrentes: any = [];

  taxaBoleto: number = 0;
  taxaAdicional: number = 0;
  taxaAdicionalNome: string = "";

  get codigoBanco() {
    const contaCorrente = this.listaContaCorrentes.find(
      (x: any) => this.item.contaCorrenteId == x.id
    );
    return contaCorrente ? contaCorrente.banco.codigo : "";
  }

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    } else {
      this.ObterParametroPorId(this.item.empresaId);
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

  salvar() {
    this.service
      .AtualizarEncargos(
        this.item.id,
        this.item.encargoFinanceiro,
        this.item.tipoGatewayId,
        this.item.tipoOperacaoId,
        this.item.contaCorrenteId,
        this.taxaBoleto,
        this.taxaAdicional,
        this.taxaAdicionalNome
      )
      .then(
        (res) => {
          this.$swal(
            "Aviso",
            "Operação realizada com sucesso!",
            res.status == 201 || res.status == 200 ? "success" : "warning"
          );

          const payloadEncargos = {
            receitaId: this.item.id,
            encargoFinanceiro: this.item.encargoFinanceiro,
            tipoGatewayId: this.item.tipoGatewayId,
            tipoOperacaoId: this.item.tipoOperacaoId,
            contaCorrenteId: this.item.contaCorrenteId,
            taxaBoleto: this.taxaBoleto,
            taxaAdicional: this.taxaAdicional,
            taxaAdicionalNome: this.taxaAdicionalNome,
          };

          this.$emit("salvou", payloadEncargos);
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

  Close() {
    this.dialog = false;
    this.taxaBoleto = 0;
    this.taxaAdicional = 0;
    this.taxaAdicionalNome = "";
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