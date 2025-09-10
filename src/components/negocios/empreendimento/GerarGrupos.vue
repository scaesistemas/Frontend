 <template>
  <v-dialog persistent v-model="dialog" width="500"  no-click-animation>
  <v-card>
    <v-toolbar>
      <v-btn icon color="primary" @click="Close()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
 
      <v-toolbar-title class="title font-weight-regular">Grupos</v-toolbar-title>
        <v-spacer/> 
      </v-toolbar> 
 
      <v-card outlined> 
        <v-card-text class="py-3">
          <v-card-title>
            <v-icon>mdi-grid-large</v-icon>
            <span class="font-weight-regular"> Quantos <strong> Grupos</strong> deseja gerar?</span>
          </v-card-title>

          <v-col cols="12" md="8">
            <v-text-field placeholder="Digite" outlined type="number" v-model="qtdeQuadras" dense/>
          </v-col>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" text @click="GerarGrupos()">Gerar</v-btn>
        </v-card-actions>
      </v-card>
    </v-card> 
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Empreendimento, Grupo } from "@/core/models/cadastros";
import { EmpreendimentoService } from "@/core/services/cadastros";
import { TratarErroApi } from "@/assets/scripts/helper";

@Component
export default class ConfigurarReceita extends Vue {
  @Prop() public item!: Empreendimento;
  @Prop() public value!: string;
  @Prop() public grupos!:any [];

  service = new EmpreendimentoService();
  qtdeQuadras = 0;
   
  valid = true;
  dialog = false;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];
  
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

  GerarGrupos() {
    if (!this.validarQuantidade()) {
      this.$swal('Atenção!', 'A quantidade não pode ser menor ou igual a 0.', 'warning');
      return;
    }
    
    if (!this.validarLimiteGrupos()) {
      this.$swal('Atenção!', 'Não é permitido exceder o limite de 100 grupos.', 'warning');
      return;
    }

    const adicionarGrupo = (nome) => {
      for (let i = 1; i <= this.qtdeQuadras; i++) {
        let grupo = new Grupo();
        if (this.item.id > 0) {
          grupo.empreendimentoId = this.item.id;
        }
        
        if(this.item.id > 0){
          grupo.empreendimentoId = this.item.id;
          grupo.nome = `${i < 10 ? `0${i}` : i}`;
        }
        
        grupo.nome = `${nome} ${i < 10 ? `0${i}` : i}`;
        this.grupos.push(grupo);
      }
    };

    if (this.grupos.length === 0) {
      adicionarGrupo("");
    } else {
      adicionarGrupo("Nova Quadra");
    }

    if (this.item.id > 0) {
      this.CriarGrupos();
    }
    
    this.dialog = false;
    this.qtdeQuadras = 0;
  }

  validarQuantidade() {
    return this.qtdeQuadras > 0;
  }

  validarLimiteGrupos() {
    return this.qtdeQuadras <= 100;
  }

  /* Grupos */
  CriarGrupos(){
    let novosGrupos = this.grupos; 
    this.service.SalvarGrupos(novosGrupos).then(
      (res) => {
        this.$emit("salvou"); 
        this.Close()
      },  
      (err) => TratarErroApi(err)
    )
  }
}
</script>