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
      <v-toolbar dark color="primary" extended>
        <v-btn icon dark @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>Novo Contrato</v-toolbar-title>
        <v-spacer />

        <v-toolbar-items>
          <v-btn dark text @click="Salvar()" :loading="overlay">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-form v-model="valid" lazy-validation ref="form">
        <v-stepper v-model="e13" vertical class="fundo">
          <v-stepper-step
            :complete="e13 > 1"
            step="1"
            editable
            edit-icon="mdi-check"
            >Envolvidos</v-stepper-step
          >

          <v-stepper-content step="1">
            <v-card class="mb-6" outlined style="border-radius: 20px">
              <v-card-text>
                <div class="font-weight-bold">Empresa</div>
                <v-row dense>
                  <v-col cols="12" md="5">
                    <v-select
                      placeholder="Selecione"
                      outlined
                      v-model="item.empresaId"
                      @change="ObterParametroPorId(item.empresaId)"
                      dense
                      :rules="fieldRules"
                      :items="listaEmpresas"
                      item-value="id"
                      item-text="nomeFantasia"
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider />

              <v-card-text>
                <div class="font-weight-bold">Clientes</div>
                <v-form
                  v-model="validCliente"
                  lazy-validation
                  ref="formCliente"
                >
                  <v-row dense>
                    <v-col cols="12" sm="12" md="6">
                      <v-autocomplete
                        placeholder="Selecione"
                        outlined
                        v-model="contratoCliente.clienteId"
                        :items="listaClientes"
                        :rules="fieldRules"
                        clearable
                        item-text="nomeCnpjCpf"
                        item-value="id"
                        dense
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
                                <v-icon color="primary"
                                  >mdi-account-plus</v-icon
                                >
                              </v-btn>
                            </template>
                            <span>Cadastrar Cliente</span>
                          </v-tooltip>
                        </template>
                      </v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="12" md="1" lg="1">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            icon
                            color="primary"
                            v-on="on"
                            @click="AdicionarCliente()"
                            :disabled="
                              contratoCliente.clienteId == 0 || !validCliente
                            "
                          >
                            <v-icon x-large color="primary">mdi-check</v-icon>
                          </v-btn>
                        </template>
                        <span>Incluir Cliente</span>
                      </v-tooltip>
                    </v-col>

                    <v-col cols="12" md="12">
                      <v-data-table
                        hide-default-footer
                        style="background-color: transparent"
                        :headers="headersCliente"
                        :items="item.clientes"
                        item-key="item.id"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.actions`]="{ item }">
                          <v-tooltip left>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                small
                                @click="EditarCliente(item)"
                                v-on="on"
                                >mdi-pencil</v-icon
                              >
                            </template>
                            <span>Editar</span>
                          </v-tooltip>

                          <v-tooltip right>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                small
                                @click="ExcluirCliente(item)"
                                v-on="on"
                                >mdi-delete</v-icon
                              >
                            </template>
                            <span>Excluir</span>
                          </v-tooltip>
                        </template>

                        <template v-slot:[`item.clienteId`]="{ item }">
                          {{
                            listaClientes.find((x) => x.id == item.clienteId)
                              .nomeCnpjCpf
                          }}
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>

            <v-card-actions class="justify-start">
              <v-btn @click="e13++" color="primary">
                AVANÇAR <v-icon small left>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-stepper-content>

          <v-stepper-step
            :complete="e13 > 2"
            step="2"
            editable
            edit-icon="mdi-check"
            >Informações do Produto</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-card class="mb-6" shaped outlined>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" xs="12" sm="12" md="4" lg="3" xl="3">
                    <div class="font-weight-bold">Tipo do contrato</div>
                    <v-select
                      placeholder="Selecione"
                      outlined
                      @change="ObterEmpreendimentos(item.tipoId)"
                      v-model="item.tipoId"
                      dense
                      :items="tiposContratos"
                      :rules="fieldRules"
                      item-value="id"
                      item-text="nome"
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    />
                  </v-col>
                </v-row>

                <v-row dense class="pt-3">
                  <v-col cols="12" md="4">
                    <div class="font-weight-bold">Empreendimento</div>
                    <v-autocomplete
                      placeholder="Selecione"
                      outlined
                      v-model="item.empreendimentoId"
                      @change="ObterGrupos()"
                      dense
                      :items="listaEmpreendimentos"
                      :rules="fieldRules"
                      item-value="id"
                      item-text="nome"
                      :disabled="item.tipoId == 0"
                    />
                  </v-col>

                  <v-col cols="12" xs="12" sm="5" md="3" lg="2" xl="2">
                    <div class="font-weight-bold">Grupo</div>
                    <v-autocomplete
                      placeholder="Selecione"
                      outlined
                      v-model="item.grupoId"
                      @change="ObterUnidades()"
                      dense
                      :items="listaGrupos"
                      :rules="fieldRules"
                      item-value="id"
                      item-text="nome"
                      :disabled="item.empreendimentoId == 0"
                    />
                  </v-col>

                  <v-col cols="12" xs="12" sm="5" md="3" lg="2" xl="2">
                    <div class="font-weight-bold">Unidade</div>
                    <v-autocomplete
                      @change="ObterUnidade()"
                      placeholder="Selecione"
                      outlined
                      dense
                      v-model="item.unidadePrincipalId"
                      :items="listaUnidades"
                      :rules="fieldRules"
                      item-value="id"
                      item-text="nome"
                      :disabled="item.grupoId == 0"
                    />
                  </v-col>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        large
                        icon
                        color="primary"
                        class="mt-6"
                        dark
                        v-on="on"
                        @click="dialogMultiLotes = true"
                      >
                        <v-icon large>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Adicionar lotes </span>
                  </v-tooltip>
                </v-row>

                <v-snackbar
                  shaped
                  :timeout="6000"
                  v-model="errorAlert"
                  color="primary"
                >
                  Esta unidade não possui um plano de pagamento. Você pode
                  inserir um plano de pagamento para a unidade ou criar um
                  contrato manualmente.
                </v-snackbar>

                <v-card
                  elevation="1"
                  shaped
                  color="fundo"
                  max-width="645"
                  v-if="planoPagamento.id > 0"
                >
                  <v-card-title>
                    <v-icon left large color="primary">mdi-file-check</v-icon>
                    Resumo do Plano
                  </v-card-title>

                  <v-card-text>
                    <v-list class="fundo">
                      <v-list-item>
                        <v-row dense no-gutters>
                          <v-col cols="12" md="5">
                            <v-list-item-content>
                              <v-list-item-title
                                >Nome do plano</v-list-item-title
                              >
                              <v-list-item-subtitle
                                >{{ planoPagamento.nome }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="3">
                            <v-list-item-content>
                              <v-list-item-title> Indice </v-list-item-title>
                              <v-list-item-subtitle
                                >{{
                                  planoPagamento.tipoIndice
                                    ? planoPagamento.tipoIndice.nome
                                    : "Não cadastrado"
                                }}
                                -
                                {{
                                  planoPagamento.intervaloReajuste
                                    ? planoPagamento.intervaloReajuste.nome
                                    : "Não cadastrado"
                                }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title>
                                Mês do reajuste
                              </v-list-item-title>
                              <v-list-item-subtitle>{{
                                planoPagamento.tipoMesReajuste
                                  ? planoPagamento.tipoMesReajuste.nome
                                  : "Não cadastrado"
                              }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="6">
                            <v-list-item-content>
                              <v-list-item-title>
                                Ano do 1º reajuste
                              </v-list-item-title>
                              <v-list-item-subtitle>{{
                                planoPagamento.tipoAnoInicioReajuste
                                  ? planoPagamento.tipoAnoInicioReajuste.nome
                                  : "Não cadastrado"
                              }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>
                        </v-row>
                      </v-list-item>
                    </v-list>

                    <v-card-actions>
                      <v-spacer />
                      <v-btn color="primary" icon @click="show = !show">
                        <v-icon>{{
                          show ? "mdi-chevron-up" : "mdi-chevron-down"
                        }}</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card-text>

                  <v-expand-transition>
                    <div v-show="show">
                      <v-divider />

                      <v-tabs
                        class="pl-3"
                        background-color="fundo"
                        v-model="tab"
                        color="#404142"
                      >
                        <v-tab>Entrada</v-tab>
                        <v-tab>Intermediaria</v-tab>
                        <v-tab>Financiamento</v-tab>
                      </v-tabs>

                      <v-card-text>
                        <v-tabs-items v-model="tab">
                          <v-tab-item class="fundo">
                            <template v-if="planoPagamento.entrada">
                              <v-list color="fundo">
                                <v-list-item>
                                  <v-row dense>
                                    <v-col cols="12" md="5">
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Tipo da entrada</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.entrada.tipo
                                              ? planoPagamento.entrada.tipo.nome
                                              : "Não cadastrado"
                                          }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col
                                      cols="12"
                                      md="3"
                                      v-if="planoPagamento.entrada.tipoId == 2"
                                    >
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Valor</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.entrada.valor.toMoeda(
                                              true
                                            )
                                          }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="3" v-else>
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Porcentagem</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.entrada
                                              .porcentagemValorTotal
                                          }}
                                          %
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="3">
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Intervalo</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.entrada
                                              .tipoIntervaloParcela
                                              ? planoPagamento.entrada
                                                  .tipoIntervaloParcela.nome
                                              : "Não cadastrado"
                                          }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="3">
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Qtde de parcelas</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{ planoPagamento.entrada.prazo }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>
                                  </v-row>
                                </v-list-item>
                              </v-list>

                              <div class="dotted-line2" />
                              <v-row dense class="px-3">
                                <v-col cols="12" md="4">
                                  <div class="font-weight-regular">
                                    Selecione a qtde de parcelas
                                  </div>
                                  <v-select
                                    @change="ConfigurarPlano(unidade)"
                                    v-model="planoPagamento.entrada.prazo"
                                    :items="
                                      planoPagamento.entrada.prazosDisponiveis
                                    "
                                    placeholder="Selecione"
                                    filled
                                    dense
                                    outlined
                                    item-value="id"
                                    item-text="nome"
                                  />
                                </v-col>
                              </v-row>
                            </template>

                            <h3 v-else>Receita não configurada</h3>
                          </v-tab-item>

                          <v-tab-item class="fundo">
                            <template v-if="planoPagamento.intermediaria">
                              <v-list color="fundo">
                                <v-list-item>
                                  <v-row dense>
                                    <v-col cols="12" md="5">
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Tipo de
                                          Intermediaria</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.intermediaria.tipo
                                              ? planoPagamento.intermediaria
                                                  .tipo.nome
                                              : "Não cadastrado"
                                          }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col
                                      cols="12"
                                      md="3"
                                      v-if="
                                        planoPagamento.intermediaria.tipoId == 2
                                      "
                                    >
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Valor</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.intermediaria.valor.toMoeda(
                                              true
                                            )
                                          }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="3" v-else>
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Porcentagem</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.intermediaria
                                              .porcentagemValorTotal
                                          }}
                                          %</v-list-item-subtitle
                                        >
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="3">
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Intervalo</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.intermediaria
                                              .tipoIntervaloParcela
                                              ? planoPagamento.intermediaria
                                                  .tipoIntervaloParcela.nome
                                              : "Não cadastrado"
                                          }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="3">
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Qtde de parcelas</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.intermediaria.prazo
                                          }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>
                                  </v-row>
                                </v-list-item>
                              </v-list>

                              <div class="dotted-line2" />

                              <v-row dense class="px-3">
                                <v-col cols="12" md="4">
                                  <div class="font-weight-regular">
                                    Selecione a qtde de parcelas
                                  </div>
                                  <v-select
                                    @change="ConfigurarPlano(unidade)"
                                    v-model="planoPagamento.intermediaria.prazo"
                                    :items="
                                      planoPagamento.intermediaria
                                        .prazosDisponiveis
                                    "
                                    placeholder="Selecione"
                                    filled
                                    dense
                                    outlined
                                    item-value="id"
                                    item-text="nome"
                                  />
                                </v-col>

                                <v-col cols="12" md="5">
                                  <div class="font-weight-regular">
                                    Selecione o intervalo
                                  </div>
                                  <v-select
                                    @change="ConfigurarPlano(unidade)"
                                    v-model="
                                      planoPagamento.intermediaria
                                        .tipoIntervaloParcelaId
                                    "
                                    :items="tiposIntervaloParcelas"
                                    placeholder="Selecione"
                                    filled
                                    dense
                                    outlined
                                    item-value="id"
                                    item-text="nome"
                                  />
                                </v-col>
                              </v-row>
                            </template>

                            <h3 v-else>Receita não configurada</h3>
                          </v-tab-item>

                          <v-tab-item class="fundo">
                            <template v-if="planoPagamento.financiamento">
                              <v-list color="fundo">
                                <v-list-item>
                                  <v-row dense>
                                    <v-col cols="12" md="5">
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Tipo do
                                          financiamento</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.financiamento.tipo
                                              ? planoPagamento.financiamento
                                                  .tipo.nome
                                              : "Não cadastrado"
                                          }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col
                                      cols="12"
                                      md="3"
                                      v-if="
                                        planoPagamento.financiamento.tipoId == 2
                                      "
                                    >
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Valor</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            receitaSaldoDevedor.valor.toMoeda(
                                              true
                                            )
                                          }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="3" v-else>
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Porcentagem</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.financiamento
                                              .porcentagemValorTotal
                                          }}
                                          %
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="3">
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Intervalo</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.financiamento
                                              .tipoIntervaloParcela
                                              ? planoPagamento.financiamento
                                                  .tipoIntervaloParcela.nome
                                              : "Não cadastrado"
                                          }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="3">
                                      <v-list-item-content>
                                        <v-list-item-title
                                          >Qtde de parcelas</v-list-item-title
                                        >
                                        <v-list-item-subtitle
                                          >{{
                                            planoPagamento.financiamento.prazo
                                          }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>
                                  </v-row>
                                </v-list-item>
                              </v-list>

                              <div class="dotted-line2" />

                              <v-row dense class="px-3">
                                <v-col cols="12" md="4">
                                  <div class="font-weight-regular">
                                    Selecione a qtde de parcelas
                                  </div>
                                  <v-select
                                    @change="ConfigurarPlano(unidade)"
                                    v-model="planoPagamento.financiamento.prazo"
                                    :items="
                                      planoPagamento.financiamento
                                        .prazosDisponiveis
                                    "
                                    placeholder="Selecione"
                                    filled
                                    dense
                                    outlined
                                    item-value="id"
                                    item-text="nome"
                                  />
                                </v-col>

                                <v-col class="pt-2" cols="12" md="4">
                                  <v-switch
                                    @change="ConfigurarPlano(unidade)"
                                    hint="As parcelas do financiamento serão geradas após as parcelas de entrada."
                                    persistent-hint
                                    color="primary"
                                    v-model="
                                      planoPagamento.financiamento
                                        .gerarFinanciamentoPosEntrada
                                    "
                                    label="Pós entrada"
                                  />
                                </v-col>

                                <v-col class="pt-2" cols="12" md="4">
                                  <v-switch
                                    @change="ConfigurarPlano(unidade)"
                                    hint="As parcelas do financiamento serão geradas sem causar sobreposições com as parcelas da intermediária."
                                    persistent-hint
                                    color="primary"
                                    v-model="
                                      planoPagamento.financiamento
                                        .gerarFinanciamentoComIntermediaria
                                    "
                                    label="Não Não Gerar financiamento com intermediaria"
                                  />
                                </v-col>
                              </v-row>
                            </template>

                            <h3 v-else>Receita não configurada</h3>
                          </v-tab-item>
                        </v-tabs-items>
                      </v-card-text>
                    </div>
                  </v-expand-transition>
                </v-card>
              </v-card-text>
            </v-card>

            <v-card-actions class="justify-start">
              <v-btn @click="e13--" outlined color="primary">
                <v-icon small left>mdi-arrow-left</v-icon> Voltar
              </v-btn>
              <v-btn @click="e13++" color="primary">
                AVANÇAR <v-icon small left>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-stepper-content>

          <v-stepper-step
            :complete="e13 > 3"
            step="3"
            editable
            edit-icon="mdi-check"
            >Datas e Reajuste</v-stepper-step
          >
          <v-stepper-content step="3">
            <v-card class="mb-6" shaped outlined>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="2">
                    <div class="font-weight-bold">Data do contrato</div>
                    <v-text-field
                      @change="
                        ObterMesAno(
                          planoPagamento.tipoMesReajusteId,
                          planoPagamento.tipoAnoInicioReajusteId
                        )
                      "
                      placeholder="Selecione"
                      outlined
                      :rules="fieldRules"
                      v-model="item.data"
                      dense
                      type="date"
                      max="9999-12-31"
                    />
                  </v-col>
                </v-row>
                <v-divider />

                <v-row dense class="pt-3">
                  <v-col cols="12" md="2">
                    <div class="font-weight-bold">Índice do reajuste</div>
                    <v-select
                      placeholder="Selecione"
                      outlined
                      :items="listaIndices.filter((x) => x.criado == true)"
                      v-model="item.tipoIndiceId"
                      item-value="id"
                      item-text="nomeEditavel"
                      dense
                      :rules="fieldRules"
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    >
                      <!-- <template v-slot:append-outer>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn icon v-on="on" style="margin-top: -5px"  @click="NovoTipoIndice()">
                                  <v-icon color="primary">mdi-account-plus</v-icon>
                                </v-btn>
                              </template>
                              <span>Cadastrar Tipo de Indice</span>
                            </v-tooltip> 
                          </template> -->
                    </v-select>
                  </v-col>

                  <v-col cols="12" md="2">
                    <div class="font-weight-bold">Intervalo do reajuste</div>
                    <v-select
                      placeholder="Selecione"
                      outlined
                      :items="tiposIntervalos"
                      v-model="item.intervaloReajusteId"
                      item-value="id"
                      item-text="nome"
                      dense
                      :rules="fieldRules"
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    />
                  </v-col>

                  <v-col cols="12" md="2" v-if="item.intervaloReajusteId == 1">
                    <div class="font-weight-bold">
                      Mês do índice de reajuste
                    </div>
                    <v-select
                      placeholder="Selecione"
                      outlined
                      dense
                      :items="meses"
                      item-text="nome"
                      item-value="id"
                      v-model="item.mesReajuste"
                      :rules="fieldRules"
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    />
                  </v-col>

                  <v-col cols="12" md="2">
                    <div class="font-weight-bold">Ano do 1º reajuste</div>
                    <v-autocomplete
                      placeholder="Selecione"
                      outlined
                      v-model="item.anoPrimeiroReajuste"
                      dense
                      :items="anos"
                      :rules="fieldRules"
                    />
                  </v-col>

                  <v-col cols="12" md="2">
                    <div class="font-weight-bold">Tipo de tabela</div>
                    <v-select
                      placeholder="Selecione"
                      outlined
                      :items="tiposAmortizacao"
                      v-model="item.tipoAmortizacaoId"
                      item-value="id"
                      item-text="nome"
                      dense
                      :rules="fieldRules"
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    lg="2"
                    md="2"
                    xl="1"
                    v-if="item.tipoAmortizacaoId == 2"
                  >
                    <div class="font-weight-bold">Juros a.m</div>
                    <v-text-field
                      type="number"
                      suffix="%"
                      outlined
                      v-model="item.jurosAmortizacao"
                      dense
                      :rules="fieldRules"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card-actions class="justify-start">
              <v-btn @click="e13--" outlined color="primary">
                <v-icon small left>mdi-arrow-left</v-icon> Voltar
              </v-btn>
              <v-btn @click="e13++" color="primary">
                AVANÇAR <v-icon small left>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-stepper-content>

          <v-stepper-step
            :complete="e13 > 4"
            step="4"
            editable
            edit-icon="mdi-check"
            >Receitas</v-stepper-step
          >

          <v-stepper-content step="4">
            <v-card class="mb-6" shaped outlined>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-card-title>
                      <span class="title-span">Gerencie suas Receitas</span>
                    </v-card-title>

                    <v-row dense class="px-3 pt-3">
                      <v-col cols="12" xs="6" sm="6" md="6" lg="5" xl="5">
                        <span class="font-weight-bold">{{
                          item.tipoId == 1
                            ? "Valor total do lote"
                            : "Valor total da casa"
                        }}</span>
                        <money-input
                          v-model="item.valor"
                          @ValorFormatado="(valor) => (item.valor = valor)"
                        />
                      </v-col>
                    </v-row>

                    <v-row dense class="py-3 px-3">
                      <v-col cols="12" xs="6" sm="6" md="6" lg="5" xl="5">
                        <span class="font-weight-bold">Entrada</span>
                        <money-input
                          v-model="receitaEntrada.valor"
                          @ValorFormatado="
                            (valor) => (receitaEntrada.valor = valor)
                          "
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        xs="6"
                        sm="6"
                        md="6"
                        lg="5"
                        xl="5"
                        class="pt-7"
                      >
                        <v-btn
                          :disabled="receitaEntrada.valor < 1"
                          color="primary"
                          @click="ObterReceita(receitaEntrada)"
                          >Gerenciar</v-btn
                        >
                      </v-col>
                    </v-row>

                    <v-row dense class="px-3">
                      <v-col cols="12" xs="6" sm="6" md="6" lg="5" xl="5">
                        <span class="font-weight-bold">Intermediária</span>
                        <money-input
                          v-model="receitaIntermediaria.valor"
                          @ValorFormatado="
                            (valor) => (receitaIntermediaria.valor = valor)
                          "
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        xs="6"
                        sm="6"
                        md="6"
                        lg="5"
                        xl="5"
                        class="pt-7"
                      >
                        <v-btn
                          :disabled="receitaIntermediaria.valor < 1"
                          color="primary"
                          @click="ObterReceita(receitaIntermediaria)"
                          >Gerenciar</v-btn
                        >
                      </v-col>
                    </v-row>

                    <v-row dense class="py-3 px-3">
                      <v-col cols="12" xs="6" sm="6" md="6" lg="5" xl="5">
                        <span class="font-weight-bold">Financiamento</span>
                        <money-input
                          v-model="receitaSaldoDevedor.valor"
                          @ValorFormatado="
                            (valor) => (receitaSaldoDevedor.valor = valor)
                          "
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        xs="6"
                        sm="6"
                        md="6"
                        lg="5"
                        xl="5"
                        class="pt-7"
                      >
                        <v-btn
                          :disabled="receitaSaldoDevedor.valor < 1"
                          color="primary"
                          @click="ObterReceita(receitaSaldoDevedor)"
                          >Gerenciar</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-divider vertical></v-divider>
                  <v-col cols="12" md="8">
                    <span class="font-weight-bold">
                      <v-subheader>
                        <v-icon small color="primary" class="mr-2"
                          >mdi-credit-card</v-icon
                        >
                        Encargos Financeiros
                      </v-subheader>
                    </span>

                    <v-divider class="mb-4"></v-divider>
                    <br />

                    <v-row dense class="px-3 pt-3">
                      <v-col cols="12" md="6">
                        <v-select
                          label="Instituição Financeira*"
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

                      <v-col cols="12" md="6" v-if="item.tipoOperacaoId == 1">
                        <v-select
                          label="Fintech"
                          outlined
                          clearable
                          v-model="item.tipoGatewayId"
                          @change="
                            (e) => {
                              ObterParametroGatway(item.tipoGatewayId);
                            }
                          "
                          return-object
                          :items="gatways"
                          item-text="tipo.nome"
                          item-value="tipo.id"
                          dense
                          :menu-props="{ offsetY: true, offsetOverflow: true }"
                        ></v-select>
                      </v-col>

                      <v-col
                        cols="12"
                        md="6"
                        v-if="
                          item.tipoOperacaoId == 2 || item.tipoOperacaoId == 3
                        "
                      >
                        <v-select
                          label="Conta Corrente"
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
                      <v-col cols="12" md="3">
                        <v-text-field
                          label="Juros ao dia"
                          outlined
                          v-model="item.encargoFinanceiro.jurosDia"
                          dense
                          type="number"
                          suffix="%"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                          label="Multa"
                          outlined
                          v-model="item.encargoFinanceiro.multa"
                          dense
                          type="number"
                          suffix="%"
                        ></v-text-field>
                      </v-col>

                      <v-col
                        cols="12"
                        md="3"
                        v-if="item.tipoAmortizacaoId == 1"
                      >
                        <v-text-field
                          :suffix="
                            item.encargoFinanceiro
                              .isDescontoVencimentoPercentual == true
                              ? '%'
                              : ''
                          "
                          label="Desconto"
                          outlined
                          v-model="item.encargoFinanceiro.descontoVencimento"
                          dense
                          type="number"
                        ></v-text-field>
                      </v-col>

                      <v-switch
                        style="margin-top: -5px"
                        label="Percentual?"
                        v-if="item.tipoAmortizacaoId == 1"
                        v-model="
                          item.encargoFinanceiro.isDescontoVencimentoPercentual
                        "
                        class="py-3 pt-3"
                      ></v-switch>
                    </v-row>

                    <!-- <v-divider></v-divider>
                      <v-row dense class="px-3 pt-2">
                        <v-col cols="12" md="3">
                          <v-switch v-model="AplicarDiasProtesto" label="Aplicar dias de protesto?"/>
                        </v-col>                         
                      </v-row> -->

                    <v-row dense class="px-3">
                      <v-col cols="12" md="3">
                        <v-text-field
                          label="Dias"
                          outlined
                          v-model="item.encargoFinanceiro.diasProtesto"
                          dense
                          type="number"
                          hint="Nº de dias necessário para protestar após o vencimento."
                          persistent-hint
                        ></v-text-field>
                      </v-col>

                      <v-col
                        cols="12"
                        md="3"
                        v-if="item.tipoAmortizacaoId == 1"
                      >
                        <v-text-field
                          label="Dias para desconto"
                          outlined
                          v-model="
                            item.encargoFinanceiro.diasDescontoVencimento
                          "
                          dense
                          type="number"
                          hint="Nº de dias necessário antes do vencimento para ter o desconto."
                          persistent-hint
                        ></v-text-field>
                      </v-col>

                      <v-col
                        cols="12"
                        md="3"
                        v-if="item.tipoAmortizacaoId == 1"
                      >
                        <v-text-field
                          label="Desconto"
                          outlined
                          v-model="item.encargoFinanceiro.descontoAntecipacao"
                          suffix="%"
                          dense
                          type="number"
                          hint="Antecipação/Quitação"
                          persistent-hint
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                          label="Dias para não receber"
                          outlined
                          v-model="
                            item.encargoFinanceiro.diasAposVencimentoNaoReceber
                          "
                          dense
                          type="number"
                          hint="Nº de dias para não receber após o vencimento."
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-actions class="justify-start">
                <v-btn @click="e13--" outlined color="primary">
                  <v-icon small left>mdi-arrow-left</v-icon> Voltar
                </v-btn>
                <v-btn @click="e13++" color="primary">
                  AVANÇAR <v-icon small left>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-step
            :complete="e13 > 5"
            step="5"
            editable
            edit-icon="mdi-check"
            >Pagadoria</v-stepper-step
          >
          <v-stepper-content step="5">
            <v-card elevation="2" class="mb-6">
              <v-card-title>
                <v-icon left color="primary">mdi-account-multiple</v-icon>
                Gerenciamento de Corretores e Comissões
              </v-card-title>
              <v-divider></v-divider>

              <v-card-subtitle>
                {{
                  `${
                    item.tipoId == 1
                      ? "Valor total do Lote:"
                      : "Valor total do Imóvel:"
                  }`
                }}
                {{ Number(item.valor).toMoeda(true) }}
              </v-card-subtitle>
              <v-card-text>
                <v-row>
                  <v-card-title>Limite total da comissão</v-card-title>
                </v-row>

                <v-row dense>
                  <v-col cols="12" md="2">
                    <span class="font-weight-bold">Percentual</span>
                    <v-text-field
                      v-model="percentualcomissao"
                      dense
                      outlined
                      type="number"
                      @input="atualizarValorComissao('valor', $event)"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="2">
                    <span class="font-weight-bold">Valor Fixo</span>
                    <money-input
                      v-model="item.valorComissaoCorretor"
                      @ValorFormatado="
                        (valor) => (item.valorComissaoCorretor = valor)
                      "
                    />
                    <!-- <v-text-field   outlined dense hint="Comissão a ser dividida" persistent-hint prefix="R$" type="number" @input="atualizarPercentualComissao"></v-text-field> -->
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-text>
                <!-- Formulário de Adição de Corretores -->

                <v-form
                  v-model="validCorretor"
                  lazy-validation
                  ref="formCorretor"
                >
                  <v-row dense>
                    <!-- Seleção de Corretor -->
                    <v-col cols="12" sm="4">
                      <span class="font-weight-bold">Corretor</span>
                      <v-autocomplete
                        label="Selecione"
                        placeholder="Selecione"
                        outlined
                        v-model="contratoCorretor.corretorId"
                        :items="listaCorretores"
                        :rules="fieldRules"
                        clearable
                        item-text="nomeCnpjCpf"
                        item-value="id"
                        dense
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
                                <v-icon color="primary"
                                  >mdi-account-plus</v-icon
                                >
                              </v-btn>
                            </template>
                            <span>Cadastrar Corretor</span>
                          </v-tooltip>
                        </template>
                      </v-autocomplete>
                    </v-col>

                    <!-- Valor Percentual ou Fixo -->
                    <!-- <v-col style="margin-top:-10px">
                        <v-switch label="Percentual?" v-model="contratoCorretor.isPercentual" dense inset></v-switch>
                      </v-col> -->

                    <v-col cols="12" md="2">
                      <span class="font-weight-bold"
                        >Percentual da comissão</span
                      >
                      <v-text-field
                        outlined
                        dense
                        v-model="contratoCorretor.percentual"
                        suffix="%"
                        type="number"
                        @input="atualizarValorComissaoCorretor"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="2">
                      <span class="font-weight-bold">Valor de comissão</span>
                      <money-input
                        v-model="contratoCorretor.valorFixo"
                        @ValorFormatado="
                          (valor) => (contratoCorretor.valorFixo = valor)
                        "
                      />
                      <!-- <v-text-field outlined dense v-model="contratoCorretor.valorFixo" prefix="R$" type="number" @input="atualizarPercentualComissaoCorretor"></v-text-field> -->
                    </v-col>

                    <v-col cols="12" md="2">
                      <span class="font-weight-bold"
                        >Quantidade de Parcela</span
                      >
                      <v-text-field
                        outlined
                        dense
                        v-model="contratoCorretor.quantidadeParcela"
                        type="number"
                      ></v-text-field>
                    </v-col>

                    <!-- Botão Adicionar -->
                    <v-col cols="12" md="2">
                      <v-btn
                        class="mt-6"
                        color="primary"
                        :disabled="
                          !contratoCorretor.corretorId || !validCorretor
                        "
                        @click="AdicionarCorretor()"
                      >
                        <v-icon left>mdi-plus</v-icon>
                        Adicionar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>

                <v-divider class="my-4"></v-divider>

                <v-card-title class="py-3">
                  <v-icon left color="primary">mdi-table</v-icon>
                  Corretores Adicionados
                </v-card-title>

                <v-data-table
                  :headers="headersCorretor"
                  :items="item.corretores"
                  item-key="item.id"
                  class="elevation-1"
                >
                  <!-- Ações -->
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on }">
                        <v-icon small @click="EditarCorretor(item)" v-on="on"
                          >mdi-pencil</v-icon
                        >
                      </template>
                      <span>Editar</span>
                    </v-tooltip>

                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-icon small @click="ExcluirCorretor(item)" v-on="on"
                          >mdi-delete</v-icon
                        >
                      </template>
                      <span>Excluir</span>
                    </v-tooltip>

                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-icon small @click="VincularParcelas(item)" v-on="on"
                          >mdi-file-document-multiple</v-icon
                        >
                      </template>
                      <span>Vincular parcelas</span>
                    </v-tooltip>
                  </template>

                  <!-- Corretores e Percentual/Valor -->
                  <template v-slot:[`item.corretorId`]="{ item }">
                    {{
                      listaCorretores.find((x) => x.id == item.corretorId)
                        ?.nomeCnpjCpf || "Não encontrado"
                    }}
                  </template>

                  <template v-slot:[`item.percentual`]="{ item }">
                    {{
                      `${item.percentual} %  - ${Number(item.valorFixo).toMoeda(
                        true
                      )}`
                    }}
                  </template>

                  <template v-slot:[`item.qtdeParcela`]="{ item }">
                    {{ item.quantidadeParcela }}
                  </template>
                </v-data-table>
              </v-card-text>

              <v-card-actions class="justify-start">
                <v-btn @click="e13--" outlined color="primary">
                  <v-icon small left>mdi-arrow-left</v-icon> Voltar
                </v-btn>
                <v-btn @click="Salvar()" color="primary" :loading="overlay">
                  Salvar
                  <v-icon small left
                    >mdi-clipboard-check-multiple-outline</v-icon
                  ></v-btn
                >
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper>
      </v-form>
    </v-card>

    <v-dialog v-model="dialogParcelas" max-width="1200">
      <template>
        <v-card>
          <v-card-title>
            Selecione a Receita para Vincular as Parcelas de Comissões
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="(dialogParcelas = false), salvarParcelaLigacaoCorretor()"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-row dense>
            <v-col cols="10" class="px-2">
              <v-card outlined style="border-radius: 12px">
                <v-card-text>
                  <v-card-title> Parcelas de Comissões </v-card-title>
                  <br />
                  <v-data-table
                    class="vdatatable"
                    :items-per-page="-1"
                    hide-default-footer
                    :headers="headersComissoes"
                    :items="contratoCorretor.ligacaoParcelas"
                    item-value=""
                    item-key="numeroParcela"
                    dense
                  >
                    <template v-slot:[`item.dataDeVencimento`]="{ item }">
                      {{ DiaMesAno(item.dataDeVencimento) }}
                    </template>
                    <template v-slot:[`item.valor`]="{ item }">
                      {{ Number(item.valor).toMoeda(true) }}
                    </template>

                    <template v-slot:[`item.tipoReceitaId`]="{ item }">
                      <v-select
                        item-text="nome"
                        item-value="id"
                        :items="listaTiposReceitas"
                        style="
                          margin-left: 30px;
                          width: 200px;
                          margin-bottom: -24px;
                        "
                        outlined
                        v-model="item.tipoReceitaId"
                        dense
                        type="number"
                      />
                    </template>

                    <template v-slot:[`item.numeroParcelaReceita`]="{ item }">
                      <v-select
                        v-if="item.tipoReceitaId == 1"
                        :item-text="formatarParcela"
                        item-value="parcela"
                        :items="receitaSaldoDevedor.parcelas"
                        style="
                          margin-left: 30px;
                          width: 120px;
                          margin-bottom: -24px;
                        "
                        outlined
                        v-model="item.numeroParcelaReceita"
                        dense
                        type="number"
                      />
                      <v-select
                        v-else-if="item.tipoReceitaId == 3"
                        :item-text="formatarParcela"
                        item-value="parcela"
                        :items="receitaEntrada.parcelas"
                        style="
                          margin-left: 30px;
                          width: 120px;
                          margin-bottom: -24px;
                        "
                        outlined
                        v-model="item.numeroParcelaReceita"
                        dense
                        type="number"
                      />
                      <v-select
                        v-else-if="item.tipoReceitaId == 5"
                        :item-text="formatarParcela"
                        item-value="parcela"
                        :items="receitaIntermediaria.parcelas"
                        style="
                          margin-left: 30px;
                          width: 120px;
                          margin-bottom: -24px;
                        "
                        outlined
                        v-model="item.numeroParcelaReceita"
                        dense
                        type="number"
                      />
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="salvarParcelaLigacaoCorretor(), (dialogParcelas = false)"
              >Confirmar</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <cadastro-tipoindice
      v-model="dialogTipoIndice"
      :item="tipoIndice"
      @fechou="dialogTipoIndice = false"
      @salvou="AtualizarTipoIndice()"
    />
    <gerenciador-receita
      v-model="dialogGerencial"
      :receitaIntermediaria="receitaIntermediaria"
      :receitaEntrada="receitaEntrada"
      :item="receitaGerenciada"
      @fechou="dialogGerencial = false"
    />
    <gerenciador-receitaprice
      v-model="dialogGerencialPrice"
      :receitaIntermediaria="receitaIntermediaria"
      :receitaEntrada="receitaEntrada"
      :item="receitaGerenciada"
      @fechou="dialogGerencialPrice = false"
    />
    <cadastro-pessoa
      v-model="dialogCadastroPessoa"
      :item="pessoa"
      @fechou="dialogCadastroPessoa = false"
      @salvou="AtualizarPessoa()"
    />
    <multi-lotes
      v-model="dialogMultiLotes"
      :tipoId="item.tipoId"
      :unidadeId="item.unidadePrincipalId"
      :lista.sync="item.unidadesAdicionais"
      @salvou="(dialogMultiLotes = false), removerUnidadesDuplicadas()"
      @fechou="(dialogMultiLotes = false), removerUnidadesDuplicadas()"
    />
  </v-dialog>
</template>

<script lang="ts">
import {
  Contrato,
  ContratoCliente,
  ContratoCorretor,
  TipoIndice,
  Unidade,
} from "@/core/models/cadastros";
import Pessoa from "@/core/models/cadastros/Pessoa";
import {
  EmpreendimentoService,
  PessoaService,
  TipoIndiceService,
} from "@/core/services/cadastros";
import { ContratoService } from "@/core/services/cadastros/ContratoService";
import { EmpresaService } from "@/core/services/compras/EmpresaService";
import {
  ContaCorrenteService,
  IntervaloReajusteService,
  ParametroFinanceiroService,
  ReceitaService,
  SituacaoReceitaParcelaService,
  TipoAmortizacaoService,
  TipoContratoService,
  TipoDocumentoService,
} from "@/core/services/financeiro";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  Encargo,
  EnumSituacaoReceitaParcela,
  EnumTipoIntervaloParcelas,
  EnumTipoReceita,
  Receita,
  ReceitaParcela,
  TipoAmortizacao,
  ValoresAdicionais,
} from "@/core/models/financeiro";
import { PlanoPagamentoModelo } from "@/core/models/contratos";
import { EnumTipoMesReajuste } from "@/core/models/contratos/PlanoPagamentoModelo";
import {
  TratarErroApi,
  ObterTipoAno,
  ObterTipoMes,
  CalcularDataParcela,
  ObterMelhorDia,
  GenerateYearOptions,
  SituacaoColor,
  DiaMesAno,
} from "@/assets/scripts/helper";
import {
  TipoIntervaloParcelasService,
  TipoOperacaoFinanceiraService,
} from "@/core/services/contratos";

@Component
export default class CadastroContrato extends Vue {
  @Prop() public item!: Contrato;
  @Prop() public value!: string;

  service = new ContratoService();
  empreendimentoService = new EmpreendimentoService();
  receitaService = new ReceitaService();

  receitaGerenciada = new Receita();
  receitaSaldoDevedor = new Receita(1);
  receitaEntrada = new Receita(3);
  receitaIntermediaria = new Receita(5);
  planoPagamento = new PlanoPagamentoModelo();
  percentualcomissao: any = null;

  public DiaMesAno = DiaMesAno;

  selecionadasEntrada = [];
  selecionadasFinanciamento = [];
  selecionadasIntermediaria = [];

  dialogParcelas = false;
  tabActive2 = null;

  tipoId = 1;

  listaTiposReceitas = [
    { id: 1, nome: "Financiamento" },
    { id: 3, nome: "Entrada" },
    { id: 5, nome: "Intermediaria" },
  ];

  SituacaoColor(item: ReceitaParcela) {
    return SituacaoColor(item);
  }

  confirmarParcelas() {
    this.dialog = false;
  }

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nº", value: "parcela" },
    {
      text: "VALOR DA PARCELA",
      value: "valor",
      align: "center",
      sortable: false,
    },
    { text: "SITUAÇÃO", value: "situacaoId", align: "center", sortable: false },
    { text: "VENCIMENTO", value: "dataVencimento", align: "center" },
  ];

  headersComissoes: any[] = [
    { text: "Nº", value: "numeroParcelaDespesa" },
    {
      text: "VALOR DA COMISSÂO",
      value: "valor",
      align: "center",
      sortable: false,
    },
    { text: "VENCIMENTO", value: "dataDeVencimento", align: "center" },
    {
      text: "SELECIONE TIPO DE RECEITA",
      value: "tipoReceitaId",
      align: "center",
    },
    {
      text: "VINCULAR PARCELA DE RECEITA",
      value: "numeroParcelaReceita",
      align: "center",
    },
  ];

  //numeroParcelaDespesa: i,
  // numeroParcelaReceita:0,
  /// valor: valorParcela.toFixed(2),
  // situacaoId:1,
  // dataDeVencimento: vencimento.toISOString().split('T')[0],
  // contratoId: item.contratoId,
  //  corretorId: item.corretorId,
  //isPercentual: item.isPercentual,
  // percentual: item.percentual,

  itemsComissoes: any[] = [
    {
      parcela: "1",
      valor: "500",
      dataVencimento: "14/05/2025",
      situacaoId: "Aberto",
    },
    {
      parcela: "2",
      valor: "500",
      dataVencimento: "14/05/2025",
      situacaoId: "Aberto",
    },
  ];

  parcelas: any = [
    // { id: 1, numero: "1", valor: "R$ 1.000,00", vencimento: "10/06/2025", status: "Pendente" },
    //{ id: 2, numero: "2", valor: "R$ 1.000,00", vencimento: "10/07/2025", status: "Pendente" },
    //{ id: 3, numero: "3", valor: "R$ 1.000,00", vencimento: "10/08/2025", status: "Pendente" },
    // { id: 4, numero: "4", valor: "R$ 1.000,00", vencimento: "10/09/2025", status: "Pendente" },
    //{ id: 5, numero: "5", valor: "R$ 1.000,00", vencimento: "10/10/2025", status: "Pendente" },
  ];

  @Watch("item.valorComissaoCorretor")
  BaixaJuros(valor) {
    if (valor == null) return;

    this.percentualcomissao = parseFloat(
      ((valor * 100) / this.item.valor).toFixed(2)
    );
  }

  atualizarValorComissao() {
    if (this.percentualcomissao !== null && this.item.valor) {
      this.item.valorComissaoCorretor = Number(
        ((this.percentualcomissao / 100) * this.item.valor).toFixed(2)
      );
    }
  }

  atualizarValorComissaoCorretor() {
    if (this.contratoCorretor.percentual !== null && this.item.valor) {
      this.contratoCorretor.valorFixo = Number(
        (this.contratoCorretor.percentual / 100) * this.item.valor
      );
    }
  }

  @Watch("contratoCorretor.valorFixo")
  atualizarPercentualComissaoCorretor(valor) {
    if (valor == null) return;

    this.contratoCorretor.percentual = parseFloat(
      ((valor * 100) / this.item.valor).toFixed(2)
    );
  }

  formatarParcela(parcela) {
    const numero = parcela.parcela;
    const valor = parcela.valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return `${numero} - ${valor}`;
  }

  removerUnidadesDuplicadas() {
    const idsListaUnidades: any = new Set(
      this.item.unidadesAdicionais.map((x: any) => x.unidadeId)
    );

    this.listaUnidades = this.listaUnidades.filter(
      (unidade: any) => !idsListaUnidades.has(unidade.id)
    );
  }

  listaEmpresas = [];
  tiposContratos = [];
  gatways = [];
  tiposAmortizacao = [];
  tiposIntervalos = [];
  listaEmpreendimentos = [];
  listaGrupos = [];
  listaUnidades = [];
  listaIndices: any = [];
  listaTiposDocumentos: any = [];
  tiposIntervaloParcelas = [];
  listaContaCorrentes = [];
  tiposOperacaoContrato = [];

  valoresAdicionaisParcela = new ValoresAdicionais();
  contratoCorretor = new ContratoCorretor();
  contratoCliente = new ContratoCliente();
  pessoa = new Pessoa();
  unidade = new Unidade();

  itemIndex: number = -1;
  itemIndexCliente: number = -1;
  stepHorizontal: number = 1;
  e13: number = 1;
  tab: number = 0;

  show: boolean = false;
  dialogCadastroPessoa: boolean = false;
  dialogGerencial: boolean = false;
  dialogMultiLotes: boolean = false;
  validCliente: boolean = true;
  validCorretor: boolean = false;
  valid: boolean = true;
  overlay: boolean = false;
  dialog: boolean = false;
  dialogGerencialPrice: boolean = false;
  AplicarDiasProtesto = false;

  tipoMesReajusteId: number = 0;
  errorAlert: boolean = false;

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  $refs!: {
    form: HTMLFormElement;
    formCorretor: HTMLFormElement;
    formCliente: HTMLFormElement;
  };

  ObterUnidade() {
    this.empreendimentoService
      .ObterUnidade(
        this.item.unidadePrincipalId,
        "PlanoPagamento.Financiamento.Tipo, PlanoPagamento.Financiamento.TipoIntervaloParcela,PlanoPagamento.Entrada.Tipo, PlanoPagamento.Entrada.TipoIntervaloParcela, PlanoPagamento.Intermediaria.Tipo, PlanoPagamento.Intermediaria.TipoIntervaloParcela, Imovel, Lote, PlanoPagamento.IntervaloReajuste, PlanoPagamento.TipoAnoInicioReajuste, PlanoPagamento.TipoMesReajuste, PlanoPagamento.TipoIndice, PlanoPagamento.TipoAmortizacao, PlanoPagamento.TipoValorTotal"
      )
      .then((res) => {
        this.unidade = res.data;
        this.planoPagamento = new PlanoPagamentoModelo(
          this.unidade.planoPagamento
        );

        if (this.unidade.planoPagamento != null) {
          let valoresAdicionais = this.valoresAdicionaisParcela;

          this.valoresAdicionaisParcela = {
            gestao: this.planoPagamento.taxaGestao,
            valorMPI: 0,
            percentualMPI: this.planoPagamento.seguroMPI,
            valorDFI: 0,
            percentualDFI: this.planoPagamento.seguroDFI,
            correcaoIndice: 0,
            isDFIFixo: this.planoPagamento.isDFIFixo,
            taxaBoleto: valoresAdicionais.taxaBoleto,
            nomeTaxaAdicional: "",
            valorFixoTaxaAdicional: 0,
          };
          this.item.valor = this.unidade.valorTotalUnidade;
          this.ConfigurarPlano();
        } else {
          return (this.errorAlert = true);
        }
      });
  }

  ConfigurarPlano() {
    this.ResetReceitas();
    this.ConfigurarContrato(this.planoPagamento);
    this.ObterDadosReceita(
      this.planoPagamento.entrada.prazo,
      this.item.data,
      this.unidade.valorEntradaPlanoPagamento,
      EnumTipoReceita.TituloEntrada,
      this.valoresAdicionaisParcela,
      EnumTipoIntervaloParcelas.Mensal
    );
    this.ObterDadosReceita(
      this.planoPagamento.intermediaria.prazo,
      this.item.data,
      this.unidade.valorIntermediariaPlanoPagamento,
      EnumTipoReceita.TituloIntermediaria,
      this.valoresAdicionaisParcela,
      this.planoPagamento.intermediaria.tipoIntervaloParcelaId
    );
    this.ObterDadosReceita(
      this.planoPagamento.financiamento.prazo,
      this.dataPrimeiroVencimento(),
      this.unidade.valorFinanciamentoPlanoPagamento,
      EnumTipoReceita.Titulo,
      this.valoresAdicionaisParcela,
      EnumTipoIntervaloParcelas.Mensal
    );
    this.ObterMesAno(
      this.planoPagamento.tipoMesReajusteId,
      this.planoPagamento.tipoAnoInicioReajusteId
    );
  }

  ConfigurarContrato(planoPagamento) {
    this.item.data = new Date().yyyymmdd();
    this.item.tipoIndiceId = planoPagamento.tipoIndiceId;
    this.item.intervaloReajusteId = planoPagamento.intervaloReajusteId;
    this.item.tipoAmortizacaoId = planoPagamento.tipoAmortizacaoId;
    this.item.jurosAmortizacao = planoPagamento.jurosTabela;
    this.tipoMesReajusteId = planoPagamento.tipoMesReajusteId;
  }

  dataPrimeiroVencimento() {
    const ultimaParcela =
      this.receitaEntrada.parcelas[this.receitaEntrada.parcelas.length - 1];
    const dataInicial = new Date(this.item.data);

    if (
      ultimaParcela &&
      this.planoPagamento.financiamento.gerarFinanciamentoPosEntrada == true
    ) {
      const dataVencimentoParcela = new Date(ultimaParcela.dataVencimento);
      dataVencimentoParcela.setMonth(dataVencimentoParcela.getMonth() + 1);
      return new Date(dataVencimentoParcela).yyyymmdd();
    }

    return dataInicial.yyyymmdd();
  }

  @Watch("contratoCorretor")
  ContratoCorretor() {
    if (this.$refs.formCorretor) {
      this.$refs.formCorretor.resetValidation();
    }
  }

  @Watch("contratoCliente")
  ContratoCliente() {
    if (this.$refs.formCliente) {
      this.$refs.formCliente.resetValidation();
    }
  }

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    } else {
      this.ObterMesAno();

      if (this.item.empreendimentoId > 0) {
        this.ObterEmpreendimentos(this.item.tipoId),
          this.ObterGrupos(),
          this.ObterUnidades();
      }

      if (this.item.empreendimentoId && this.item.unidadePrincipalId) {
        this.ObterUnidade();
      }
    }
  }

  headersCliente: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome CPF/CNPJ", value: "clienteId" },
  ];

  headersCorretor: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome CPF/CNPJ", value: "corretorId" },
    { text: "Valor", value: "percentual" },
    { text: "Qtde Parcela", value: "qtdeParcela" },
  ];

  meses = [
    { id: 1, nome: "Janeiro" },
    { id: 2, nome: "Fevereiro" },
    { id: 3, nome: "Março" },
    { id: 4, nome: "Abril" },
    { id: 5, nome: "Maio" },
    { id: 6, nome: "Junho" },
    { id: 7, nome: "Julho" },
    { id: 8, nome: "Agosto" },
    { id: 9, nome: "Setembro" },
    { id: 10, nome: "Outubro" },
    { id: 11, nome: "Novembro" },
    { id: 12, nome: "Dezembro" },
  ];

  @Watch("receitaEntrada.valor")
  @Watch("receitaIntermediaria.valor")
  @Watch("item.valor")
  gerenciarValores() {
    this.receitaSaldoDevedor.valor = Math.max(
      this.item.valor -
        this.receitaEntrada.valor -
        this.receitaIntermediaria.valor,
      0
    );
  }

  Salvar() {
    this.$refs.form.validate();

    if (!this.Validacoes()) {
      this.overlay = !this.overlay;
      this.item.receitas = [];

      let ReceitasAdicionais = [
        this.receitaSaldoDevedor,
        this.receitaEntrada,
        this.receitaIntermediaria,
      ];
      let modelo = this.item.PrepararContrato(this.item, ReceitasAdicionais);

      this.service
        .GerarContrato(modelo)
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
            TratarErroApi(err);
          }
        )
        .finally(() => (this.overlay = false));
    }
  }

  Close() {
    this.Reset();
    this.dialog = false;
  }

  ObterParametroGatway(item) {
    if (item) {
      this.item.encargoFinanceiro = item.encargoFinanceiro;
      this.item.tipoGatewayId = item.tipoId;
    } else {
      this.item.encargoFinanceiro = new Encargo();
      this.item.tipoGatewayId = 0;
    }
  }

  ObterParametroPorId(id) {
    new ParametroFinanceiroService()
      .ObterParametroEmpresaPorId(id, "Gatways.Tipo")
      .then(
        (res) => {
          this.gatways = res.data.gatways;
          this.item.tipoAmortizacaoId = res.data.tipoAmortizacaoId;
          this.item.jurosAmortizacao = res.data.jurosAmortizacao;
          this.valoresAdicionaisParcela = res.data.valoresAdicionaisParcela;
        },
        (err) => {
          this.gatways = [];
          this.valoresAdicionaisParcela = new ValoresAdicionais();
          this.item.encargoFinanceiro = new Encargo();
        }
      );
  }

  ObterEmpreendimentos(id) {
    const filter = { tipoId: id == 2 ? 3 : id };
    this.item.tipoProdutoId = filter.tipoId == 1 ? 2 : 1;

    this.empreendimentoService
      .Listar(-1, -1, ["nome"], [], undefined, [], filter, "", "Id,Nome", "")
      .then((res) => {
        this.listaEmpreendimentos = res.data.items;
        filter.tipoId = 0;
      });
  }

  ObterGrupos() {
    this.empreendimentoService
      .ListarGrupo(this.item.empreendimentoId)
      .then((res) => {
        this.listaGrupos = res.data;
      });
  }

  ObterUnidades() {
    this.empreendimentoService.ListarUnidade(this.item.grupoId).then((res) => {
      this.listaUnidades = res.data.filter((x) => x.situacaoId == 1);
      this.removerUnidadesDuplicadas();
    });
  }

  AdicionarCorretor() {
    if (this.$refs.formCorretor.validate()) {
      const corretorId = this.contratoCorretor.corretorId;
      const corretorExistente = this.item.corretores.find(
        (x, index) => x.corretorId === corretorId && index !== this.itemIndex
      );
      const novoPercentualTotal =
        this.itemIndex > -1
          ? this.item.corretores.reduce(
              (acc, cur, index) =>
                index !== this.itemIndex ? acc + +cur.percentual : acc,
              0
            ) + +this.contratoCorretor.percentual
          : this.item.corretores.reduce(
              (acc, cur) => acc + +cur.percentual,
              0
            ) + +this.contratoCorretor.percentual;

      if (corretorExistente)
        return this.$swal(
          "Aviso",
          "Esta pessoa já foi adicionada na lista.",
          "warning"
        );

      if (novoPercentualTotal > this.percentualcomissao)
        return this.$swal(
          "Erro!",
          "Limite de percentual por corretor atingido. O valor máximo é de 100%",
          "warning"
        );

      this.itemIndex > -1
        ? Object.assign(
            this.item.corretores[this.itemIndex],
            this.contratoCorretor
          )
        : this.item.corretores.push(this.contratoCorretor);

      this.contratoCorretor = new ContratoCorretor();
      this.itemIndex = -1;
    }
  }

  ExcluirCorretor(item) {
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
        const index = this.item.corretores.indexOf(item);
        this.item.corretores.splice(index, 1);
        return this.$swal("Aviso", "Registro excluído com sucesso!", "success");
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if (result.value) {
      }
    });
  }

  salvarParcelaLigacaoCorretor() {
    this.contratoCorretor = new ContratoCorretor();
  }

  VincularParcelas(item) {
    this.contratoCorretor = Object.assign({}, item);
    this.itemIndex = this.item.corretores.indexOf(item);
    this.AdicionarParcelas(this.contratoCorretor);
    this.dialogParcelas = true;
  }

  AdicionarParcelas(item) {
    const qtdeParcela = Number(item.quantidadeParcela);
    const valorParcela = item.valorFixo / qtdeParcela;
    const hoje = new Date();

    const parcelasAntigas = item.ligacaoParcelas || [];

    for (let i = item.ligacaoParcelas.length + 1; i <= qtdeParcela; i++) {
      const vencimento = new Date(hoje);
      vencimento.setMonth(vencimento.getMonth() + (i - 1));

      // Tenta achar parcela anterior
      const parcelaAntiga = parcelasAntigas.find(
        (p) => p.numeroParcelaDespesa == i
      );

      item.ligacaoParcelas.push({
        numeroParcelaDespesa: i,
        numeroParcelaReceita: parcelaAntiga?.numeroParcelaReceita ?? 0,
        tipoReceitaId: parcelaAntiga?.tipoReceitaId ?? null,
        valor: valorParcela.toFixed(2),
        situacaoNome: "Aberto",
        dataDeVencimento: vencimento,
      });
    }

    item.ligacaoParcelas.forEach((element) => {
      element.valor = valorParcela.toFixed(2);
    });
  }

  EditarCorretor(item) {
    this.contratoCorretor = Object.assign({}, item);
    this.itemIndex = this.item.corretores.indexOf(item);
  }

  AdicionarCliente() {
    if (this.$refs.formCliente.validate()) {
      const clienteId = this.contratoCliente.clienteId;
      const clienteExistente = this.item.clientes.find(
        (x, index) =>
          x.clienteId === clienteId && index !== this.itemIndexCliente
      );

      if (clienteExistente)
        return this.$swal(
          "Aviso",
          "Esta pessoa já foi adicionada na lista.",
          "warning"
        );

      if (this.itemIndexCliente > -1) {
        Object.assign(
          this.item.clientes[this.itemIndexCliente],
          this.contratoCliente
        );
      } else {
        this.item.clientes.push(this.contratoCliente);
        this.contratoCliente = new ContratoCliente();
      }

      this.contratoCliente = new ContratoCliente();
      this.itemIndexCliente = -1;
    }
  }

  ExcluirCliente(item) {
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
        const index = this.item.clientes.indexOf(item);
        this.item.clientes.splice(index, 1);
        return this.$swal("Aviso", "Registro excluído com sucesso!", "success");
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if (result.value) {
      }
    });
  }

  EditarCliente(item) {
    this.contratoCliente = Object.assign({}, item);
    this.itemIndexCliente = this.item.clientes.indexOf(item);
  }

  CadastrarPessoa() {
    this.pessoa = new Pessoa();
    this.dialogCadastroPessoa = true;
  }

  ObterMesAno(tipoMesReajusteId?: number, tipoAnoInicioReajusteId?: number) {
    const data = new Date(this.item.data);

    const tipoMesReajuste =
      tipoMesReajusteId !== EnumTipoMesReajuste.UmaParcelaEntrada &&
      tipoMesReajusteId !== EnumTipoMesReajuste.UmaParcelaFinanciamento
        ? Number(ObterTipoMes(tipoMesReajusteId))
        : 0;
    const tipoAnoInicioReajuste = Number(ObterTipoAno(tipoAnoInicioReajusteId));

    data.setMonth(data.getMonth() + tipoMesReajuste);
    data.setFullYear(data.getFullYear() + tipoAnoInicioReajuste);

    if (
      tipoMesReajusteId !== EnumTipoMesReajuste.UmaParcelaEntrada &&
      tipoMesReajusteId !== EnumTipoMesReajuste.UmaParcelaFinanciamento
    ) {
      this.item.mesReajuste = data.getMonth() + 1;
    }
    this.item.anoPrimeiroReajuste = data.getFullYear();

    if (this.item.intervaloReajusteId == 1) {
      this.item.anoPrimeiroReajuste = data.getFullYear() + 1;
    }
  }

  ObterDadosReceita(
    qtdeParcela: number,
    dataInicialParcela: string,
    valorReceita: number,
    tipoReceitaId: number,
    valoresAdicionaisParcela: any = {},
    tipoIntervaloParcelaId?: EnumTipoIntervaloParcelas
  ) {
    if (tipoReceitaId == EnumTipoReceita.TituloEntrada) {
      this.GerarParcelasEntrada(qtdeParcela, dataInicialParcela, valorReceita);
    } else if (tipoReceitaId == EnumTipoReceita.TituloIntermediaria) {
      this.GerarParcelasIntermediarias(
        qtdeParcela,
        dataInicialParcela,
        valorReceita,
        tipoIntervaloParcelaId
      );
    } else if (tipoReceitaId == EnumTipoReceita.Titulo) {
      if (this.item.tipoAmortizacaoId == TipoAmortizacao.Padrao) {
        this.GerarParcelasFinanciamento(
          qtdeParcela,
          dataInicialParcela,
          valorReceita,
          tipoReceitaId,
          tipoIntervaloParcelaId
        );
      } else {
        this.receitaService
          .ParcelamentoPrice(
            valorReceita,
            this.item.jurosAmortizacao,
            qtdeParcela,
            valoresAdicionaisParcela.isDFIFixo,
            valoresAdicionaisParcela.percentualMPI,
            valoresAdicionaisParcela.percentualDFI,
            valoresAdicionaisParcela.gestao
          )
          .then(
            (res) => {
              this.GerarParcelasSac(res.data, dataInicialParcela);
            },
            (err) => {
              TratarErroApi(err);
            }
          );
      }
    }

    this.CarregarTipoReceita(tipoReceitaId, valorReceita);
  }

  ObterReceita(receitaSelecionada) {
    this.CarregarTipoReceita(
      receitaSelecionada.tipoId,
      receitaSelecionada.valor
    );
    this.receitaGerenciada = receitaSelecionada;

    if (
      this.item.tipoAmortizacaoId == TipoAmortizacao.Price &&
      receitaSelecionada.tipoId == EnumTipoReceita.Titulo
    ) {
      this.dialogGerencialPrice = true;
    } else {
      this.dialogGerencial = true;
    }
  }

  CarregarTipoReceita(tipoId, valorReceita) {
    switch (tipoId) {
      case EnumTipoReceita.TituloEntrada:
        this.ConfigurarReceita(this.receitaEntrada, valorReceita, "Entrada");
        break;

      case EnumTipoReceita.TituloIntermediaria:
        this.ConfigurarReceita(
          this.receitaIntermediaria,
          valorReceita,
          "Intermediaria"
        );
        break;

      case EnumTipoReceita.Titulo:
        this.ConfigurarReceita(
          this.receitaSaldoDevedor,
          valorReceita,
          "Financiamento"
        );
        break;
    }
  }

  ConfigurarReceita(receita, valorReceita, titulo) {
    receita.valor = valorReceita;
    receita.melhorDia = this.item.melhorDia;
    receita.dataInicialParcelas = this.item.primeiroVencimento;
    receita.empresaId = this.item.empresaId;
    receita.tipoAmortizacaoId = this.item.tipoAmortizacaoId;
    receita.jurosAmortizacao = this.item.jurosAmortizacao;
    receita.valoresAdicionaisParcela = this.valoresAdicionaisParcela;
    receita.tipoDocumentoId = this.listaTiposDocumentos[0].id;
    receita.gerarFinanciamentoComIntermediaria =
      this.planoPagamento.financiamento.gerarFinanciamentoComIntermediaria;
    receita.gerarFinanciamentoPosEntrada =
      this.planoPagamento.financiamento.gerarFinanciamentoPosEntrada;
    receita.titulo = titulo;
  }

  @Watch("receitaSaldoDevedor.parcelas", { deep: true })
  ObservarFinanciamento(parcelas: any[]) {
    if (
      parcelas.length > 0 &&
      this.tipoMesReajusteId == EnumTipoMesReajuste.UmaParcelaFinanciamento
    ) {
      const primeiroItem = parcelas[0];
      this.item.mesReajuste =
        new Date(primeiroItem.dataVencimento).getMonth() + 1;
    }
  }

  @Watch("receitaEntrada.parcelas", { deep: true })
  ObservarReceitaEntrada(parcelas: any[]) {
    if (
      parcelas.length > 0 &&
      this.tipoMesReajusteId == EnumTipoMesReajuste.UmaParcelaEntrada
    ) {
      const primeiroItem = parcelas[0];
      this.item.mesReajuste =
        new Date(primeiroItem.dataVencimento).getMonth() + 1;
    }
  }

  Validacoes() {
    if (!this.item.empresaId) {
      this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
      this.e13 = 1;
      return true;
    }

    if (this.item.corretores.length == 0) {
      this.$swal(
        "Alerta!",
        "É necessário incluir pelo menos 1 corretor neste contrato.",
        "warning"
      );
      this.e13 = 5;
      return true;
    }

    if (this.item.clientes.length == 0) {
      this.$swal(
        "Alerta!",
        "É necessário incluir pelo menos 1 cliente neste contrato.",
        "warning"
      );
      this.e13 = 1;
      return true;
    }

    if (
      !this.item.tipoId ||
      !this.item.empreendimentoId ||
      !this.item.grupoId ||
      !this.item.unidadePrincipalId
    ) {
      this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
      this.e13 = 2;
      return true;
    }

    if (
      !this.item.data ||
      !this.item.mesReajuste ||
      !this.item.tipoIndiceId ||
      !this.item.tipoAmortizacaoId ||
      !this.item.intervaloReajusteId ||
      !this.item.anoPrimeiroReajuste
    ) {
      this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
      this.e13 = 3;
      return true;
    }

    if (this.receitaSaldoDevedor.parcelas.length == 0) {
      this.$swal(
        "Aviso",
        "É necessário gerar parcelas de financiamento.",
        "warning"
      );
      this.e13 = 4;
      return true;
    }

    if (!this.item.tipoOperacaoId) {
      this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
      this.e13 = 4;
      return true;
    }
  }

  Reset() {
    this.receitaSaldoDevedor = new Receita(1);
    this.receitaEntrada = new Receita(3);
    this.receitaIntermediaria = new Receita(5);
    this.valoresAdicionaisParcela = new ValoresAdicionais();
    this.planoPagamento = new PlanoPagamentoModelo();

    this.$refs.formCorretor.resetValidation();
    this.$refs.formCliente.resetValidation();
    this.tab = 0;
    this.e13 = 1;
    this.show = false;
    this.overlay = false;
  }

  ResetReceitas() {
    this.receitaSaldoDevedor.parcelas = [];
    this.receitaEntrada.parcelas = [];
    this.receitaIntermediaria.parcelas = [];
  }

  anos = GenerateYearOptions();

  GerarParcelasEntrada(qtdeParcela, dataInicialParcela, valorReceita) {
    const mes = new Date(dataInicialParcela).getMonth();

    if (qtdeParcela > 0 && valorReceita > 0) {
      let quantidadeParcela = qtdeParcela;

      for (let i = 1; i <= quantidadeParcela; i++) {
        let parcela = new ReceitaParcela();
        let dataInicial = new Date(`${dataInicialParcela}T00:00:00`);
        const dia = ObterMelhorDia(dataInicial, this.item.melhorDia, i);

        const numeroParcela = i;
        const dataVencimento = CalcularDataParcela(
          dataInicial,
          undefined,
          numeroParcela,
          dia,
          mes
        ).yyyymmdd();
        parcela.parcela = numeroParcela;
        parcela.dataVencimento = dataVencimento;
        parcela.dataVencimentoOriginal = parcela.dataVencimento;
        parcela.valor = Number((valorReceita / quantidadeParcela).toFixed(2));
        parcela.situacaoId = EnumSituacaoReceitaParcela.Aberto;
        parcela.valoresAdicionais.taxaBoleto =
          this.valoresAdicionaisParcela.taxaBoleto;

        this.receitaEntrada.parcelas.push(parcela);
      }
      this.item.melhorDia = 0;
    }
  }

  GerarParcelasIntermediarias(
    qtdeParcela,
    dataInicialParcela,
    valorReceita,
    tipoIntervaloParcelaId
  ) {
    const mes = new Date(dataInicialParcela).getMonth();

    if (qtdeParcela > 0 && valorReceita > 0) {
      let quantidadeParcela = qtdeParcela;

      for (let i = 1; i <= quantidadeParcela; i++) {
        let parcela = new ReceitaParcela();
        let dataInicial = new Date(`${dataInicialParcela}T00:00:00`);
        const dia = ObterMelhorDia(dataInicial, this.item.melhorDia, i);

        const numeroParcela = i;
        const dataVencimento = CalcularDataParcela(
          dataInicial,
          tipoIntervaloParcelaId,
          numeroParcela,
          dia,
          mes
        ).yyyymmdd();
        parcela.parcela = numeroParcela;
        parcela.dataVencimento = dataVencimento;
        parcela.dataVencimentoOriginal = parcela.dataVencimento;
        parcela.valor = Number((valorReceita / quantidadeParcela).toFixed(2));
        parcela.situacaoId = EnumSituacaoReceitaParcela.Aberto;
        parcela.valoresAdicionais.taxaBoleto =
          this.valoresAdicionaisParcela.taxaBoleto;

        this.receitaIntermediaria.parcelas.push(parcela);
      }
      this.item.melhorDia = 0;
    }
  }

  GerarParcelasFinanciamento(
    qtdeParcela: number,
    dataInicialParcela: string,
    valorReceita: number,
    tipoReceitaId: number,
    tipoIntervaloParcelaId?: EnumTipoIntervaloParcelas
  ) {
    let mes = new Date(dataInicialParcela).getMonth();

    if (qtdeParcela > 0 && valorReceita > 0) {
      for (let i = 1; i <= qtdeParcela; i++) {
        let parcela = new ReceitaParcela();
        let dataInicial = new Date(
          Date.parse(`${dataInicialParcela} 00:00:00`)
        );
        const dia = ObterMelhorDia(dataInicial, this.item.melhorDia, i);

        parcela.parcela = i;
        parcela.dataVencimento = CalcularDataParcela(
          dataInicial,
          tipoIntervaloParcelaId,
          i,
          dia,
          mes
        ).yyyymmdd();
        parcela.dataVencimentoOriginal = parcela.dataVencimento;
        parcela.valor = Number((valorReceita / qtdeParcela).toFixed(2));
        parcela.situacaoId = EnumSituacaoReceitaParcela.Aberto;
        parcela.valoresAdicionais.taxaBoleto =
          this.valoresAdicionaisParcela.taxaBoleto;

        if (tipoReceitaId == EnumTipoReceita.Titulo) {
          const intermediariaParcelas = this.receitaIntermediaria.parcelas;
          let vencimentoCalculadoAux;

          if (this.receitaSaldoDevedor.parcelas.length > 0) {
            vencimentoCalculadoAux = new Date(
              this.receitaSaldoDevedor.parcelas[
                this.receitaSaldoDevedor.parcelas.length - 1
              ].dataVencimento
            );
            vencimentoCalculadoAux = new Date(
              vencimentoCalculadoAux.setMonth(
                new Date(vencimentoCalculadoAux).getMonth() + 1
              )
            );
          } else {
            vencimentoCalculadoAux = new Date(parcela.dataVencimento);
          }

          if (
            intermediariaParcelas &&
            this.planoPagamento.financiamento
              .gerarFinanciamentoComIntermediaria == true
          ) {
            if (
              intermediariaParcelas.some(
                (x) =>
                  new Date(x.dataVencimento).getMonth() ==
                    new Date(vencimentoCalculadoAux).getMonth() &&
                  new Date(x.dataVencimento).getFullYear() ==
                    new Date(vencimentoCalculadoAux).getFullYear()
              )
            ) {
              intermediariaParcelas.forEach((x) => {
                if (
                  new Date(vencimentoCalculadoAux).getMonth() ==
                    new Date(x.dataVencimento).getMonth() &&
                  new Date(vencimentoCalculadoAux).getFullYear() ==
                    new Date(x.dataVencimento).getFullYear()
                ) {
                  vencimentoCalculadoAux = new Date(
                    vencimentoCalculadoAux.setMonth(
                      new Date(vencimentoCalculadoAux).getMonth() + 1
                    )
                  );
                }
              });
            }
          }

          parcela.dataVencimento = new Date(vencimentoCalculadoAux).yyyymmdd();
          parcela.dataVencimentoOriginal = parcela.dataVencimento;
          this.receitaSaldoDevedor.parcelas.push(parcela);
        }
      }

      this.item.melhorDia = 0;
      qtdeParcela = 0;
    }
  }

  GerarParcelasSac(resultado, dataInicialParcela: string) {
    for (let i = 0; i < resultado.length; i++) {
      let parcela = new ReceitaParcela();

      let dataInicial = new Date(Date.parse(`${dataInicialParcela} 00:00:00`));
      const dia = ObterMelhorDia(dataInicial, this.item.melhorDia, i + 1);

      parcela.parcela = resultado[i].parcela;
      parcela.valor = resultado[i].valorParcela.toFixed(2);
      parcela.saldoAmortizacaoPeriodoOriginal =
        resultado[i].saldoInicialPeriodo;
      parcela.saldoAmortizacaoInicioPeriodoCorrigido =
        resultado[i].saldoInicialPeriodo;
      parcela.saldoAmortizacaoFimPeriodoCorrigido =
        resultado[i].saldoFinalPeriodo;
      parcela.situacaoId = EnumSituacaoReceitaParcela.Aberto;
      parcela.dataVencimento = CalcularDataParcela(
        dataInicial,
        0,
        i + 1,
        dia,
        0
      ).yyyymmdd();
      parcela.dataVencimentoOriginal = parcela.dataVencimento;
      parcela.juros = resultado[i].juros;
      parcela.amortizacao = resultado[i].amortizacao;
      parcela.valoresAdicionais = resultado[i].valoresAdicionais;
      parcela.valoresAdicionais.taxaBoleto =
        this.valoresAdicionaisParcela.taxaBoleto;

      if (this.receitaSaldoDevedor.tipoId == EnumTipoReceita.Titulo) {
        const intermediariaParcelas = this.receitaIntermediaria.parcelas;
        let vencimentoCalculadoAux;

        if (this.receitaSaldoDevedor.parcelas.length > 0) {
          vencimentoCalculadoAux = new Date(
            this.receitaSaldoDevedor.parcelas[
              this.receitaSaldoDevedor.parcelas.length - 1
            ].dataVencimento
          );
          vencimentoCalculadoAux = new Date(
            vencimentoCalculadoAux.setMonth(
              new Date(vencimentoCalculadoAux).getMonth() + 1
            )
          );
        } else {
          vencimentoCalculadoAux = new Date(parcela.dataVencimento);
        }

        if (
          intermediariaParcelas &&
          this.planoPagamento.financiamento
            .gerarFinanciamentoComIntermediaria == true
        ) {
          if (
            intermediariaParcelas.some(
              (x) =>
                new Date(x.dataVencimento).getMonth() ==
                  new Date(vencimentoCalculadoAux).getMonth() &&
                new Date(x.dataVencimento).getFullYear() ==
                  new Date(vencimentoCalculadoAux).getFullYear()
            )
          ) {
            intermediariaParcelas.forEach((x) => {
              if (
                new Date(vencimentoCalculadoAux).getMonth() ==
                  new Date(x.dataVencimento).getMonth() &&
                new Date(vencimentoCalculadoAux).getFullYear() ==
                  new Date(x.dataVencimento).getFullYear()
              ) {
                vencimentoCalculadoAux = new Date(
                  vencimentoCalculadoAux.setMonth(
                    new Date(vencimentoCalculadoAux).getMonth() + 1
                  )
                );
              }
            });
          }
        }

        parcela.dataVencimento = new Date(vencimentoCalculadoAux).yyyymmdd();
        parcela.dataVencimentoOriginal = parcela.dataVencimento;
        this.receitaSaldoDevedor.parcelas.push(parcela);
      }
    }
  }

  listaClientes = [];
  listaCorretores = [];

  AtualizarPessoa() {
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
        "Id,nome,cnpjCpf, nomeCnpjCpf, isCliente, isCorretor",
        ""
      )
      .then((res) => {
        this.listaClientes = res.data.items.filter(
          (x: any) => x.isCliente == true
        );
        this.listaCorretores = res.data.items.filter(
          (x: any) => x.isCorretor == true
        );
      });
  }

  ObterEncargosContaCorrente() {
    new ContaCorrenteService()
      .ObterPorId(this.item.contaCorrenteId)
      .then((res) => {
        this.item.encargoFinanceiro = res.data.encargoFinanceiro;
      });
  }

  situacaoParcelas = [];

  NovoTipoIndice() {
    let qtdeDisponivel = this.listaIndices.filter(
      (item: any) => item.criado == false
    ).length;

    if (qtdeDisponivel == 4)
      return this.$swal(
        "Aviso",
        "Limite dos tipos personalizados atingido.",
        "warning"
      );

    this.tipoIndice = this.listaIndices.find((item) => item.criado == false);
    this.dialogTipoIndice = true;
  }

  dialogTipoIndice: boolean = false;
  tipoIndice = new TipoIndice();

  AtualizarTipoIndice() {
    new TipoIndiceService().ListarTudo().then((res) => {
      this.listaIndices = res.data.items;
    });
  }

  mounted() {
    this.AtualizarPessoa();
    this.AtualizarTipoIndice();

    new SituacaoReceitaParcelaService().ListarTudo().then((res) => {
      this.situacaoParcelas = res.data.items;
    });

    const tipoOperacaoContrato = new TipoOperacaoFinanceiraService();
    tipoOperacaoContrato.ListarTudo().then((res) => {
      this.tiposOperacaoContrato = res.data.items;
    });

    const contaCorrenteService = new ContaCorrenteService();
    contaCorrenteService.ListarTudo().then((res) => {
      this.listaContaCorrentes = res.data.items;
    });

    new TipoIntervaloParcelasService().ListarTudo().then((res) => {
      this.tiposIntervaloParcelas = res.data.items;
    });

    new TipoDocumentoService().ListarTudo().then((res) => {
      this.listaTiposDocumentos = res.data.items;
    });

    new IntervaloReajusteService().ListarTudo().then((res) => {
      this.tiposIntervalos = res.data.items;
    });

    new TipoAmortizacaoService().ListarTudo().then((res) => {
      this.tiposAmortizacao = res.data.items.filter((x) => x.id != 3);
    });

    new TipoContratoService().ListarTudo().then((res) => {
      this.tiposContratos = res.data.items;
    });

    new EmpresaService()
      .Listar(-1, -1, ["nome"], [], "", [], "", "", "Id,nome,nomeFantasia", "")
      .then((res) => {
        this.listaEmpresas = res.data.items;
      });
  }
}
</script>

<style scoped>
.dotted-line2 {
  border-top: 1px dashed #1f1e1d; /* Define a cor da linha aqui */
  margin-top: 15px;
  margin-bottom: 15px;
}

.vdatatable {
  border-radius: 12px !important;
  border: 1px !important;
  gap: 24px !important;
}
</style>
