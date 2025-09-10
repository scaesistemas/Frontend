 <template>
  <v-dialog persistent v-model="dialog" width="500" no-click-animation>

  <v-card height="300">
    <v-toolbar>
      <v-btn icon color="primary" @click="Close()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
 
      <v-toolbar-title class="title-toolbar">Cobrança Automática</v-toolbar-title>
        <v-spacer></v-spacer>  
         <v-toolbar-items>
          <v-btn  color="primary" text @click="Salvar()" :disabled="!valid">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar> 
 
      <v-card flat> 
        <v-card-text>  
          <v-form v-model="valid" lazy-validation ref="form">
            <v-row dense class="px-3">
              <v-col cols="12" md="8">
                <v-switch color="primary" v-model="item.gerarBoletoAutomatico" label="Gerar boleto automático"/>
              </v-col>

              <v-col cols="12" md="8">
                <v-switch color="primary" v-model="item.realizarCobrancaAutomatica" label="Realizar cobrança automática"/>
              </v-col>
         
              <v-col cols="12" md="8" v-if="item.tipoId == 5">
                <v-switch color="primary" v-model="item.isReajustavel" label="Realizar o reajuste"/>
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
import { Receita } from "@/core/models/financeiro";
import * as jsonpatch from 'fast-json-patch';

@Component
export default class ConfigurarReceita extends Vue {
  @Prop() public item!: Receita;
  @Prop() public value!: string;

  receitaService = new ReceitaService();
  observer! : jsonpatch.Observer<Receita>;

  valid = true;
  dialog = false;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];
  
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

  $refs!: { 
    form: HTMLFormElement;
  }; 

  @Watch("item")
  Item() {
      if (this.$refs.form) {
      this.$refs.form.resetValidation();
      } 
  }

  Close() { 
    this.dialog = false;
  }
 
  Salvar() {
    if (this.$refs.form.validate()) {
    let pacthModel = jsonpatch.generate(this.observer);

     (this.item.id > 0 ? this.receitaService.Patch(pacthModel, this.item.id) : this.receitaService.Salvar(this.item)).then(
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
</script>