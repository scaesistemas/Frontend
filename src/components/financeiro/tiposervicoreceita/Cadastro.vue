<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    no-click-animation
  >
    <v-card class="fundo">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>Novo tipo de Serviço de Receita</v-toolbar-title>
        <v-spacer></v-spacer>
 
        <v-toolbar-items>
          <v-btn dark text @click="Salvar()" :disabled="!valid">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card outlined>
        <v-card-text>
          <v-card-title>
            <v-icon large left color="primary">mdi-information</v-icon>
            <span class="title-span">Informação do Tipo de Serviço</span>
          </v-card-title>

          <v-form v-model="valid" lazy-validation ref="form">
            <v-row class="pt-3 px-3" dense>
              <v-col cols="12" md="4">
                <span class="font-weight-bold">Nome*</span>
                <v-text-field outlined v-model="item.nome" dense :rules="fieldRules" :counter="120" maxlength="120"/>
              </v-col>

              <v-col cols="12" md="2">
                <span class="font-weight-bold">Valor</span>
                <money-input v-model="item.valor" @ValorFormatado="valor => item.valor = valor" dense />
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
import { TipoServicoReceitaService } from "@/core/services/financeiro";
import { TipoServicoReceita } from "@/core/models/financeiro";
import * as jsonpatch from 'fast-json-patch';
import { TratarErroApi } from "@/assets/scripts/helper";

@Component
export default class CadastroTipoServicoReceita extends Vue {
  @Prop() public item!: TipoServicoReceita;
  @Prop() public value!: string;

  service = new TipoServicoReceitaService();

  valid = true;
  dialog = false;

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

   $refs!: {
    form: HTMLFormElement
  }

  @Watch('item') 
  Item(){
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  observer! : jsonpatch.Observer<TipoServicoReceita>;

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false; 

    if (this.dialog){
      this.observer = jsonpatch.observe(this.item);
    }
    else {
      jsonpatch.unobserve(this.item, this.observer);
    }
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }
  }

   Salvar() {
    if (this.$refs.form.validate()) {
      let pacthModel = jsonpatch.generate(this.observer);

      (this.item.id > 0 ? this.service.Patch(pacthModel, this.item.id) : this.service.Salvar(this.item)).then(
        (res) => {
          this.$swal("Aviso", "Operação realizada com sucesso!",res.status == 201 || res.status == 200 ? "success" : "warning");
          this.$emit("salvou");
          this.Close();
        },
        (err) => TratarErroApi(err)
        );
    }
  }

  Close() {
    this.dialog = false;
  }
}
</script>