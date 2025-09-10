<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    no-click-animation
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>Cadastro Tipo Documento</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn dark text @click="Salvar()" :disabled="!valid">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar>

    <v-card elevation="1">
      <v-card-text>
        <v-card-title>
          <v-icon large left color="primary">mdi-information</v-icon>
          <span class="title-span">Informação do Tipo documento</span>
        </v-card-title>
       
          <v-form ref="formTipoDocumento" v-model="valid" lazy-validation>
            <v-row class="pt-3 px-3">
              <v-col cols="12" md="6">
                <span class="font-weight-bold">Nome</span>
                <v-text-field outlined v-model="item.nome" dense :rules="fieldRules" :counter="60" maxlength="60"/>
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
import { TipoDocumentoService } from "@/core/services/financeiro";
import { TipoDocumento } from "@/core/models/financeiro";
import * as jsonpatch from 'fast-json-patch';
import { TratarErroApi } from "@/assets/scripts/helper";

@Component
export default class CadastroTipoDocumento extends Vue {
  @Prop() public item!: TipoDocumento;
  @Prop() public value!: string;

  service = new TipoDocumentoService();
  valid = true;
  dialog = false;

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  $refs!: {
    formTipoDocumento: HTMLFormElement;
  };

  @Watch("item")
  Item() {
    if (this.$refs.formTipoDocumento)
    this.$refs.formTipoDocumento.resetValidation();
  }

  observer! : jsonpatch.Observer<TipoDocumento>;

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
    if (this.$refs.formTipoDocumento.validate()) {
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