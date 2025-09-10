 <template>
  <v-dialog v-model="dialog" width="600" no-click-animation>
    <v-card>
      <v-toolbar>
        <v-btn @click="Close()" icon color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="title-toolbar">Reajuste de Parcelas</v-toolbar-title>
        <v-spacer/> 

        <v-toolbar-items>
          <v-btn color="primary" text @click="Salvar(item)">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar>   

     <v-form v-model="valid" lazy-validation ref="form"> 
      <v-card elevation="1"> 
        <v-card-text class="pt-6">
          <v-row dense> 
            <v-col cols="12" md="4">
              <span class="font-weight-bold">Parcela</span>
              <v-text-field outlined v-model="item.parcela" disabled dense/>
            </v-col> 

            <v-col cols="12" md="8">
              <span class="font-weight-bold">Valor da Parcela</span>
              <money-input v-model="item.valor" @ValorFormatado="valor => item.valor = valor" dense />
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
export default class AjusteAmortizacao extends Vue { 
  @Prop() public item!: ReceitaParcela;
  @Prop() public value!: string;

  tipoOperacaoId = 1;

  receitaService = new ReceitaService();
  valid = true;
  dialog = false;

  tipos = [
    {id:1, nome:'Ajustar pelo valor da parcela'},
    {id:2, nome:'Ajustar pelo valor da amortização'}
]
  
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
    }
  }

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    } 
  }
  
  Salvar() {
    if (this.$refs.form.validate()) {
      let modelo = this.item;

      if(this.item.receita!.contrato!.tipoAmortizacaoId == 1){
         this.receitaService.AjustarParcelaPadrao(modelo.id, modelo.valor).then(
          (res) => {
            this.$swal("Aviso","Operação realizada com sucesso!",res.status == 201 || res.status == 200 ? "success" : "warning");
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
          });
      }else{
         this.receitaService.AjustarAmortizacao(modelo.id, this.tipoOperacaoId, modelo.saldoAmortizacaoInicioPeriodoCorrigido, modelo.valor).then(
          (res) => {
            this.$swal("Aviso","Operação realizada com sucesso!",res.status == 201 || res.status == 200 ? "success" : "warning");
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
          });
      }
    }
  }

  Close(){
    this.dialog = false;
  }
 
  mounted(){
  
  }
}
</script>