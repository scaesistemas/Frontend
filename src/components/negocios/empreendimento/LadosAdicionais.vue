 <template>
  <v-dialog v-model="dialog" width="1000"  no-click-animation>
    <v-card>
      <v-toolbar flat>
        <v-btn icon color="primary" @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="title font-weight-regular">Adicional</v-toolbar-title>
        <v-spacer/>

        <v-toolbar-items>
          <v-btn color="primary" text  @click="Close()">Confirmar</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    <br>
       <v-card-text>  
        <v-data-table :headers="headers" :items="lista" class="elevation-1" item-key="item.id">
          <template v-slot:top>
           <v-toolbar flat>
             <v-spacer/>

             <v-dialog v-model="dialogLado" max-width="500px"> 
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Adicionar</v-btn>
                </template>

              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
 
                <v-card-text>
                  <v-container>
                    <v-row dense>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field dense outlined type="text" v-model="ladoItem.nome"  label="Nome"/>
                      </v-col>

                      <v-col cols="12" sm="6" md="6">
                        <v-text-field dense outlined type="number" v-model="ladoItem.valor" label="M"/>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

              <v-card-actions>
                <v-spacer/>
                <v-btn color="primary" text @click="Fechar()"> Fechar</v-btn>
                <v-btn color="primary" text @click="Adicionar()"> Adicionar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>

        </template>
          <template v-slot:[`item.actions`] = "{item}">
            <v-icon :disabled="item.excluido" @click="EditarItem(item)" small class="mr-2">mdi-pencil</v-icon>
            <v-icon :disabled="item.excluido" @click="ExcluirItem(item)" small > mdi-delete</v-icon>
          </template>
         </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Empreendimento, LadoAdicional } from "@/core/models/cadastros";
import { EmpreendimentoService } from "@/core/services/cadastros";
import { TratarErroApi } from "@/assets/scripts/helper";

@Component
export default class LadosAdicionais extends Vue {
  @Prop() public item!: Empreendimento;
  @Prop() private value!: string;
  @Prop() private lista!: any;
  @Prop() public patch!: boolean;

  valid = true;
  dialog = false;
  dialogLado = false;

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];
  editedIndex = -1;
  ladoItem = new LadoAdicional();

  get formTitle () {
    return this.editedIndex === -1 ? 'Novo Lado' : 'Editar Lado'
  }

  Adicionar(){
    if (this.editedIndex > -1) {
       Object.assign(this.lista[this.editedIndex], this.ladoItem);

      } else {
        this.lista.push(this.ladoItem);
      }

    this.ladoItem = new LadoAdicional();
    this.editedIndex = -1;
    this.dialogLado = false;
  }

  Fechar(){
    this.ladoItem = new LadoAdicional();
    this.dialogLado = false;
    this.editedIndex = -1;
  }
  
  EditarItem(item){
    this.editedIndex = this.lista.indexOf(item);
    this.ladoItem = Object.assign({}, item);
    this.dialogLado = true;
  }

  ExcluirItem(item:LadoAdicional){
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
      if(item.id > 0 && this.patch){
        item.excluido = true;
        const index = this.lista.indexOf(item);
        delete this.lista[index];
        this.dialog = false;
        this.dialog = true;
        return true;
      }else{
        if(item.id > 0){
          new EmpreendimentoService().DeletarLadoUnidade(item.id).then(
            (res) => {
             this.$emit("salvou"); 
           },
            (err) => TratarErroApi(err)
            )
          }
          const index = this.lista.indexOf(item);
          this.lista.splice(index, 1);
          return this.$swal("Aviso", "Operação realizada com sucesso!", "success");
        }
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
      }).then((result) => {
      if(result.value){

      }
    })
  }

  headers = [
    { text: '', value: 'actions', sortable: false },
    { text: 'Nome', value: 'nome',},
    { text: 'M', value: 'valor' },
  ]

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

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  Close() {
    this.dialog = false;
  }
}
</script>