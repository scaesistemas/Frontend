<template>
  <v-dialog persistent v-model="dialog" width="800" no-click-animation>
    <v-card>
      <v-toolbar flat>
        <v-btn icon color="primary"  @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn> 
  
      <v-toolbar-title class="title font-weight-regular">Lista dos signatários cadastrados</v-toolbar-title>
        <v-spacer/> 

        <v-toolbar-items>
           <v-btn :disabled="!valid" color="primary" text @click="Salvar()">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar>  

      <v-card-text>   
        <v-form v-model="valid" lazy-validation ref="formEmail">
          <v-row dense>
            <v-col cols="12" md="12">
              <div class="font-weight-bold">Signatário</div> 
              <v-autocomplete  placeholder="Digite o nome do signatário" @change="ObterPessoa(signatario.clienteId)" v-model="signatario.clienteId" dense outlined :items="listaCombinada" item-value="id" item-text="nome"/>
            </v-col>

            <v-col cols="12" md="10">
              <div class="font-weight-bold">E-mail</div> 
              <v-text-field append-icon="mdi-email" placeholder="Caso o signatário não possua um e-mail, insira-o aqui." v-model="signatario.email" dense outlined :rules="fieldRules"/>
            </v-col>

            <v-col cols="12" md="8">
              <div class="font-weight-bold">Tipo de assinatura</div> 
              <v-select v-model="signatario.tipoAssinaturaId"  placeholder="Selecione" item-text="nome" item-value="id" :items="tiposAssinatura"  dense outlined :rules="fieldRules"/>
            </v-col>
            
            <v-col cols="12" md="2" class="mt-6">
              <v-btn :disabled="!valid" color="primary" @click="AdicionarSignatario()">
                {{ `${emailIndex === -1 ? 'Adicionar' : 'Editar'}` }} 
                <v-icon small right>{{ `${emailIndex === -1 ? 'mdi-plus' : 'mdi-pencil'}` }}</v-icon>
              </v-btn>
            </v-col>
          </v-row> 
        </v-form>
 
      <v-data-table item-key="item.key" no-data-text="Lista em branco" :items="item.signatarios" height="200" :headers="headers" :items-per-page="5" class="elevation-1">
        <template v-slot:[`item.actions`] = "{item}">
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-icon @click="EditarSignatario(item)" small v-on="on">mdi-pencil</v-icon>
              </template>
            <span>Editar</span>
          </v-tooltip>

          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon @click="ExcluirSignatario(item)" small v-on="on">mdi-delete</v-icon>
              </template>
            <span>Excluir</span>
          </v-tooltip>
        </template>

          <template v-slot:[`item.clienteId`] = "{item}">
            {{listaPessoas.find(x=> x.id == item.clienteId)  ? listaPessoas.find(x=> x.id == item.clienteId).nome : '(Não possui cadastro)'}}
          </template>

          <template v-slot:[`item.email`] = "{item}">
            {{ item.email }}
          </template>

          <template v-slot:[`item.tipoAssinaturaId`] = "{item}">
            {{ tiposAssinatura.find(x => x.id == item.tipoAssinaturaId) ? tiposAssinatura.find(x => x.id == item.tipoAssinaturaId).nome : '(Não possui cadastro)' }}
          </template>
        </v-data-table> 
      </v-card-text> 
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {  ContratoDigital, SignatarioContratoDigital } from "@/core/models/cadastros";
import { ContratoService, PessoaService, TipoAssinaturaService } from "@/core/services/cadastros";

@Component
export default class AnteciparContrato extends Vue {
  @Prop() public item!: ContratoDigital;
  @Prop() public value!: string;
  
  signatario = new SignatarioContratoDigital();
  service = new ContratoService();
  emailIndex: number = -1;

  listaPessoas = [];
  tiposAssinatura = [];
  listaCombinada = [{id:0, nome:""}];
  
  valid = true;
  dialog = false;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  headers = [
    { text: "", value: "actions", sortable: false },
    { text: 'Signatário', value: 'clienteId' },
    { text: 'E-mail', value: 'email' },
    { text: 'Tipo Assinatura', value: 'tipoAssinaturaId' }
  ];

  $refs!: {
    form: HTMLFormElement;
    formEmail: HTMLFormElement;
  }; 
  
  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }else{
      this.CarregarContrato();
    }
  }

  ObterPessoa(id){
    new PessoaService().ObterPorId(id).then(
      res => {
        this.signatario.email = res.data.email;
      },
      err => {
        if (!err.response) {
          this.$swal("Aviso", "Não foi possível acessar a API", "error");
        } else if (err.response.status == 403) {
          this.$swal("Aviso", err.response.data.message, "warning" );
        } else {
          this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
        }
      })
  }

  CarregarContrato(){
    new ContratoService().ObterPorId(this.item.contratoId, 'Corretores.Corretor, Clientes.Cliente, Empreendimento.Proprietarios.Proprietario').then(
      res => {
       this.listaCombinada = [
          ...res.data.empreendimento.proprietarios.map(x => ({ id: x.proprietarioId, nome: x.proprietario.nome })),
          ...res.data.corretores.map(x => ({ id: x.corretorId, nome: x.corretor.nome })),
          ...res.data.clientes.map(x => ({ id: x.clienteId, nome: x.cliente.nome }))
        ];
      },
      err => {
        if (!err.response) {
          this.$swal("Aviso", "Não foi possível acessar a API", "error");
        } else if (err.response.status == 403) {
          this.$swal("Aviso", err.response.data.message, "warning" );
        } else {
          this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
        }
    }) 
  }

  Salvar() {
    if(this.item.signatarios.length == 0){
      this.$swal("Aviso", "É necessário adicionar signatários na lista!", "warning" );
      return;
    }
      this.item.signatarios.forEach((x:any) => x.situacao = undefined);
      this.service.AlterarContratoDigital(this.item.id, this.item).then(
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

  Close() {
    this.dialog = false;
  }

  AdicionarSignatario(){
    if (this.$refs.formEmail.validate()) {
      const clienteId = this.signatario.clienteId;
      const email = this.signatario.email;

      const clienteExistente = this.item.signatarios.find((x, index) => x.clienteId === clienteId && index !== this.emailIndex);
      const emailExistente = this.item.signatarios.find((x, index) => x.email === email && index !== this.emailIndex);

      if (emailExistente) {
        this.$swal("Aviso", "Este e-mail já foi adicionado na lista.", "warning");
        return;
      }

      if (clienteExistente && clienteId > 0) {
        this.$swal("Aviso", "Esta pessoa já foi adicionada na lista.", "warning");
        return;
      }
      
      if (this.emailIndex > -1) {
        Object.assign(this.item.signatarios[this.emailIndex], this.signatario);
      } else {
        this.item.signatarios.push(this.signatario);
      }
      this.emailIndex = -1;
      this.signatario = new SignatarioContratoDigital();
      this.$refs.formEmail.resetValidation();
    }
  }

  EditarSignatario(item){
    this.signatario = Object.assign({}, item);
    this.emailIndex = this.item.signatarios.indexOf(item);
  } 

  ExcluirSignatario(item){
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja excluir o registro atual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
    }).then((result) => {
      if(item.id > 0)
      this.service.ExcluirSignatario(item.id).then();
       
      const index = this.item.signatarios!.indexOf(item);
      this.item.signatarios.splice(index, 1);
      this.$swal("Aviso", "Registro excluído com sucesso!", "success");
    });
  }
  
  mounted(){
    new PessoaService().Listar(-1, -1, ['nome'],[],'',[], '', '' , 'Id,nome,cnpjCpf, nomeCnpjCpf, Email', '').then(res => {
      this.listaPessoas = res.data.items;
    })

    new TipoAssinaturaService().ListarTudo().then(res => {
      this.tiposAssinatura = res.data.items;
    })
  }
}
</script>
