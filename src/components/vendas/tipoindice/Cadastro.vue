<template>
  <v-dialog 
    v-model="dialog"
    width="600"
    hide-overlay
    persistent
    no-click-animation
  > 
    <v-card>
      <v-toolbar >
        <v-btn  icon dark @click="Close()"><v-icon color="black">mdi-close</v-icon></v-btn>
        <v-toolbar-title>Novo Tipo de Índice</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn color="black" dark text @click="Salvar()" :disabled="!valid">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar> 

        <v-card outlined>
          <v-card-text> 
 
                <br> 
                  <v-form v-model="valid" lazy-validation ref="form">
                      <v-row dense class="py-3 px-3">
                          <v-col cols="12" md="8">
                            <span class="font-weight-bold">Nome</span>
                            <v-text-field outlined v-model="item.nomeEditavel" dense :rules="fieldRules" :counter="60" maxlength="60"/>
                          </v-col>
                      </v-row>
                  </v-form>
                <br>
            <br>
          </v-card-text>
        </v-card>
    </v-card>
  </v-dialog>
</template> 
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { TipoIndice } from '@/core/models/cadastros';
import { TipoIndiceService } from '@/core/services/financeiro';

@Component
export default class CadastroTipoProcessoJudicial extends Vue {
  @Prop() public item!: TipoIndice;
  @Prop() public value!: string;

  service = new TipoIndiceService();

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
 
  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;     
  }

  @Watch('dialog')
  Dialog() {
    if (!this.dialog) {
      this.$emit('fechou');
    }
  } 
   
  Salvar() {
    if (this.$refs.form.validate()) {

      let modelo:TipoIndice = this.item;
      modelo.criado = true;

      this.service.Salvar(this.item).then(
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