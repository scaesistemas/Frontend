 <template>
  <v-dialog v-model="dialog" width="600" no-click-animation>
    <v-card>
      <v-toolbar flat>
        <v-btn icon color="primary" @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="title-toolbar">Quitação</v-toolbar-title>
        <v-spacer/>

        <v-toolbar-items>
          <v-btn color="primary" text @click="Simular()" :disabled="!valid">Simular Relatório</v-btn>
          <v-btn color="primary" text @click="Salvar()" :disabled="!valid">Gerar Boleto</v-btn> 
        </v-toolbar-items> 
      </v-toolbar>  
  <br>
      <v-card-text> 
        <v-form v-model="valid" lazy-validation ref="form" class="pt-3">
          <v-row>  
            <v-col cols="12" md="8">
              <v-text-field outlined v-model="modelo.data" label="Data de vencimento" :rules="fieldRules" max="9999-12-31" type="date" @input="GetQuitacao('valor', $event)" dense/>
            </v-col>
          </v-row>
        </v-form> 
   
        <v-row> 
          <v-spacer/>
            <v-col cols="4">
              <v-list-item-content class="align-end">
                <v-list-item-title> Valor da quitação </v-list-item-title>
                  <v-list-item-subtitle>{{valor.toMoeda(true)}}
                </v-list-item-subtitle> 
              </v-list-item-content>
            </v-col>
        </v-row>
      </v-card-text> 
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Receita } from "@/core/models/financeiro";
import {ReceitaService} from "@/core/services/financeiro";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class QuitadorContrato extends Vue {
  @Prop() public item!: Receita;
  @Prop() public value!: string;
  @Prop() public tipoAmortizacaoId!: number;

  modelo = new Model(); 
  dialog = false;
  receitaService = new ReceitaService();
  valid = true;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  valor: number = 0;

  $refs!: {
    form: HTMLFormElement;
  };

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
  }

  @Watch("modelo")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }else{
       this.GetQuitacao();
    }
  }

  Close() {
    this.dialog = false;
    this.Reset();
  }

  Salvar() {
    if (this.$refs.form.validate()) {
      this.modelo.tipoAmortizacaoId = this.tipoAmortizacaoId;
      let modelo = this.modelo;

      this.receitaService.Quitar(this.item.id, modelo).then(
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
      })
    }
  }

  Simular(){
    if (this.$refs.form.validate()) {
      let routeLink = this.$router.resolve({ 
        name: "RelSimulacaoQuitacao",
        query: {
          dataSimulada:this.modelo.data,
          receitaId: this.item.id ? this.item.id.toString() : "",
          tipoAmortizacaoId: this.item.contrato!.tipoAmortizacaoId ?  this.item.contrato!.tipoAmortizacaoId.toString() : "",
        },
      });
      window.open(routeLink.href, "_blank");
    }
  }

  GetQuitacao() {
    if (this.modelo.data.length === 10 && parseInt(this.modelo.data.charAt(0)) > 0) {
      new ReceitaService().GetTotalSimulacaoQuitacao(this.item.id, 0, this.modelo.data, this.tipoAmortizacaoId).then(
        res => {
          this.valor = res.data;
          this.valid = true;
        },
          (err) => {  
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status == 403) {
            this.$swal("Aviso", err.response.data.message, "warning");
          } else {
            this.$swal("Aviso",err.response.data,err.response.status == 400 ? "warning" : "error");
          }
          return this.Reset();
        }
      )
    }
  }

  Reset(){
    this.valid = false;
    this.valor = 0;
    this.modelo = new Model();    
  }
}

class Model {
  data:any = new Date().yyyymmdd();
  tipoAmortizacaoId!:number;
}
</script>