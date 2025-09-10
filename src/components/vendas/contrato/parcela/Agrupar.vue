 <template>
  <v-dialog persistent v-model="dialog" width="500" no-click-animation>
    
    <v-card height="300">
      <v-toolbar flat>
        <v-btn icon color="primary" @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title class="title-toolbar">Agrupar</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn color="primary" text @click="Salvar()" :loading="overlay" :disabled="!valid">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar> 
  
        <v-card-text class="pa-3"> 
          <v-form v-model="valid" lazy-validation ref="form">
            <v-col cols="12" md="12">
              <v-text-field filled v-model="modelo.dataVencimento" label="Data de vencimento" type="date" max="9999-12-31" dense :rules="fieldRules"/>
            </v-col>

            <v-row class="pl-12">
              <v-spacer/>
              <v-col cols="12" md="6">
                <v-switch color="primary" v-model="modelo.aplicarEncargos" :label="`Aplicar Encargos`"/>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

      <v-overlay :value="overlay"/>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ReceitaService } from "@/core/services/financeiro";
import { ReceitaParcela } from "@/core/models/financeiro";

@Component
export default class AnteciparContrato extends Vue {
  @Prop() public item!: ReceitaParcela;
  @Prop() public value!: string;

  modelo = new Model();
  receitaService = new ReceitaService();
  valid = true;
  dialog = false;
  overlay = false;
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

  @Watch("modelo")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  Close() {
    this.dialog = false;
    this.modelo = new Model();
  }

  parcelas: any = [];

  Salvar() {
    if (this.$refs.form.validate()) {
      this.parcelas = this.item;
      this.overlay = !this.overlay;

      this.parcelas.forEach((x) => {
        this.modelo.parcelaIds.push(x.id);
      });

      this.receitaService.AgruparParcelas(this.item[0].receitaId, this.modelo).then(
        (res) => {
          this.$swal("Aviso","Operação realizada com sucesso!",res.status == 201 || res.status == 200 ? "success" : "warning");
          this.$emit("salvou");
          this.Close();
        },
        (err) => {
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status == 403) {
            this.$swal("Aviso", err.response.data.message, "warning");
          } else {
            this.$swal("Aviso",err.response.data,err.response.status == 400 ? "warning" : "error");
          }
        }).finally(() => this.overlay = false);
     }
  }
}

class Model {
  public dataVencimento: string = "";
  public parcelaIds: any = [];
  public aplicarEncargos: boolean = true;
}
</script>