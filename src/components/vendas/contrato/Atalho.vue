 <template>
  <v-dialog persistent v-model="dialog" width="1000" no-click-animation>

    <v-card>
      <v-toolbar>
        <v-btn icon color="primary"  @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="title font-weight-regular">Filtro</v-toolbar-title>
      </v-toolbar>
 
      <v-card outlined>
        <v-card-text> 
          <v-row dense> 
            <v-col cols="12" md="3">
              <span class="font-weight-bold">Número</span>
              <v-text-field outlined type="number" v-model="filter.numero" dense/>
            </v-col>

            <v-col cols="12" md="3">
              <span class="font-weight-bold">Sequência</span>
              <v-text-field outlined type="number" v-model="filter.sequencia" dense/>
            </v-col>

            <v-col cols="12" md="6">
              <span class="font-weight-bold">Cliente/CPF-CNPJ</span>
              <v-autocomplete placeholder="Selecione" outlined v-model="filter.clienteIds" :items="pessoas" clearable item-text="nomeCnpjCpf" item-value="id" dense/>
            </v-col>

            <v-col cols="12" md="3">
              <span class="font-weight-bold">Data do Contrato</span>
              <v-text-field outlined v-model="filter.dataContrato" type="date" dense />
            </v-col>

            <v-col cols="12" md="3">
              <span class="font-weight-bold">Tipo do Produto</span>
              <v-select outlined v-model="filter.tipoProdutoId" item-value="id" item-text="nome" :items="tiposProdutos" dense clearable :menu-props="{ offsetY: true, offsetOverflow: true }"/>
            </v-col>
 
            <v-col cols="12" md="6">
              <span class="font-weight-bold">Tipo do Contrato</span>
              <v-select outlined v-model="filter.tipoContratoId" item-value="id" item-text="nome" :items="tipos" dense clearable :menu-props="{ offsetY: true, offsetOverflow: true }"/>
            </v-col>

            <v-col cols="12" md="6">
              <span class="font-weight-bold">Empreendimento</span>
              <v-autocomplete placeholder="Selecione" outlined @change="FiltrarGrupos()" v-model="filter.empreendimentoId" item-value="id" item-text="nome" :items="empreendimentos" dense clearable/>
            </v-col>

            <v-col cols="12" md="3">
              <span class="font-weight-bold">Quadras</span>
              <v-autocomplete placeholder="Selecione" outlined v-model="filter.grupoId" dense clearable @change="FiltrarUnidades()" :items="listaGrupos" item-value="id" item-text="nome"/>
            </v-col>

            <v-col cols="12" md="3">
              <span class="font-weight-bold">Unidades</span>
              <v-autocomplete placeholder="Selecione" outlined dense clearable v-model="filter.unidadePrincipalId" :items="listaUnidades" item-value="id" item-text="nome"/>
            </v-col>
            <v-col cols="12" md="2"/>

            <v-spacer/>
              <div class="ma-3">
                <v-btn color="primary" @click="Filtrar()">Consultar</v-btn>
              </div>  
          </v-row>
        </v-card-text>

          <v-card-text>
            <v-data-table 
              height="250"
              :headers="headers" 
              :items="lista" 
              :options.sync="options" 
              :footer-props="{ showFirstLastPage: true }" 
              :server-items-length="totalLista" 
              :loading="loading" 
              class="elevation-1" 
              >
              <template v-slot:[`item.actions`] = "{item}">
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-icon @click="Gerenciar(item)" v-on="on">mdi-file-document-edit</v-icon>
                  </template>
                  <span>Gerenciar</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.numero`]="{ item }">
                {{ item.numeroSequenciaContrato }}
              </template>

              <template v-slot:[`item.clienteNome`]="{ item }">
                {{ item.clienteNome  }}
              </template>

              <template v-slot:[`item.situacaoNome`]="{ item }">
                <v-chip :color="situacaoColor(item)">
                  {{item.situacaoNome }} 
                </v-chip>
              </template>  

              <template v-slot:[`item.empreendimentoNome`]="{ item }">
                {{ item.empreendimentoNome }}
              </template>

              <template v-slot:[`item.grupoNome`]="{ item}">
                {{ item.grupoNome }}
              </template>

              <template v-slot:[`item.unidadeNome`]="{ item }">
                {{ item.unidadeNome }}
              </template>

              <template v-slot:[`item.tipoProduto`]="{ item }">
                {{ item.tipoProduto }}
              </template>

              <template v-slot:[`item.dataContrato`]="{ item }">
                {{ new Date(item.dataContrato).toLocaleDateString() }}
              </template>  
            </v-data-table>
        </v-card-text>
      </v-card>
   </v-card> 

    <v-row>
      <gerenciador-contrato  v-model="dialogGerenciador" :item="item" @fechou="dialogGerenciador = false"> </gerenciador-contrato> 
    </v-row>
  </v-dialog> 
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ContratoService, EmpreendimentoService, PessoaService } from '@/core/services/cadastros';
import { Contrato } from '@/core/models/cadastros';
import { TipoContratoService, TipoProdutoContratoService } from "@/core/services/financeiro";

@Component
export default class AtalhoFiltro extends Vue {
  @Prop() private value!: string;
  public item = new Contrato();

  filter = new Relatorio();
  service =  new ContratoService();
  serviceEmpreendimento = new EmpreendimentoService();

  dialogGerenciador:boolean = false;
  valid = true;
  dialog = false;

  tipos = [];
  tiposProdutos = [];
  empreendimentos = [];
  listaGrupos: any = [];
  listaUnidades: any = [];
  pessoas = [];
  lista:any = [];

  totalLista = 0;

  loading: boolean = false;

  options: any = {
    itemsPerPage: 15
  }; 
   
  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Número do contrato", value: "numero" },
    { text: "Cliente", value: "clienteNome" },
    { text: "Situação", value: "situacaoNome" },
    { text: "Empreendimento", value: "empreendimentoNome" },
    { text: "Grupo", value: "grupoNome" },
    { text: "Unidade", value: "unidadeNome" },
    { text: "Data do Contrato", value: "dataContrato", type: "date" },
  ];

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
   
  @Watch("options", { deep: true })
  Atualizar() {
    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;
    this.loading = true;
   
    this.service.ListarContratosAtualizados(page,itemsPerPage, sortBy.length == 0 ? ['numero'] : sortBy, sortBy.length == 0 ? [true] : sortDesc, search, columns, this.filter).then(
      (res) => {
        this.lista = res.data.items;
        this.totalLista = res.data.count;
      }, 
     (err) => {
        if (!err.response) {
          this.$swal("Aviso", "Não foi possível acessar a API", "error");
        } else if (err.response.status == 403) {
          this.$swal("Aviso", err.response.data.message, "warning" );
        } else {
          this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
        }
      }).finally(() => (this.loading = false)); 
  }

  Filtrar() {
    this.options.page = 1;

    const { page, itemsPerPage, sortBy, sortDesc, search, columns } = this.options;
    this.loading = true;

    this.service.ListarContratosAtualizados(page,itemsPerPage,sortBy,sortDesc,search,columns, this.filter)
      .then((res) => {
        this.lista = res.data.items;
        this.totalLista = res.data.count;
      }
    ).finally(() => (this.loading = false));
  } 

  Close() {
    this.dialog = false;
    this.filter = new Relatorio()
  }  
  
  Gerenciar(item) {
    this.service.ObterPorId(item.id,"Receitas.Parcelas.Transacoes.UsuarioBoletoGerado, ContratosDigitais.Tipo,ContratosDigitais.Situacao, ContratosDigitais.Signatarios.Cliente, ContratosDigitais.Signatarios.Situacao, Receitas.Parcelas.AntecipacaoAmortizacao.Itens,TipoAmortizacao, Receitas.Parcelas.AntecipacaoComprovante, Observacoes, Receitas.Parcelas.Situacao, Receitas.Parcelas.Baixas.FormaPagamento,Receitas.Tipo, Receitas.Parcelas.Baixas.ReceitaBaixaComprovante, TipoIndice,  HistoricoSituacoes.Situacao, HistoricoSituacoes.Usuario")
      .then((res) => {
        this.item = res.data; 
        this.dialogGerenciador = true;
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

  FiltrarGrupos() {
    this.serviceEmpreendimento.ListarGrupo(this.filter.empreendimentoId).then(
      res => {this.listaGrupos = res.data}
    )
  }

   FiltrarUnidades() {
     this.serviceEmpreendimento.ListarUnidade(this.filter.grupoId).then(
      res => {this.listaUnidades = res.data}
    )
  }

  situacaoColor(item){ 
  if(item.situacaoId == 1)
    return "blue lighten-3";

    else if(item.situacaoId == 2) 
    return "orange lighten-1";

    else if(item.situacaoId == 3)
    return "deep-purple lighten-1";

    else if(item.situacaoId == 4)
    return "red lighten-1";
 
    else if(item.situacaoId == 5)
    return "grey lighten-1";

    else if(item.situacaoId == 6) 
    return "teal lighten-1";

    else if(item.situacaoId == 7)
    return "yellow lighten-1";
  }
 
  mounted(){
    new PessoaService().Listar(-1, -1, ['nome'],[],'',[], '', '' , 'Id,nome,cnpjCpf, nomeCnpjCpf', '').then(
      res =>{this.pessoas = res.data.items; }
    )
    new TipoProdutoContratoService().ListarTudo().then((res) =>
     {this.tiposProdutos = res.data.items});

    new EmpreendimentoService().Listar(-1, -1, ['nome'], [], undefined, [], "", '', "Id,Nome", "").then(
      (res) => {this.empreendimentos = res.data.items});

    new TipoContratoService().ListarTudo().then(
      (res) => {this.tipos = res.data.items;});
  }
}

class Relatorio {
  numero: number = 0;
  sequencia: number = 0;
  tipoProdutoId:number = 0;
  tipoContratoId: number =  0;
  dataContrato:string = "";
  empreendimentoId: number = 0;
  grupoId: number= 0; 
  unidadePrincipalId:number= 0;
  clienteIds = 0;
}
</script>