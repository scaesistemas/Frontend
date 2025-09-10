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
        <v-btn icon dark @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title
          >Editar Parcela
          <v-chip class="ml-2" color="white" label outlined>{{
            item.parcelaStr
          }}</v-chip>
        </v-toolbar-title>
        <v-spacer />

        <v-toolbar-items>
          <v-btn dark text @click="Salvar(item)">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card elevation="1">
        <v-card-text>
          <v-card-title>
            <v-icon large left color="primary">mdi-information</v-icon>
            <span class="title-span">Informação da Parcela</span>
          </v-card-title>

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
              <span class="font-weight-bold">Valor da Parcela</span>
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
                  @ValorFormatado="(valor) => (item.saldo = valor)"
                />
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <span class="font-weight-bold">Vencimento</span>
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
                :menu-props="{ offsetY: true, offsetOverflow: true }"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="6" md="6">
              <span class="font-weight-bold">Linha digitavel</span>
              <v-text-field
                outlined
                v-model="item.linhaDigitavelBoleto"
                :counter="60"
                maxlength="60"
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
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
</template> 

<script lang="ts">
import { TratarErroApi } from "@/assets/scripts/helper";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ReceitaParcela } from "../../../core/models/financeiro";
import {
  ReceitaService,
  SituacaoReceitaParcelaService,
} from "../../../core/services/financeiro";

@Component
export default class EditarParcela extends Vue {
  @Prop() public item!: ReceitaParcela;
  @Prop() public value!: string;

  service = new ReceitaService();
  situacoes: [] = [];

  valid = true;
  dialog = false;
  tabActive = null;
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

  Salvar(item) {
    let modelo = item;

    this.service.EditarParcela(item.id, modelo, false).then(
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
    );
  }

  Close() {
    this.dialog = false;
  }

  mounted() {
    new SituacaoReceitaParcelaService().ListarTudo().then((res) => {
      this.situacoes = res.data.items;
    });
  }
}
</script>