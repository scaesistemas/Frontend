<template>
    <v-row justify="center" style="gap: 15px; margin-top:-40px" class="fundo">
      
      <v-hover v-slot:default="{ hover }" close-delay="50"  class="item">
        <v-card class=" ma-1 pa-0 rounded-lg d-flex" :elevation="hover ? 12 : 2" to="/financeiro/receita">
          <div class="d-flex align-center pa-1">
            <div>
              <v-card-subtitle class="ma-0">
                <p style="margin: 0; padding: 0; font-weight: 700; color: #E05A1B; font-size: 16px;" class="pb-1">Receitas</p>
              </v-card-subtitle>
            </div>
            <img src="../../assets/images/newIconsDashboard/Icon.svg"/>
          </div>
        </v-card>
      </v-hover>

      <v-hover v-slot:default="{ hover }" close-delay="50"  class="item">
        <v-card class=" ma-1 pa-0 rounded-lg d-flex" :elevation="hover ? 12 : 2" to="/financeiro/despesa">
          <div class="d-flex align-center pa-1">
            <div>
              <v-card-subtitle class="ma-0">
                <p style="margin: 0; padding: 0; font-weight: 700; color: #E05A1B; font-size: 16px;">Despesas</p>
              </v-card-subtitle>
            </div>
            <img src="../../assets/images/newIconsDashboard/Icon.svg"/>
          </div>
        </v-card>
      </v-hover> 

      <v-hover v-slot:default="{ hover }" close-delay="50"  class="item">
        <v-card class=" ma-1 pa-0 rounded-lg d-flex" :elevation="hover ? 12 : 2" to="/financeiro/relatorio/fluxocaixa/configuracao">
          <div class="d-flex align-center pa-1">
            <div>
              <v-card-subtitle>
                <p style="margin: 0; font-weight: 700; color: #E05A1B; font-size: 16px; line-height: 1.0;">Fluxo de
                  caixa</p>
              </v-card-subtitle>
            </div>
            <img  src="../../assets//images/newIconsDashboard/fluxo-caixa-icon.svg" />
          </div>
        </v-card>
      </v-hover>

      <v-hover v-slot:default="{ hover }" close-delay="50"  class="item">
        <v-card class=" ma-1 rounded-lg d-flex" :elevation="hover ? 12 : 2" to="/gestao/contrato">
          <div class="d-flex align-center pa-1">
            <div>
              <v-card-subtitle class="text-no-wrap pb-0 pt-0" style="font-weight: 700; color: #E05A1B; font-size: 16px;">
                <p style="margin: 0; padding: 0; font-weight: 700; color: #E05A1B; font-size: 16px;" class="pb-1">Contratos</p>
              </v-card-subtitle>
            </div>
            <img src="../../assets//images/newIconsDashboard/contrato-icon.svg" />
          </div>
        </v-card>
      </v-hover>

     

      <v-hover v-slot:default="{ hover }" close-delay="50"  class="item">
        <v-card class=" ma-1 rounded-lg d-flex" :elevation="hover ? 12 : 2" to="/negocios/empreendimento">
          <div class="d-flex align-center pa-1">
            <div>
              <v-card-subtitle class="text-no-wrap" style="font-weight: 700; color: #E05A1B; font-size: 16px;">Empreendimentos</v-card-subtitle>
            </div>
            <img src="../../assets//images/newIconsDashboard/empreendimento-icon.svg" />
          </div>
        </v-card>
      </v-hover>

      <v-hover v-slot:default="{ hover }" close-delay="50"  class="item">
        <v-card class=" ma-1 rounded-lg d-flex" :elevation="hover ? 12 : 2" to="/negocios/pessoa">
          <div class="d-flex align-center pa-1">
            <div>
              <v-card-subtitle class="text-no-wrap" style="font-weight: 700; color: #E05A1B; font-size: 16px;">Pessoas</v-card-subtitle>
            </div>
            <img src="../../assets//images/newIconsDashboard/pessoa-icon.svg" />
          </div>
        </v-card>
      </v-hover>
      <atalho-filtro v-model="dialogEmitirBoleto" @fechou="dialogEmitirBoleto = false"/> 
    </v-row>
    
</template>  
  
  <script lang="ts">
  import { Vue, Component, Prop, Watch } from "vue-property-decorator";
  
  @Component
  export default class LinksDashboard extends Vue {
  dialogEmitirBoleto = false;
  
    $refs!: {
      form: HTMLFormElement;
    };
  
  
    mounted(){
     
    }
  }
  </script>

<style scoped lang="css">
.item{
  height:70px
}
  
  </style>
