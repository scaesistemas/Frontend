<template>
  <v-dialog persistent v-model="dialog" width="500" no-click-animation>
    <v-card>
      <v-toolbar>
        <v-btn icon color="primary" @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="title-toolbar">Configurar Split</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn color="primary" text @click="Salvar()" :disabled="!valid">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-form v-model="valid" lazy-validation ref="form">
        <v-card elevation="1">
          <v-card-text>
            <v-row dense class="pa-3">
              <v-col cols="12" md="12">
                <span class="font-weight-bold">Tipo de Split</span>
                <v-radio-group
                  v-model="modelo.type"
                  :rules="[v => !!v || 'Selecione o tipo de Split']"
                  row
                >
                  <v-radio label="Fixed" value="Fixed"></v-radio>
                  <v-radio label="Percent" value="Percent"></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="12" md="12">
                <span class="font-weight-bold">Valor</span>
                <money-input
                  v-model="modelo.value"
                  dense
                  @ValorFormatado="valor => this.modelo.value = valor"
                  :rules="[v => v > 0 || 'O valor deve ser maior que zero']"
                />
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
import { ReceitaService } from "@/core/services/financeiro";
import { ReceitaParcela } from "@/core/models/financeiro";

@Component
export default class SplitPagamento extends Vue {
  @Prop() public item!: ReceitaParcela;
  @Prop() public value!: string;

  modelo = new Model();
  receitaService = new ReceitaService();
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

  @Watch("modelo")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  Close() {
    this.modelo = new Model();
    this.dialog = false;
  }

  Salvar() {
    if (this.$refs.form.validate()) {
      this.modelo.id = this.item.id;
      this.receitaService
        .AtualizarSplit(this.item.id, this.modelo.type, this.modelo.value)
        .then(
          (res) => {
            this.$swal(
              "Aviso",
              "Split cadastrado com sucesso!",
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
}

class Model {
  id: number = 0;
  type: string = ""; // Fixed or Percent
  value: number = 0;
}
</script>

<style scoped>
.title-toolbar {
  font-weight: bold;
}
</style>
