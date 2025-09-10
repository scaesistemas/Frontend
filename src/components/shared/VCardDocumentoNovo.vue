<template>
  <v-card elevation="1" :loading="overlayDocumentos">
    <v-card-text> 
      <v-row>
        <v-card-title>
          <span class="title-span">Documentos</span>
        </v-card-title>

        <v-spacer></v-spacer>
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-btn @click="AdicionarArquivo()"  v-on="on" small color="primary" dark fab class="mb-2">
                <v-icon>mdi-plus</v-icon>
              </v-btn> 
            </template>

            <span>Adicionar arquivo</span>
          </v-tooltip>
        </v-row>

        <v-row dense>
          <v-col cols="auto" sm="12" md="12" lg="12">
            <v-data-table class="elevation-0" :options.sync="options" item-key="empreendimentoDocumento.key" :headers="headersDocumentos" :items="empreendimentoDocumento.documentos"   :loading="loading" :footer-props="{ showFirstLastPage: false}">
                
              <template v-slot:[`item.actions`] = "{item}"> 
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon small @click="ExcluirDocumento(item)" v-on="on" :disabled="item.excluido">mdi-delete</v-icon>
                  </template>
                  <span>Excluir</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon class="ml-2" small @click="CompartilharArquivo(item)" v-on="on" :disabled="item.excluido">mdi-share</v-icon>
                  </template>
                  <span>Compartilhar</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon class="ml-2" small @click="BaixarArquivo(item)" v-on="on" :disabled="item.excluido">mdi-download</v-icon>
                  </template>
                  <span>Download</span>
                </v-tooltip>
              </template>
                
              <template v-slot:[`item.nome`] = "{item}">
                <v-col cols="12" md="6">
                  <v-edit-dialog persistent @save="SalvarDocumento()" :return-value.sync="item.nome"   large save-text="Salvar" cancel-text="Cancelar">
                    {{ item.nome }}   
                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-icon small v-on="on">mdi-pencil</v-icon>
                      </template>
                      <span>Editar</span>
                    </v-tooltip>  
                    
                    <template v-slot:input>
                      <v-text-field v-model="item.nome"  label="Editar" single-line counter/>
                    </template>
                  </v-edit-dialog>
                </v-col>
              </template>

              <template v-slot:[`item.dataEmissao`] = "{item}">
                {{ item.dataEmissao != null ? new Date(item.dataEmissao).ddmmyyyy() : '-' }}
              </template>

            
              <template v-slot:[`item.anexar`] = "{item}">
                  <div>
                    <v-btn color="primary" class="text-none" depressed  @click="Upload(item)">
                      <v-icon left> mdi-file</v-icon>
                      <div v-if="item.dados.length > 0">Alterar</div>
                      <div v-else>Anexar</div>
                        
                    </v-btn>
                    <input ref="uploader" class="d-none" type="file" accept="" @change="e => {EnviarArquivo(e, item)}">
                  </div>
              </template>
            </v-data-table>  
          </v-col>
        </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { EmpreendimentoService } from '@/core/services/cadastros';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import * as jsonpatch from 'fast-json-patch';
import { DocumentoEmpreendimento, Empreendimento } from '@/core/models/cadastros';
import { ArquivoService } from '@/core/services/geral/ArquivoService';

@Component
export default class VCardDocumento extends Vue {
  @Prop() empreendimentoDocumento!:Empreendimento;
  @Prop() loading;
  

  service = new EmpreendimentoService();
  documento: DocumentoEmpreendimento = new DocumentoEmpreendimento();

  inputDocumento: any = null;
  dialog = false;

  headersDocumentos: any[] = [ 
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome", align: "left",sortable: false },
    { text: "Documentos", value: "anexar", align: "left",sortable: false },
  ]; 

  @Watch("empreendimentoDocumento", {deep:true})
  ObservadorItem(){
    this.observer = jsonpatch.observe(this.empreendimentoDocumento);
  }; 
  
  options: any = {
    itemsPerPage: 5
  };

  observer! : jsonpatch.Observer<Empreendimento>;
  overlayDocumentos = false;
  loadingArquivo = false;
  selecionarArquivo:any = null;
  index = -1;

  $refs!: {
    uploader
  };

  Upload(item) {
    this.index =  this.empreendimentoDocumento.documentos!.indexOf(item);
    this.loadingArquivo = true
    window.addEventListener('focus', () => {
      this.loadingArquivo = false
    }, { once: true,passive: true });

    this.$refs.uploader.click();
  };

  async EnviarArquivo(e) {
    this.selecionarArquivo = e.target.files[0];
    let dados = await new ArquivoService().Ler(this.selecionarArquivo);
    this.empreendimentoDocumento.documentos[this.index].dados =  dados.replace(/^[^,]*,/, "");
    this.empreendimentoDocumento.documentos[this.index].tipo =  this.selecionarArquivo.type;
    this.index = -1;

    this.SalvarDocumento();
  }

  AdicionarArquivo() {
    if (this.index > -1) {
      Object.assign(this.empreendimentoDocumento.documentos[this.index], this.documento);
    } else {
      this.documento.nome = "Novo documento";
      this.documento.usuarioId = JSON.parse(localStorage.sessionApp.split(".")).dados.usuarioId;
      this.empreendimentoDocumento.documentos.push(this.documento);
      this.AtualizarLista(this.empreendimentoDocumento.documentos);
    }
    this.documento = new DocumentoEmpreendimento();
    this.inputDocumento = null;
    this.index = -1;
  }

  CompartilharArquivo(item){
    new ArquivoService().Compartilhar(item);
  }

  ExcluirDocumento(documento:any) {
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
        if(documento.id > 0){
         documento.excluido = true;
         const index = this.empreendimentoDocumento.documentos!.indexOf(documento);
         delete this.empreendimentoDocumento.documentos![index]
         this.dialog = false;
         this.dialog = true;
         return true; 
        }else{
          const index = this.empreendimentoDocumento.documentos!.indexOf(documento);
          this.empreendimentoDocumento.documentos!.splice(index, 1);
          return this.$swal("Aviso", "Registro excluído com sucesso!", "success");
        }
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if(result.value){
        this.SalvarDocumento();
      }
    })
  }

  SalvarDocumento(){
    if(this.empreendimentoDocumento.id > 0){

      this.observer = jsonpatch.observe(this.empreendimentoDocumento);
      let pacthModel = jsonpatch.generate(this.observer);

      this.service.Patch(pacthModel, this.empreendimentoDocumento.id).then(
        (res) => {
          this.$swal("Aviso","Operação realizada com sucesso!", res.status == 201 || res.status == 200 ? "success" : "warning");
          this.$emit("salvou");

          jsonpatch.unobserve(this.empreendimentoDocumento, this.observer);
          this.GetDocumentos();
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

  GetDocumentos(){
    this.overlayDocumentos = true;

    this.service.ObterPorId(this.empreendimentoDocumento.id, "Documentos").then((res) => {
      this.empreendimentoDocumento = res.data;
      this.overlayDocumentos = false;
    }); 
  }

  BaixarArquivo(arquivo){
    new ArquivoService().Download(arquivo);
  }

  AtualizarLista(novoValor: any){ 
    this.$emit('update:lista', novoValor);
  }
  
  mounted(){
  }
}
</script>

