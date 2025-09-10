<template>
  <v-dialog persistent v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" no-click-animation> 
    <v-card v-if="item.despesa">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      <v-toolbar-title>Detalhar Despesa</v-toolbar-title>

      <template v-slot:extension>
        <v-tabs v-model="tabActive" background-color="primary" dark>
          <v-tab>Dados da Parcela</v-tab>
          <v-tab>Dados da Despesa</v-tab>
          <v-tab>Documentos</v-tab>
        </v-tabs> 
      </template> 
    </v-toolbar>

    <v-tabs-items v-model="tabActive">
      <v-tab-item>
        <v-card elevation="1">
          <v-card-text>
            <v-card-title>
               <v-icon large left color="primary">mdi-information</v-icon>
              <span class="title-span">Informação da Parcela</span>
            </v-card-title>

                <v-list two-line>
                  <v-list-item>
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-list-item-content>
                          <v-list-item-title>Parcela</v-list-item-title>
                          <v-list-item-subtitle>{{item.parcela}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-list-item-content>
                          <v-list-item-title>Linha digitável</v-list-item-title>
                            <v-list-item-subtitle>{{item.linhaDigitavelBoleto}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>
                    </v-row>
                  </v-list-item> 
                  <v-divider/>

                  <v-list-item>
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-list-item-content>
                          <v-list-item-title>Vencimento</v-list-item-title>
                          <v-list-item-subtitle>{{item.dataVencimento.toDateDDMMYYYY()}}</v-list-item-subtitle>  
                        </v-list-item-content>
                      </v-col>

                    <v-col cols="12" md="6" v-if="item.situacao">
                      <v-list-item-content>
                        <v-list-item-title>Situação</v-list-item-title>
                        <v-list-item-subtitle> {{item.situacao.nome}} </v-list-item-subtitle> 
                      </v-list-item-content>
                    </v-col>   
                  </v-row>
                </v-list-item>
              <v-divider/>

              <v-list-item>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-list-item-content>
                      <v-list-item-title>Valor</v-list-item-title>
                      <v-list-item-subtitle>{{ item.valor.toMoeda() }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-list-item-content>
                      <v-list-item-title>Saldo</v-list-item-title>
                      <v-list-item-subtitle>{{ item.saldo.toMoeda()}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-list-item v-if="item.pagamentoLiberado">
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-list-item-content>
                      <v-list-item-title style="color: #f98038;">Parcela de comissão liberada para pagamento</v-list-item-title>
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      <br>
        <v-card elevation="1">
          <v-card-text>
            <v-card-title>
              <span class="title-span">Baixas</span> 
            </v-card-title>

            <v-data-table
              :headers="headers"
              :items="item.baixas"
              :items-per-page="5"
              :loading="loading"
              class="elevation-1"
            >
            <template v-slot:[`item.dataPagamento`]="{item}">
              {{item.dataPagamento.toDateDDMMYYYY()}}
            </template>  

            <template v-slot:[`item.formaPagamento.nome`]="{item}">
              {{item.formaPagamento ? item.formaPagamento.nome : '-'}}
            </template>   

             <template v-slot:[`item.valor`]="{item}">
              {{item.valor  ? Number(item.valor).toMoeda(true) : new Number(0).toMoeda(true)}}
            </template>

            <template v-slot:[`item.juros`]="{item}">
              {{item.juros  ? Number(item.juros).toMoeda(true) : new Number(0).toMoeda(true)}}
            </template>

            <template v-slot:[`item.multa`]="{item}">
              {{item.multa  ? Number(item.multa).toMoeda(true) : new Number(0).toMoeda(true)}}
            </template>

            <template v-slot:[`item.desconto`]="{item}">
              {{item.desconto  ? Number(item.desconto).toMoeda(true) : new Number(0).toMoeda(true)}}
            </template>
            
            <template v-slot:[`item.total`]="{item}">
              {{item.total  ? Number(item.total).toMoeda(true) : new Number(0).toMoeda(true)}}
            </template>  

            <template v-slot:[`item.automatica`] = "{item}">
              {{item.automatica.toSimNao()}}
            </template>

            <template v-slot:[`item.cancelado`] = "{item}">
              {{item.cancelado.toSimNao()}}
            </template>   

            <template v-slot:[`item.comprovante.dados`] = "{item}">
              <div v-if="item.comprovante"> 
                <v-icon v-if="item.comprovante == 'application/pdf' " large color="primary" @click="BaixarArquivo(item)">mdi-file</v-icon>
                <img  v-else class="mt-2"  @click="BaixarArquivo(item)" :src="'data:image/gif;base64,' + item.comprovante.dados" alt="Img" width="100" height="100"/>
              </div>
            </template> 
          </v-data-table>
        </v-card-text>  
      </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card elevation="1">
          <v-card-text>
            <v-card-title> 
              <v-icon large left color="primary">mdi-information</v-icon>
              <span class="title-span">Informação da Despesa</span> 
            </v-card-title>

            <v-list two-line>
              <v-list-item>
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-list-item-content>
                      <v-list-item-title>Número</v-list-item-title> 
                      <v-list-item-subtitle>{{item.despesa.numeroDocumento}} </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-list-item-content>
                      <v-list-item-title>Emissão</v-list-item-title>
                      <v-list-item-subtitle>{{  item.despesa.dataEmissao ? item.despesa.dataEmissao.toDateDDMMYYYY() : '' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-list-item-content v-if="item.despesa.tipo">
                      <v-list-item-title>Despesa</v-list-item-title> 
                      <v-list-item-subtitle>{{ item.despesa.tipo.nome }} </v-list-item-subtitle>  
                    </v-list-item-content>
                  </v-col>  
                </v-row>
              </v-list-item>  

              <v-divider/>
                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-list-item-content v-if="item.despesa.tipoDocumento">
                        <v-list-item-title>Tipo de documento</v-list-item-title>
                        <v-list-item-subtitle>{{  item.despesa.tipoDocumento.nome}}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col> 

                  <v-col cols="12" md="8">
                    <v-list-item-content>
                      <v-list-item-title>Chave</v-list-item-title>
                      <v-list-item-subtitle>{{item.despesa.chaveDfe}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>  
            <v-divider/>

              <v-list-item>
                <v-row dense>
                <v-col cols="12" md="8">
                  <v-list-item-content v-if="item.despesa.fornecedor">
                    <v-list-item-title>Fornecedor</v-list-item-title>
                    <v-list-item-subtitle>{{item.despesa.fornecedor.nome}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>

                <v-col cols="12" md="4">
                  <v-list-item-content v-if="item.despesa.empreendimento">
                    <v-list-item-title>Empreendimento</v-list-item-title>
                    <v-list-item-subtitle>{{ item.despesa.empreendimento.nome}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
                </v-row>
              </v-list-item>   
            <v-divider/>

              <v-list-item>
              <v-row dense>
                <v-col cols="12" md="8">
                  <v-list-item-content>
                    <v-list-item-title>Total</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.despesa.valor  ? Number(item.despesa.valor).toMoeda(true) : new Number(0).toMoeda(true) }} 
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col> 

                <v-col cols="12" md="4">
                  <v-list-item-content>
                  <v-list-item-title>Saldo</v-list-item-title>
                    <v-list-item-subtitle>{{ item.despesa.saldo.toMoeda(true)}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-list-item> 
          <v-divider/>

          <v-list-item>
            <v-row dense>
              <v-col cols="12" md="4" v-if="item.despesa.dataCriacao && item.despesa.horaCriacao">
                <v-list-item-content>
                  <v-list-item-title>Data de criação</v-list-item-title>
                  <v-list-item-subtitle>{{ new Date(item.despesa.dataCriacao).ddmmyyyy() }} - {{ item.despesa.horaCriacao.split('.')[0] }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-col>

              <v-col cols="12" md="4" v-if="item.despesa.usuario">
                <v-list-item-content>
                  <v-list-item-title>Criada por</v-list-item-title>
                  <v-list-item-subtitle> {{ item.despesa.usuario.login }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
              <v-col cols="12" md="4">
                <v-list-item-content>
                  <v-list-item-title>Observação</v-list-item-title>
                  <v-list-item-subtitle>{{item.despesa.observacao}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
            </v-row>
          </v-list-item>  
        </v-list>
      </v-card-text>
    </v-card>
  <br>
    <v-card elevation="1">
      <v-card-text>
        <v-card-title> 
          <span class="title-span">Classificação</span> 
        </v-card-title>

        <v-col cols="12" md="12">
            <v-data-table
              :headers="headersClassificacao"
              :items="item.despesa.classificacoes"
              :items-per-page="5"
              :loading="loading"
              class="elevation-1"
            >
            <template v-slot:[`item.centroCustoId`] = "{item}">
              {{ item.centroCusto.nome}}
            </template>

            <template v-slot:[`item.contaGerencialId`] = "{item}">
              {{ item.contaGerencial.nome}}
            </template>

            <template v-slot:[`item.valor`] = "{item}">
              {{ item.valor  ? Number(item.valor).toMoeda(true) : new Number(0).toMoeda(true) }}
            </template>

            <template v-slot:[`item.percentual`] = "{item}">
              {{ item.percentual  ? Number(item.percentual).toMoeda(false) : new Number(0).toMoeda(false) }} %
            </template>
          </v-data-table>
        </v-col>
      </v-card-text>
    </v-card>
      </v-tab-item>
       
      <v-tab-item>  
          <vcard-documento :lista.sync="item.despesa.documentos" :exibirCampos="false" />
        <br>
      </v-tab-item>
    </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { DespesaParcela,} from "../../../core/models/financeiro";
import { DespesaService} from "../../../core/services/financeiro";
import { SituacaoColor } from '@/assets/scripts/helper';

@Component
export default class DetalharDespesa extends Vue {
  @Prop() public item!: DespesaParcela;
  @Prop() public value!: string;

  service = new DespesaService(); 
  loading = false;
  tabActive = 0;
  dialog = false;
 
  headers = [
    { text: "Data da Baixa", value: "dataPagamento" },
    { text: "Forma de pagamento", value: "formaPagamento.nome" },
    { text: "Valor", value: "valor" },
    { text: "Encargos", value: "juros" },
    { text: "Multa", value: "multa" },
    { text: "Desconto", value: "desconto" },
    { text: "Total", value: "total" },
    { text: "Automática", value: "automatica" },
    { text: "Cancelado", value: "cancelado" },
    { text: "Comprovante", value: "comprovante.dados" },
  ];

  headersClassificacao = [
    { text: "", value: "actions", sortable: false },
    { text: "Centro Custo", value: "centroCustoId" },
    { text: "Categoria", value: "contaGerencialId" },
    { text: "Valor", value: "valor" },
    { text: "Percentual", value: "percentual" },
  ];

  headersParcelas = [
    { text: "", value: "actions", sortable: false },
    { text: "Parcela", value: "parcela" },
    { text: "Valor", value: "valor" },
    { text: "Saldo", value: "saldo" },
    { text: "Valor Pago", value: "valorPago" },
    { text: "Situação", value: "situacao.nome" },
  ]

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

  Close() {
    this.dialog = false;
    this.tabActive = 0;
  }

  BaixarArquivo(arquivo: any){
    const link = document.createElement("a");
    link.href = `data:${arquivo.comprovante.tipo};base64,${arquivo.comprovante.dados}`;
    link.type = arquivo.comprovante.tipo;
    link.download = `${new Date().toLocaleString().replace('','_')}`;
    link.click();
    link.remove();
  }

  SituacaoColor(item){
    return SituacaoColor(item)
  }
}
</script>
