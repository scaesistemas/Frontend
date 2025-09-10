 <template>
  <v-dialog v-model="dialog" width="600" no-click-animation>
    <v-card>
      <v-toolbar>
        <v-btn @click="Close()" icon color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="title-toolbar">Baixar parcelas retroativas</v-toolbar-title>
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
                <span class="font-weight-bold">Tipo</span>
                <v-select :rules="fieldRules" outlined v-model="tipoOperacaoId" :items="tipos" item-text="nome" item-value="id" dense :menu-props="{ offsetY: true, offsetOverflow: true }"/>
              </v-col>  

              <v-col cols="12" md="6">
                <span class="font-weight-bold">Forma de pagamento</span>
                <v-select outlined :rules="fieldRules" item-text="nome" item-value="id" :items="formasPagamento" v-model="formaPagamentoId" dense :menu-props="{ offsetY: true, offsetOverflow: true }"/>
              </v-col>

              <v-col cols="12" md="6">
                <span class="font-weight-bold">Conta corrente</span>
                <v-select outlined :rules="fieldRules" item-text="nome" item-value="id" :items="contasCorrente" v-model="contaCorrenteId" dense :menu-props="{ offsetY: true, offsetOverflow: true }"/>
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
import { ContaCorrenteService, FormaPagamentoService, ReceitaService } from "@/core/services/financeiro";
import { ReceitaParcela } from "@/core/models/financeiro";

@Component
export default class AjusteAmortizacao extends Vue { 
  @Prop() public item!: ReceitaParcela;
  @Prop() public value!: string;

  tipoOperacaoId = 1;
  formaPagamentoId = 1;
  contaCorrenteId = 1;

  formasPagamento = [];
  contasCorrente = [];

  receitaService = new ReceitaService();
  valid = true;
  dialog = false;

  tipos = [
    {id:1, nome:'Gerar baixas pela data da parcela'},
    {id:2, nome:'Gerar baixas pela data de hoje'}
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

    this.$swal({
    title: "Atenção!",
    html:"Tem certeza que desejar realizar essa ação! <br> Esta ferramenta efetuará o pagamento de todas as parcelas retroativas a partir da parcela selecionada.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sim",
    cancelButtonText: "Não",
    showCloseButton: true,
    showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.receitaService.BaixaRetroativa(modelo.id, this.tipoOperacaoId, this.formaPagamentoId, this.contaCorrenteId).then(
          (res) => {
            if (res.status == 200) {
              this.$emit("salvou");
              this.Close(); 
              return res;
            }
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
      },
    // @ts-ignore: Unreachable code error
    allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal("Aviso", result.value.data,result.value.status == 200 ? "success" : "warning");
      }
    });
    }
  }

  Close(){
    this.dialog = false;
  }
 
  mounted(){
    new FormaPagamentoService().ListarTudo().then(res => {
      this.formasPagamento = res.data.items;
    })

    new ContaCorrenteService().ListarTudo().then(res =>{
      this.contasCorrente = res.data.items;
    })
  }
}
class Model{

}
</script>