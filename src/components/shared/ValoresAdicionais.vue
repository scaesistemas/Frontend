<template>
 <v-dialog persistent v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" no-click-animation>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Valores adicionais</v-toolbar-title>
        <v-spacer/> 

        <v-toolbar-items>
          <v-btn dark text @click="Salvar(item)">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar>
 
      <v-card elevation="1">
        <v-card-text>  
          <v-card-title>
            <v-icon large left color="primary">mdi-information</v-icon>
            <span class="title-span">Informação dos Valores Adicionais</span>
          </v-card-title> 

          <v-form v-model="valid" lazy-validation ref="form">
            <v-row dense class="pt-3 px-3">
              <v-col cols="12" xs="12" sm="12" md="2" lg="2" xl="2">
                <span class="font-weight-bold">Gestão</span> 
                <v-text-field dense outlined v-model="valoresAdicionais.gestao" type="number" clearable/>
              </v-col>

              <v-col cols="12" xs="12" sm="12" md="2" lg="2" xl="2">
                <span class="font-weight-bold">MPI</span> 
                <v-text-field type="number" outlined v-model="valoresAdicionais.percentualMPI" suffix="%" dense clearable/>
              </v-col>

              <v-col cols="12" xs="12" sm="12" md="2" lg="2" xl="2">
                <span class="font-weight-bold">Valor DFI</span> 
                <v-text-field dense outlined v-model="valoresAdicionais.valorDFI" type="number" clearable/>
              </v-col>

              <v-col cols="12" xs="12" sm="12" md="2" lg="2" xl="2">
                <span class="font-weight-bold">Percentual DFI</span> 
                <v-text-field outlined type="number" v-model="valoresAdicionais.percentualDFI" dense suffix="%" clearable/>
              </v-col>

               <v-col cols="12" xs="12" sm="12" md="2" lg="2" xl="2">
                <span class="font-weight-bold">Fixo</span> 
                <v-select clearable outlined :items="fixo" item-value="fixo" item-text="nome" v-model="valoresAdicionais.isDFIFixo" dense/>
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
import { ReceitaService } from "@/core/services/financeiro";
import { Receita, ReceitaParcela, ValoresAdicionais } from "@/core/models/financeiro";

@Component
export default class valoresAdicionais extends Vue {
  @Prop() public item!: ReceitaParcela;
  @Prop() public value!: string;


  valoresAdicionais = new ValoresAdicionais();
  receitaService = new ReceitaService();
  valid = true;
  dialog = false;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];


  fixo = [
    {id:1, nome:'Sim', fixo:true},
    {id:2, nome:'Não', fixo:false}
   ]

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
    }
  }

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  Close() {
    this.dialog = false;
    this.valoresAdicionais = new ValoresAdicionais();
  }
 
   Salvar(item){ 
     if (this.$refs.form.validate()) {

      let isDFIFixo = this.valoresAdicionais.isDFIFixo != null? this.valoresAdicionais.isDFIFixo.toString() : "";
      let gestao = this.valoresAdicionais.gestao ? this.valoresAdicionais.gestao.toString() : "";
      let percentualMPI = this.valoresAdicionais.percentualMPI ? this.valoresAdicionais.percentualMPI.toString() : "";
      let valorDFI = this.valoresAdicionais.valorDFI ? this.valoresAdicionais.valorDFI.toString() : "";
      let percentualDFI = this.valoresAdicionais.percentualDFI ? this.valoresAdicionais.percentualDFI.toString() : "";

      this.receitaService.SalvarValoresAdicionais(item.receitaId, gestao, percentualMPI, percentualDFI, valorDFI, isDFIFixo).then(
        (res) => {
          this.$swal("Aviso", "Operação realizada com sucesso!",res.status == 201 || res.status == 200 ? "success" : "warning");
          this.$emit("salvou");
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
        })
     }
   }
}

</script>