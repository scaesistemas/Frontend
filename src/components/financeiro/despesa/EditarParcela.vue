<template>
  <v-dialog
    persistent
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    no-click-animation
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title
          >Editar Parcela
          <v-chip color="white" class="ml-2" label outlined>{{
            item.parcelaStr
          }}</v-chip>
        </v-toolbar-title>
        <v-spacer />

        <v-toolbar-items>
          <v-btn
            dark
            text
            @click="Salvar()"
            :disabled="!valid || overlay"
            :loading="overlay"
            >Salvar</v-btn
          >
        </v-toolbar-items>
      </v-toolbar>

      <v-card elevation="1">
        <v-card-text>
          <v-card-title>
            <span class="title-span">Informação da Parcela</span>
          </v-card-title>

          <v-form v-model="valid" ref="form" lazy-validation>
            <v-row dense class="pt-3 px-3">
              <v-col cols="12" sm="6" md="2">
                <span class="font-weight-bold">Parcela</span>
                <v-text-field
                  disabled
                  outlined
                  v-model="item.parcela"
                  dense
                  readonly
                />
              </v-col>

              <v-col cols="12" sm="6" md="2">
                <span class="font-weight-bold">Valor</span>
                <money-input
                  v-model="item.valor"
                  @ValorFormatado="(valor) => (item.valor = valor)"
                />
              </v-col>

              <v-col cols="12" sm="6" md="2">
                <v-card disabled flat>
                  <span class="font-weight-bold">Saldo</span>
                  <money-input
                    v-model="item.saldo"
                    @ValorFormatado="(valor) => (item.valor = valor)"
                  />
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <span class="font-weight-bold">1º vencimento</span>
                <v-text-field
                  outlined
                  v-model="item.dataVencimento"
                  type="date"
                  dense
                />
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <span class="font-weight-bold">Situação</span>
                <v-select
                  outlined
                  v-model="item.situacaoId"
                  :items="situacoes"
                  item-value="id"
                  item-text="nome"
                  dense
                />
              </v-col>

              <v-col cols="12" sm="6" md="6">
                <span class="font-weight-bold">Linha digitavel</span>
                <v-text-field
                  :rules="validaBoleto"
                  outlined
                  v-model="item.linhaDigitavelBoleto"
                  :counter="58"
                  maxlength="58"
                  dense
                />
              </v-col>

              <v-col cols="12" sm="12" md="12">
                <span class="font-weight-bold">Observação</span>
                <v-textarea
                  type="text"
                  outlined
                  v-model="item.observacao"
                  dense
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-card>

    <v-overlay :value="overlay" />
  </v-dialog>
</template> 

<script lang="ts">
import { TratarErroApi } from "@/assets/scripts/helper";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  DespesaParcela,
  SituacaoDespesaParcela,
} from "../../../core/models/financeiro";
import {
  DespesaService,
  SituacaoDespesaParcelaService,
} from "../../../core/services/financeiro";
import { boleto } from "boleto-brasileiro-validator";

@Component
export default class EditarParcelaDespesa extends Vue {
  @Prop() public item!: DespesaParcela;
  @Prop() public value!: string;

  service = new DespesaService();
  situacoes: SituacaoDespesaParcela[] = [];

  valid = true;
  dialog = false;
  tabActive = null;
  overlay: boolean = false;
  validaBoleto = [
    (v) => v.length == 0 || boleto(v) || "Código do boleto inválido!",
  ];

  $refs!: {
    form: HTMLFormElement;
  };

  @Watch("item.linhaDigitavelBoleto")
  Baixa() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
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

  Salvar() {
    this.overlay = true;

    this.service
      .EditarParcela(this.item.id, this.item)
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
        (err) => TratarErroApi(err)
      )
      .finally(() => (this.overlay = false));
  }

  Close() {
    this.dialog = false;
  }

  mounted() {
    new SituacaoDespesaParcelaService().ListarTudo().then((res) => {
      this.situacoes = res.data.items;
    });
  }

  close() {
    this.dialog = false;
  }
}
</script>