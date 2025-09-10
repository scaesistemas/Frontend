<template>
  <v-dialog
    persistent
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    no-click-animation
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title>Receita</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn dark text @click="Salvar()" :loading="overlay">Salvar</v-btn>
        </v-toolbar-items>

        <template v-slot:extension>
          <v-tabs v-model="tabActive" background-color="primary" dark>
            <v-tab>Geral</v-tab>
            <v-tab>Instituição Financeira</v-tab>
            <v-tab>Parcelas</v-tab>
            <v-tab>Classificação</v-tab>
            <v-tab>Documentos</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-form ref="formReceita" v-model="valid" lazy-validation>
        <v-tabs-items v-model="tabActive">
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-card-title>
                  <v-icon large left color="primary">mdi-information</v-icon>
                  <span class="title-span">Informação da Receita</span>
                </v-card-title>

                <span class="pt-3 px-3" id="campos">* Campo obrigatório</span>
                <v-row dense class="px-3">
                  <v-col cols="12" md="3">
                    <span class="font-weight-bold">Código do documento*</span>
                    <v-text-field
                      outlined
                      v-model="item.numeroDocumento"
                      :counter="20"
                      maxlength="20"
                      dense
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <span class="font-weight-bold">Emissão *</span>
                    <v-text-field
                      outlined
                      v-model="item.dataEmissao"
                      max="9999-12-31"
                      type="date"
                      dense
                      :rules="fieldRules"
                      id="dataEmissao"
                      name="dataEmissao"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <span class="font-weight-bold">Tipo de receita*</span>
                    <v-select
                      outlined
                      v-model="item.tipoId"
                      :rules="fieldRules"
                      :items="tipoReceitas"
                      item-value="id"
                      item-text="nome"
                      dense
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <span class="font-weight-bold">Tipo de documento*</span>
                    <v-select
                      outlined
                      v-model="item.tipoDocumentoId"
                      :rules="fieldRules"
                      :items="tipoDocumentos"
                      item-value="id"
                      item-text="nome"
                      dense
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    />
                  </v-col>

                  <v-col cols="12" sm="12" md="2">
                    <span class="font-weight-bold">Valor da Receita*</span>
                    <money-input
                      v-model="item.valor"
                      @ValorFormatado="(valor) => (item.valor = valor)"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <span class="font-weight-bold">Pagador*</span>
                    <v-select
                      outlined
                      v-model="item.clienteId"
                      :rules="fieldRules"
                      :items="pessoas"
                      item-value="id"
                      item-text="nomeCnpjCpf"
                      dense
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    >
                      <template v-slot:append-outer>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              icon
                              v-on="on"
                              style="margin-top: -5px"
                              @click="CadastrarPessoa()"
                            >
                              <v-icon color="primary">mdi-account-plus</v-icon>
                            </v-btn>
                          </template>
                          <span>Cadastrar Pessoa</span>
                        </v-tooltip>
                      </template>
                    </v-select>
                  </v-col>

                  <v-col cols="12" md="6">
                    <span class="font-weight-bold">Empresa*</span>
                    <v-autocomplete
                      placeholder="Selecione"
                      outlined
                      :items="empresas"
                      @change="
                        ObterParametroPorId(), ObterEmpreendimentosPorEmpresa()
                      "
                      v-model="item.empresaId"
                      :rules="fieldRules"
                      item-value="id"
                      item-text="nomeFantasia"
                      dense
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <span class="font-weight-bold">Empreendimento</span>
                    <v-autocomplete
                      placeholder="Selecione"
                      outlined
                      v-model="item.empreendimentoId"
                      :items="empreendimentos"
                      item-value="id"
                      item-text="nome"
                      dense
                    />
                  </v-col>

                  <v-col cols="12">
                    <span class="font-weight-bold">Observação</span>
                    <v-textarea outlined v-model="item.observacao" dense />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <br />
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-card-title>
                  <span class="title-span">Encargos Financeiros</span>
                </v-card-title>

                <v-row dense class="pt-3 px-3">
                  <v-col cols="12" md="6" lg="4">
                    <span class="font-weight-bold"
                      >Instituição Financeira*</span
                    >
                    <v-select
                      :rules="fieldRules"
                      outlined
                      v-model="item.tipoOperacaoId"
                      :items="tiposOperacaoContrato"
                      item-text="nome"
                      item-value="id"
                      dense
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    ></v-select>
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    v-if="item.tipoOperacaoId == 1"
                  >
                    <span class="font-weight-bold">Gateway*</span>
                    <v-select
                      outlined
                      clearable
                      v-model="item.tipoGatewayId"
                      @change="
                        (e) => {
                          ObterParametroGatway(item.tipoGatewayId);
                        }
                      "
                      return-object
                      :items="listaGateway"
                      item-text="tipo.nome"
                      item-value="tipo.id"
                      dense
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                    lg="4"
                    v-if="item.tipoOperacaoId == 2 || item.tipoOperacaoId == 3"
                  >
                    <span class="font-weight-bold">Conta Corrente*</span>
                    <v-select
                      @change="ObterEncargosContaCorrente()"
                      outlined
                      v-model="item.contaCorrenteId"
                      :items="listaContaCorrentes"
                      item-text="nome"
                      item-value="id"
                      dense
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row dense class="px-3">
                  <v-col cols="12" md="3" lg="2">
                    <span class="font-weight-bold">Juros ao dia</span>
                    <v-text-field
                      suffix="%"
                      outlined
                      v-model="parametroGatway.encargoFinanceiro.jurosDia"
                      dense
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="3" lg="2">
                    <span class="font-weight-bold">Multa</span>
                    <v-text-field
                      suffix="%"
                      outlined
                      v-model="parametroGatway.encargoFinanceiro.multa"
                      dense
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <span class="font-weight-bold">Dias</span>
                    <v-text-field
                      outlined
                      v-model="
                        parametroGatway.encargoFinanceiro.diasDescontoVencimento
                      "
                      dense
                      type="number"
                      hint="Nº de dias necessário antes do vencimento para ter o desconto."
                      persistent-hint
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="2"
                    v-if="
                      parametroGatway.encargoFinanceiro
                        .isDescontoVencimentoPercentual
                    "
                  >
                    <span class="font-weight-bold">Desconto</span>
                    <v-text-field
                      suffix="%"
                      outlined
                      v-model="
                        parametroGatway.encargoFinanceiro.descontoVencimento
                      "
                      dense
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="2" v-else>
                    <span class="font-weight-bold">Desconto</span>
                    <v-text-field
                      prefix="R$"
                      outlined
                      v-model="
                        parametroGatway.encargoFinanceiro.descontoVencimento
                      "
                      dense
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="2" class="pa-0 ma-0">
                    <v-switch
                      v-model="
                        parametroGatway.encargoFinanceiro
                          .isDescontoVencimentoPercentual
                      "
                      class="mb-0 pa-0 pt-4"
                      :label="
                        parametroGatway.encargoFinanceiro
                          .isDescontoVencimentoPercentual != false
                          ? 'Percentual'
                          : 'Fixo'
                      "
                    />
                  </v-col>

                  <v-col cols="12" md="3" lg="2">
                    <span class="font-weight-bold">Desconto</span>
                    <v-text-field
                      outlined
                      v-model="
                        parametroGatway.encargoFinanceiro.descontoVencimento
                      "
                      dense
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="3" lg="2">
                    <span class="font-weight-bold">Dias</span>
                    <v-text-field
                      outlined
                      v-model="
                        parametroGatway.encargoFinanceiro.diasDescontoVencimento
                      "
                      dense
                      type="number"
                      hint="Nº de dias necessário antes do vencimento para ter o desconto."
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row dense class="px-3">
                  <v-col cols="12" md="3" lg="2">
                    <span class="font-weight-bold">Desconto</span>
                    <v-text-field
                      suffix="%"
                      persistent-hint
                      hint="Antecipação/Quitação"
                      outlined
                      v-model="
                        parametroGatway.encargoFinanceiro.descontoAntecipacao
                      "
                      dense
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="3" lg="2">
                    <span class="font-weight-bold">Dias</span>
                    <v-text-field
                      outlined
                      v-model="
                        parametroGatway.encargoFinanceiro
                          .diasAposVencimentoNaoReceber
                      "
                      dense
                      type="number"
                      hint="Nº de dias para não receber após o vencimento."
                      persistent-hint
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="3" lg="2">
                    <span class="font-weight-bold">Dias</span>
                    <v-text-field
                      outlined
                      v-model="parametroGatway.encargoFinanceiro.diasProtesto"
                      dense
                      type="number"
                      hint="Nº de dias necessário para protestar após o vencimento."
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <br />
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-form ref="formParcela" v-model="valid" lazy-validation>
                  <v-card-title>
                    <span class="title-span">Parcela</span>
                  </v-card-title>

                  <v-row class="pt-3 px-3" dense>
                    <v-col cols="12" md="2">
                      <span class="font-weight-bold"
                        >Quantidade de Parcelas*</span
                      >
                      <v-text-field
                        outlined
                        type="number"
                        v-model="qtdeParcelas"
                        :rules="fieldRules"
                        @input="
                          valorParcela = Number(
                            Dividir(item.valor, qtdeParcelas).toFixed(2)
                          )
                        "
                        dense
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="12" md="2">
                      <span class="font-weight-bold">Valor da Parcela*</span>
                      <money-input
                        v-model="valorParcela"
                        @ValorFormatado="(valor) => (valorParcela = valor)"
                        readonly
                      />
                    </v-col>

                    <v-col cols="12" md="3">
                      <span class="font-weight-bold">1° Vencimento*</span>
                      <v-text-field
                        outlined
                        v-model="parcela.dataVencimento"
                        max="9999-12-31"
                        type="date"
                        dense
                      />
                    </v-col>

                    <v-col cols="12" md="2" class="pt-7">
                      <v-btn color="primary" dark @click="GerarParcelas()">
                        <v-icon>mdi-plus</v-icon>
                        Gerar
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="12">
                      <v-data-table
                        :headers="headersParcela"
                        :items="item.parcelas"
                        :items-per-page="15"
                        :loading="loading"
                        class="elevation-1"
                        sort-by="parcela"
                        item-key="item.id"
                        :footer-props="{ showFirstLastPage: true }"
                      >
                        <template v-slot:[`item.actions`]="{ item }">
                          <v-tooltip left>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                :disabled="item.situacaoId != 1"
                                small
                                @click="EditarParcela(item)"
                                v-on="on"
                                >mdi-pencil</v-icon
                              >
                            </template>
                            <span>Editar</span>
                          </v-tooltip>
                        </template>

                        <template v-slot:[`item.parcela`]="{ item }">{{
                          item.parcela
                        }}</template>
                        <template v-slot:[`item.valor`]="{ item }">
                          <v-edit-dialog :return-value.sync="item.valor">
                            {{
                              item.valor
                                ? Number(item.valor).toMoeda(true)
                                : new Number(0).toMoeda(true)
                            }}
                            <template v-slot:input>
                              <v-text-field
                                :disabled="item.situacaoId != 1"
                                type="number"
                                v-model="item.valor"
                                label="Editar"
                              />
                            </template>
                          </v-edit-dialog>
                        </template>

                        <template
                          v-slot:[`item.linhaDigitavelBoleto`]="{ item }"
                        >
                          <v-edit-dialog
                            :return-value.sync="item.linhaDigitavelBoleto"
                          >
                            <v-tooltip right>
                              <template v-slot:activator="{ on }">
                                <v-icon small v-on="on">mdi-pencil</v-icon>
                              </template>
                              <span>Editar</span>
                            </v-tooltip>

                            {{ item.linhaDigitavelBoleto }}
                            <template v-slot:input>
                              <v-text-field
                                :disabled="item.situacaoId != 1"
                                v-model="item.linhaDigitavelBoleto"
                                label="Editar"
                                single-line
                                :counter="60"
                                maxlength="60"
                              />
                            </template>
                          </v-edit-dialog>
                        </template>

                        <template v-slot:[`item.dataVencimento`]="{ item }">
                          <v-edit-dialog
                            :return-value.sync="item.dataVencimento"
                            >{{ item.dataVencimento.toDateDDMMYYYY() }}
                            <template v-slot:input>
                              <v-text-field
                                :disabled="item.situacaoId != 1"
                                type="date"
                                max="9999-12-31"
                                v-model="item.dataVencimento"
                                label="Editar"
                              />
                            </template>
                          </v-edit-dialog>
                        </template>

                        <template v-slot:[`item.situacaoId`]="{ item }">
                          <v-chip :color="SituacaoColor(item)">
                            <div v-if="item.agrupadorId != null">Agrupada</div>
                            <div v-else>
                              {{
                                situacaoParcelas.find(
                                  (f) => f.id == item.situacaoId
                                ).nome
                              }}
                            </div>
                          </v-chip>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
            <br />
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-form ref="formClassificacao" v-model="valid" lazy-validation>
                  <v-card-title>
                    <span class="title-span">Classificação</span>
                  </v-card-title>

                  <v-row dense class="pt-3 px-3">
                    <v-col cols="12" md="2">
                      <span class="font-weight-bold"
                        >Despesa a ser dividida</span
                      >
                      <money-input
                        v-model="valorTotal"
                        @ValorFormatado="(valor) => (valorTotal = valor)"
                        disabled
                      />
                    </v-col>
                  </v-row>

                  <v-row dense class="px-3">
                    <v-col cols="12" md="3">
                      <span class="font-weight-bold">Centro custo*</span>
                      <v-autocomplete
                        placeholder="Selecione"
                        outlined
                        v-model="classificacao.centroCustoId"
                        :rules="fieldRules"
                        :items="centroCustos"
                        item-value="id"
                        item-text="codigoDescricao"
                        dense
                      />
                    </v-col>

                    <v-col cols="12" md="3">
                      <span class="font-weight-bold">Categoria*</span>
                      <v-autocomplete
                        placeholder="Selecione"
                        outlined
                        v-model="classificacao.contaGerencialId"
                        :rules="fieldRules"
                        :items="contaGerenciais"
                        item-value="key"
                        item-text="value"
                        dense
                      />
                    </v-col>

                    <v-col cols="12" md="2">
                      <span class="font-weight-bold">Valor*</span>
                      <money-input
                        v-model="classificacao.valor"
                        @ValorFormatado="
                          (valor) => (classificacao.valor = valor)
                        "
                        @input="CalcularPercentualValor(classificacao.valor)"
                        dense
                      />
                    </v-col>

                    <v-col cols="12" md="2">
                      <span class="font-weight-bold">Percentual*</span>
                      <v-text-field
                        outlined
                        v-model="classificacao.percentual"
                        @input="
                          CalcularValorPercentual(classificacao.percentual)
                        "
                        :rules="fieldRules"
                        suffix="%"
                        dense
                        type="number"
                      />
                    </v-col>

                    <v-col cols="12" md="2" class="pt-7">
                      <v-btn
                        color="primary"
                        dark
                        @click="AdicionarClassificacao()"
                        ><v-icon>mdi-plus</v-icon>Adicionar</v-btn
                      >
                    </v-col>
                  </v-row>

                  <v-data-table
                    :headers="headersClassificacao"
                    :items="item.classificacoes"
                    :items-per-page="5"
                    :footer-props="{ showFirstLastPage: true }"
                    :loading="loading"
                    item-key="item.id"
                    class="elevation-1"
                  >
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-tooltip left>
                        <template v-slot:activator="{ on }"
                          ><v-icon
                            :disabled="item.excluido"
                            small
                            @click="EditarClassificacao(item)"
                            v-on="on"
                            >mdi-pencil</v-icon
                          ></template
                        >
                        <span>Editar</span>
                      </v-tooltip>

                      <v-tooltip right>
                        <template v-slot:activator="{ on }"
                          ><v-icon
                            :disabled="item.excluido"
                            small
                            @click="ExcluirClassificao(item)"
                            v-on="on"
                            >mdi-delete</v-icon
                          ></template
                        >
                        <span>Excluir</span>
                      </v-tooltip>
                    </template>

                    <template v-slot:[`item.centroCustoId`]="{ item }">{{
                      centroCustos.find((c) => c.id == item.centroCustoId).nome
                    }}</template>
                    <template v-slot:[`item.contaGerencialId`]="{ item }">{{
                      contaGerenciais.find(
                        (d) => d.key == item.contaGerencialId
                      )
                        ? contaGerenciais.find(
                            (d) => d.key == item.contaGerencialId
                          ).value
                        : "-"
                    }}</template>
                    <template v-slot:[`item.valor`]="{ item }">{{
                      item.valor
                        ? Number(item.valor).toMoeda(true)
                        : new Number(0).toMoeda(true)
                    }}</template>
                    <template v-slot:[`item.percentual`]="{ item }"
                      >{{
                        `${item.percentual.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })} %`
                      }}
                    </template>
                  </v-data-table>
                </v-form>
              </v-card-text>
            </v-card>
            <br />
          </v-tab-item>

          <v-tab-item>
            <vcard-documento
              :lista.sync="item.documentos"
              :exibirCampos="true"
            />
            <br />
          </v-tab-item>
        </v-tabs-items>
      </v-form>
    </v-card>

    <v-dialog v-model="dialogParcela" persistent max-width="700">
      <v-card>
        <v-toolbar flat>
          <v-card-actions>
            <v-btn @click="dialogParcela = false" icon color="primary">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card-title class="title font-weight-light"
              >Editar Parcela</v-card-title
            >
          </v-card-actions>
        </v-toolbar>
        <br />

        <v-card-text>
          <v-row class="px-3" dense>
            <v-col cols="12" md="3">
              <span class="font-weight-bold">Parcela</span>
              <v-text-field
                outlined
                type="number"
                v-model="parcela.parcela"
                disabled
                dense
              />
            </v-col>

            <v-col cols="12" md="3">
              <span class="font-weight-bold">Valor da Parcela</span>
              <money-input
                v-model="parcela.valor"
                @ValorFormatado="(valor) => (parcela.valor = valor)"
              />
            </v-col>

            <v-col cols="12" md="6">
              <span class="font-weight-bold">Situação</span>
              <v-select
                outlined
                v-model="parcela.situacaoId"
                :items="situacaoParcelas"
                readonly
                item-value="id"
                item-text="nome"
                dense
              />
            </v-col>

            <v-col cols="12" md="6">
              <span class="font-weight-bold">Linha Digitável</span>
              <v-text-field
                outlined
                v-model="parcela.linhaDigitavelBoleto"
                :counter="60"
                maxlength="60"
                dense
              />
            </v-col>

            <v-col cols="12" md="6">
              <span class="font-weight-bold">1º vencimento</span>
              <v-text-field
                outlined
                v-model="parcela.dataVencimento"
                type="date"
                dense
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="Confirmar()">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <cadastro-pessoa
      v-model="dialogCadastroPessoa"
      :item="pessoa"
      @salvou="(dialogCadastroPessoa = false), AtualizarPessoas()"
      @fechou="dialogCadastroPessoa = false"
    />
  </v-dialog>
</template> 

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  ReceitaService,
  TipoDocumentoService,
  SituacaoReceitaParcelaService,
  CentroCustoService,
  ContaGerencialService,
  ParametroFinanceiroService,
  ContaCorrenteService,
} from "@/core/services/financeiro";
import {
  Receita,
  ReceitaParcela,
  ReceitaClassificacao,
  Encargo,
  ParametroGatway,
  ContaCorrente,
  ValoresAdicionais,
} from "@/core/models/financeiro";
import { TipoReceitaService } from "../../../core/services/financeiro/TipoReceitaService";
import {
  EmpreendimentoService,
  PessoaService,
} from "../../../core/services/cadastros";
import { EmpresaService } from "../../../core/services/compras/EmpresaService";
import { Pessoa } from "../../../core/models/cadastros";
import { SituacaoColor } from "@/assets/scripts/helper";
import * as jsonpatch from "fast-json-patch";
import { TipoOperacaoFinanceiraService } from "@/core/services/contratos";

@Component
export default class CadastroReceita extends Vue {
  @Prop() public item!: Receita;
  @Prop() public value!: string;

  service = new ReceitaService();
  classificacao = new ReceitaClassificacao();
  parcela = new ReceitaParcela();

  tipoDocumentos = [];
  tipoReceitas = [];
  situacaoParcelas: any = [];
  centroCustos: any = [];
  contaGerenciais: any = [];
  empresas = [];
  empreendimentos = [];
  pessoas = [];
  tiposOperacaoContrato = [];
  listaContaCorrentes = [];
  parcelas: any = [];

  dialogCadastroPessoa = false;
  overlay = false;
  pessoa = new Pessoa();

  qtdeParcelas = 0;
  valorParcela = 0;
  itemIndex: number = -1;

  parametroGatway = new ParametroGatway();
  listaGateway = [];

  tabActive = 0;
  valid = true;
  dialog = false;
  dialogParcela = false;
  loading = false;

  $refs!: {
    formReceita: HTMLFormElement;
    formClassificacao: HTMLFormElement;
    formParcela: HTMLFormElement;
  };

  parcelaIndex = -1;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  headersParcela = [
    { text: "", value: "actions", sortable: false },
    { text: "Parcela", value: "parcela" },
    { text: "Valor", value: "valor" },
    { text: "Linha digitável", value: "linhaDigitavelBoleto" },
    { text: "Vencimento", value: "dataVencimento" },
    { text: "Situação", value: "situacaoId" },
  ];

  headersClassificacao = [
    { text: "", value: "actions", sortable: false },
    { text: "Centro custo", value: "centroCustoId" },
    { text: "Categoria", value: "contaGerencialId" },
    { text: "Valor", value: "valor" },
    { text: "Percentual", value: "percentual" },
  ];

  @Watch("item", { deep: true })
  ObservadorItem() {
    this.observer = jsonpatch.observe(this.item);
  }

  @Watch("item")
  Item() {
    if (this.$refs.formReceita) {
      this.$refs.formReceita.resetValidation();
    }
  }

  @Watch("classificacao")
  Classificacao() {
    if (this.$refs.formClassificacao) {
      this.$refs.formClassificacao.resetValidation();
    }
  }

  @Watch("parcela")
  Parcela() {
    if (this.$refs.formParcela) {
      this.$refs.formParcela.resetValidation();
    }
  }

  observer!: jsonpatch.Observer<Receita>;

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
    if (this.dialog) {
      this.observer = jsonpatch.observe(this.item);
    } else {
      jsonpatch.unobserve(this.item, this.observer);
    }
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    } else {
      if (this.item.id > 0) this.ObterParametroPorId();
    }
  }

  Validacoes() {
    if (
      !this.item.dataEmissao ||
      !this.item.tipoId ||
      !this.item.tipoDocumentoId ||
      !this.item.valor ||
      !this.item.clienteId ||
      !this.item.empresaId
    ) {
      this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
      this.tabActive = 0;
      return true;
    }

    if (!this.item.tipoOperacaoId) {
      this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
      this.tabActive = 1;
      return true;
    }

    if (this.item.parcelas.length == 0) {
      this.$swal("Aviso", "É necessário adicionar as parcelas.", "warning");
      this.tabActive = 2;
      return true;
    }
  }

  Salvar() {
    this.$refs.formReceita.validate();
    if (!this.Validacoes()) {
      this.item.parcelas.forEach((x) => {
        if (x.situacaoId == 1) {
          x.tipoGatewayId = this.item.tipoGatewayId;
          x.encargoFinanceiro = this.parametroGatway.encargoFinanceiro;
          x.tipoOperacaoId = this.item.tipoOperacaoId;
          x.contaCorrenteId = this.item.contaCorrenteId;
        }
      });

      this.overlay = true;
      let pacthModel = jsonpatch.generate(this.observer);

      (this.item.id > 0
        ? this.service.Patch(pacthModel, this.item.id)
        : this.service.Salvar(this.item)
      )
        .then(
          (res) => {
            this.$swal(
              "Aviso",
              "Operação realizada com sucesso!",
              res.status == 201 || res.status == 200 ? "success" : "warning"
            );
            this.$emit("salvou");
            this.Close();
          },
          (err) => {
            if (!err.response) {
              this.$swal("Aviso", "Não foi possível acessar a API", "error");
            } else if (err.response.status == 403) {
              this.$swal("Aviso", err.response.data.message, "warning");
            } else {
              this.$swal(
                "Aviso",
                err.response.data,
                err.response.status == 400 ? "warning" : "error"
              );
            }
          }
        )
        .finally(() => (this.overlay = false));
    }
  }

  Atualizar() {
    this.service
      .ObterPorId(this.item.id, "Parcelas.Baixas, Classificacoes, Documentos")
      .then((res) => {
        this.item = res.data;
        jsonpatch.unobserve(this.item, this.observer);
      });
  }

  Close() {
    this.dialog = false;
    this.ResetEncargos();
    this.ResetAtributos();
  }

  CadastrarPessoa() {
    this.pessoa = new Pessoa();
    this.dialogCadastroPessoa = true;
  }

  GerarParcelas() {
    this.parcelas = [...this.item!.parcelas];

    if (this.item.parcelas.some((parcela) => parcela.situacaoId !== 1))
      return this.$swal(
        "Aviso",
        "Não é possível editar uma parcela paga ou cancelada.",
        "warning"
      );

    this.item.parcelas = [];
    const dataInicial = new Date(
      Date.parse(`${this.parcela.dataVencimento} 00:00:00`)
    );

    for (let i = 0; i < this.qtdeParcelas; i++) {
      const parcelaAntiga = this.parcelas[i] || {};

      const dataCalculada = new Date(dataInicial);
      dataCalculada.setMonth(dataInicial.getMonth() + i);

      const novaParcela: any = {
        parcela: i + 1,
        valor: this.valorParcela,
        situacaoId: 1,
        dataVencimento: dataCalculada.yyyymmdd(),
        dataVencimentoOriginal: parcelaAntiga?.id
          ? parcelaAntiga.dataVencimento
          : new Date(),
        linhaDigitavelBoleto: this.parcela.linhaDigitavelBoleto,
        ultimaDataPagamento: null,
        ultimaFormaPagamento: null,
        id: parcelaAntiga.id || 0,
        receita: parcelaAntiga.receita,
        receitaId: parcelaAntiga.receitaId || 0,
        parcelaStr: parcelaAntiga.parcelaStr || "",
        saldo: parcelaAntiga.saldo || 0,
        valorAPagarComJurosEMulta: parcelaAntiga.valorAPagarComJurosEMulta || 0,
        tipoServicoId: null,
        ultimaTransacao: null,
        valorPago: 0,
        situacao: null,
        valoresAdicionais: new ValoresAdicionais(
          parcelaAntiga.valoresAdicionais
        ),
        multaAplicado: parcelaAntiga.multaAplicado || 0,
        jurosAplicado: parcelaAntiga.jurosAplicado || 0,
        descontoAplicado: parcelaAntiga.descontoAplicado || 0,
        valorComTaxas: parcelaAntiga.valorComTaxas || 0,
      };

      this.item!.parcelas.push(novaParcela);
      this.parcela.linhaDigitavelBoleto = "";
    }

    // Resetar a parcela e outros parâmetros
    this.parcela = new ReceitaParcela();
    this.parcelaIndex = -1;
    this.valorParcela = 0;
    this.qtdeParcelas = 0;
  }

  EditarParcela(item) {
    this.parcela = item;
    this.parcela.dataVencimento = new Date(item.dataVencimento).yyyymmdd();
    this.dialogParcela = true;
  }

  Confirmar() {
    // Obtenha o índice da parcela editada na lista item.parcelas
    let indiceParcelaEditada = this.item.parcelas.indexOf(this.parcela);
    let valorParcelaEditada = this.parcela.valor;

    // Calcule o valor total das parcelas anteriores à parcela editada
    let valorParcelasAnteriores = 0;
    for (let i = 0; i < indiceParcelaEditada; i++) {
      valorParcelasAnteriores += this.item.parcelas[i].valor;
    }

    // Calcule o saldo restante após a edição da parcela
    let saldoRestante =
      this.item.valor - valorParcelasAnteriores - valorParcelaEditada;

    // Atualize as parcelas posteriores à parcela editada
    for (let i = indiceParcelaEditada + 1; i < this.item.parcelas.length; i++) {
      let parcela = this.item.parcelas[i];

      let valorFormatado = Number(
        (saldoRestante > 0 ? saldoRestante : 0) /
          (this.item.parcelas.length - (indiceParcelaEditada + 1))
      ).toFixed(2);
      parcela.valor = Number(valorFormatado);
    }

    let valortotal = this.item.parcelas
      .reduce((total, parcela) => total + parcela.valor, 0)
      .toFixed(2);
    this.item.valor = Number(valortotal);
    this.parcela = new ReceitaParcela();
    this.dialogParcela = false;
  }

  ExcluirParcela(item) {
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja excluir o registro atual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        if (item.id > 0) this.service.ExcluirParcela(item.id).then();

        const index = this.item.parcelas!.indexOf(item);
        this.item.parcelas!.splice(index, 1);
        return this.$swal("Aviso", "Registro excluído com sucesso!", "success");
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if (result.value) {
      }
    });
  }

  valorTotal: number = 0;

  @Watch("itemIndex")
  @Watch("item.valor")
  @Watch("item.classificacoes")
  updateValorTotal() {
    const valorClassificacoes = this.item.classificacoes.reduce(
      (total, classificacao) => total + classificacao.valor,
      0
    );
    this.valorTotal = this.item.valor - valorClassificacoes;
  }

  AdicionarClassificacao() {
    if (this.$refs.formClassificacao.validate()) {
      let valorRestante = Number(this.valorTotal);

      if (this.itemIndex > -1) {
        const currentClassification = this.item.classificacoes[this.itemIndex];
        valorRestante += currentClassification.valor;
      }

      if (this.classificacao.valor > valorRestante) {
        return this.$swal(
          "Aviso",
          "O valor não pode ser maior que o valor a ser dividido",
          "warning"
        );
      }

      if (this.itemIndex > -1) {
        Object.assign(
          this.item.classificacoes[this.itemIndex],
          this.classificacao
        );
      } else {
        this.item.classificacoes.push(this.classificacao);
      }

      this.classificacao = new ReceitaClassificacao();
      this.itemIndex = -1;
    }
  }

  EditarClassificacao(item) {
    this.itemIndex = this.item.classificacoes.indexOf(item);
    this.classificacao = Object.assign({}, item);
  }

  ExcluirClassificao(item) {
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja excluir o registro atual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        if (item.id > 0) {
          item.excluido = true;
          const index = this.item.classificacoes!.indexOf(item);
          delete this.item.classificacoes![index];
          this.dialog = false;
          this.dialog = true;
          return true;
        } else {
          const index = this.item.classificacoes!.indexOf(item);
          this.item.classificacoes!.splice(index, 1);
          return this.$swal(
            "Aviso",
            "Registro excluído com sucesso!",
            "success"
          );
        }
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if (result.value) {
      }
    });
  }

  SituacaoColor(item) {
    return SituacaoColor(item);
  }

  ObterParametroGatway(item) {
    if (item) {
      this.parametroGatway.encargoFinanceiro = item.encargoFinanceiro;
      this.item.tipoGatewayId = item.tipoId;
    } else {
      this.parametroGatway.encargoFinanceiro = new Encargo();
      this.item.tipoGatewayId = 0;
    }
  }

  ObterParametroPorId() {
    new ParametroFinanceiroService()
      .ObterParametroEmpresaPorId(this.item.empresaId, "Gatways.Tipo")
      .then(
        (res) => {
          this.listaGateway = res.data.gatways;
        },
        (err) => {
          this.ResetEncargos();
        }
      );
  }

  ObterEncargosContaCorrente() {
    new ContaCorrenteService()
      .ObterPorId(this.item.contaCorrenteId)
      .then((res) => {
        this.parametroGatway.encargoFinanceiro = res.data.encargoFinanceiro;
      });
  }

  Dividir = (x: any, b: any) => parseFloat(x) / parseFloat(b);

  @Watch("dialog")
  ObterEncargosPrimeiraParcela(dialog) {
    if (dialog == null) return;

    if (dialog == true) {
      this.parametroGatway.encargoFinanceiro =
        this.item.parcelas.length > 0
          ? this.item.parcelas[0].encargoFinanceiro
          : new Encargo();
    }
  }

  ResetEncargos() {
    this.parametroGatway = new ParametroGatway();
  }

  ResetAtributos() {
    this.qtdeParcelas = 0;
    this.valorParcela = 0;
    this.tabActive = 0;
  }

  AtualizarPessoas() {
    new PessoaService()
      .Listar(
        -1,
        -1,
        ["nome"],
        [],
        "",
        [],
        "",
        "",
        "Id,nome,cnpjCpf, nomeCnpjCpf",
        ""
      )
      .then((res) => {
        this.pessoas = res.data.items;
      });
  }

  ObterEmpreendimentosPorEmpresa() {
    let filter = { empresaId: this.item.empresaId };
    new EmpreendimentoService()
      .Listar(
        -1,
        -1,
        ["nome"],
        [],
        "",
        ["Id,Nome, EmpresaId"],
        filter,
        "",
        "",
        ""
      )
      .then((res) => {
        this.empreendimentos = res.data.items;
      });
  }

  @Watch("classificacao.valor")
  CalcularPercentualValor(valor) {
    if (valor > 0) {
      let percentual = (valor * 100) / Number(this.item.valor);
      this.classificacao.percentual = Number(percentual.toFixed(2));
    }
  }

  CalcularValorPercentual(valor) {
    let valorClassificado = (this.item.valor * valor) / 100;
    this.classificacao.valor = Number(valorClassificado.toFixed(2));
  }

  mounted() {
    this.AtualizarPessoas();

    const contaCorrenteService = new ContaCorrenteService();
    contaCorrenteService.ListarTudo().then((res) => {
      this.listaContaCorrentes = res.data.items;
    });

    const tipoOperacaoContrato = new TipoOperacaoFinanceiraService();
    tipoOperacaoContrato.ListarTudo().then((res) => {
      this.tiposOperacaoContrato = res.data.items;
    });

    new PessoaService()
      .Listar(
        -1,
        -1,
        ["nome"],
        [],
        "",
        [],
        "",
        "",
        "Id,nome,cnpjCpf, nomeCnpjCpf",
        ""
      )
      .then((res) => (this.pessoas = res.data.items));

    new TipoDocumentoService()
      .ListarTudo()
      .then((res) => (this.tipoDocumentos = res.data.items));

    new TipoReceitaService()
      .ListarTudo()
      .then((res) => (this.tipoReceitas = res.data.items));

    new SituacaoReceitaParcelaService()
      .ListarTudo()
      .then((res) => (this.situacaoParcelas = res.data.items));

    new CentroCustoService()
      .ListarTudo()
      .then((res) => (this.centroCustos = res.data.items));

    new ContaGerencialService()
      .Listagem()
      .then((res) => (this.contaGerenciais = res.data));

    new EmpresaService()
      .Listar(
        -1,
        -1,
        ["nomeFantasia"],
        [],
        "",
        [],
        "",
        "",
        "Id, nomeFantasia",
        ""
      )
      .then((res) => (this.empresas = res.data.items));
  }
}
</script>

<style>
.dotted-line {
  border-top: 1px dashed #414042;
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>