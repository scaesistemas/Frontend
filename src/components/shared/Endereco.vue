<template>
  <v-card flat>
    <v-card-text>
      <v-card-title>
        <!-- <v-icon color="primary" large left>mdi-map</v-icon> -->
        <span class="title-span">Endereço</span>
      </v-card-title>

      <v-row class="px-3 pt-3" dense>
        <v-col cols="12" md="2">
          <span class="font-weight-bold">CEP*</span>
          <v-text-field outlined :rules="fieldRules" v-model="item.cep" @input="buscarCep()" type="text" dense v-mask="'#####-###'" maxlength="9"/>
        </v-col>

        <v-col cols="12" md="6">
          <span class="font-weight-bold">Logradouro*</span>
          <v-text-field outlined :rules="fieldRules" dense v-model="item.logradouro" :loading="carregando" maxlength="40"/>
        </v-col> 
 
        <v-col cols="12" md="1">
          <span class="font-weight-bold">Número</span>
          <v-text-field outlined dense v-model="item.numero"/>
        </v-col>

        <v-col cols="12" md="3">
          <span class="font-weight-bold">Complemento</span>
          <v-text-field outlined dense v-model="item.complemento" maxlength="15"/>
        </v-col> 

        <v-col cols="12" md="4">
          <span class="font-weight-bold">Bairro*</span>
          <v-text-field outlined :rules="fieldRules" dense v-model="item.bairro" :loading="carregando"/>
        </v-col>

        <v-col cols="12" md="4">
          <span class="font-weight-bold">Estado*</span>
          <v-autocomplete placeholder="Selecione" outlined :rules="fieldRules" :items="listaEstado" item-value="id" item-text="nome" dense v-model="item.estadoId" :loading="carregando" @change="carregarMunicipio"/>
        </v-col>

        <v-col cols="12" md="4">
          <span class="font-weight-bold">Município*</span>
          <v-autocomplete placeholder="Selecione" outlined :rules="fieldRules" :items="listaMunicipio" item-value="id" item-text="nome" dense v-model="item.municipioId" :loading="carregando"/>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
 
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Endereco } from '@/core/models/shared';
import { Estado, Municipio } from '@/core/models/geral';
import { EnderecoService } from '@/core/services/geral/EnderecoService';
 
@Component
export default class VCardEndereco extends Vue {
  @Prop() item!: Endereco;

  listaMunicipio: Municipio[] = [];
  listaEstado: Estado[] = [];
  carregando: boolean = false;
  serviceEndereco = new EnderecoService();

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  created() {
    this.carregarMunicipio();
  }

  @Watch("item.estadoId")
  carregarMunicipio() {
    if (this.item.estadoId > 0) {
      this.carregando = true;

      this.serviceEndereco.ListarMunicipiosPorIdEstadual(this.item.estadoId).then(res => {
        this.listaMunicipio = res.data.items;
        this.carregando = false;
      });
    }
  }
  

 buscarCep() {
    if (this.item.cep.length === 9) {
      this.carregando = true;
      try {
         this.serviceEndereco.EncontrarEnderecoPorCep(this.item.cep).then(
          (res) =>{
            this.item.cep = res.data.cep;
            this.item.bairro = res.data.bairro;
            this.item.logradouro = res.data.logradouro;
            this.item.estadoId = res.data.estadoId;
            this.item.municipioId = res.data.municipioId;
            this.carregando = false;
          }
        )       
      } catch (err) {
        this.$swal({title: "Atenção", text: `Erro ao efetuar a consulta do cep ${this.item.cep}. Verifique se o CEP informado é válido e tente novamente.`, timer:2000, icon: "warning", showConfirmButton:false, allowOutsideClick:false, allowEnterKey:false});
        this.carregando = false;
        this.item = new Endereco();
      }
    }
}

  mounted(){
    this.serviceEndereco.ListarEstados().then(res => {
      this.listaEstado = res.data.items;
    });
  }
}
</script>
