<template>
  <v-dialog
    v-model="dialog"
    max-width="650"
    hide-overlay
    transition="dialog-bottom-transition"
    no-click-animation
  >
    <v-card>
            <v-card-title>
              <span class="text-h5"> Transferência por PIX </span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="5">
                     <span class="font-weight-bold">Tipo de Chave*</span>
                    <v-select dense outlined></v-select>
                  </v-col>

                  <v-col cols="12" sm="12" md="7">
                     <span class="font-weight-bold">Chave Pix*</span>
                    <v-text-field dense outlined></v-text-field>
                  </v-col>

                

                  <v-col cols="12" sm="12" md="4">
                    <span class="font-weight-bold">Valor para transferir</span>
                    <money-input readonly  dense />
                  </v-col>


                  

                  <!-- <v-col cols="12" sm="6" md="4">
                    <v-text-field label="Fat (g)"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field label="Carbs (g)"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-text-field label="Protein (g)"></v-text-field>
                  </v-col> -->
                </v-row>
                <br>
            <v-divider></v-divider>
            <br>
                <v-row>
                    <v-col cols="12" sm="12" md="6">
                        <v-switch v-model="agendarPagament" label="Agendar Pagamento?"></v-switch>
                    </v-col>        

                     <v-col cols="12" sm="12" md="4" v-if="agendarPagament">
                        <span class="font-weight-bold">Data do Pagamento</span>
                        <v-text-field outlined dense type="date" ></v-text-field>
                    </v-col>   
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false">Fechar</v-btn>
              <v-btn color="primary" text @click="dialog = false">Salvar</v-btn>
            </v-card-actions>
          </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { BancoService } from "@/core/services/financeiro";
import { Banco } from "@/core/models/financeiro";
import * as jsonpatch from 'fast-json-patch';
import { TratarErroApi } from "@/assets/scripts/helper";

@Component
export default class CadastroBanco extends Vue {
  @Prop() public item!: Banco;
  @Prop() public value!: string;

  service = new BancoService();
  agendarPagament = false;
  valid = true;
  dialog = false;

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  $refs!: {
    form: HTMLFormElement;
  }; 

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation(); 
    } 
  }

  observer! : jsonpatch.Observer<Banco>; 

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
  
  Salvar() {
    if (this.$refs.form.validate()) {
      let pacthModel = jsonpatch.generate(this.observer);
    
      (this.item.id > 0 ? this.service.Patch(pacthModel, this.item.id) : this.service.Salvar(this.item)).then(
        (res) => {
        this.$swal("Aviso","Operação realizada com sucesso!",res.status == 201 || res.status == 200 ? "success" : "warning");
        this.$emit("salvou");
        this.Close(); 
      },
      (err) => TratarErroApi(err)
      )
    }
  }

  Close() {
    this.dialog = false;
  }
}
</script>
