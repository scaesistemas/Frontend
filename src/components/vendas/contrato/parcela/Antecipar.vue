<template>
  <v-dialog persistent v-model="dialog" width="500" no-click-animation>
    <v-card height="300">
      <v-toolbar flat>
        <v-btn icon color="primary"  @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn> 
  
      <v-toolbar-title class="title-toolbar">Antecipar</v-toolbar-title>
        <v-spacer/> 
        <v-toolbar-items>
          <v-btn color="primary" text @click="Simular()" :disabled="!valid">Simular</v-btn>
          <v-btn color="primary" text @click="Salvar()" :loading="overlay" :disabled="!valid">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar>   

    <v-card-text class="py-6">   
      <v-form v-model="valid" lazy-validation ref="form">
        <v-col cols="12" md="12">
          <v-text-field filled v-model="model.dataVencimento" label="Data de vencimento" type="date" dense :rules="fieldRules" max="9999-12-31" @input="GetAntecipacao('valor', $event)"/>
        </v-col>

          <v-row justify="end">
            <v-col cols="12" md="5">
              <v-list-item-content>
                <v-list-item-title> Valor da antecipação </v-list-item-title>
                <v-list-item-subtitle>
                  {{ valor  ? Number(valor).toMoeda(true) : new Number(0).toMoeda(true)}}  
                </v-list-item-subtitle>
              </v-list-item-content>
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
 
  model = new Model();
  receitaService = new ReceitaService();
  valor:number = 0;
  
  valid = true;
  dialog = false;
  overlay = false;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];
  parcelas:any = [];

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

  @Watch("model")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    } 
  }

  filter: {
    receitaId:number,
    parcelaIds: any;
    dataSimulada:string
  } = {
    receitaId: 0,
    parcelaIds:[],
    dataSimulada: ''
  }; 
 
  Simular(){
    if (this.$refs.form.validate()) {
     let parcelas:any = this.item;
  
      this.filter.parcelaIds = [];
      this.filter.receitaId = this.item[0].receitaId;
      this.filter.dataSimulada = this.model.dataVencimento
  
      parcelas.forEach(element => {
        this.filter.parcelaIds.push(element.id)
      });

      let routeLink = this.$router.resolve({ 
        name: "RelComprovante",
        query: {
          parcelaIds: this.filter.parcelaIds ? this.filter.parcelaIds.toString() : "",
          dataSimulada:this.filter.dataSimulada,
          receitaId: this.filter.receitaId ? this.filter.receitaId.toString() : ""
        },
      });
      window.open(routeLink.href, "_blank");
    }
  }
  
  Salvar() {
    if (this.$refs.form.validate()) {
      this.overlay = !this.overlay;

      this.model.parcelaIds = [];
      this.parcelas = this.item;
      
      this.parcelas.forEach(x => {
        this.model.parcelaIds.push(x.id)
      });

      this.receitaService.Antecipacao(this.item[0].receitaId, this.model).then(
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
      }).finally(() => this.overlay = false);
    }
  } 

  GetAntecipacao(tipo, x) {
    if(tipo.toLocaleLowerCase() === "valor"){ 
      if(x.length == 10){
        if(x.charAt(0) > 0){

          this.model.parcelaIds = []; 
          this.parcelas = this.item;
          
          this.parcelas.forEach(x => {
            this.model.parcelaIds.push(x.id)
          });
        
          this.receitaService.ObterAntecipacao(this.item[0].receitaId, this.model.parcelaIds, this.model.dataVencimento).then(
            (res) => {
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
              return this.valid = false, this.model = new Model();
            });
          }
        }
      }
  }

  Close() {
    this.model.parcelaIds = [];
    this.model = new Model();
    this.valor = 0;
    this.dialog = false;
  } 
}

class Model { 
  parcelaIds:any = []; 
  dataVencimento:string ='';
} 
</script>
