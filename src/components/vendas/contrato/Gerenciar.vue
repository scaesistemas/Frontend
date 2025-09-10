<template>
  <v-dialog
    persistent
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    no-click-animation
  >
    <v-card color="fundo">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title class="title font-weight-regular">
          Gerenciar Contrato - {{ clienteNome }}</v-toolbar-title
        >
        <v-chip outlined label style="margin-left: 5px"
          >{{ item.numero }} - {{ item.sequencia }}
        </v-chip>
        <v-spacer />

        <v-toolbar-items>
          <v-btn dark text @click="Salvar()">Salvar</v-btn>
        </v-toolbar-items>

        <template v-slot:extension>
          <v-tabs v-model="tabActive" background-color="primary" dark>
            <v-tab>Financeiro</v-tab>
            <v-tab>Observação</v-tab>
            <v-tab @click="getDocumentos()">Documentos</v-tab>
            <v-tab>Contrato Digital</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items v-model="tabActive">
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-toolbar color="transparent" flat dense height="2">
                <template v-slot:extension>
                  <v-tabs color="primary" v-model="subTabActive">
                    <v-tab
                      v-if="gerenciador.receitas.some((x) => x.tipoId == 1)"
                      >Financiamento
                    </v-tab>
                    <v-tab
                      v-if="gerenciador.receitas.some((x) => x.tipoId == 3)"
                      >Entrada</v-tab
                    >
                    <v-tab
                      v-if="gerenciador.receitas.some((x) => x.tipoId == 4)"
                      >Aditamento</v-tab
                    >
                    <v-tab
                      v-if="gerenciador.receitas.some((x) => x.tipoId == 5)"
                      >Intermediária</v-tab
                    >
                    <v-tab
                      v-if="gerenciador.receitas.some((x) => x.tipoId == 9)"
                      >Serviço</v-tab
                    >
                    <v-tab v-if="gerenciador.despesas.length > 0">
                      Comissão</v-tab
                    >

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          small
                          icon
                          class="ml-2 mt-3"
                          v-on="on"
                          @click="GerarServico()"
                        >
                          <v-icon size="28px" color="#676668"
                            >mdi-plus-circle</v-icon
                          >
                        </v-btn>
                      </template>

                      <span>Cadastrar Parcelas de Serviços</span>
                    </v-tooltip>
                  </v-tabs>

                  <v-spacer />
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        outlined
                        color="primary"
                        dark
                        v-on="on"
                        @click="ObterContrato()"
                      >
                        <v-icon left>mdi-clipboard-text-outline</v-icon>
                        Detalhar
                      </v-btn>
                    </template>
                    <span>Informação do Contrato</span>
                  </v-tooltip>
                </template>
              </v-toolbar>
            </v-card-text>

            <v-tabs-items v-model="subTabActive" class="mt-3">
              <template v-for="gerenciar in gerenciador.receitas">
                <v-tab-item
                  v-if="gerenciar.id > 0 || gerenciar.tipoId == 9"
                  :key="gerenciar.titulo"
                >
                  <v-container fluid text-xs-center>
                    <v-card outlined>
                      <v-layout wrap>
                        <v-flex>
                          <v-card tile class="text-center py-3">
                            <v-card-title
                              style="font-weight: 500; font-size: 23px"
                              class="justify-center text--secondary"
                              >Tabela</v-card-title
                            >
                            <v-card-subtitle
                              class="pt-1"
                              style="
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: 500;
                                font-size: 18px;
                              "
                              >{{
                                gerenciador.tipoAmortizacao.nome
                              }}</v-card-subtitle
                            >
                          </v-card>
                        </v-flex>
                        <v-flex>
                          <v-card tile class="text-center py-3">
                            <v-card-title
                              style="font-weight: 500; font-size: 23px"
                              class="justify-center text--secondary"
                              >Parcelas</v-card-title
                            >
                            <v-card-subtitle
                              class="pt-1"
                              style="
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: 500;
                                font-size: 18px;
                              "
                              >{{
                                gerenciar.quantidadeParcela
                              }}</v-card-subtitle
                            >
                          </v-card>
                        </v-flex>
                        <v-flex>
                          <v-card tile class="text-center py-3">
                            <v-card-title
                              style="font-weight: 500; font-size: 23px"
                              class="justify-center text--secondary"
                              >Valor das Parcelas</v-card-title
                            >
                            <v-card-subtitle
                              class="pt-1"
                              style="
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: 500;
                                font-size: 18px;
                              "
                              >{{
                                Number(gerenciar.valorParcelaAtual).toMoeda(
                                  true
                                )
                              }}</v-card-subtitle
                            >
                          </v-card>
                        </v-flex>
                        <v-flex>
                          <v-card tile class="text-center py-3">
                            <v-card-title
                              style="font-weight: 500; font-size: 23px"
                              class="justify-center text--secondary"
                              >Saldo Devedor</v-card-title
                            >
                            <v-card-subtitle
                              class="pt-1"
                              style="
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: 500;
                                font-size: 18px;
                              "
                              >{{
                                Number(gerenciar.saldo).toMoeda(true)
                              }}</v-card-subtitle
                            >
                          </v-card>
                        </v-flex>
                        <v-flex>
                          <v-card tile class="text-center py-3">
                            <v-card-title
                              style="font-weight: 500; font-size: 23px"
                              class="justify-center text--secondary"
                              >1º Vencimento</v-card-title
                            >
                            <v-card-subtitle
                              class="pt-1"
                              style="
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: 500;
                                font-size: 18px;
                              "
                              >{{
                                gerenciar.primeiroVencimento &&
                                gerenciar.primeiroVencimento != ""
                                  ? gerenciar.primeiroVencimento.toDateDDMMYYYY()
                                  : "00/00/0000"
                              }}</v-card-subtitle
                            >
                          </v-card>
                        </v-flex>
                        <v-flex>
                          <v-card tile class="text-center py-3">
                            <v-card-title
                              style="font-weight: 500; font-size: 23px"
                              class="justify-center text--secondary"
                              >Índice</v-card-title
                            >
                            <v-card-subtitle
                              class="pt-1"
                              style="
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: 500;
                                font-size: 18px;
                              "
                              >{{
                                gerenciador.tipoIndice
                                  ? gerenciador.tipoIndice.nomeEditavel
                                  : ""
                              }}</v-card-subtitle
                            >
                          </v-card>
                        </v-flex>
                        <v-flex>
                          <v-card tile class="text-center py-3">
                            <v-card-title
                              style="font-weight: 500; font-size: 23px"
                              class="justify-center text--secondary"
                              >Mês do Reajuste</v-card-title
                            >
                            <v-card-subtitle
                              class="pt-1"
                              style="
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: 500;
                                font-size: 18px;
                              "
                              >{{
                                mesReajuste.find(
                                  (x) => x.id == gerenciador.mesReajuste
                                )
                                  ? mesReajuste.find(
                                      (x) => x.id == gerenciador.mesReajuste
                                    ).nome
                                  : ""
                              }}</v-card-subtitle
                            >
                          </v-card>
                        </v-flex>
                      </v-layout>

                      <v-row dense>
                        <v-col cols="12">
                          <v-data-table
                            class="elevation-1"
                            fixed-header
                            height="450"
                            :headers="headers"
                            :items="filtrarParcelas(gerenciar.parcelas)"
                            :options.sync="options"
                            :footer-props="{ showFirstLastPage: true }"
                            item-key="gerenciar"
                            sort-by="parcela"
                            :loading="loading"
                          >
                            <template v-slot:top>
                              <v-row dense class="pt-3 px-3">
                                <v-btn
                                  icon
                                  @click="AgruparAntecipar(gerenciar)"
                                >
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <v-icon large color="primary" v-on="on"
                                        >mdi-cash-plus</v-icon
                                      >
                                    </template>
                                    <span>Gerenciar parcelas</span>
                                  </v-tooltip>
                                </v-btn>
                                <v-btn
                                  icon
                                  @click="EncargosEDescontos(gerenciar.id)"
                                >
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <v-icon color="primary" v-on="on"
                                        >mdi-finance</v-icon
                                      >
                                    </template>
                                    <span>Encargos e descontos</span>
                                  </v-tooltip>
                                </v-btn>
                                <v-btn
                                  icon
                                  v-if="
                                    item.tipoAmortizacaoId != 1 &&
                                    gerenciar.tipoId == 1
                                  "
                                  @click="SimularAmortizacao(gerenciar)"
                                >
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <v-icon color="primary" v-on="on"
                                        >mdi-calendar-clock</v-icon
                                      >
                                    </template>
                                    <span>Amortização</span>
                                  </v-tooltip>
                                </v-btn>
                                <v-btn icon @click="Quitar(gerenciar)">
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <v-icon color="primary" v-on="on"
                                        >mdi-text-box-check-outline</v-icon
                                      >
                                    </template>
                                    <span>Quitar receita</span>
                                  </v-tooltip>
                                </v-btn>
                                <v-btn
                                  icon
                                  @click="ConfigurarReceita(gerenciar)"
                                >
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <v-icon color="primary" v-on="on"
                                        >mdi-tune</v-icon
                                      >
                                    </template>
                                    <span>Configurar receita</span>
                                  </v-tooltip>
                                </v-btn>

                                <v-menu offset-x>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon v-bind="attrs" v-on="on">
                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-icon color="primary" v-on="on"
                                            >mdi-filter-menu-outline</v-icon
                                          >
                                        </template>
                                        <span>Filtrar parcelas</span>
                                      </v-tooltip>
                                    </v-btn>
                                  </template>

                                  <v-card>
                                    <v-list>
                                      <v-list-item>
                                        <v-list-item-content>
                                          <v-list-item-subtitle
                                            >Filtrar
                                            Parcelas</v-list-item-subtitle
                                          >
                                        </v-list-item-content>

                                        <v-list-item-action>
                                          <v-icon size="20" color="grey"
                                            >mdi-filter-menu-outline</v-icon
                                          >
                                        </v-list-item-action>
                                      </v-list-item>
                                    </v-list>

                                    <v-divider></v-divider>

                                    <v-list>
                                      <v-list-item @click="filtroAtivo = 1">
                                        <v-list-item-title
                                          >Parcelas em aberto</v-list-item-title
                                        >
                                      </v-list-item>

                                      <v-list-item @click="filtroAtivo = 3">
                                        <v-list-item-title
                                          >Parcelas Pagas</v-list-item-title
                                        >
                                      </v-list-item>

                                      <v-list-item @click="filtroAtivo = null">
                                        <v-list-item-title
                                          >Todas as Parcelas</v-list-item-title
                                        >
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-menu>
                              </v-row>
                            </template>

                            <template v-slot:[`item.actions`]="{ item }">
                              <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-row dense>
                                    <v-btn
                                      outlined
                                      v-bind="attrs"
                                      v-on="on"
                                      color="primary"
                                    >
                                      <v-icon size="25px" left
                                        >mdi-menu-down</v-icon
                                      >Ações
                                    </v-btn>
                                  </v-row>
                                </template>

                                <v-list>
                                  <template v-if="!item.agrupadorId">
                                    <v-list-item @click="BaixarParcela(item)">
                                      <v-list-item-title
                                        v-if="
                                          item.situacaoId == 3 ||
                                          item.situacaoId == 4
                                        "
                                      >
                                        <v-icon
                                          size="30px"
                                          color="teal"
                                          class="pr-3"
                                          >mdi-pencil</v-icon
                                        >
                                        Editar Baixa
                                      </v-list-item-title>

                                      <v-list-item-title v-else>
                                        <v-icon
                                          size="30px"
                                          color="teal"
                                          class="pr-3"
                                          >mdi-cash-check</v-icon
                                        >
                                        Baixar Parcela
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-divider />
                                  </template>

                                  <template
                                    v-if="
                                      item.urlBoleto ||
                                      item.linhaDigitavelBoleto
                                    "
                                  >
                                    <v-list-item
                                      @click="VisualizarBoleto(item)"
                                    >
                                      <v-list-item-title>
                                        <v-icon
                                          size="30px"
                                          color="primary"
                                          class="pr-3"
                                          >mdi-barcode</v-icon
                                        >
                                        Visualizar boleto
                                      </v-list-item-title> </v-list-item
                                    ><v-divider />
                                  </template>

                                  <template v-else>
                                    <v-list-item
                                      @click="GerarBoleto(item)"
                                      :disabled="
                                        item.situacaoId != 1 ||
                                        item.agrupadorId > 0
                                      "
                                    >
                                      <v-list-item-title>
                                        <v-icon
                                          size="30px"
                                          color="grey darken-1"
                                          class="pr-3"
                                          >mdi-printer</v-icon
                                        >
                                        Gerar boleto
                                      </v-list-item-title> </v-list-item
                                    ><v-divider />
                                  </template>

                                  <template
                                    v-if="
                                      !item.agrupadorId &&
                                      (item.urlBoleto ||
                                        item.linhaDigitavelBoleto)
                                    "
                                  >
                                    <v-list-item @click="CancelarBoleto(item)">
                                      <v-list-item-title>
                                        <v-icon
                                          size="30px"
                                          color="grey darken-1"
                                          class="pr-3"
                                          >mdi-undo-variant</v-icon
                                        >
                                        Cancelar Boleto
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-divider />
                                  </template>

                                  <template
                                    v-if="
                                      !item.agrupadorId &&
                                      (item.urlBoleto ||
                                        item.linhaDigitavelBoleto)
                                    "
                                  >
                                    <v-list-item
                                      @click="CancelarBoletoForcado(item)"
                                    >
                                      <v-list-item-title>
                                        <v-icon
                                          size="30px"
                                          color="red darken-1"
                                          class="pr-3"
                                          >mdi-delete-alert-outline</v-icon
                                        >
                                        Excluir Boleto
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-divider />
                                  </template>

                                  <template
                                    v-if="
                                      (item.isAgrupador == true ||
                                        item.isAntecipador == true) &&
                                      item.situacaoId == 1
                                    "
                                  >
                                    <v-list-item @click="CancelarParcela(item)">
                                      <v-list-item-title>
                                        <v-icon
                                          size="30px"
                                          color="red lighten-1"
                                          class="pr-3"
                                          >mdi-cancel</v-icon
                                        >
                                        Cancelar Parcela
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-divider />
                                  </template>

                                  <v-list-item @click="EditarParcela(item)">
                                    <v-list-item-title>
                                      <v-icon
                                        size="30px"
                                        color="primary"
                                        class="pr-3"
                                      >
                                        <template
                                          v-if="
                                            item.urlBoleto ||
                                            item.situacaoId == 2 ||
                                            item.situacaoId == 3 ||
                                            item.situacaoId == 4 ||
                                            item.qrCode ||
                                            item.agrupadorId > 0
                                          "
                                        >
                                          mdi-eye</template
                                        >
                                        <template v-else> mdi-pencil </template>
                                      </v-icon>

                                      <span>
                                        {{
                                          item.urlBoleto ||
                                          item.situacaoId == 2 ||
                                          item.situacaoId == 3 ||
                                          item.situacaoId == 4 ||
                                          item.qrCode ||
                                          item.agrupadorId > 0
                                            ? "Visualizar"
                                            : "Editar"
                                        }}
                                      </span>
                                    </v-list-item-title>
                                  </v-list-item>
                                  <v-divider />

                                  <template
                                    v-if="
                                      !item.agrupadorId && item.situacaoId == 1
                                    "
                                  >
                                    <v-list-item @click="AjustarParcela(item)">
                                      <v-list-item-title>
                                        <v-icon
                                          size="30px"
                                          color="purple lighten-1"
                                          class="pr-3"
                                          >mdi-table-edit</v-icon
                                        >
                                        Reajuste de Parcelas
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-divider />
                                  </template>

                                  <template
                                    v-if="
                                      app.usuarioId == 1 || app.usuarioId == 2
                                    "
                                  >
                                    <template
                                      v-if="item.splitPagamento != null"
                                    >
                                      <v-list-item @click="RemoverSplit(item)">
                                        <v-list-item-title>
                                          <v-icon
                                            size="30px"
                                            color="red accent-4"
                                            class="pr-3"
                                            >mdi-delete</v-icon
                                          >
                                          Remover Split
                                        </v-list-item-title>
                                      </v-list-item>
                                    </template>
                                    <template v-else>
                                      <v-list-item
                                        @click="AdicionarSplit(item)"
                                      >
                                        <v-list-item-title>
                                          <v-icon
                                            size="30px"
                                            color="green accent-4"
                                            class="pr-3"
                                            >mdi-arrow-down</v-icon
                                          >
                                          Cadastrar Split
                                        </v-list-item-title>
                                      </v-list-item>
                                    </template>
                                  </template>

                                  <template
                                    v-if="
                                      !item.agrupadorId && item.situacaoId == 1
                                    "
                                  >
                                    <v-list-item @click="DataSequencia(item)">
                                      <v-list-item-title>
                                        <v-icon
                                          size="30px"
                                          color="light-blue lighten-1"
                                          class="pr-3"
                                          >mdi-calendar-clock</v-icon
                                        >
                                        Atualizar Data
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-divider />
                                  </template>

                                  <template
                                    v-if="
                                      !item.agrupadorId && item.situacaoId == 1
                                    "
                                  >
                                    <v-list-item @click="BaixaRetroativa(item)">
                                      <v-list-item-title>
                                        <v-icon
                                          size="30px"
                                          color="pink lighten-1"
                                          class="pr-3"
                                          >mdi-cash-multiple</v-icon
                                        >
                                        Baixar P. Retroativas
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-divider />
                                  </template>

                                  <template
                                    v-if="!item.agrupadorId && item.urlBoleto"
                                  >
                                    <v-list-item @click="EnviarWhatsapp(item)">
                                      <v-list-item-title>
                                        <v-icon
                                          size="30px"
                                          color="#27A017"
                                          class="pr-3"
                                          >mdi-whatsapp</v-icon
                                        >
                                        Env. whatsapp
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-divider />
                                  </template>

                                  <template
                                    v-if="
                                      !item.agrupadorId &&
                                      item.situacaoId == 3 &&
                                      item.isAgrupador == true
                                    "
                                  >
                                    <v-list-item
                                      v-if="
                                        item.antecipacaoComprovante
                                          ? item.antecipacaoComprovante
                                              .protocolo == null
                                          : ''
                                      "
                                      @click="GerarComprovante(item)"
                                    >
                                      <v-list-item-title>
                                        <v-icon
                                          size="30px"
                                          color="yellow accent-4"
                                          class="pr-3"
                                          >mdi-file-document</v-icon
                                        >
                                        Gerar comprovante
                                      </v-list-item-title>
                                    </v-list-item>

                                    <v-list-item
                                      v-else
                                      @click="VisualizarComprovante(item)"
                                    >
                                      <v-list-item-title>
                                        <v-icon
                                          size="30px"
                                          color="yellow accent-4"
                                          class="pr-3"
                                          >mdi-file-document</v-icon
                                        >
                                        Visualizar comprovante
                                      </v-list-item-title>
                                    </v-list-item>
                                  </template>
                                </v-list>
                              </v-menu>
                            </template>

                            <template v-slot:[`item.parcela`]="{ item }">
                              <v-row dense align="center">
                                <span>{{ item.parcela }}</span>
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      v-if="item.splitPagamento"
                                      class="ml-2"
                                      color="blue lighten-2"
                                      v-bind="attrs"
                                      v-on="on"
                                    >
                                      mdi-swap-horizontal
                                    </v-icon>
                                  </template>
                                  <span>Parcela com split de pagamento</span>
                                </v-tooltip>
                              </v-row>
                            </template>

                            <template v-slot:[`item.valor`]="{ item }">
                              {{
                                item.valor
                                  ? Number(item.valor).toMoeda(true)
                                  : new Number(0).toMoeda(true)
                              }}
                            </template>

                            <template
                              v-slot:[`item.valoresAdicionais.taxaBoleto`]="{
                                item,
                              }"
                            >
                              {{
                                Number(
                                  (item?.valoresAdicionais?.taxaBoleto || 0) +
                                    (item?.valoresAdicionais
                                      ?.valorFixoTaxaAdicional || 0)
                                ).toMoeda(true)
                              }}
                            </template>

                            <template v-slot:[`item.totalEncargos`]="{ item }">
                              {{
                                Number(
                                  item.jurosAplicado + item.multaAplicado
                                ).toMoeda(true)
                              }}
                            </template>

                            <template v-slot:[`item.valorPago`]="{ item }">
                              {{
                                item.valorPago
                                  ? Number(item.valorPago).toMoeda(true)
                                  : new Number(0).toMoeda(true)
                              }}
                            </template>

                            <template v-slot:[`item.situacao.nome`]="{ item }">
                              <v-chip :color="SituacaoColor(item)">
                                <div v-if="item.agrupadorId != null">
                                  Agrupada
                                </div>

                                <div v-else>
                                  {{
                                    listaSituacao.find(
                                      (x) => x.id == item.situacaoId
                                    ).nome
                                  }}
                                </div>
                              </v-chip>
                            </template>

                            <template
                              v-slot:[`item.dataVencimentoOriginal`]="{ item }"
                            >
                              {{
                                new Date(item.dataVencimentoOriginal).ddmmyyyy()
                              }}
                            </template>

                            <template v-slot:[`item.dataVencimento`]="{ item }">
                              {{ new Date(item.dataVencimento).ddmmyyyy() }}
                            </template>

                            <template v-slot:[`item.urlBoleto`]="{ item }">
                              <div
                                v-if="
                                  item.urlBoleto || item.linhaDigitavelBoleto
                                "
                              >
                                <v-btn icon @click="VisualizarBoleto(item)">
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <v-icon color="primary" v-on="on"
                                        >mdi-barcode</v-icon
                                      >
                                    </template>
                                    <span>Visualizar boleto</span>
                                  </v-tooltip>
                                </v-btn>
                              </div>

                              <div v-else>
                                <v-btn
                                  icon
                                  @click="GerarBoleto(item)"
                                  :disabled="
                                    item.situacaoId != 1 || item.agrupadorId > 0
                                  "
                                >
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <v-icon color="grey darken-1" v-on="on"
                                        >mdi-printer</v-icon
                                      >
                                    </template>
                                    <span>Gerar boleto</span>
                                  </v-tooltip>
                                </v-btn>
                              </div>
                            </template>

                            <!-- <template v-slot:[`item.ultimaTransacao`] = "{item}"> 
                                    {{ obterLoginUsuario(item) }}                                  
                                  </template> -->

                            <template
                              v-slot:[`item.ultimaDataPagamento`]="{ item }"
                            >
                              {{
                                item.ultimaDataPagamento
                                  ? new Date(
                                      item.ultimaDataPagamento
                                    ).ddmmyyyy()
                                  : "-"
                              }}
                            </template>

                            <template
                              v-slot:[`item.ultimaFormaPagamento`]="{ item }"
                            >
                              {{
                                item.ultimaFormaPagamento
                                  ? item.ultimaFormaPagamento
                                  : "-"
                              }}
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>

                      <v-snackbar
                        v-model="snack"
                        :timeout="3000"
                        :color="snackColor"
                      >
                        {{ snackText }}
                        <template v-slot:action="{ attrs }">
                          <v-btn v-bind="attrs" text @click="snack = false"
                            >Fechar</v-btn
                          >
                        </template>
                      </v-snackbar>
                    </v-card>
                  </v-container>
                </v-tab-item>
              </template>

              <template>
                <v-tab-item v-if="gerenciador.despesas.length > 0">
                  <v-container fluid text-xs-center>
                    <v-card outlined>
                      <v-layout wrap>
                        <v-flex>
                          <v-card tile class="text-center py-3">
                            <v-card-title
                              style="font-weight: 500; font-size: 23px"
                              class="justify-center text--secondary"
                              >Documento</v-card-title
                            >
                            <v-card-subtitle
                              class="pt-1"
                              style="
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: 500;
                                font-size: 18px;
                              "
                              >{{
                                pegarDespesasComissoes(gerenciador.despesas)
                                  .documento
                              }}</v-card-subtitle
                            >
                          </v-card>
                        </v-flex>
                        <v-flex>
                          <v-card tile class="text-center py-3">
                            <v-card-title
                              style="font-weight: 500; font-size: 23px"
                              class="justify-center text--secondary"
                              >Parcelas</v-card-title
                            >
                            <v-card-subtitle
                              class="pt-1"
                              style="
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: 500;
                                font-size: 18px;
                              "
                              >{{
                                pegarDespesasComissoes(gerenciador.despesas)
                                  .parcelas
                              }}</v-card-subtitle
                            >
                          </v-card>
                        </v-flex>
                        <v-flex>
                          <v-card tile class="text-center py-3">
                            <v-card-title
                              style="font-weight: 500; font-size: 23px"
                              class="justify-center text--secondary"
                              >Valor das Parcelas</v-card-title
                            >
                            <v-card-subtitle
                              class="pt-1"
                              style="
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: 500;
                                font-size: 18px;
                              "
                              >{{
                                pegarDespesasComissoes(gerenciador.despesas)
                                  .valorParcela
                              }}</v-card-subtitle
                            >
                          </v-card>
                        </v-flex>
                        <v-flex>
                          <v-card tile class="text-center py-3">
                            <v-card-title
                              style="font-weight: 500; font-size: 23px"
                              class="justify-center text--secondary"
                              >Saldo Devedor</v-card-title
                            >
                            <v-card-subtitle
                              class="pt-1"
                              style="
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: 500;
                                font-size: 18px;
                              "
                              >{{
                                Number(
                                  pegarDespesasComissoes(gerenciador.despesas)
                                    .saldo
                                ).toMoeda(true)
                              }}</v-card-subtitle
                            >
                          </v-card>
                        </v-flex>
                        <v-flex>
                          <v-card tile class="text-center py-3">
                            <v-card-title
                              style="font-weight: 500; font-size: 23px"
                              class="justify-center text--secondary"
                              >Total Pago</v-card-title
                            >
                            <v-card-subtitle
                              class="pt-1"
                              style="
                                font-family: Arial, Helvetica, sans-serif;
                                font-weight: 500;
                                font-size: 18px;
                              "
                              >{{
                                Number(
                                  pegarDespesasComissoes(gerenciador.despesas)
                                    .totalPago
                                ).toMoeda(true)
                              }}</v-card-subtitle
                            >
                          </v-card>
                        </v-flex>
                      </v-layout>

                      <v-row dense class="mt-2">
                        <v-col cols="12">
                          <v-data-table
                            class="elevation-1"
                            fixed-header
                            height="450"
                            :headers="headersComissao"
                            :items="
                              pegarParcelasComissoes(
                                gerenciador.despesas
                              ).filter((x) => x.situacaoId != 2)
                            "
                            :options.sync="options"
                            :footer-props="{ showFirstLastPage: true }"
                            item-key="gerenciar"
                            sort-by="parcela"
                            :loading="loading"
                          >
                            <template v-slot:[`item.actions`]="{ item }">
                              <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-row dense>
                                    <v-btn
                                      outlined
                                      v-bind="attrs"
                                      v-on="on"
                                      color="primary"
                                    >
                                      <v-icon size="25px" left
                                        >mdi-menu-down</v-icon
                                      >Ações
                                    </v-btn>
                                  </v-row>
                                </template>

                                <v-list>
                                  <template>
                                    <v-list-item
                                      @click="BaixarParcelaDespesa(item)"
                                    >
                                      <v-list-item-title
                                        v-if="
                                          item.situacaoId == 3 ||
                                          item.situacaoId == 4
                                        "
                                      >
                                        <v-icon size="30px" color="teal"
                                          >mdi-pencil</v-icon
                                        >
                                        Editar Baixa
                                      </v-list-item-title>

                                      <v-list-item-title v-else>
                                        <v-icon size="35px" color="teal"
                                          >mdi-cash-check</v-icon
                                        >
                                        Baixar Parcela
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-divider />
                                  </template>

                                  <v-list-item
                                    @click="EditarParcelaDespesa(item)"
                                  >
                                    <v-list-item-title>
                                      <v-icon size="30px" color="primary">
                                        <template
                                          v-if="
                                            item.situacaoId == 2 ||
                                            item.situacaoId == 3 ||
                                            item.situacaoId == 4
                                          "
                                        >
                                          mdi-eye</template
                                        >
                                        <template v-else> mdi-pencil </template>
                                      </v-icon>

                                      <span>
                                        {{
                                          item.situacaoId == 2 ||
                                          item.situacaoId == 3 ||
                                          item.situacaoId == 4
                                            ? "Visualizar"
                                            : "Editar"
                                        }}
                                      </span>
                                    </v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                            </template>

                            <template v-slot:[`item.valor`]="{ item }">
                              {{
                                item.valor
                                  ? Number(item.valor).toMoeda(true)
                                  : new Number(0).toMoeda(true)
                              }}
                            </template>

                            <template v-slot:[`item.valorPago`]="{ item }">
                              {{
                                item.valorPago
                                  ? Number(item.valorPago).toMoeda(true)
                                  : new Number(0).toMoeda(true)
                              }}
                            </template>

                            <template v-slot:[`item.situacao.nome`]="{ item }">
                              <v-chip :color="SituacaoColor(item)">
                                <div v-if="item.agrupadorId != null">
                                  Agrupada
                                </div>

                                <div v-else>
                                  {{
                                    listaSituacao.find(
                                      (x) => x.id == item.situacaoId
                                    ).nome
                                  }}
                                </div>
                              </v-chip>
                            </template>

                            <template v-slot:[`item.dataVencimento`]="{ item }">
                              {{ new Date(item.dataVencimento).ddmmyyyy() }}
                            </template>

                            <template
                              v-slot:[`item.ultimaDataPagamento`]="{ item }"
                            >
                              {{
                                item.ultimaDataPagamento
                                  ? new Date(
                                      item.ultimaDataPagamento
                                    ).ddmmyyyy()
                                  : "-"
                              }}
                            </template>

                            <template
                              v-slot:[`item.ultimaFormaPagamento`]="{ item }"
                            >
                              {{
                                item.ultimaFormaPagamento
                                  ? item.ultimaFormaPagamento
                                  : "-"
                              }}
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>

                      <v-snackbar
                        v-model="snack"
                        :timeout="3000"
                        :color="snackColor"
                      >
                        {{ snackText }}
                        <template v-slot:action="{ attrs }">
                          <v-btn v-bind="attrs" text @click="snack = false"
                            >Fechar</v-btn
                          >
                        </template>
                      </v-snackbar>
                    </v-card>
                  </v-container>
                </v-tab-item>
              </template>
            </v-tabs-items>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card outlined>
            <vcard-observacao :lista.sync="gerenciador.observacoes" />
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card outlined>
            <v-card-text>
              <v-card-title>
                <span class="title-span">Documentos</span>
              </v-card-title>

              <v-row dense class="px-3">
                <v-col cols="12" md="5">
                  <span class="font-weight-bold">Nome do arquivo</span>
                  <v-text-field outlined dense v-model="documento.nome" />
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold pl-8">Arquivo</span>
                  <v-file-input
                    outlined
                    chips
                    accept="image/*,application/pdf"
                    label="Selecione o arquivo"
                    v-model="inputDocumento"
                    show-size
                    counter
                    dense
                  />
                </v-col>

                <v-col cols="12" md="2" class="mt-6">
                  <v-btn color="primary" @click="AdicionarArquivo()">
                    <v-icon left>mdi-plus</v-icon>
                    Adicionar
                  </v-btn>
                </v-col>
              </v-row>

              <v-data-table
                class="elevation-1"
                :options.sync="optionsDocumentos"
                item-key="item.key"
                :headers="headersDocumentos"
                :items="contratoDocumento.documentos"
                :loading="overlayDocumentos"
                :footer-props="{ showFirstLastPage: false }"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        @click="ExcluirDocumento(item)"
                        v-on="on"
                        :disabled="item.excluido"
                        >mdi-delete</v-icon
                      >
                    </template>
                    <span>Excluir</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        class="ml-2"
                        small
                        @click="CompartilharArquivo(item)"
                        v-on="on"
                        :disabled="item.excluido"
                        >mdi-share</v-icon
                      >
                    </template>
                    <span>Compartilhar</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        class="ml-2"
                        small
                        @click="BaixarArquivo(item)"
                        v-on="on"
                        :disabled="item.excluido"
                        >mdi-download</v-icon
                      >
                    </template>
                    <span>Download</span>
                  </v-tooltip>
                </template>

                <template v-slot:[`item.nome`]="{ item }">
                  {{ item.nome }}
                </template>

                <template v-slot:[`item.dados`]="{ item }">
                  <v-icon
                    v-if="item.tipo == 'application/pdf'"
                    large
                    color="primary"
                    >mdi-file</v-icon
                  >
                  <img
                    v-else
                    class="mt-2"
                    :src="'data:image/gif;base64,' + item.dados"
                    alt="Img"
                    width="100"
                    height="100"
                  />
                </template>

                <template v-slot:[`item.dataEmissao`]="{ item }">
                  {{
                    item.dataEmissao ? item.dataEmissao.toDateDDMMYYYY() : "-"
                  }}
                </template>

                <template v-slot:[`item.usuario.login`]="{ item }">
                  {{ item.usuario != null ? item.usuario.login : "-" }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <vcard-contratodigital
            :item="gerenciador"
            :lista.sync="gerenciador.contratosDigitais"
          />
        </v-tab-item>
      </v-tabs-items>
      <v-overlay :value="overlay"></v-overlay>
    </v-card>

    <ajuste-amortizacao
      v-model="dialogAjusteAmortizacao"
      :item="parcela"
      @fechou="dialogAjusteAmortizacao = false"
      @salvou="AtualizarContrato()"
    />
    <editar-parcelaManual
      v-model="dialogParcela"
      :item="parcela"
      @fechou="dialogParcela = false"
      @salvou="AtualizarContrato()"
    />
    <atualizar-dataSequencia
      v-model="dialogDataSequencia"
      :item="parcela"
      @fechou="dialogDataSequencia = false"
      @salvou="AtualizarContrato()"
    />
    <parcelabaixa-receita
      :item="parcela"
      :encargos="item.encargoFinanceiro"
      v-model="dialogBaixar"
      @fechou="(dialogBaixar = false), AtualizarContrato()"
      @salvou="AtualizarContrato()"
    />
    <quitador-contrato
      v-model="dialogQuitarContrato"
      :item="contratoQuitacao"
      @fechou="dialogQuitarContrato = false"
      :tipoAmortizacaoId="item.tipoAmortizacaoId"
      @salvou="AtualizarContrato()"
    />
    <despesa-contratual
      v-model="dialogDespesaContratual"
      :item="receitaServico"
      @fechou="(dialogDespesaContratual = false), AtualizarContrato()"
      @salvou="AtualizarContrato()"
    />
    <encargos-descontos
      v-model="dialogEncargosDescontos"
      :item.sync="receitaEncargo"
      @fechou="dialogEncargosDescontos = false"
      @salvou="AtualizarContrato"
    />
    <detalhar-contrato
      v-model="dialogDetalhar"
      :item="detalhar"
      @fechou="dialogDetalhar = false"
      @salvou="AtualizarContrato()"
    />
    <gerenciador-receita
      v-model="dialogGerencial"
      :item="receitaGerenciada"
      @fechou="(dialogGerencial = false), AtualizarContrato()"
    />
    <agrupar-antecipar
      v-model="dialogAgruparAntecipar"
      :item="receitaAgruparAntecipar"
      @fechou="(dialogAgruparAntecipar = false), AtualizarContrato()"
      @salvou="AtualizarContrato()"
    />
    <configurar-receita
      v-model="dialogConfigurarReceita"
      :item="receitaConfig"
      @fechou="dialogConfigurarReceita = false"
      @salvou="AtualizarContrato()"
    />
    <simular-parcela
      v-model="dialogSimular"
      :item="simulacao"
      @fechou="(dialogSimular = false), AtualizarContrato()"
      @salvou="AtualizarContrato()"
    />
    <baixas-retroativa
      v-model="dialogBaixasRetroativa"
      :item="parcelaBaixaRetroativa"
      @fechou="dialogBaixasRetroativa = false"
      @salvou="AtualizarContrato()"
    />
    <split-pagamento
      v-model="dialogSplit"
      :item="parcela"
      @fechou="dialogSplit = false"
      @salvou="AtualizarContrato()"
    />
    <editar-parcelaDespesa
      v-model="dialogParcelaDespesa"
      :item="parcelaDespesa"
      @fechou="dialogParcelaDespesa = false"
      @salvou="(dialogParcelaDespesa = false), AtualizarContrato()"
    />
    <parcelabaixa-despesa
      v-model="dialogBaixarDespesa"
      :item="parcelaDespesa"
      @fechou="(dialogBaixarDespesa = false), AtualizarContrato()"
      @salvou="(dialogBaixarDespesa = false), AtualizarContrato()"
    />

    <v-card style="display: none">
      <div>
        <center>
          <h1>Comprovante de Quitação</h1>
          <br />

          <table id="simple_table4">
            <tbody>
              <tr>
                <td>
                  {{
                    `Contrato: ${
                      antecipacao.numeroSequenciaContrato
                    } referente a compra do lote ${
                      antecipacao.loteNome
                    } da quadra ${antecipacao.quadraNome} no empreendimento ${
                      antecipacao.empreendimentoNome
                    }. 
                        Este Documento foi solicitado por ${
                          antecipacao.clienteNome
                        }, na quantia de ${Number(
                      antecipacao.valorTotalParcela
                    ).toMoeda(true)}.
                        Correspondente a previsão de pagamento das parcelas relacionadas abaixo: 
                      `
                  }}
                </td>
              </tr>
            </tbody>
          </table>

          <table id="simple_table">
            <tr>
              <th>Parc.</th>
              <th>Venc.</th>
              <th>Valor</th>
              <th>Em atrasos</th>
              <th>Desconto</th>
              <th>Encargos</th>
              <th>Valor Pg</th>
              <th>Data Pgt</th>
            </tr>
            <tbody v-for="parcela in antecipacao.parcelas" :key="parcela.id">
              <tr>
                <td>{{ parcela.parcelaNumero }}</td>
                <td>{{ parcela.dataVencimento.toDateDDMMYYYY() }}</td>
                <td>
                  {{
                    parcela.saldoParcela
                      ? Number(parcela.saldoParcela).toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </td>
                <td>{{ parcela.diasAtraso }}</td>
                <td>
                  {{
                    parcela.descontoAntecipacaoQuitacao
                      ? parcela.descontoAntecipacaoQuitacao.toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </td>
                <td>
                  {{
                    parcela.encargos
                      ? parcela.encargos.toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </td>
                <td>
                  {{
                    parcela.valorPago
                      ? parcela.valorPago.toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </td>
                <td>
                  {{
                    parcela.dataPagamento
                      ? parcela.dataPagamento.toDateDDMMYYYY()
                      : "-"
                  }}
                </td>
              </tr>
            </tbody>
          </table>

          <table id="simple_table2">
            <thead>
              <tr>
                <th>VALOR TOTAL:</th>
                <th>TOTAL DE ENCARGOS:</th>
                <th>TOTAL DE DESCONTO:</th>
                <th>VALOR TOTAL PAGO:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {{
                    antecipacao.valorTotalParcela
                      ? antecipacao.valorTotalParcela.toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </td>
                <td>
                  {{
                    antecipacao.totalEncargos
                      ? antecipacao.totalEncargos.toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </td>
                <td>
                  {{
                    antecipacao.totalDescontoAntecipacaoQuitacao
                      ? antecipacao.totalDescontoAntecipacaoQuitacao.toMoeda(
                          true
                        )
                      : new Number(0).toMoeda(true)
                  }}
                </td>
                <td>
                  {{
                    antecipacao.valorTotalPago
                      ? antecipacao.valorTotalPago.toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </td>
              </tr>
            </tbody>
          </table>

          <table id="simple_table3">
            <thead>
              <tr>
                <th>____________________________________________</th>
                <th>____________________________________________</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  Empresa:
                  {{
                    `${antecipacao.contratoEmpresaNome} \ ${antecipacao.cnpjContratoEmpresa} `
                  }}
                </td>
                <td>
                  Cliente:
                  {{ `${antecipacao.clienteNome} \ ${antecipacao.clienteCPF}` }}
                </td>
              </tr>
            </tbody>
          </table>
        </center>
      </div>
    </v-card>
  </v-dialog>
</template> 
 
<script lang="ts">
import { PageBase } from "@/core/models/shared";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import * as jsonpatch from "fast-json-patch";
import {
  ContratoService,
  EmpreendimentoService,
  TipoProcessoJudicialService,
} from "@/core/services/cadastros";
import {
  Contrato,
  DocumentoContrato,
  EnumTipoOperacaoFinanceira,
  TipoProcessoJudicial,
  Unidade,
} from "@/core/models/cadastros";
import {
  Receita,
  ReceitaParcela,
  EnumTipoReceita,
  AnteciparDocumento,
  Despesa,
  DespesaParcela,
} from "@/core/models/financeiro";
import {
  DespesaService,
  ReceitaService,
  SituacaoReceitaParcelaService,
} from "@/core/services/financeiro";
import {
  SituacaoColor,
  FormatarNumeroTelefone,
  TratarErroApi,
  ConstruirQueryParams,
} from "@/assets/scripts/helper";
import { Documento } from "@/core/models/geral";
import * as jsPDF from "jspdf";
import "jspdf-autotable";
import { ArquivoService } from "@/core/services/geral/ArquivoService";

@Component
export default class CadastroContrato extends PageBase {
  @Prop() public item!: Contrato;
  @Prop() public clienteNome?: string;
  @Prop() public value!: string;

  comprovante = new Documento();
  receitaAgruparAntecipar = new Receita();
  receitaConfig = new Receita();
  simulacao = new Receita();
  gerenciador = new Contrato();
  contratoDocumento = new Contrato();
  service = new ContratoService();
  receitaService = new ReceitaService();
  serviceTipoProcesso = new TipoProcessoJudicialService();
  inputDocumento: any = null;
  documento = new DocumentoContrato();
  contrato = new Contrato();

  parcela = new ReceitaParcela();
  tipoProcesso = new TipoProcessoJudicial();
  receitaGerenciada = new Receita();
  receitaEncargo = new Receita();
  receitaServico: any = new Receita();
  contratoQuitacao = new Receita();

  parcelaBaixaRetroativa = new ReceitaParcela();
  antecipacao = new AnteciparDocumento();
  unidadeItem = new Contrato();
  detalhar = new Contrato();

  listaSituacao = [];

  overlayDocumentos = false;
  ativarEditorUnidades = false;
  dialogDetalhar = false;
  dialogParcela = false;
  dialogAjusteAmortizacao = false;
  dialogEncargosDescontos = false;
  dialogDespesaContratual = false;
  dialogAgruparAntecipar = false;
  dialogConfigurarReceita = false;
  dialogSimular = false;
  loading = false;
  dialogBaixasRetroativa = false;
  dialogBaixar = false;
  dialogQuitarContrato = false;
  dialogSplit = false;

  dialogDataSequencia = false;
  dialogGerencial = false;
  dialog = false;
  overlay = false;

  tabActive: any = null;
  subTabActive = null;
  page = 1;

  filtroAtivo: any = null;

  snack = false;
  snackColor = "";
  snackText = "";

  options: any = {
    itemsPerPage: -1,
  };

  optionsDocumentos = {
    itemsPerPage: 5,
  };

  observer!: jsonpatch.Observer<Contrato>;

  parcelasComissoes: any[] = [];

  pegarParcelasComissoes(despesas: Despesa[]): any[] {
    const parcelas: any[] = [];
    despesas.forEach((d) => {
      d.parcelas.forEach((p) => {
        parcelas.push(p);
      });
    });
    return parcelas;
  }

  pegarDespesasComissoes(despesas: Despesa[]) {
    const despesaComissao = {
      quantidade: 0,
      saldo: 0,
      totalPago: 0,
      parcelas: 0,
      documento: "",
      valorParcela: 0,
    };
    despesas.forEach((d) => {
      (despesaComissao.quantidade += d.quantidadeParcela),
        (despesaComissao.documento = d.numeroDocumento),
        (despesaComissao.valorParcela = d.valorParcelaAtual),
        (despesaComissao.parcelas += d.quantidadeParcela);
      despesaComissao.saldo += d.saldo;
      despesaComissao.totalPago += d.totalPagoParcelas;
    });
    return despesaComissao;
  }

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
    if (this.dialog) {
      this.observer = jsonpatch.observe(this.gerenciador);
    }
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    } else {
      this.gerenciador = this.item;
      this.gerenciador.receitas = this.item.receitas.sort(
        (x, y) => x.tipoId - y.tipoId
      );
    }
  }

  @Watch("gerenciador", { deep: true })
  ObservadorItem() {
    this.observer = jsonpatch.observe(this.gerenciador);
  }

  @Watch("contratoDocumento", { deep: true })
  ContratoDocumento() {
    this.observer = jsonpatch.observe(this.contratoDocumento);
  }

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nº", value: "parcela" },
    {
      text: "Valor da parcela",
      value: "valor",
      align: "center",
      sortable: false,
    },
    {
      text: "Outras Taxas",
      value: "valoresAdicionais.taxaBoleto",
      align: "center",
      sortable: false,
    },
    {
      text: "Encargos",
      value: "totalEncargos",
      align: "center",
      sortable: false,
    },
    {
      text: "Valor pago",
      value: "valorPago",
      align: "center",
      sortable: false,
    },
    {
      text: "Situação",
      value: "situacao.nome",
      align: "center",
      sortable: false,
    },
    {
      text: "Venc. original",
      value: "dataVencimentoOriginal",
      align: "center",
      sortable: false,
    },
    { text: "Venc. Atual", value: "dataVencimento", align: "center" },
    { text: "Boleto", value: "urlBoleto", align: "center", sortable: false },
    //{text: "Gerado por", value: "ultimaTransacao", align: "center",sortable: false},
    {
      text: "Data de Pagamento",
      value: "ultimaDataPagamento",
      align: "center",
      sortable: false,
    },
    {
      text: "Forma de Pagamento",
      value: "ultimaFormaPagamento",
      align: "center",
      sortable: false,
    },
  ];

  headersComissao: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nº", value: "parcela" },
    {
      text: "Valor da parcela",
      value: "valor",
      align: "center",
      sortable: false,
    },
    {
      text: "Corretor",
      value: "corretorNome",
      align: "center",
      sortable: false,
    },
    {
      text: "Encargos",
      value: "totalEncargos",
      align: "center",
      sortable: false,
    },
    {
      text: "Valor pago",
      value: "valorPago",
      align: "center",
      sortable: false,
    },
    {
      text: "Situação",
      value: "situacao.nome",
      align: "center",
      sortable: false,
    },
    {
      text: "Venc. original",
      value: "dataVencimentoOriginal",
      align: "center",
      sortable: false,
    },
    { text: "Venc. Atual", value: "dataVencimento", align: "center" },
    { text: "Boleto", value: "urlBoleto", align: "center", sortable: false },
    //{text: "Gerado por", value: "ultimaTransacao", align: "center",sortable: false},
    {
      text: "Data pgt",
      value: "ultimaDataPagamento",
      align: "center",
      sortable: false,
    },
    {
      text: "Forma pgt",
      value: "ultimaFormaPagamento",
      align: "center",
      sortable: false,
    },
  ];

  headersDocumentos: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome", align: "center", sortable: false },
    { text: "Arquivo", value: "dados", align: "center", sortable: false },
    { text: "Data", value: "dataEmissao", align: "center", sortable: false },
    {
      text: "Usuário",
      value: "usuario.login",
      align: "center",
      sortable: false,
    },
  ];

  filtrarParcelas(parcelas) {
    if (this.filtroAtivo === null) {
      return parcelas;
    }
    return parcelas.filter(
      (parcela) => parcela.situacaoId === this.filtroAtivo
    );
  }

  SimularAmortizacao(item) {
    this.receitaService.ObterPorId(item.id, "Parcelas").then((res) => {
      this.simulacao = res.data;
      this.dialogSimular = true;
    });
  }

  ConfigurarReceita(item) {
    this.receitaService.ObterPorId(item.id).then((res) => {
      this.receitaConfig = res.data;
      this.dialogConfigurarReceita = true;
    });
  }

  async AtualizarContrato(payloadCharges?: any) {
    this.loading = true;

    if (payloadCharges) {
      this.item.receitas = this.item.receitas.map((income: Receita) => {
        if (income.id === payloadCharges.receitaId) {
          return {
            ...income,
            encargoFinanceiro: payloadCharges.encargoFinanceiro,
          };
        } else {
          return income;
        }
      });
    }

    await this.service
      .ObterPorId(
        this.gerenciador.id,
        "Despesas.Parcelas.Baixas.FormaPagamento,Despesas.Parcelas.Situacao,Despesas.Fornecedor, ContratosDigitais.Signatarios.Cliente, ContratosDigitais.Signatarios.Situacao,ContratosDigitais.Tipo,ContratosDigitais.Situacao, TipoAmortizacao, Receitas.Parcelas.AntecipacaoComprovante, Observacoes, Receitas.Parcelas.Situacao, Receitas.Parcelas.Transacoes.UsuarioBoletoGerado, Receitas.Parcelas.Baixas.FormaPagamento,Receitas.Tipo, Receitas.Parcelas.Baixas.ReceitaBaixaComprovante,TipoIndice"
      )
      .then(
        (res) => {
          this.gerenciador = res.data;
          this.gerenciador.receitas = res.data.receitas.sort(
            (x, y) => x.tipoId - y.tipoId
          );
          this.loading = false;
        },
        (err) => {
          TratarErroApi(err), (this.loading = false);
        }
      );
  }

  Salvar() {
    this.overlay = !this.overlay;
    this.observer = jsonpatch.observe(this.gerenciador);
    let pacthModel = jsonpatch.generate(this.observer);

    this.service.Patch(pacthModel, this.gerenciador.id).then(
      (res) => {
        this.$swal(
          "Aviso",
          "Operação realizada com sucesso!",
          res.status == 201 || res.status == 200 ? "success" : "warning"
        );
        this.$emit("salvou");

        jsonpatch.unobserve(this.gerenciador, this.observer);
        this.AtualizarContrato();
        this.overlay = false;
      },
      (err) => {
        TratarErroApi(err);
        this.overlay = false;
      }
    );
  }

  Close() {
    this.filtroAtivo = 1;
    this.subTabActive = null;
    this.tabActive = 0;
    this.contratoDocumento = new Contrato();
    this.overlay = false;
    this.dialog = false;
    this.Reset();
  }

  ObterContrato() {
    this.service.ObterContratoDetalhado(this.gerenciador.id).then((res) => {
      this.detalhar = res.data;
      this.dialogDetalhar = true;
    });
  }

  async GerarServico() {
    let servico = this.gerenciador.receitas.find(
      (x) => x.tipoId == EnumTipoReceita.Outros
    );

    if (servico) {
      const res = await new ReceitaService().ObterPorId(servico.id, "Parcelas");
      this.receitaServico = res.data;
    } else {
      const res = await this.service.ObterPorId(
        this.item.id,
        "Clientes.Cliente"
      );
      this.receitaServico = new Receita();

      const primeiroCliente = res.data.clientes[0];
      this.receitaServico.clienteId = primeiroCliente.clienteId;
      this.receitaServico.tipoId = 9;
      this.receitaServico.contratoId = this.item.id;
      this.receitaServico.tipoGatewayId = this.item.tipoGatewayId;
      this.receitaServico.tipoDocumentoId = 1;
      this.receitaServico.empreendimentoId = this.item.empreendimentoId;
      this.receitaServico.tipoGatewayId = this.item.tipoGatewayId;
      this.receitaServico.tipoOperacaoId = this.item.tipoOperacaoId;
      this.receitaServico.contaCorrenteId = this.item.contaCorrenteId;
    }

    this.dialogDespesaContratual = true;
  }

  EncargosEDescontos(receitaId: number) {
    new ReceitaService().ObterPorId(receitaId).then((res) => {
      this.receitaEncargo = res.data;
      this.receitaEncargo.tipoAmortizacaoId = this.item.tipoAmortizacaoId;
      this.receitaEncargo.encargoFinanceiro =
        this.gerenciador.encargoFinanceiro;
      this.dialogEncargosDescontos = true;
    });
  }

  AjustarParcela(item) {
    this.receitaService
      .ObterParcelaPorId(item.id, "Receita.Contrato")
      .then((res) => {
        this.parcela = res.data;
        this.parcela.dataVencimento = new Date(
          res.data.dataVencimento
        ).yyyymmdd();
        this.dialogAjusteAmortizacao = true;
      });
  }

  EditarParcela(item) {
    this.receitaService
      .ObterParcelaPorId(item.id, "Receita.Contrato, Transacoes")
      .then((res) => {
        this.parcela = res.data;
        this.parcela.dataVencimento = new Date(
          res.data.dataVencimento
        ).yyyymmdd();
        this.dialogParcela = true;
      });
  }

  BaixarParcela(item) {
    this.parcela = item;
    this.dialogBaixar = true;
  }

  RemoverSplit(item) {
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja remover o split dessa parcela?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.receitaService.RemoverSplit(item.id).then(
          (res) => {
            if (res.status == 200) {
              this.AtualizarContrato();
              return res;
            }
          },
          (err) => TratarErroApi(err)
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
      }
    });
  }

  AdicionarSplit(item) {
    this.receitaService
      .ObterParcelaPorId(item.id, "Receita.Contrato, Transacoes")
      .then(
        (res) => {
          this.parcela = res.data;
          this.parcela.dataVencimento = new Date(
            res.data.dataVencimento
          ).yyyymmdd();
          this.dialogSplit = true;
        },
        (err) => {
          TratarErroApi(err);
        }
      );
  }

  GerarBoleto(item) {
    if (item.encargoFinanceiro.descontoVencimento > 0) {
      let calc = new Date(item.dataVencimento).getTime() - new Date().getTime();
      let diasAtrasos = calc / (1000 * 3600 * 24);

      if (
        Math.ceil(diasAtrasos) < item.encargoFinanceiro.diasDescontoVencimento
      )
        return this.$swal(
          "Aviso",
          "Não é possivel gerar o boleto pois a data de limite de desconto foi excedida. É necessário realizar uma das seguintes ações: Extender a data de vencimento, zerar o desconto ou zerar os dias.",
          "warning"
        );
    }

    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja gerar o boleto?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.receitaService.GerarBoleto(item.id).then(
          (res) => {
            if (res.status == 200) {
              this.AtualizarContrato();
              return res;
            }
          },
          (err) => TratarErroApi(err)
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
      }
    });
  }

  VisualizarBoleto(item) {
    this.receitaService.ObterParcelaPorId(item.id, "Transacoes").then(
      (res) => {
        let ultimaTransacao = res.data.ultimaTransacao;
        if (item.tipoOperacaoId === EnumTipoOperacaoFinanceira.Boleto) {
          this.abrirUrlNoNovaJanela("financeiroBoleto", {
            transacaoId: ultimaTransacao.id,
          });
        } else if (item.tipoOperacaoId === EnumTipoOperacaoFinanceira.Gateway) {
          if (item.tipoGatewayId === 3) {
            this.abrirUrlNoNovaJanela("RelBoletoSafra", {
              codigoZoop: item.codigoZoop,
            });
          } else {
            window.open(item.urlBoleto, "_blank");
          }
        } else if (item.tipoOperacaoId === EnumTipoOperacaoFinanceira.Banco) {
          this.DownloadDocumento(item.id);
        }
      },
      (err) => {
        TratarErroApi(err);
      }
    );
  }

  abrirUrlNoNovaJanela(nomeRota, queryParams) {
    let routeLink = this.$router.resolve({
      name: nomeRota,
      query: ConstruirQueryParams(queryParams),
    });
    window.open(routeLink.href, "_blank");
  }

  CancelarBoleto(item) {
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja cancelar o Boleto?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.receitaService.CancelarBoleto(item.id).then(
          (res) => {
            if (res.status == 200) {
              this.AtualizarContrato();
              return res;
            }
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
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
      }
    });
  }

  CancelarBoletoForcado(item) {
    this.$swal({
      title: "Atenção!",
      text: "Essa opção excluí o boleto do nosso sistema completamente. Só utilize essa função se tem certeza que o boleto foi cancelado na instituição financeira onde ele foi registrado. Tem certeza que deseja prosseguir e excluir o Boleto?",
      icon: "warning",
      iconColor: "red",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.receitaService.CancelarBoletoForcado(item.id).then(
          (res) => {
            if (res.status == 200) {
              this.AtualizarContrato();
              return res;
            }
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
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
      }
    });
  }

  CancelarParcela(item) {
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja cancelar a parcela?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.receitaService.CancelarParcela(item.id).then(
          (res) => {
            if (res.status == 200) {
              this.AtualizarContrato();
              return res;
            }
          },
          (err) => TratarErroApi(err)
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
      }
    });
  }

  EnviarWhatsapp(item) {
    this.service.ObterPorId(this.item.id, "Clientes.Cliente").then((res) => {
      let contrato = res.data;
      var telefone = FormatarNumeroTelefone(
        contrato.clientes[0].cliente!.telefone
      );

      window.open(
        `https://api.whatsapp.com/send?phone=55${telefone}&text=Olá, Segue a baixo o link do seu boleto: ${item.urlBoleto} Ou se preferir, para maior comodidade segue o código do boleto:  ${item.linhaDigitavelBoleto}`
      );
    });
  }

  DataSequencia(item) {
    this.parcela = item;
    this.dialogDataSequencia = true;
  }

  Quitar(item) {
    new ReceitaService().ObterPorId(item.id, "Parcelas, Contrato").then(
      (res) => {
        this.contratoQuitacao = res.data;
        this.dialogQuitarContrato = true;
      },
      (err) => {
        TratarErroApi(err);
      }
    );
  }

  Reset() {
    this.gerenciador = new Contrato();
    this.antecipacao = new AnteciparDocumento();
  }

  AgruparAntecipar(item) {
    new ReceitaService()
      .ObterPorId(item.id, "Contrato, Cliente, Parcelas.Baixas")
      .then((res) => {
        this.receitaAgruparAntecipar = res.data;
        this.receitaAgruparAntecipar.parcelas = res.data.parcelas.filter(
          (x) =>
            x.agrupadorId == null &&
            x.situacaoId != 3 &&
            x.situacaoId != 2 &&
            x.isAgrupador == false
        );
        this.dialogAgruparAntecipar = true;
      });
  }

  SituacaoColor(item) {
    return SituacaoColor(item);
  }

  getDocumentos(atualizar = false) {
    if (this.contratoDocumento.documentos.length == 0 || atualizar) {
      this.overlayDocumentos = true;

      this.service
        .ObterPorId(this.gerenciador.id, "Documentos.Usuario")
        .then((res) => {
          this.contratoDocumento = res.data;
          this.overlayDocumentos = false;
        });
    }
  }

  SalvarDoc() {
    this.observer = jsonpatch.observe(this.contratoDocumento);
    let pacthModel = jsonpatch.generate(this.observer);

    this.service.Patch(pacthModel, this.contratoDocumento.id).then((res) => {
      this.$swal(
        "Aviso",
        "Operação realizada com sucesso!",
        res.status == 201 || res.status == 200 ? "success" : "warning"
      );
      this.$emit("salvou");
      jsonpatch.unobserve(this.contratoDocumento, this.observer);
      this.getDocumentos(true);
    });
  }

  async AdicionarArquivo() {
    if (!this.inputDocumento) {
      this.$swal("Aviso", "É necessário selecionar um arquivo.", "warning");
      return;
    }
    let dados = await new ArquivoService().Ler(this.inputDocumento);
    this.documento.usuarioId = JSON.parse(
      localStorage.sessionApp.split(".")
    ).dados.usuarioId;
    this.documento.dataEmissao = new Date().yyyymmdd();
    this.documento.dados = dados.replace(/^[^,]*,/, "");
    this.documento.nome =
      this.documento.nome != ""
        ? this.documento.nome
        : this.inputDocumento.name;
    this.documento.tamanho = this.inputDocumento.size;
    this.documento.tipo = this.inputDocumento.type;
    this.contratoDocumento.documentos.push(this.documento);
    this.documento = new DocumentoContrato();
    this.inputDocumento = null;
    this.SalvarDoc();
  }

  ExcluirDocumento(documento: any) {
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
        if (documento.id > 0) {
          documento.excluido = true;
          const index = this.contratoDocumento.documentos!.indexOf(documento);
          delete this.contratoDocumento.documentos![index];
          this.dialog = false;
          this.dialog = true;
          return true;
        } else {
          const index = this.contratoDocumento.documentos!.indexOf(documento);
          this.contratoDocumento.documentos!.splice(index, 1);
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
        this.SalvarDoc();
      }
    });
  }

  BaixarArquivo(item) {
    new ArquivoService().Download(item);
  }

  CompartilharArquivo(item) {
    new ArquivoService().Compartilhar(item);
  }

  GerarComprovante(item) {
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que desejar gerar o Comprovante?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.receitaService.GerarDocumentoAntecipacao(item.id).then(
          (res) => {
            if (res.status == 200) {
              this.antecipacao = res.data;
              setTimeout(() => {
                this.BaixarComprovante(item);
              }, 1000);

              this.AtualizarContrato();
              return res;
            }
          },
          (err) => {
            TratarErroApi(err);
          }
        );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value) {
        this.$swal(
          "Aviso",
          result.value.data,
          result.value.status == 200 ? "success" : "warning"
        );
      }
    });
  }

  BaixaRetroativa(item) {
    new ReceitaService().ObterParcelaPorId(item.id).then(
      (res) => {
        this.parcelaBaixaRetroativa = res.data;
        this.dialogBaixasRetroativa = true;
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
    );
  }

  BaixarComprovante(item) {
    const doc = new jsPDF.default();
    var y = 20;
    doc.setLineWidth(2);
    (doc as any)
      .text(60, (y = y + 15), "COMPROVANTE DE QUITAÇÃO")
      .autoTable({
        html: "#simple_table4",
        startY: 50,
        theme: "grid",
      })
      .autoTable({
        html: "#simple_table",
        theme: "grid",
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25 },
        },
      })
      .autoTable({
        html: "#simple_table2",
        theme: "grid",
        styles: {
          fillColor: false,
          textColor: "#191919",
        },
      })
      .autoTable({
        html: "#simple_table3",
        theme: "grid",
        styles: {
          fillColor: false,
          textColor: "#000000",
        },
      });

    doc.save("comprovante.pdf");
    var file = doc.output("datauristring");
    var url = file.replace(
      "data:application/pdf;filename=generated.pdf;base64,",
      ""
    );
    doc.output("dataurlnewwindow");

    this.comprovante.dados = url;
    this.receitaService
      .SalvarDocumento(item.antecipacaoComprovante.id, this.comprovante)
      .then(
        (res) => {
          this.$swal("Aviso", "Operação realizada com sucesso!", "success");
        },

        (err) => TratarErroApi(err)
      );
  }

  VisualizarComprovante(item) {
    this.receitaService
      .VisualizarDocumentoAntecipacao(item.antecipacaoComprovante.id)
      .then(
        (res) => {
          var url = "data:application/pdf;base64," + res.data;
          var iframe =
            "<iframe width='100%' height='100%' src='" + url + "'></iframe>";
          var x: any = window.open();
          x.document.open();
          x.document.write(iframe);
          x.document.close();
          document.location.href = url;
        },
        (err) => {
          TratarErroApi(err);
        }
      );
  }

  mesReajuste = [
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

  DownloadDocumento(id: number) {
    this.loading = true;
    this.receitaService
      .DownloadDocumento(id)
      .then(
        (res) => {
          let file = new Blob([res.data], {
            type: res.headers["content-type"],
          });
          let fileURL = URL.createObjectURL(file);
          window.open(fileURL);
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
      .finally(() => (this.loading = false));
  }

  obterLoginUsuario(item) {
    if (item.ultimaTransacao && (item.urlBoleto || item.linhaDigitavelBoleto)) {
      if (item.ultimaTransacao.usuarioBoletoGerado) {
        return item.ultimaTransacao.usuarioBoletoGerado.login;
      } else {
        return "-";
      }
    }
    return "-";
  }

  /* DESPESA */
  parcelaDespesa = new DespesaParcela();
  dialogParcelaDespesa = false;
  dialogBaixarDespesa = false;

  BaixarParcelaDespesa(item) {
    new DespesaService()
      .ObterParcelaPorId(item.id, "Despesa, Baixas")
      .then((res) => {
        this.parcelaDespesa = res.data;
        this.parcelaDespesa.dataVencimento = new Date(
          res.data.dataVencimento
        ).yyyymmdd();
        this.dialogBaixarDespesa = true;
      });
  }

  EditarParcelaDespesa(item) {
    new DespesaService().ObterParcelaPorId(item.id, "").then((res) => {
      this.parcelaDespesa = res.data;
      this.dialogParcelaDespesa = true;
    });
  }

  mounted() {
    new SituacaoReceitaParcelaService().ListarTudo().then((res) => {
      this.listaSituacao = res.data.items;
    });
  }
}
</script> 