<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    no-click-animation
  >
    <v-card v-if="item.receita">
      <v-toolbar dark color="primary" dense>
        <v-btn icon dark @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Receita</v-toolbar-title>
        <v-spacer />

        <template v-slot:extension>
          <v-tabs
            v-model="tabActive"
            background-color="primary"
            dark
            class="pl-2"
          >
            <v-tab v-if="item.receita.contrato">Contrato</v-tab>
            <v-tab>Dados da Parcela </v-tab>
            <v-tab>Dados da Receita</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items v-model="tabActive">
        <v-tab-item v-if="item.receita.contrato">
          <v-card elevation="1">
            <v-card-text>
              <v-card-title>
                <v-icon large left color="primary">mdi-information</v-icon>
                <span class="title-span">Informação do Contrato</span>
              </v-card-title>

              <v-list two-line>
                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title
                          >Número do contrato</v-list-item-title
                        >
                        <v-list-item-subtitle>{{
                          item.receita.contrato.numeroSequencia
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Cliente</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.receita.cliente ? item.receita.cliente.nome : "-"
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Empreendimento</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.receita.contrato.empreendimento
                            ? item.receita.contrato.empreendimento.nome
                            : "-"
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider />

                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Produto</v-list-item-title>
                        <v-list-item-subtitle
                          >{{
                            item.receita.contrato.tipoProduto
                              ? item.receita.contrato.tipoProduto.nome
                              : "-"
                          }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Data do Contrato</v-list-item-title>
                        <v-list-item-subtitle
                          >{{ item.receita.contrato.data.toDateDDMMYYYY() }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
          <br />
        </v-tab-item>

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
                        <v-list-item-subtitle>{{
                          item.parcelaStr
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-list-item-content>
                        <v-list-item-title>Linha digitável</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.linhaDigitavelBoleto
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider />

                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-list-item-content>
                        <v-list-item-title>Vencimento</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.dataVencimento.toDateDDMMYYYY()
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="6" v-if="item.situacao">
                      <v-list-item-content>
                        <v-list-item-title>Situação</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.situacao.nome }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider />

                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-list-item-content>
                        <v-list-item-title>Valor</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.valor.toMoeda()
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-list-item-content>
                        <v-list-item-title>Saldo</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.saldo.toMoeda()
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider />
              </v-list>
            </v-card-text>
          </v-card>
          <br />
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
                <template v-slot:[`item.dataPagamento`]="{ item }">
                  {{ item.dataPagamento.toDateDDMMYYYY() }}
                </template>

                <template v-slot:[`item.formaPagamento.nome`]="{ item }">
                  {{ item.formaPagamento.nome }}
                </template>

                <template v-slot:[`item.valor`]="{ item }">
                  {{
                    item.valor
                      ? Number(item.valor).toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </template>

                <template v-slot:[`item.juros`]="{ item }">
                  {{
                    item.juros
                      ? Number(item.juros).toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </template>

                <template v-slot:[`item.multa`]="{ item }">
                  {{
                    item.multa
                      ? Number(item.multa).toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </template>

                <template v-slot:[`item.desconto`]="{ item }">
                  {{
                    item.desconto
                      ? Number(item.desconto).toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </template>

                <template v-slot:[`item.total`]="{ item }">
                  {{
                    item.total
                      ? Number(item.total).toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </template>

                <template v-slot:[`item.automatica`]="{ item }">
                  {{ item.automatica.toSimNao() }}
                </template>

                <template v-slot:[`item.cancelado`]="{ item }">
                  {{ item.cancelado.toSimNao() }}
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
                <span class="title-span">Informação da Receita</span>
              </v-card-title>

              <v-list two-line>
                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Número</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.receita.numeroDocumento
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Emissão</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.receita.dataEmissao.toDateDDMMYYYY()
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Receita</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.receita.tipo ? item.receita.tipo.nome : "-"
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider />

                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="12">
                      <v-list-item-content>
                        <v-list-item-title>Documento</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.receita.tipoDocumento
                            ? item.receita.tipoDocumento.nome
                            : "-"
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider />

                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="8">
                      <v-list-item-content>
                        <v-list-item-title>Total</v-list-item-title>
                        <v-list-item-subtitle>
                          {{
                            item.receita.valor
                              ? Number(item.receita.valor).toMoeda(true)
                              : new Number(0).toMoeda(true)
                          }}</v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Saldo</v-list-item-title>
                        <v-list-item-subtitle>
                          {{
                            item.receita.saldo
                              ? Number(item.receita.saldo).toMoeda(true)
                              : new Number(0).toMoeda(true)
                          }}</v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider />

                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="12">
                      <v-list-item-content>
                        <v-list-item-title>Observação</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.receita.observacao
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>

              <v-card-title>
                <span class="title-span">Classificação</span>
              </v-card-title>

              <v-col cols="12" md="12">
                <v-data-table
                  :headers="headersClassificacao"
                  :items="item.receita.classificacoes"
                  :items-per-page="5"
                  :loading="loading"
                  class="elevation-1"
                >
                  <template v-slot:[`item.centroCusto.nome`]="{ item }">
                    {{ item.centroCusto ? item.centroCusto.nome : "-" }}
                  </template>

                  <template v-slot:[`item.contaGerencial.nome`]="{ item }">
                    {{ item.contaGerencial ? item.contaGerencial.nome : "-" }}
                  </template>

                  <template v-slot:[`item.valor`]="{ item }">
                    {{
                      item.valor
                        ? Number(item.valor).toMoeda(true)
                        : new Number(0).toMoeda(true)
                    }}
                  </template>

                  <template v-slot:[`item.percentual`]="{ item }">
                    {{ item.percentual }} %
                  </template>
                </v-data-table>
              </v-col>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template> 

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ReceitaParcela } from "../../../core/models/financeiro";
import { ReceitaService } from "../../../core/services/financeiro";

@Component
export default class ParcelaDetalheReceita extends Vue {
  @Prop() public item!: ReceitaParcela;
  @Prop() public value!: string;

  service = new ReceitaService();

  valid = true;
  dialog = false;
  loading = false;
  tabActive = null;
  tab = null;

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
  ];

  headersClassificacao = [
    { text: "", value: "actions", sortable: false },
    { text: "Centro Custo", value: "centroCusto.nome" },
    { text: "Categoria", value: "contaGerencial.nome" },
    { text: "Valor", value: "valor" },
    { text: "Percentual", value: "percentual" },
  ];

  Close() {
    this.dialog = false;
  }
}
</script>