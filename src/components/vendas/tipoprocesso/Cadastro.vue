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
        <v-toolbar-title>Novo Tipo de Processo</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn dark text @click="Salvar()" :disabled="!valid">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar> 

        <v-card outlined>
          <v-card-text>

            <v-card-title>
              <v-icon large left color="primary">mdi-information</v-icon>
              <span class="title-span">Tipo de Processo</span>        
            </v-card-title>

            <v-form v-model="valid" lazy-validation ref="form">
              <v-row dense class="py-3 px-3">
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { TipoProcessoJudicialService } from '@/core/services/cadastros';
import { TipoProcessoJudicial } from '@/core/models/cadastros';
import * as jsonpatch from 'fast-json-patch';

@Component
export default class CadastroTipoProcessoJudicial extends Vue {
  @Prop() public item!: TipoProcessoJudicial;
  @Prop() public value!: string;

  service = new TipoProcessoJudicialService();

  valid = true;
  dialog = false;

  fieldRules: any[] = [
    (v: any) => !!v || 'Campo obrigatório',
  ]
  
  $refs!: {
    form: HTMLFormElement
  }

  @Watch('item') 
  Item(){
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }
 
  observer! : jsonpatch.Observer<TipoProcessoJudicial>;

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

  @Watch('dialog')
  Dialog() {
    if (!this.dialog) {
      this.$emit('fechou');
    }
  } 
   
  Salvar() {
    if (this.$refs.form.validate()) {
    let pacthModel = jsonpatch.generate(this.observer);

      (this.item.id > 0 ? this.service.Patch(pacthModel, this.item.id) :this.service.Salvar(this.item)).then(
        res => {
          this.$swal('Aviso', 'Operação realizada com sucesso!', res.status == 201 || res.status == 200 ? 'success' : 'warning');
          this.$emit('salvou');
          this.Close();
        },
        (err) => {
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status == 403) {
            this.$swal("Aviso", err.response.data.message, "warning" );
          } else {
            this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
          }
        });
    }
  }

  Close() {
    this.dialog = false;
  }
}

</script>