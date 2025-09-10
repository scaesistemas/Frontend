<template>
  <v-dialog width="1000" v-model="dialog" no-click-animation>
    <v-card>
      <v-toolbar>
        <v-btn color="primary" icon dark @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title class="title font-weight-regular"
          >Detalhar</v-toolbar-title
        >

        <template v-slot:extension>
          <v-tabs v-model="tab">
            <v-tab>Contrato</v-tab>
            <v-tab>Editar</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-stepper v-model="e6" vertical>
            <v-stepper-step
              color="#676668"
              edit-icon="mdi-account-group-outline"
              editable
              :complete="true"
              step="1"
            >
              Envolvidos
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-card elevation="1" class="mb-12">
                <v-list two-line>
                  <v-list-item>
                    <v-row dense>
                      <v-col cols="12">
                        <v-list-item-content>
                          <v-list-item-title>Empresa</v-list-item-title>
                          <br /><br />
                          <v-list-item-subtitle class="text-subtitle-1">
                            {{ item.empresaNome }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>

                <v-list two-line>
                  <v-list-item>
                    <!-- Clientes -->
                    <v-row dense no-gutters>
                      <v-col
                        cols="12"
                        v-if="item.clientes && item.clientes.length > 0"
                      >
                        <v-list-item-content>
                          <v-list-item-title>Clientes</v-list-item-title>
                        </v-list-item-content>
                      </v-col>

                      <v-col
                        cols="12"
                        md="12"
                        v-for="x in item.clientes"
                        :key="x.id"
                      >
                        <v-list-item-content>
                          <v-list-item-subtitle class="text-subtitle-1">
                            <span class="font-weight-bold">Nome: </span>
                            {{ x.nome }}
                            <v-btn icon @click="EditarCliente(x)">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon small color="primary" v-on="on"
                                    >mdi-eye-outline</v-icon
                                  >
                                </template>
                                <span>Visualizar Cliente</span>
                              </v-tooltip>
                            </v-btn>
                          </v-list-item-subtitle>

                          <v-list-item-subtitle class="text-subtitle-1">
                            <span
                              class="font-weight-bold"
                              v-if="x.cpfCnpj.length > 14"
                            >
                              Cnpj: {{ x.cpfCnpj }}
                            </span>
                            <span class="font-weight-bold" v-else>
                              Cpf: {{ x.cpfCnpj }}</span
                            >
                          </v-list-item-subtitle>

                          <v-list-item-subtitle class="text-subtitle-1">
                            <span class="font-weight-bold"> telefone: </span>
                            {{ x.telefone }} -
                            <span class="font-weight-bold"> Email: </span>
                            {{ x.email }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
              </v-card>

              <v-btn color="primary" @click="e6 = 2">
                Avançar <v-icon small right>mdi-arrow-right</v-icon>
              </v-btn>
            </v-stepper-content>

            <v-stepper-step
              color="#676668"
              edit-icon="mdi-clipboard-text-search-outline"
              editable
              :complete="true"
              step="2"
            >
              Informações do Produto
            </v-stepper-step>

            <v-stepper-content step="2">
              <v-card elevation="1" class="mb-12">
                <v-list two-line>
                  <v-list-item>
                    <v-row dense>
                      <v-col cols="4">
                        <v-list-item-content>
                          <v-list-item-title
                            >Tipo do contrato</v-list-item-title
                          >
                          <br /><br />
                          <v-list-item-subtitle class="text-subtitle-1">
                            {{ item.tipoProdutoNome }}
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
                      <v-col cols="4">
                        <v-list-item-content>
                          <v-list-item-title>Empreendimento</v-list-item-title>
                          <br /><br />
                          <v-list-item-subtitle class="text-subtitle-1">
                            {{ item.empreendimentoNome }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>

                      <v-col cols="4">
                        <v-list-item-content>
                          <v-list-item-title>Grupo</v-list-item-title>
                          <br /><br />
                          <v-list-item-subtitle class="text-subtitle-1">
                            {{ item.grupoNome }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>

                      <v-col cols="4">
                        <v-list-item-content>
                          <v-list-item-title>Unidade</v-list-item-title>
                          <br /><br />
                          <v-list-item-subtitle class="text-subtitle-1">
                            Unidade Principal: {{ item.loteNome }}
                            <v-btn
                              icon
                              @click="ObterUnidade(item.unidadePrincipalId)"
                            >
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon small color="primary" v-on="on"
                                    >mdi-eye-outline</v-icon
                                  >
                                </template>
                                <span>Visualizar Unidade</span>
                              </v-tooltip>
                            </v-btn>
                          </v-list-item-subtitle>

                          <v-list-item-subtitle
                            v-for="lote in item.unidadesAdicionais"
                            :key="lote.id"
                            class="text-subtitle-1"
                          >
                            Unidade Adicional: {{ lote.nome }}
                            <v-btn icon @click="ObterUnidade(lote.id)">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon small color="primary" v-on="on"
                                    >mdi-eye-outline</v-icon
                                  >
                                </template>
                                <span>Visualizar Unidade</span>
                              </v-tooltip>
                            </v-btn>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
              </v-card>
              <v-card-actions class="justify-start">
                <v-btn @click="e6--" outlined color="primary">
                  <v-icon small left>mdi-arrow-left</v-icon> Voltar
                </v-btn>
                <v-btn color="primary" @click="e6 = 3"
                  >Avançar <v-icon small right>mdi-arrow-right</v-icon></v-btn
                >
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-step
              color="#676668"
              edit-icon="mdi-calendar-outline"
              editable
              :complete="true"
              step="3"
            >
              Datas e Reajustes
            </v-stepper-step>

            <v-stepper-content step="3">
              <v-card elevation="1" class="mb-12">
                <v-list two-line>
                  <v-list-item>
                    <v-row dense>
                      <v-col cols="4">
                        <v-list-item-content>
                          <v-list-item-title>
                            Data do contrato</v-list-item-title
                          >
                          <br /><br />
                          <v-list-item-subtitle class="text-subtitle-1">
                            <v-icon small left>mdi-calendar</v-icon>
                            {{ new Date(item.dataContrato).ddmmyyyy() }}
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
                      <v-col cols="4">
                        <v-list-item-content>
                          <v-list-item-title
                            >Índice do reajuste</v-list-item-title
                          >
                          <br /><br />
                          <v-list-item-subtitle class="text-subtitle-1">
                            {{ item.indiceNome }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>

                      <v-col cols="4">
                        <v-list-item-content>
                          <v-list-item-title
                            >Intervalo do reajuste</v-list-item-title
                          >
                          <br /><br />
                          <v-list-item-subtitle class="text-subtitle-1">
                            {{ item.intervaloNome }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>

                      <v-col cols="4" v-if="item.intervaloReajusteId == 1">
                        <v-list-item-content>
                          <v-list-item-title
                            >Mês do índice do reajuste</v-list-item-title
                          >
                          <br /><br />
                          <v-list-item-subtitle class="text-subtitle-1">
                            {{
                              mesReajuste.find((x) => x.id == item.mesReajuste)
                                ?.nome || "Não informado"
                            }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>

                      <v-col cols="4">
                        <v-list-item-content>
                          <v-list-item-title
                            >Ano do 1º reajuste</v-list-item-title
                          >
                          <br /><br />
                          <v-list-item-subtitle class="text-subtitle-1">
                            {{ item.anoPrimeiroReajuste }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>

                      <v-col cols="4">
                        <v-list-item-content>
                          <v-list-item-title>Tipo de tabela</v-list-item-title>
                          <br /><br />
                          <v-list-item-subtitle class="text-subtitle-1">
                            {{ item.tipoTabelaNome }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>

                      <v-col cols="4" v-if="item.tipoAmortizacaoId == 2">
                        <v-list-item-content>
                          <v-list-item-title>Juros</v-list-item-title>
                          <br /><br />
                          <v-list-item-subtitle class="text-subtitle-1">
                            {{ item.jurosAmortizacao }} %
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
              </v-card>

              <v-card-actions class="justify-start">
                <v-btn @click="e6--" outlined color="primary">
                  <v-icon small left>mdi-arrow-left</v-icon> Voltar
                </v-btn>
                <v-btn color="primary" @click="e6++"
                  >Avançar <v-icon small right>mdi-arrow-right</v-icon></v-btn
                >
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-step
              color="#676668"
              edit-icon="mdi-finance"
              editable
              :complete="true"
              step="4"
            >
              Financeiro
            </v-stepper-step>

            <v-stepper-content step="4">
              <v-card elevation="1" class="mb-6">
                <!-- Cabeçalho do Card -->
                <v-card-title>
                  <v-row justify="space-between" align="center">
                    <v-col cols="12" md="8">
                      <div>
                        <strong>Contrato: {{ item.numeroSequencia }} </strong>
                        <p class="text-body-2 grey--text">
                          Status: {{ item.situacaoNome }}
                        </p>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-title>

                <!-- Resumo financeiro -->
                <v-row dense class="mb-4">
                  <v-col cols="12" md="4">
                    <v-card outlined>
                      <v-card-text>
                        <v-icon color="green" left>mdi-cash</v-icon>
                        <strong>{{
                          `${
                            item.tipoId == 1
                              ? "Total do lote:"
                              : "Total do imóvel:"
                          }`
                        }}</strong>
                        <p class="text-h6 green--text">
                          {{ Number(item.valor).toMoeda(true) }}
                        </p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card outlined>
                      <v-card-text>
                        <v-icon color="orange" left>mdi-clock</v-icon>
                        <strong>Total do contrato com juros:</strong>
                        <p class="text-h6 orange--text">
                          {{ Number(item.valorComJuros).toMoeda(true) }}
                        </p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card outlined>
                      <v-card-text>
                        <v-icon color="blue" left>mdi-check-circle</v-icon>
                        <strong>Recebido:</strong>
                        <p class="text-h6 blue--text">
                          {{ Number(item.valorRecebido).toMoeda(true) }}
                        </p>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-card-title>
                  <v-row justify="space-between" align="center">
                    <v-col cols="12" md="8">
                      <div>
                        <strong> Receitas: </strong>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-title>

                <!-- Tabs para receitas -->
                <v-tabs
                  v-model="selectedTab"
                  background-color="grey"
                  dark
                  color="white"
                >
                  <v-tab
                    v-for="(receita, index) in item.receitas"
                    :key="index"
                    :to="'#receita-' + index"
                  >
                    {{ receita.tipoNome }}
                  </v-tab>
                </v-tabs>

                <v-tabs-items v-model="selectedTab">
                  <v-tab-item
                    v-for="(receita, index) in item.receitas"
                    :key="index"
                    :id="'receita-' + index"
                  >
                    <v-card flat class="pa-4">
                      <v-divider class="my-2"></v-divider>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title
                                >Total da receita:</v-list-item-title
                              >
                              <v-list-item-subtitle
                                class="text-subtitle-1 green--text"
                              >
                                {{ Number(receita.receitaTotal).toMoeda(true) }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title
                                >Total da receita com juros:</v-list-item-title
                              >
                              <v-list-item-subtitle
                                class="text-subtitle-1 orange--text"
                              >
                                {{
                                  Number(receita.totalReceitaComJuros).toMoeda(
                                    true
                                  )
                                }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title
                                >Total recebido:</v-list-item-title
                              >
                              <v-list-item-subtitle
                                class="text-subtitle-1 blue--text"
                              >
                                {{
                                  Number(receita.totalRecebido).toMoeda(true)
                                }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title
                                >Total de parcelas:</v-list-item-title
                              >
                              <v-list-item-subtitle class="text-subtitle-1">
                                {{ receita.qtdeParcela }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title
                                >Parcelas restantes:</v-list-item-title
                              >
                              <v-list-item-subtitle class="text-subtitle-1">
                                {{ receita.qtdeParcelaRestante }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title
                                >Parcelas pagas:</v-list-item-title
                              >
                              <v-list-item-subtitle class="text-subtitle-1">
                                {{ receita.qtdeParcelaPagas }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>
                        </v-row>

                        <v-divider class="my-4"></v-divider>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
              </v-card>

              <v-card-actions class="justify-start">
                <v-btn @click="e6--" outlined color="primary">
                  <v-icon small left>mdi-arrow-left</v-icon> Voltar
                </v-btn>
                <v-btn @click="e6++" color="primary">
                  AVANÇAR <v-icon small left>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-step
              color="#676668"
              edit-icon="mdi-briefcase"
              editable
              :complete="true"
              step="5"
            >
              Corretores
            </v-stepper-step>

            <v-stepper-content step="5">
              <v-card elevation="1" class="mb-6">
                <v-list two-line>
                  <v-list-item>
                    <!-- Clientes -->
                    <v-row dense>
                      <v-col
                        cols="12"
                        v-if="item.corretores && item.corretores.length > 0"
                      >
                        <v-list-item-content>
                          <v-list-item-title class="text-subtitle-1"
                            >Participações por corretor</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-col>

                      <v-col
                        cols="12"
                        md="12"
                        v-for="x in item.corretores"
                        :key="x.id"
                      >
                        <v-list-item-content>
                          <v-list-item-subtitle class="text-subtitle-1">
                            <span class="font-weight-bold">Nome: </span>
                            {{ x.nome }}
                            <v-btn icon @click="EditarCliente(x)">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-icon small color="primary" v-on="on"
                                    >mdi-eye-outline</v-icon
                                  >
                                </template>
                                <span>Visualizar corretor</span>
                              </v-tooltip>
                            </v-btn>
                          </v-list-item-subtitle>

                          <v-list-item-subtitle class="text-subtitle-1">
                            <span
                              class="font-weight-bold"
                              v-if="x.cpfCnpj.length > 14"
                            >
                              Cnpj: {{ x.cpfCnpj }}
                            </span>
                            <span class="font-weight-bold" v-else>
                              Cpf: {{ x.cpfCnpj }}</span
                            >
                          </v-list-item-subtitle>

                          <v-list-item-subtitle class="text-subtitle-1">
                            <span class="font-weight-bold"> Participação:</span>
                            {{
                              x.isPercentual == true
                                ? x.percentual + "%"
                                : Number(x.valorFixo).toMoeda(true)
                            }}</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
              </v-card>

              <v-card-actions class="justify-start">
                <v-btn @click="e6--" outlined color="primary">
                  <v-icon small left>mdi-arrow-left</v-icon> Voltar
                </v-btn>
                <v-btn color="primary" @click="e6++"
                  >Avançar <v-icon small right>mdi-arrow-right</v-icon></v-btn
                >
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-step
              color="#676668"
              edit-icon="mdi-history"
              :complete="true"
              editable
              step="6"
            >
              Histórico
            </v-stepper-step>

            <v-stepper-content step="6">
              <v-card elevation="1" class="mb-6">
                <v-timeline dense clipped>
                  <v-timeline-item
                    fill-dot
                    class="white--text mb-0"
                    v-for="(historico, index) in item.historicoSituacoes"
                    :key="index"
                    :color="situacaoColor(historico)"
                    :icon="
                      historico.situacaoId === 1 || historico.situacaoId === 6
                        ? 'mdi-check-circle'
                        : 'mdi-alert-circle-outline'
                    "
                  >
                    <v-card flat>
                      <v-card-title>
                        <v-icon color="primary" left>
                          {{
                            historico.situacaoId === 1 ||
                            historico.situacaoId === 6
                              ? "mdi-check-circle"
                              : "mdi-alert-circle-outline"
                          }}
                        </v-icon>
                        {{ historico.situacaoNome || "Situação não definida" }}
                      </v-card-title>
                      <v-card-text>
                        <p>
                          <strong>Responsável:</strong>
                          {{ historico?.usuarioNome || "Não informado" }}
                        </p>
                        <p>
                          <strong>Data:</strong>
                          {{ historico.dataAlteracao.toDateDDMMYYYY() }}
                        </p>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-card>

              <v-card-actions class="justify-start">
                <v-btn @click="e6--" outlined color="primary">
                  <v-icon small left>mdi-arrow-left</v-icon> Voltar
                </v-btn>
              </v-card-actions>
            </v-stepper-content>
          </v-stepper>
        </v-tab-item>

        <v-tab-item>
          <v-card elevation="1" v-if="contrato">
            <v-card-text
              ><v-row class="pl-3">
                <span class="font-weight-bold">
                  <v-subheader>
                    <v-icon small color="primary" class="mr-2"
                      >mdi-clipboard-text-search</v-icon
                    >
                    Informação do Contrato
                  </v-subheader>
                </span>
                <v-spacer />

                <v-btn color="primary" text @click="Salvar()">Salvar</v-btn>
              </v-row>

              <v-divider class="mb-2"></v-divider>
              <br />

              <v-row dense class="px-3 pt-3">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    label="Empresa"
                    placeholder="Selecione"
                    dense
                    outlined
                    v-model="contrato.empresaId"
                    item-value="id"
                    item-text="nome"
                    :items="empresas"
                    clearable
                    disabled
                  />
                </v-col>

                <v-col cols="12" md="3" lg="3">
                  <v-autocomplete
                    label="Situação"
                    :disabled="
                      contrato.situacaoId == EnumSitucaoContrato.Aditado ||
                      contrato.situacaoId == EnumSitucaoContrato.Cancelado
                    "
                    placeholder="Selecione"
                    dense
                    outlined
                    v-model="contrato.situacaoId"
                    item-value="id"
                    item-text="nome"
                    :items="situacoesFiltradas"
                    clearable
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="3"
                  lg="3"
                  v-if="contrato.tipoAmortizacaoId == 2"
                >
                  <v-text-field
                    suffix="%"
                    label="Juros amortização"
                    placeholder="Digite"
                    type="number"
                    dense
                    outlined
                    v-model="contrato.jurosAmortizacao"
                    clearable
                  />
                </v-col>

                <v-col cols="12" md="3" lg="3">
                  <v-select
                    label="Índice do reajuste"
                    placeholder="Selecione"
                    type="number"
                    dense
                    outlined
                    v-model="contrato.tipoIndiceId"
                    clearable
                    :items="listaIndices"
                    item-text="nomeEditavel"
                    item-value="id"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-select
                    label="Mês do índice de reajuste"
                    placeholder="Selecione"
                    outlined
                    dense
                    :items="mesReajuste"
                    item-text="nome"
                    item-value="id"
                    v-model="contrato.mesReajuste"
                    :menu-props="{ offsetY: true, offsetOverflow: true }"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-select
                    label="Ano do reajuste"
                    placeholder="Selecione"
                    outlined
                    dense
                    :items="anos"
                    item-text="nome"
                    item-value="id"
                    v-model="contrato.anoPrimeiroReajuste"
                    :menu-props="{ offsetY: true, offsetOverflow: true }"
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text>
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

              <v-row dense class="px-3">
                <v-col cols="12" md="6">
                  <v-select
                    label="Instituição Financeira"
                    outlined
                    :items="tiposOperacaoContrato"
                    item-text="nome"
                    item-value="id"
                    dense
                    v-model="contrato.tipoOperacaoId"
                    :menu-props="{ offsetY: true, offsetOverflow: true }"
                  />
                </v-col>

                <v-col cols="12" md="6" v-if="contrato.tipoOperacaoId == 1">
                  <v-select
                    label="Fintech"
                    outlined
                    clearable
                    v-model="contrato.tipoGatewayId"
                    @change="
                      (e) => {
                        ObterParametroGatway(contrato.tipoGatewayId);
                      }
                    "
                    return-object
                    :items="listaGateway"
                    item-text="tipo.nome"
                    item-value="tipo.id"
                    dense
                  ></v-select>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                  v-if="
                    contrato.tipoOperacaoId == 2 || contrato.tipoOperacaoId == 3
                  "
                >
                  <v-select
                    label="Conta Corrente"
                    @change="ObterEncargosContaCorrente()"
                    outlined
                    clearable
                    v-model="contrato.contaCorrenteId"
                    :items="listaContaCorrentes"
                    item-text="nome"
                    item-value="id"
                    dense
                    :menu-props="{ offsetY: true, offsetOverflow: true }"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row dense class="px-3">
                <v-col cols="12" md="2">
                  <v-text-field
                    suffix="%"
                    label="Juros ao dia"
                    outlined
                    v-model="contrato.encargoFinanceiro.jurosDia"
                    dense
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    suffix="%"
                    label="Multa"
                    outlined
                    v-model="contrato.encargoFinanceiro.multa"
                    dense
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    label="Dias"
                    outlined
                    v-model="contrato.encargoFinanceiro.diasDescontoVencimento"
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
                    contrato.encargoFinanceiro.isDescontoVencimentoPercentual
                  "
                >
                  <v-text-field
                    label="Desconto"
                    suffix="%"
                    outlined
                    v-model="contrato.encargoFinanceiro.descontoVencimento"
                    dense
                    type="number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2" v-else>
                  <v-text-field
                    label="Desconto"
                    prefix="R$"
                    outlined
                    v-model="contrato.encargoFinanceiro.descontoVencimento"
                    dense
                    type="number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="2" class="pa-0 ma-0">
                  <v-switch
                    v-model="
                      contrato.encargoFinanceiro.isDescontoVencimentoPercentual
                    "
                    class="mb-0 pa-0"
                    :label="
                      contrato.encargoFinanceiro
                        .isDescontoVencimentoPercentual != false
                        ? 'Percentual'
                        : 'Fixo'
                    "
                  />
                </v-col>
              </v-row>

              <v-row dense class="px-3">
                <v-col cols="12" md="3">
                  <v-text-field
                    label="Desconto"
                    suffix="%"
                    hint="Antecipação/Quitação"
                    persistent-hint
                    outlined
                    v-model="contrato.encargoFinanceiro.descontoAntecipacao"
                    dense
                    type="number"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    label="Dias para não receber"
                    outlined
                    v-model="
                      contrato.encargoFinanceiro.diasAposVencimentoNaoReceber
                    "
                    dense
                    type="number"
                    hint="Nº de dias para não receber após o vencimento."
                    persistent-hint
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                    outlined
                    v-model="contrato.encargoFinanceiro.diasProtesto"
                    dense
                    type="number"
                    hint="Nº de dias necessário para protestar após o vencimento."
                    persistent-hint
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <cadastro-pessoa
      v-model="dialogCadastro"
      :item="pessoa"
      @fechou="dialogCadastro = false"
      @salvou="dialogCadastro = false"
    />
    <visualizar-unidade
      v-model="dialogUnidadeInformacao"
      @fechou="dialogUnidadeInformacao = false"
      @salvou="dialogUnidadeInformacao = false"
      :item="informacaoUnidade"
      :excluir="false"
      :salvar="true"
    />
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  ContratoService,
  EmpreendimentoService,
  PessoaService,
  TipoIndiceService,
} from "@/core/services/cadastros";
import { EmpresaService } from "@/core/services/compras/EmpresaService";
import {
  ContaCorrenteService,
  ParametroFinanceiroService,
  ReceitaService,
  TipoProdutoContratoService,
} from "@/core/services/financeiro";
import Pessoa from "@/core/models/cadastros/Pessoa";
import * as jsonpatch from "fast-json-patch";
import { Contrato, ContratoDetalhado, Unidade } from "@/core/models/cadastros";
import { Encargo } from "@/core/models/financeiro";
import { EnumSitucaoContrato } from "@/core/models/cadastros/contrato/SituacaoContrato";
import { TipoOperacaoFinanceiraService } from "@/core/services/contratos";
import { GenerateYearOptions } from "@/assets/scripts/helper";

@Component
export default class DetalharContrato extends Vue {
  @Prop() public item!: ContratoDetalhado;
  @Prop() public value!: string;

  public contrato = new Contrato();
  dialogCadastro = false;
  pessoa = new Pessoa();

  EditarCliente(item) {
    new PessoaService().ObterPorId(item.id).then((res) => {
      this.pessoa = res.data;
      this.pessoa.dataExpedicao = new Date(
        `${res.data.dataExpedicao}`
      ).yyyymmdd();
      this.pessoa.dataNascimento = new Date(
        `${res.data.dataNascimento}`
      ).yyyymmdd();
      this.pessoa.dataCadastro = new Date(
        `${res.data.dataCadastro}`
      ).yyyymmdd();

      if (res.data.conjuge) {
        this.pessoa.conjuge = this.pessoa.conjuge || {};
        this.pessoa.conjuge.dataNascimento = new Date(
          `${res.data.conjuge.dataNascimento}`
        ).yyyymmdd();
      }

      this.dialogCadastro = true;
    });
  }

  informacaoUnidade = new Unidade();
  dialogUnidadeInformacao = false;

  ObterUnidade(id) {
    new EmpreendimentoService()
      .ObterUnidade(id, "Imovel, Jazigo, Lote, Lote.Infraestrutura")
      .then((res) => {
        this.dialogUnidadeInformacao = true;
        this.informacaoUnidade = res.data;
      });
  }

  situacaoColor(item) {
    if (item.situacaoId == 1) return "blue lighten-3";
    else if (item.situacaoId == 2) return "orange lighten-1";
    else if (item.situacaoId == 3) return "deep-purple lighten-1";
    else if (item.situacaoId == 4) return "red lighten-1";
    else if (item.situacaoId == 5) return "grey lighten-1";
    else if (item.situacaoId == 6) return "teal lighten-1";
    else if (item.situacaoId == 7) return "yellow lighten-1";
  }

  e6 = 4;
  service = new ContratoService();
  receitaService = new ReceitaService();
  observer!: jsonpatch.Observer<Contrato>;
  EnumSitucaoContrato = EnumSitucaoContrato;

  listaGateway = [];
  empresas = [];
  listaIndices = [];
  listaTipoEmpreendimento = [];
  pessoas = [];
  listaContaCorrentes = [];
  tiposOperacaoContrato = [];
  selectedTab = null;
  tab = null;
  valid = true;
  dialog = false;
  //AplicarDiasProtesto = false;

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Situação", value: "situacaoId" },
    { text: "Data de Alteração", value: "dataAlteracao" },
    { text: "Responsável", value: "usuario.login" },
  ];

  ObterParametroGatway(item) {
    if (item) {
      this.contrato.encargoFinanceiro = item.encargoFinanceiro;
      this.contrato.tipoGatewayId = item.tipoId;
    } else {
      this.contrato.encargoFinanceiro = new Encargo();
      this.contrato.tipoGatewayId = 0;
    }
  }

  ObterParametroPorId(id) {
    new ParametroFinanceiroService()
      .ObterParametroEmpresaPorId(id, "Gatways.Tipo")
      .then((res) => {
        this.listaGateway = res.data.gatways;
      });
  }

  anos = GenerateYearOptions();

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

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
    if (this.dialog) {
      this.ObterContrato();
    }
  }

  @Watch("contrato", { deep: true })
  ObservadorItem() {
    this.observer = jsonpatch.observe(this.contrato);
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }
  }

  ObterContrato() {
    new ContratoService().ObterPorId(this.item.id).then((res) => {
      this.contrato = res.data;
      this.ObterParametroPorId(this.contrato.empresaId);
    });
  }

  Salvar() {
    this.observer = jsonpatch.observe(this.contrato);
    let pacthModel = jsonpatch.generate(this.observer);

    (this.contrato.id > 0
      ? this.service.Patch(pacthModel, this.contrato.id)
      : this.service.Salvar(this.contrato)
    ).then(
      (res) => {
        this.receitaService.AtualizarEncargosContrato(
          this.contrato.id,
          this.contrato.encargoFinanceiro
        );
        this.$swal(
          "Aviso",
          "Operação realizada com sucesso!",
          res.status == 201 || res.status == 200 ? "success" : "warning"
        );
        this.$emit("salvou");
        jsonpatch.unobserve(this.contrato, this.observer);
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

  Close() {
    this.dialog = false;
  }

  ObterEncargosContaCorrente() {
    new ContaCorrenteService()
      .ObterPorId(this.contrato.contaCorrenteId)
      .then((res) => {
        this.contrato.encargoFinanceiro = res.data.encargoFinanceiro;
      });
  }

  listasSituacoes = [
    { id: 1, nome: "Em Andamento" },
    { id: 2, nome: "Cobrança" },
    { id: 3, nome: "Jurídico" },
    { id: 4, nome: "Prejuízo" },
    { id: 5, nome: "Cancelado" },
    { id: 6, nome: "Quitado" },
    { id: 7, nome: "Aditado" },
    { id: 8, nome: "Com processo" },
  ];

  get situacoesFiltradas() {
    const situacoesPermitidas = this.listasSituacoes.filter(
      (situacao) =>
        situacao.id !== EnumSitucaoContrato.Aditado &&
        situacao.id !== EnumSitucaoContrato.Cancelado
    );

    return situacoesPermitidas;
  }

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
        "Id,nome,cnpjCpf, nomeCnpjCpf",
        ""
      )
      .then((res) => (this.pessoas = res.data.items));

    new TipoProdutoContratoService()
      .ListarTudo()
      .then((res) => (this.listaTipoEmpreendimento = res.data.items));

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
        "Id,nome, nomeFantasia",
        ""
      )
      .then((res) => (this.empresas = res.data.items));

    new TipoIndiceService()
      .ListarTudo()
      .then((res) => (this.listaIndices = res.data.items));

    const tipoOperacaoContrato = new TipoOperacaoFinanceiraService();
    tipoOperacaoContrato.ListarTudo().then((res) => {
      this.tiposOperacaoContrato = res.data.items;
    });

    const contaCorrenteService = new ContaCorrenteService();
    contaCorrenteService
      .Listar(-1, -1, ["id"], [], "", [], "", "", "", "Banco")
      .then((res) => {
        this.listaContaCorrentes = res.data.items;
      });
  }
}
</script>
