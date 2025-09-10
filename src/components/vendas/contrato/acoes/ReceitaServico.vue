<template>
  <v-dialog width="900" v-model="dialog" no-click-animation>
    <v-card> 
      <v-toolbar flat>
        <v-btn icon @click="Close">
          <v-icon color="primary">mdi-close</v-icon> 
        </v-btn>

        <v-toolbar-title>Receita de Serviço</v-toolbar-title>
        <v-spacer/> 

        <v-toolbar-items>
          <v-btn color="primary" text @click="Salvar(item)" :disabled="!valid">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar> 
      
        <v-card flat>  
          <v-card-text>   
            <v-form v-model="valid" lazy-validation ref="form">
              <v-row dense class="px-3">
                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Empresa</span>
                  <v-autocomplete placeholder="Selecione" outlined :rules="fieldRules" :disabled="item.id > 0" v-model="item.empresaId" :items="empresas" item-text="nome" item-value="id" dense/>
                </v-col> 
           
                <v-col cols="12" md="4">
                  <span class="font-weight-bold">Tipo de serviço</span>
                  <v-select dense outlined v-model="parcela.tipoServicoId" @change="ObterTipoServico(parcela.tipoServicoId)" :items="tiposServicos" item-text="nome" item-value="id" :menu-props="{ offsetY: true, offsetOverflow: true }"/>
                </v-col>
  
                <v-col cols="12" md="2">
                  <span class="font-weight-bold">Valor Total</span>
                  <money-input v-model="parcela.valor" @ValorFormatado="valor => parcela.valor = valor" />
                </v-col>   
              </v-row>
            </v-form>
          </v-card-text>
        
          <v-card-text>  
            <v-form v-model="validParcela" lazy-validation ref="formParcela">
              
            <span class="font-weight-bold">
              <v-subheader> 
                <v-icon small color="primary" class="mr-2">mdi-finance</v-icon> Gerar parcelas
              </v-subheader>
            </span>

          <v-divider class="mb-4"></v-divider>
          <br>

              <v-row dense class="px-3">
                <v-col cols="12" md="2">
                  <span class="font-weight-bold">Qtde</span>
                  <v-text-field dense outlined type="number" v-model="parcela.parcela" @input="valorParcela = Number((parcela.valor / parcela.parcela).toFixed(2))" :rules="fieldRules" />
                </v-col> 

                <v-col cols="12" md="4">
                  <span class="font-weight-bold">1º Vencimento</span>
                  <v-text-field dense outlined v-model="parcela.dataVencimento" type="date" :rules="fieldRules"/>
                </v-col>

                <v-col cols="12" md="2">
                  <span class="font-weight-bold">Valor</span>
                  <money-input readonly v-model="valorParcela" @ValorFormatado="valor => valorParcela = valor" dense />
                </v-col> 

                <v-col cols="12" md="2" class="mt-6">
                  <v-btn color="primary" @click="GerarParcelas()" :disabled="!validParcela">
                    <v-icon left>mdi-plus</v-icon>
                    Adicionar
                  </v-btn>
                </v-col>
              </v-row> 
            </v-form>  
              
            <v-col cols="12" md="12"> 
              <v-data-table 
                class="elevation-0" 
                :headers="headersParcelas"  
                :items="item.parcelas"     
                :footer-props="{ showFirstLastPage: true}" 
                item-key="item.id" sort-by="parcela">

                <template v-slot:[`item.actions`] = "{item}">
                    <v-tooltip left>
                      <template v-slot:activator="{ on }">
                        <v-icon :disabled="item.situacaoId != 1 || item.urlBoleto.length > 0" small @click="EditarParcela(item)" v-on="on">mdi-pencil</v-icon>
                      </template>
                      <span>Editar</span>
                    </v-tooltip>

                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-icon :disabled="item.situacaoId != 1 || item.urlBoleto.length > 0" small @click="ExcluirParcela(item)" v-on="on">mdi-delete</v-icon>
                      </template>
                      <span>Excluir</span>
                    </v-tooltip>
                  </template>
                
                <template v-slot:[`item.parcela`] = "{item}">
                  {{ item.parcela }} 
                </template>

                <template v-slot:[`item.valor`] = "{item}">
                  {{ item.valor  ? Number(item.valor).toMoeda(true) : new Number(0).toMoeda(true) }}
                </template>

                <template v-slot:[`item.tipoServicoId`] = "{item}">
                 {{ tiposServicos.find(x => x.id == item.tipoServicoId) ?  tiposServicos.find(x => x.id == item.tipoServicoId).nome : '-' }}  
                </template>

                <template v-slot:[`item.situacaoId`] = "{item}">
                  <v-chip :color="SituacaoColor(item)">
                    {{ listaSituacaoReceitaParcela.find(s => s.id == item.situacaoId).nome }}
                  </v-chip>
                </template>

                <template v-slot:[`item.dataVencimento`] = "{item}">
                  {{ new Date(item.dataVencimento).ddmmyyyy()  }}
                </template>  
              </v-data-table>    
            </v-col>   
          </v-card-text>
        </v-card>
      </v-card>

    <v-dialog v-model="dialogParcela" persistent max-width="600">
      <v-card>
        <v-card-title>
          <v-icon x-large="" color="primary">mdi-barcode</v-icon>
          <span class="title font-weight-light"> Editar Parcela </span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="12" md="3">
                <v-text-field outlined disabled type="number" v-model="editarParcela.parcela" label="Parcela" dense/>
              </v-col>  

              <v-col cols="12" md="9"> 
                <v-select dense outlined label="Tipo de serviço" v-model="editarParcela.tipoServicoId" :items="tiposServicos" item-text="nome" item-value="id"/>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field outlined type="number" v-model="editarParcela.valor" label="Valor da Parcela" prefix="R$" dense/>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field outlined label="1º vencimento" v-model="editarParcela.dataVencimento" type="date" dense/>
              </v-col>  
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" text @click="dialogParcela = false">Confirmar</v-btn>
        </v-card-actions>
      </v-card> 
    </v-dialog>
  </v-dialog>
</template> 

<script lang="ts">
import { Receita, ReceitaParcela } from "@/core/models/financeiro";
import { ReceitaService, SituacaoReceitaParcelaService, TipoServicoReceitaService } from "@/core/services/financeiro";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { SituacaoColor } from '@/assets/scripts/helper';
import { EmpresaService } from "@/core/services/compras/EmpresaService";
 
@Component
export default class EditarParcelaDespesa extends Vue {
  @Prop() public item!: Receita;
  @Prop() public value!: string;

  receita = new Receita();
  parcela = new ReceitaParcela();
  editarParcela = new ReceitaParcela();
  service = new ReceitaService();

  listaSituacaoReceitaParcela = [];
  tiposServicos = [];
  empresas = [];

  valorParcela = 0;
  parcelaIndex = -1; 
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  dialogParcela = false;
  validParcela = true;
  dialog = false;
  valid = true;
   
  headersParcelas = [
    { text: "", value: "actions", sortable: false },
    {text: "Nº", value: "parcela", align: "center", sortable: false },
    {text: "Valor", value: "valor", align: "center", sortable: false },
    {text: "Tipo de serviço", value: "tipoServicoId", align: "center", sortable: false },
    {text: "Situação", value: "situacaoId", align: "center", sortable: false },
    {text: "Vencimento", value: "dataVencimento", align: "center", sortable: false },
  ]

  @Watch("dialog")
    Dialog() {
      if (!this.dialog) { 
        this.$emit("fechou");
      }
  }

  $refs!: {
    form: HTMLFormElement,
    formParcela: HTMLFormElement;
  };

  @Watch("item")
  Item() {
  if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  } 

  @Watch("parcela")
  Parcela() {
  if (this.$refs.formParcela) {
      this.$refs.formParcela.resetValidation();
    }
  } 

  ObterTipoServico(id){
    if(id){
      new TipoServicoReceitaService().ObterPorId(id).then(
        res => {
          this.parcela.valor = res.data.valor;
        }
      )
    }
  } 

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
  }

  Validacoes(){
    if(!this.item.empresaId){
      this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
      return true;
    }

    if(this.item.parcelas.length == 0){
      this.$swal("Aviso", "É necessário gerar as parcelas de serviços", "warning");
      return true;
    };
  }

  Salvar(item) {
    if(item.id == 0){
      this.$refs.form.validate();
        item.gerarBoletoAutomatico = false;
        item.realizarCobrancaAutomatica = false;
      }

    if (!this.Validacoes()) { 

      item.valor =  item.parcelas.reduce((x,y) =>  this.sum(x,y.valor), 0);
      item.parcelas.forEach((parcela:any) => {
        parcela.situacao = null;
      });

      let modelo = item;
      this.service.Salvar(modelo).then(
        (res) => {
          this.$swal("Aviso","Operação realizada com sucesso!",res.status == 201 || res.status == 200 ? "success" : "warning");
          this.$emit("salvou");
          this.Close();
        },
        (err) => {
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status == 403) {
            this.$swal("Aviso", err.response.data.message, "warning");
          } else {
            this.$swal("Aviso",err.response.data,err.response.status == 400 ? "warning" : "error");
          }
      });
    }
  }
 
  Close() {
    this.Reset();
    this.dialog = false;
  }
 
  GerarParcelas(){
    if (this.$refs.formParcela.validate()) { 

    for (let i = 1; i <= this.parcela.parcela; i++) {
      let parcela = new ReceitaParcela();
        let dataInicial = new Date(Date.parse(this.parcela.dataVencimento));
        let dataCalculada = dataInicial;
        dataCalculada = new Date(new Date(dataInicial).setMonth(dataInicial.getMonth() + (i - 1)));
         
        parcela.parcela = i; 
        parcela.valor = this.valorParcela;
        parcela.dataVencimento = dataCalculada.yyyymmdd();
        parcela.dataVencimentoOriginal = dataCalculada.yyyymmdd();
        parcela.tipoServicoId = this.parcela.tipoServicoId;
        parcela.tipoGatewayId = this.parcela.tipoGatewayId;
        parcela.contaCorrenteId = this.item.contaCorrenteId;
        parcela.tipoOperacaoId = this.item.tipoOperacaoId;
        parcela.situacaoId = 1;
        this.item.parcelas.push(parcela);
      }
      this.$refs.formParcela.resetValidation();
      this.parcela = new ReceitaParcela();
     }
  }

  EditarParcela(item){
    this.parcelaIndex = this.item.parcelas.indexOf(item);
    this.editarParcela = item;
    this.editarParcela.dataVencimento = new Date(item.dataVencimento).yyyymmdd();
    this.dialogParcela = true;
  } 

  ExcluirParcela(item){
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
         if(item.id > 0){
            this.service.ExcluirParcela(item.id).then(
              (res) => {
                if (res.status == 200) {
                  this.$swal("Aviso", "Registro excluído com sucesso!", "success");
                  this.Atualizar(item);
                }
              },
              (err) => {
                if (!err.response) {
                  this.$swal("Aviso", "Não foi possível acessar a API", "error");
                } else if (err.response.status == 403) {
                  this.$swal("Aviso", err.response.data.message, "warning" );
                } else {
                  this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
                }
              }
            );
        }else{
          const index = this.item.parcelas!.indexOf(item);
          this.item.parcelas!.splice(index, 1);
          return this.$swal("Aviso", "Registro excluído com sucesso!", "success");
        }
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if(result.value){
      }
    })
  }

  Atualizar(item){
    this.service.ObterPorId(item.receitaId, "Parcelas").then(res=>{
      this.item = res.data;
    })
  }

  Reset(){
    this.receita = new Receita();
    this.parcela = new ReceitaParcela();
    this.valorParcela = 0;
  }
  
  SituacaoColor(item){
    return SituacaoColor(item);
  }

  sum = (a: any, b: any) => parseFloat(a) + parseFloat(b);

  mounted() {
    new TipoServicoReceitaService().ListarTudo().then(res => {
      this.tiposServicos = res.data.items;
    }) 

    new EmpresaService().Listar(-1, -1, ['nome'],[],'',[], '', '' , 'Id, nome', '').then(res =>{
      this.empresas = res.data.items;
    })

    new SituacaoReceitaParcelaService().ListarTudo().then((res: any) => {
      this.listaSituacaoReceitaParcela = res.data.items;
    }); 
   }
}
</script>