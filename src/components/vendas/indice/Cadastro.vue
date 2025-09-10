<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    no-click-animation
    persistent
  > 
    <v-card> 
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>Cadastro do Índice</v-toolbar-title>
        <v-spacer></v-spacer>
  
        <v-toolbar-items>
          <v-btn dark text @click="Salvar()" :disabled="!valid">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar> 
    
      <v-card elevation="1">
        <v-card-text> 
          <v-card-title>
            <v-icon large left color="primary">mdi-information</v-icon> 
            <span class="title-span">Informação do Índice</span>
          </v-card-title>
         
          <v-form v-model="valid" lazy-validation ref="form">
            <v-row dense class="py-3 px-3">
              <v-col cols="12" sm="6">
                <span class="font-weight-bold">Índices*</span>
                <v-select outlined v-model="item.tipoIndiceId" :rules="fieldRules" dense item-value="id" item-text="nomeEditavel" :items="indices.filter(x => x.criado == true)" :menu-props="{ offsetY: true, offsetOverflow: true }">
                   <template v-slot:append-outer>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on" style="margin-top: -5px"  @click="NovoTipoIndice()">
                          <v-icon color="primary">mdi-account-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>Cadastrar Tipo de Indice</span>
                    </v-tooltip> 
                  </template>
                </v-select> 
              </v-col> 
 
              <v-col cols="12" sm="2">
                <span class="font-weight-bold">Dia</span>
                <v-autocomplete placeholder="Selecione" :items="dias" outlined v-model="item.dia" type="number" dense :rules="fieldRules"></v-autocomplete>
              </v-col>

              <v-col cols="12" sm="2">
                <span class="font-weight-bold">Mês</span>
                <v-select :items="meses" item-text="nome" item-value="id" outlined v-model="item.mes" dense :rules="fieldRules" :menu-props="{ offsetY: true, offsetOverflow: true }"></v-select>
              </v-col>

              <v-col cols="12" sm="2">
                <span class="font-weight-bold">Ano</span>
                <v-select :items="anos" outlined v-model="item.ano" :rules="fieldRules" dense type="number" :menu-props="{ offsetY: true, offsetOverflow: true }"></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
      <br>

        <v-card elevation="1" v-if="item.tipoIndiceId != 6">
          <v-card-text>
             <v-card-title>
              <span class="title-span">Mensal</span>
            </v-card-title>

            <v-row dense class="px-3">
              <v-col cols="12" sm="2">
                <span class="font-weight-bold">Índice mensal</span>
                <v-text-field outlined v-model="item.mensal" dense type="number"></v-text-field>
              </v-col>

              <v-col cols="12" sm="2">
                <span class="font-weight-bold">Avulso Mensal</span>
                <v-text-field outlined v-model="item.avulsoMensal" type="number" suffix="%" dense></v-text-field>
              </v-col>
            
              <v-col cols="12" sm="2">
                <span class="font-weight-bold">Total do Avulso Mensal</span>
                <v-text-field disabled outlined v-model="totalMensal" suffix="%" type="number" dense></v-text-field>
              </v-col>               
            </v-row> 
          </v-card-text>
        </v-card>
       <br>
        <v-card elevation="1">
          <v-card-text>
             <v-card-title>
              <span class="title-span">Acumulado</span>
            </v-card-title>
                
            <v-row dense class="px-3">
              <v-col cols="12" sm="2" v-if="item.tipoIndiceId != 6">
                <span class="font-weight-bold">Índice acumulado 12 meses</span>
                <v-text-field outlined v-model="item.acumulado" type="number"  suffix="%" dense></v-text-field>
              </v-col>
 
              <v-col cols="12" sm="2" v-if="item.tipoIndiceId == 6">
                <span class="font-weight-bold">Valor do Salário mínimo</span>
                <v-text-field outlined v-model="item.acumulado" type="number"  dense :rules="fieldRules"></v-text-field>
              </v-col>

              <v-col cols="12" sm="2" v-if="item.tipoIndiceId != 6">
                <span class="font-weight-bold">Avulso</span>
                <v-text-field outlined v-model="item.percentual" type="number"  suffix="%" dense></v-text-field>
              </v-col>
            
              <v-col cols="12" sm="2" v-if="item.tipoIndiceId != 6">
                <span class="font-weight-bold">Total do Índice</span>
                <v-text-field disabled outlined v-model="total" suffix="%" type="number" dense></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-switch color="primary" v-model="item.aplicarIndiceNegativo" :label="`Aplicar índice negativo: ${item.aplicarIndiceNegativo.toSimNao()}`"></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card>


    <cadastro-tipoindice v-model="dialogTipoIndice" :item="tipoIndice" @fechou="dialogTipoIndice = false" @salvou="AtualizarTipoIndice()"/>
  </v-dialog> 
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { TipoIndiceService } from '@/core/services/cadastros';
import Indice from '@/core/models/cadastros/Indice';
import { IndiceService } from '@/core/services/financeiro';
import * as jsonpatch from 'fast-json-patch';
import { TipoIndice } from '@/core/models/cadastros';

@Component
export default class CadastroIndice extends Vue {
  @Prop() public item!: Indice;
  @Prop() public value!: string;

  service = new IndiceService();
  valid = true;
  dialog = false;
  
  //total:number=0;
  dias:any = [];  

  tipoIndice = new TipoIndice();
  dialogTipoIndice:boolean = false;

  meses = [
    { id: 1, nome: "Janeiro" },
    { id: 2, nome: "Fevereiro" },
    { id: 3, nome: "Março" },
    { id: 4, nome: "Abril" },
    { id: 5, nome: "Maio" },
    { id: 6, nome: "Junho" },
    { id: 7, nome: "Julho" },
    { id: 8, nome: "Agosto" },
    { id: 9, nome: "Setembro" },
    { id: 10, nome: "Outubro" },
    { id: 11, nome: "Novembro" },
    { id: 12, nome: "Dezembro" },
  ];

  anos:any = [];

  fieldRules: any[] = [
    (v: any) => !!v || 'Campo obrigatório',
  ]

  indices:any = [];
 
  $refs!: {
    form: HTMLFormElement
  }

  @Watch('item') 
  Item(){
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  observer! : jsonpatch.Observer<Indice>;

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
 
  @Watch('dialog')
  Dialog() {
    if (!this.dialog) {
      this.$emit('fechou');
    }
  } 

  get totalMensal(){
    return Number(this.sum(this.item.mensal, this.item.avulsoMensal)) || 0;
  }

  get total(){
    return Number(this.sum(this.item.acumulado, this.item.percentual)) || 0;
  }

  Salvar() {
    if (this.$refs.form.validate()) {
    let modelo = this.item;
    let pacthModel = jsonpatch.generate(this.observer);

    (this.item.id > 0 ? this.service.Patch(pacthModel, this.item.id) : this.service.Salvar(modelo)).then(
     res => {
        this.$swal("Aviso","Operação realizada com sucesso!", res.status == 201 || res.status == 200 ? "success" : "warning");
        this.$emit("salvou");
        this.Close()
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

  Close() {
    this.dialog = false;
   // this.total = 0;
  }

  GetAnos(){
    var max = new Date().getFullYear() + 1;
    var min = max - 50

    for (let i = max; i >= min; i--) {
      this.anos.push(i)
    }
    return this.anos 
  }

  GetDias(){
    for(let i = 1; i <= 30; i++){
      this.dias.push(i);
    }    
  }

  sum = (x: any, y: any) => parseFloat(x) + parseFloat(y);

  NovoTipoIndice(){
    let qtdeDisponivel = this.indices.filter( (item:any) => item.criado == false).length;

    if(qtdeDisponivel == 4)
      return this.$swal("Aviso", "Limite dos tipos personalizados atingido.", "warning");


    this.tipoIndice = this.indices.find(item => item.criado == false);
    this.dialogTipoIndice = true;
  }

  AtualizarTipoIndice(){
     new TipoIndiceService().ListarTudo().then(
      res => {
        this.indices = res.data.items;
      }
    );
  }

  mounted() {
    this.AtualizarTipoIndice();
    this.GetDias();
    this.GetAnos();
  }
}
</script>