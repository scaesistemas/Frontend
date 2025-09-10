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

        <v-toolbar-title>Detalhar Contrato</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            dark
            text
            @click="openModal()"
            v-if="item.reserva && item.situacaoId == 9"
            >Devolver Proposta</v-btn
          >
          <v-dialog v-model="dialogCancelar" max-width="500">
            <v-card>
              <v-toolbar flat>
                <v-btn color="primary" icon dark @click="dialogCancelar = false"
                  ><v-icon>mdi-close</v-icon></v-btn
                >
                <v-toolbar-title>Devolver Proposta</v-toolbar-title>
                <v-spacer />

                <v-toolbar-items>
                  <v-btn color="primary" dark text @click="confirmCancelar()"
                    >Salvar</v-btn
                  >
                </v-toolbar-items>
              </v-toolbar>

              <v-card-text class="pt-3">
                <span class="font-weight-bold">Informe o motivo</span>
                <v-textarea
                  outlined
                  v-model="motivoRejeicao"
                  required
                ></v-textarea>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn
            dark
            text
            @click="dialogAprovar = true"
            v-if="item.reserva && item.situacaoId == 9"
            >Aprovar</v-btn
          >
          <v-btn dark text @click="Salvar()" v-else>Salvar</v-btn>
        </v-toolbar-items>

        <template v-slot:extension>
          <v-tabs v-model="tabActive" background-color="primary" dark>
            <v-tab>Contrato</v-tab>
            <v-tab>Financeiro</v-tab>
            <v-tab>Corretor</v-tab>
            <v-tab>Observação</v-tab>
            <v-tab @click="getDocumentos()">Documentos</v-tab>
            <v-tab>Histórico</v-tab>
            <v-tab v-if="item.tipoProcessoJudicialId > 0">Jurídico</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items v-model="tabActive">
        <v-tab-item>
          <v-card elevation="1">
            <v-card-text>
              <v-card-title>
                <v-icon large left color="primary">mdi-information</v-icon>
                <span class="title-span">Informação do Contrato</span>
              </v-card-title>
              <v-list two-line>
                <v-list-item>
                  <v-row dense no-gutters>
                    <v-col
                      cols="12"
                      md="12"
                      v-if="item.clientes && item.clientes.length > 0"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{
                          item.clientes.length > 1 ? "Clientes" : "Cliente"
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-col>

                    <v-col
                      cols="12"
                      md="4"
                      v-for="x in item.clientes"
                      :key="x.id"
                    >
                      <v-list-item-content>
                        <v-list-item-subtitle class="text-subtitle-1">
                          <span>Nome: </span> {{ x.cliente.nome }}
                        </v-list-item-subtitle>

                        <v-list-item-subtitle
                          class="text-subtitle-1"
                          v-if="x.cliente"
                        >
                          <span> Cpf/Cnpj: {{ x.cliente.cnpjCpf }} </span>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>
              <v-list two-line>
                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title
                          >Número do contrato</v-list-item-title
                        >
                        <v-list-item-subtitle>{{
                          item.numero
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <!-- <v-col cols="12" md="4" v-if="item.clientes[0]"> 
                          <v-list-item-content>
                            <v-list-item-title>Cliente</v-list-item-title>
                            <v-list-item-subtitle>{{ item.clientes[0].cliente ?   item.clientes[0].cliente.nome : '-'}}</v-list-item-subtitle>   
                          </v-list-item-content>
                        </v-col>     -->

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Empresa</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.empresa ? item.empresa.nome : "Não cadastrado."
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider />

                <v-list-item v-if="item.unidadePrincipal">
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Empreendimento</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.empreendimento
                            ? item.empreendimento.nome
                            : "Não cadastrado."
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Grupo</v-list-item-title>
                        <v-list-item-subtitle
                          >{{
                            item.unidadePrincipal
                              ? item.unidadePrincipal.grupo.nome
                              : "Não cadastrado."
                          }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Unidade</v-list-item-title>
                        <v-list-item-subtitle
                          >{{
                            item.unidadePrincipal
                              ? item.unidadePrincipal.nome
                              : "Não cadastrado."
                          }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider />

                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Valor Financiado</v-list-item-title>
                        <v-list-item-subtitle>
                          {{
                            item.valor
                              ? Number(item.valor).toMoeda(true)
                              : new Number(0).toMoeda(true)
                          }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Data do contrato</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.data.toDateDDMMYYYY() }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title> Tipo </v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.tipoProduto
                            ? item.tipoProduto.nome
                            : "Não cadastrado."
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>

                <v-divider />
                <v-list-item>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title> Total Pago </v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.totalPagoGeral
                            ? Number(item.totalPagoGeral).toMoeda(true)
                            : ""
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title> Valor Restante </v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.saldoGeral
                            ? Number(item.saldoGeral).toMoeda(true)
                            : ""
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title> Valor Total </v-list-item-title>
                        <v-list-item-subtitle>{{
                          Number(item.saldoGeral + item.totalPagoGeral).toMoeda(
                            true
                          )
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>

                <v-divider />

                <v-list-item v-if="item.tipoAditamento">
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title> Tipo Aditamento </v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.tipoAditamento.nome
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <v-card elevation="1">
            <v-card-text>
              <v-card-title>
                <span class="title-span">Prazos</span>
              </v-card-title>

              <v-list two-line>
                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title> Mês de Reajuste </v-list-item-title>
                        <v-list-item-subtitle>{{
                          mesReajuste.find((x) => x.id == item.mesReajuste)
                            ? mesReajuste.find((x) => x.id == item.mesReajuste)
                                .nome
                            : ""
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>
                          Índice de Reajuste
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{
                            item.tipoIndice
                              ? item.tipoIndice.nomeEditavel
                              : "Não cadastrado."
                          }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>Melhor dia</v-list-item-title>
                        <v-list-item-subtitle
                          >{{ item.melhorDia }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>

                <v-divider />
                <v-list-item>
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title> 1º Vencimento </v-list-item-title>
                        <v-list-item-subtitle v-if="item.receitas[0]">{{
                          new Date(
                            item.receitas[0].primeiroVencimento
                          ).ddmmyyyy()
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title> Parcelas Pagas </v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.quantidadeParcelasPagasGeral
                            ? item.quantidadeParcelasPagasGeral
                            : "Não cadastrado."
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>
                          Parcelas Restantes
                        </v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.quantidadeParcelasAPagar
                            ? item.quantidadeParcelasAPagar
                            : "Não cadastrado."
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>

                <v-divider />
                <v-list-item>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>
                          Total de Parcelas
                        </v-list-item-title>
                        <v-list-item-subtitle>{{
                          (totalParcelas =
                            item.quantidadeParcelasAPagar +
                            item.quantidadeParcelasPagasGeral)
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-list-item-content>
                        <v-list-item-title>
                          Ano do primeiro reajuste
                        </v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.anoPrimeiroReajuste
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card outlined>
            <v-card-text>
              <v-toolbar outlined color="transparent" dense height="2px">
                <template v-slot:extension>
                  <v-tabs v-model="subTabActive">
                    <v-tab v-for="item in item.receitas" :key="item.titulo">{{
                      item.tipo.nome
                    }}</v-tab>
                  </v-tabs>
                </template>
              </v-toolbar>

              <v-tabs-items v-model="subTabActive">
                <v-tab-item v-for="item in item.receitas" :key="item.titulo">
                  <v-card flat>
                    <v-card-text>
                      <v-list two-line>
                        <v-list-item>
                          <v-row dense class="pt-3">
                            <v-spacer></v-spacer>
                            <div>
                              <v-btn
                                @click="EditarReceita(item)"
                                color="primary"
                              >
                                <v-icon small left>mdi-pencil</v-icon> Gerenciar
                                Receita</v-btn
                              >
                            </div>
                          </v-row>
                        </v-list-item>
                      </v-list>
                    </v-card-text>

                    <v-data-table
                      :headers="headers"
                      :items="item.parcelas"
                      :options.sync="options"
                      class="elevation-1"
                      :footer-props="{ showFirstLastPage: true }"
                      item-key="id"
                      sort-by="parcela"
                    >
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon
                              @click="BaixarParcela(item)"
                              v-on="on"
                              :disabled="
                                item.situacaoId != 3 || item.situacaoId != 7
                              "
                            >
                              <template>mdi-cash-check</template>
                            </v-icon>
                          </template>
                          <span>Visualizar as baixas</span>
                        </v-tooltip>
                      </template>

                      <template v-slot:[`item.parcela`]="{ item }">
                        {{ item.parcela }}
                      </template>

                      <template v-slot:[`item.valor`]="{ item }">
                        {{
                          item.valor
                            ? Number(item.valor).toMoeda(true)
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

                      <template v-slot:[`item.saldo`]="{ item }">
                        {{
                          item.saldo
                            ? Number(item.saldo).toMoeda(true)
                            : new Number(0).toMoeda(true)
                        }}
                      </template>

                      <template v-slot:[`item.situacaoId`]="{ item }">
                        <v-chip :color="SituacaoColor(item)">
                          {{ item.situacao ? item.situacao.nome : "" }}
                        </v-chip>
                      </template>

                      <template v-slot:[`item.dataVencimento`]="{ item }">
                        {{ item.dataVencimento.toDateDDMMYYYY() }}
                      </template>

                      <template
                        v-slot:[`item.dataVencimentoOriginal`]="{ item }"
                      >
                        {{ item.dataVencimentoOriginal.toDateDDMMYYYY() }}
                      </template>

                      <template v-slot:[`item.ultimaDataPagamento`]="{ item }">
                        {{
                          item.ultimaDataPagamento
                            ? item.ultimaDataPagamento.toDateDDMMYYYY()
                            : "-"
                        }}
                      </template>

                      <template v-slot:[`item.ultimaFormaPagamento`]="{ item }">
                        {{
                          item.ultimaFormaPagamento
                            ? item.ultimaFormaPagamento
                            : "-"
                        }}
                      </template>
                    </v-data-table>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card outlined>
            <v-card-text>
              <br />
              <v-form
                v-model="validCorretor"
                lazy-validation
                ref="formCorretor"
              >
                <v-row dense>
                  <!-- Seleção de Corretor -->
                  <v-col cols="12" sm="5">
                    <span class="font-weight-bold">Corretor</span>
                    <v-autocomplete
                      label="Selecione"
                      placeholder="Selecione"
                      outlined
                      v-model="contratoCorretor.corretorId"
                      :items="listaCorretores"
                      clearable
                      item-text="nomeCnpjCpf"
                      item-value="id"
                      dense
                    >
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="2">
                    <span class="font-weight-bold">Percentual da comissão</span>
                    <v-text-field
                      outlined
                      dense
                      v-model="contratoCorretor.percentual"
                      suffix="%"
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <!--  <v-col cols="12" md="1">
                        <span class="font-weight-bold">Qtde Parcela</span>
                        <v-text-field outlined dense  v-model="contratoCorretor.qtdeParcela" type="number"></v-text-field>
                      </v-col>-->

                  <!-- Botão Adicionar -->
                  <v-col cols="12" md="2">
                    <v-btn
                      class="mt-6"
                      color="primary"
                      :disabled="!contratoCorretor.corretorId || !validCorretor"
                      @click="AdicionarCorretor()"
                    >
                      <v-icon left>mdi-plus</v-icon>
                      Adicionar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <v-data-table
                class="elevation-1"
                :headers="headerCorretores"
                :items="item.corretores"
                :footer-props="{ showFirstLastPage: false }"
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
                </template>

                <template v-slot:[`item.corretorId`]="{ item }">
                  {{
                    listaCorretores.find((x) => x.id == item.corretorId)
                      ?.nome || "Não encontrado"
                  }}
                </template>

                <template v-slot:[`item.percentual`]="{ item }">
                  {{ item.percentual }} %
                </template>

                <!-- <template v-slot:[`item.qtdeParcela`] = "{item}">
                  {{ item.qtdeParcela }}  
                </template>   -->
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card outlined>
            <vcard-observacao :lista.sync="item.observacoes" />
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <v-card elevation="1">
            <v-card-text>
              <v-card-title>
                <span class="title-span">Documentos</span>
              </v-card-title>

              <v-row dense class="px-3">
                <v-col cols="12" md="5">
                  <span class="font-weight-bold">Nome do arquivo</span>
                  <v-text-field
                    outlined
                    dense
                    v-model="documento.nome"
                  ></v-text-field>
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
                  ></v-file-input>
                </v-col>

                <v-col cols="12" md="2" class="pt-7">
                  <v-btn color="primary" @click="AdicionarArquivo()">
                    <v-icon left>mdi-plus</v-icon>
                    Adicionar
                  </v-btn>
                </v-col>
              </v-row>

              <v-data-table
                class="elevation-1"
                :options.sync="options"
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
          <v-card elevation="1">
            <vcard-historico :lista.sync="item.historicoSituacoes" />
          </v-card>
        </v-tab-item>

        <v-tab-item v-if="item.tipoProcessoJudicialId > 0">
          <v-card elevation="1">
            <v-card-text>
              <v-card-title>
                <span class="title-span">Jurídico</span>
              </v-card-title>

              <v-card flat>
                <v-col cols="auto">
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        placeholder="Selecione"
                        dense
                        readonly
                        :items="listaTipoProcessos"
                        v-model="item.tipoProcessoJudicialId"
                        item-text="nome"
                        item-value="id"
                        label="Tipo do Processo"
                      ></v-autocomplete>
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-text-field
                        dense
                        v-model="item.numeroProcessoJudicial"
                        label="Número Processo"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-card>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>

      <v-overlay :value="overlay"></v-overlay>
    </v-card>

    <v-dialog v-model="dialogAprovar" max-width="500">
      <v-card>
        <v-toolbar flat>
          <v-btn color="primary" icon dark @click="dialogAprovar = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
          <v-toolbar-title>Aprovar Proposta</v-toolbar-title>
          <v-spacer />

          <v-toolbar-items>
            <v-btn
              color="primary"
              dark
              text
              @click="Aprovar(), (dialogAprovar = false)"
              >Salvar</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text class="pt-3">
          <v-col cols="12" md="12">
            <v-text-field
              v-model="quantidadeParcelas"
              hint="Parcelas de Comissões para o Corretor"
              persistent-hint
              outlined
              dense
              label="Qtde de Parcelas"
              type="number"
            ></v-text-field>
          </v-col>
        </v-card-text>
        <br /><br />
      </v-card>
    </v-dialog>

    <cadastro-receita
      v-model="dialogReceita"
      :item="receita"
      @fechou="dialogReceita = false"
      @salvou="(dialogReceita = false), AtualizarContrato()"
    ></cadastro-receita>
    <parcelabaixa-receita
      :item="parcelaBaixa"
      v-model="dialogBaixaParcela"
      @fechou="dialogBaixaParcela = false"
    />
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import * as jsonpatch from "fast-json-patch";
import {
  ContratoService,
  PessoaService,
  TipoProcessoJudicialService,
} from "@/core/services/cadastros";
import {
  Contrato,
  ContratoCorretor,
  DocumentoContrato,
} from "@/core/models/cadastros";
import Indice from "@/core/models/cadastros/Indice";
import {
  Receita,
  ReceitaParcela,
  EnumTipoReceita,
} from "@/core/models/financeiro";
import { SituacaoColor, TratarErroApi } from "@/assets/scripts/helper";
import { ArquivoService } from "@/core/services/geral/ArquivoService";
import { EmpresaService } from "@/core/services/compras/EmpresaService";
import { ReceitaService } from "@/core/services/financeiro";

@Component
export default class CadastroContrato extends Vue {
  @Prop() public item!: Contrato;
  @Prop() public value!: string;

  service = new ContratoService();
  parcelaBaixa = new ReceitaParcela();
  documento = new DocumentoContrato();
  contratoDocumento = new Contrato();

  parcela = new ReceitaParcela();

  listaCorretores = [];
  validCorretor: boolean = false;
  contratoCorretor = new ContratoCorretor();

  items: any = [];
  listaTipoProcessos = [];
  motivoRejeicao = "";
  dialogBaixaParcela = false;
  overlayDocumentos = false;
  inputDocumento: any = null;
  overlay = false;
  dialog = false;
  dialogCancelar = false;
  subTabActive = null;
  tabActive = 0;

  options: any = {
    itemsPerPage: 15,
  };

  receita = new Receita();
  dialogReceita: boolean = false;

  EditarReceita(item) {
    new ReceitaService()
      .ObterPorId(item.id, "Parcelas.Baixas, Classificacoes, Documentos")
      .then((res) => {
        this.receita = res.data;
        this.receita.dataEmissao = new Date(res.data.dataEmissao).yyyymmdd();
        this.dialogReceita = true;
      });
  }

  AtualizarContrato() {
    this.service
      .ObterPorId(
        this.item.id,
        "TipoAditamento, Receitas.Tipo, Reserva, TipoIndice, TipoProduto,Empresa,Empreendimento, UnidadePrincipal.Grupo, Clientes.Cliente, Corretores.Corretor, Observacoes, Receitas.Parcelas.Situacao, Receitas.Parcelas.Baixas.FormaPagamento, HistoricoSituacoes.Situacao, HistoricoSituacoes.Usuario, Observacoes.Usuario"
      )
      .then((res) => {
        this.item = res.data;
      });
  }

  @Watch("contratoDocumento", { deep: true })
  ContratoDocumento() {
    this.observer = jsonpatch.observe(this.contratoDocumento);
  }

  headerCorretores: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "corretorId" },
    { text: "Percentual", value: "percentual" },
    // { text: "Qtde Parcela", value: "qtdeParcela" },
  ];

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nº", value: "parcela", align: "center", sortable: false },
    { text: "Valor", value: "valor", align: "center", sortable: false },
    { text: "Pago", value: "total", align: "center", sortable: false },
    { text: "Saldo", value: "saldo", align: "center", sortable: false },
    { text: "Situação", value: "situacaoId", align: "center", sortable: false },
    {
      text: "Vencimento",
      value: "dataVencimento",
      align: "center",
      sortable: false,
    },
    {
      text: "Venc. original",
      value: "dataVencimentoOriginal",
      align: "center",
      sortable: false,
    },
    {
      text: "Data pgt.",
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

  headersObservacoes: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Observação", value: "observacao" },
    { text: "Usuário Logado", value: "usuarioId" },
    { text: "Data Hora", value: "dataHora" },
  ];

  observer!: jsonpatch.Observer<Contrato>;

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
    }
  }

  $refs!: {
    formCorretor: HTMLFormElement;
  };

  itemIndex: number = -1;

  AdicionarCorretor() {
    if (this.$refs.formCorretor.validate()) {
      const corretorId = this.contratoCorretor.corretorId;
      const corretorExistente = this.item.corretores.find(
        (x, index) => x.corretorId === corretorId && index !== this.itemIndex
      );
      //  const novoPercentualTotal = this.itemIndex > -1 ? this.item.corretores.reduce((acc, cur, index) => index !== this.itemIndex ? acc + +cur.percentual : acc, 0) + +this.contratoCorretor.percentual : this.item.corretores.reduce((acc, cur) => acc + +cur.percentual, 0) + +this.contratoCorretor.percentual;

      if (corretorExistente)
        return this.$swal(
          "Aviso",
          "Esta pessoa já foi adicionada na lista.",
          "warning"
        );

      // if (novoPercentualTotal > this.percentualcomissao)
      // return this.$swal("Erro!", "Limite de percentual por corretor atingido. O valor máximo é de 100%", "warning");
      this.contratoCorretor.isPercentual = true;
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

  EditarCorretor(item) {
    this.contratoCorretor.isPercentual = true;
    this.contratoCorretor = Object.assign({}, item);
    this.itemIndex = this.item.corretores.indexOf(item);
  }

  openModal() {
    this.dialogCancelar = true;
  }

  confirmCancelar() {
    if (!this.motivoRejeicao) {
      this.$swal("Aviso", "Por favor, informe o motivo da rejeição", "warning");
      return;
    }
    this.dialogCancelar = false;
    this.overlay = !this.overlay;

    this.service
      .CancelarProposta(this.item.id, { observacao: this.motivoRejeicao })
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
      .finally(() => {
        this.overlay = false;
        this.motivoRejeicao = ""; // Reset the reason field
      });
  }

  Close() {
    this.Reset();
    this.overlay = false;
    this.dialog = false;
  }

  BaixarParcela(item) {
    this.parcelaBaixa = item;
    this.dialogBaixaParcela = true;
  }

  Reset() {
    this.contratoDocumento = new Contrato();
    this.tabActive = 0;
    this.quantidadeParcelas = 0;
  }

  SituacaoColor(item: ReceitaParcela) {
    return SituacaoColor(item);
  }

  BaixarArquivo(arquivo) {
    new ArquivoService().Download(arquivo);
  }

  CompartilharArquivo(item) {
    new ArquivoService().Compartilhar(item);
  }

  getDocumentos(atualizar = false) {
    if (this.contratoDocumento.documentos.length == 0 || atualizar) {
      this.overlayDocumentos = true;

      this.service
        .ObterPorId(this.item.id, "Documentos.Usuario")
        .then((res) => {
          this.contratoDocumento = res.data;
          this.overlayDocumentos = false;
        });
    }
  }

  Salvar() {
    this.overlay = !this.overlay;
    this.observer = jsonpatch.observe(this.item);
    let pacthModel = jsonpatch.generate(this.observer);

    this.service
      .Patch(pacthModel, this.item.id)
      .then(
        (res) => {
          this.$swal(
            "Aviso",
            "Operação realizada com sucesso!",
            res.status == 201 || res.status == 200 ? "success" : "warning"
          );
          this.$emit("salvou");
          jsonpatch.unobserve(this.item, this.observer);
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
      .finally(() => {
        this.overlay = false;
      });
  }

  dialogAprovar: boolean = false;
  quantidadeParcelas: number = 0;

  Aprovar() {
    this.Salvar();
    this.service
      .AprovarProposta(this.item.id, this.item, this.quantidadeParcelas)
      .then(
        (res) => {
          this.$swal(
            "Aviso",
            "Operação realizada com sucesso!",
            res.status == 201 || res.status == 200 ? "success" : "warning"
          );
          this.quantidadeParcelas = 0;
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
      );
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

    this.documento.dados = dados.replace(/^[^,]*,/, "");
    this.documento.nome =
      this.documento.nome != ""
        ? this.documento.nome
        : this.inputDocumento.name;
    this.documento.tamanho = this.inputDocumento.size;
    this.documento.tipo = this.inputDocumento.type;
    this.documento.dataEmissao = new Date().yyyymmdd();
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

  empresas = [];

  mounted() {
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
        this.listaCorretores = res.data.items.filter(
          (x: any) => x.isCorretor == true
        );
      });

    new TipoProcessoJudicialService().ListarTudo().then((res) => {
      this.listaTipoProcessos = res.data.items;
    });

    new EmpresaService().ListarTudo().then((res) => {
      this.empresas = res.data.items;
    });
  }
}
class Financiamento {
  public quantidadeParcelas: number = 0;
  public valorPrestacao: string = "";
  public valorAVista: string = "";
  public total: number = 0;
  public primeiroVencimento: string = "";
  public totalPago: number = 0;
  public totalCancelado: number = 0;
  public indice: Indice = new Indice();
  public receita?: Receita;

  constructor(receita: any, indice: Indice = new Indice()) {
    if (receita != null) {
      this.receita = receita;
      this.quantidadeParcelas =
        receita.quantidadeParcela != undefined ? receita.quantidadeParcela : 0;
      this.valorPrestacao = receita.valorParcelaAtual;
      this.valorAVista = receita.valor;
      this.totalPago = receita.totalPagoParcelas;
      this.totalCancelado = receita.totalCanceladoParcelas;
      this.total = receita.valor;
      this.primeiroVencimento = receita.primeiroVencimento;
      this.indice = indice;
    } else {
      this.receita = new Receita();
    }
  }
}
</script>
