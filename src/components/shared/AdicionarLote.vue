 <template>
  <v-dialog v-model="dialog" width="1000" no-click-animation persistent>
    <v-card>
      <v-toolbar flat>
        <v-btn icon color="primary" @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="title font-weight-regular">Adicionar Lotes</v-toolbar-title>
        <v-spacer/>

        <v-toolbar-items>
          <v-btn color="primary" text  @click="Close()">Confirmar</v-btn>
        </v-toolbar-items>
      </v-toolbar>
     <br> 
 
      <v-card-text> 
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row dense>  
            <v-col cols="12" md="8">
              <div class="font-weight-bold">Empreendimento</div>
              <v-autocomplete placeholder="Selecione" outlined v-model="empreendimentoId" @change="ObterGrupos()" dense :items="listaEmpreendimentos" :rules="fieldRules" item-value="id" item-text="nome"/>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" md="4">
              <div class="font-weight-bold">Grupo</div>
              <v-autocomplete v-model="grupoId" placeholder="Selecione" outlined @change="ObterUnidades()" :rules="fieldRules" dense :items="listaGrupos" item-value="id" item-text="nome"/>
            </v-col>

            <v-col cols="12" md="4">
              <div class="font-weight-bold">Unidade</div>
              <v-autocomplete v-model="unidade.unidadeId" placeholder="Selecione" :rules="fieldRules" outlined dense :items="listaUnidades" item-value="id" item-text="nome" :disabled="grupoId==0"/>
            </v-col>

            <v-col cols="12" md="2" class="pt-6">
              <v-btn large outlined color="primary" @click="Adicionar()">
                <v-icon left>mdi-plus</v-icon> Adicionar
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
         
        <v-data-table :items="listaLotes" :headers="headers" class="elevation-1" item-key="item.id">
          <template v-slot:[`item.actions`]= "{item}">
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon small @click="ExcluirItem(item)" v-on="on">mdi-delete</v-icon>
              </template>
              <span>Excluir</span>
            </v-tooltip> 
          </template>   

          <template v-slot:[`item.nome`] = "{item}">
            {{ unidades.find(x=>x.id == item.unidadeId).nome }}  
          </template>
        </v-data-table>
      </v-card-text>
    </v-card> 
  </v-dialog> 
</template> 

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Empreendimento } from "@/core/models/cadastros";
import { EmpreendimentoService } from "@/core/services/cadastros";
import { ContratoUnidadeAdicional } from "@/core/models/contratos";
 
@Component
export default class MultiLotes extends Vue {
  @Prop() public item!: Empreendimento;
  @Prop() private value!: string;
  @Prop() private tipoId!: 0;
  @Prop() private unidadeId!:0;
  @Prop() lista?: any[];

  listaLotes:ContratoUnidadeAdicional[] = [];

  valid = true;
  dialog = false;

  headers = [
    { text: '', value: 'actions', sortable: false },
    { text: 'Nome', value: 'nome',},
  ]

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];
  editedIndex = -1;

  unidade = new ContratoUnidadeAdicional();
  listaUnidades = [];
  listaEmpreendimentos = [];
  listaGrupos = [];

  empreendimentoId = 0;
  grupoId = 0;

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
    }else{
      this.ObterEmpreendimentos();
    }
  }

  @Watch("unidade")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  Adicionar(){
    if (this.$refs.form.validate()) {

      if(this.unidade.unidadeId == 0)
      return this.$swal("Aviso","É necessário selecionar a unidade!", "warning");

      if (this.editedIndex > -1) {
        Object.assign(this.listaLotes[this.editedIndex], this.unidade);

        } else {
          this.listaLotes.push(this.unidade);
          this.AtualizarLista(this.listaLotes);
          this.ObterUnidades();
        }

      this.unidade = new ContratoUnidadeAdicional();
      this.editedIndex = -1; 
    }
  } 

  ExcluirItem(item){
    this.$swal({
    title: "Atenção!",
    text: "Tem certeza que deseja excluir o registro atual?",
    icon: "question",
    showCancelButton: true,  
    confirmButtonText: "Sim",
    cancelButtonText: "Não",
    showCloseButton: true,
    showLoaderOnConfirm:true,
    preConfirm:() => {
      const index = this.listaLotes.indexOf(item);
      this.listaLotes.splice(index, 1);
      this.ObterUnidades();
      this.AtualizarLista(this.listaLotes);
      return this.$swal("Aviso", "Registro excluído com sucesso!", "success");
    },
    // @ts-ignore: Unreachable code error
    allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if(result.value){
      }
    })
  }

  Close() {
    this.dialog = false;
    this.grupoId = 0;
  }

  ObterEmpreendimentos(){
    let filter = { tipoId: this.tipoId };

    new EmpreendimentoService().Listar(-1, -1, ['nome'], [], undefined, [], filter, '', "Id,Nome", "").then(
      res => { this.listaEmpreendimentos = res.data.items})
  }

  ObterUnidades() {
    new EmpreendimentoService().ListarUnidade(this.grupoId)
      .then(res => {
        const unidadesFiltradas = res.data.filter(x => x.situacaoId == 1).filter(x => x.id != this.unidadeId);
       
        if (this.listaLotes.length > 0) {
          this.listaUnidades = unidadesFiltradas.filter(unidade => !this.listaLotes.some(objB => objB.unidadeId == unidade.id));
        } else {
          this.listaUnidades = unidadesFiltradas;
        }
      }) 
    .catch(error => {
      console.error("Erro ao obter unidades:", error);
    });
  }

  ObterGrupos(){
    new EmpreendimentoService().ListarGrupo(this.empreendimentoId).then(
      res => {this.listaGrupos = res.data})
  }

  AtualizarLista(novoValor: any) {
    this.$emit("update:lista", novoValor);
  }
  
  @Watch("lista")
  ObservadorLista(novoValor: any) {
    this.listaLotes = Object.assign([], this.lista);
  }

  unidades = [];

  mounted(){
    this.listaLotes = Object.assign([], this.lista);

    new EmpreendimentoService().ListarTodasUnidades().then(
      res => {this.unidades = res.data.items}
    )
  }
}
</script>