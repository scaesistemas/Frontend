<template>
  <v-dialog
    v-model="dialog"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    no-click-animation
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>Parametrização da Empresa</v-toolbar-title>
        <v-spacer />

        <v-toolbar-items>
          <v-btn dark text @click="Salvar(true)">Salvar</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card flat class="ma-3">
        <v-card-text>
          <v-form v-model="valid" lazy-validation ref="form">
            <v-tabs
              v-model="tab"
              color="primary"
              background-color="transparent"
            >
              <v-tab>Identificação</v-tab>
              <v-tab>Indíces e Reajustes</v-tab>
              <v-tab>CRM</v-tab>
              <v-tab>Financeiro</v-tab>
              <v-tab>Cobrança</v-tab>
              <v-tab>Controle de Água</v-tab>
              <v-tab>SubContas</v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-form ref="formParametro" v-model="valid" lazy-validation>
                <v-tab-item>
                  <v-card>
                    <v-card-text>
                      <v-row dense>
                        <v-col cols="12" md="6">
                          <div class="font-weight-bold">Empresa</div>
                          <v-select
                            placeholder="Selecione"
                            outlined
                            v-model="item.empresaId"
                            dense
                            :rules="fieldRules"
                            :items="empresas"
                            item-value="id"
                            item-text="nome"
                            :menu-props="{
                              offsetY: true,
                              offsetOverflow: true,
                            }"
                          />
                        </v-col>

                        <v-col cols="12" md="3">
                          <div class="font-weight-bold">Centro de Custo</div>
                          <v-autocomplete
                            placeholder="Selecione"
                            outlined
                            :items="listaCentroCusto"
                            item-value="key"
                            item-text="value"
                            dense
                            v-model="item.centroCustoReceitalId"
                            :rules="fieldRules"
                          />
                        </v-col>

                        <v-col cols="12" md="3">
                          <div class="font-weight-bold">Categoria</div>
                          <v-autocomplete
                            placeholder="Selecione"
                            outlined
                            :items="listaContaGerencial"
                            item-value="key"
                            item-text="value"
                            dense
                            v-model="item.contaGerenciaReceitalId"
                            :rules="fieldRules"
                          />
                        </v-col>
                      </v-row>
                      <br />
                      <v-card-actions class="justify-start">
                        <v-btn @click="tab = 1" color="primary">
                          Avançar
                          <v-icon small right>mdi-arrow-right</v-icon></v-btn
                        >
                      </v-card-actions>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <v-tab-item>
                  <v-card>
                    <v-card-text>
                      <v-row dense class="mb-1">
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
                            :menu-props="{
                              offsetY: true,
                              offsetOverflow: true,
                            }"
                          />
                        </v-col>

                        <v-col
                          cols="12"
                          lg="2"
                          md="1"
                          xl="1"
                          v-if="item.tipoAmortizacaoId != 1"
                        >
                          <div class="font-weight-bold">Juros amortização</div>
                          <v-text-field
                            type="number"
                            suffix="%"
                            outlined
                            v-model="item.jurosAmortizacao"
                            dense
                          />
                        </v-col>

                        <v-col cols="12" md="2">
                          <div class="font-weight-bold">Gestão</div>
                          <money-input
                            v-model="item.valoresAdicionaisParcela.gestao"
                            @ValorFormatado="
                              (valor) =>
                                (item.valoresAdicionaisParcela.gestao = valor)
                            "
                            dense
                          />
                        </v-col>

                        <v-col cols="12" md="2">
                          <div class="font-weight-bold">MPI</div>
                          <v-text-field
                            outlined
                            type="number"
                            v-model="
                              item.valoresAdicionaisParcela.percentualMPI
                            "
                            dense
                            suffix="%"
                          />
                        </v-col>

                        <v-col cols="12" md="2">
                          <div class="font-weight-bold">DFI</div>
                          <v-text-field
                            outlined
                            type="number"
                            v-model="
                              item.valoresAdicionaisParcela.percentualDFI
                            "
                            dense
                            suffix="%"
                          />
                        </v-col>
                      </v-row>

                      <v-divider></v-divider>
                      <br />
                      <v-row dense>
                        <v-col cols="12" md="2">
                          <div class="font-weight-bold">Taxa do Boleto</div>
                          <v-text-field
                            outlined
                            type="number"
                            v-model="item.valoresAdicionaisParcela.taxaBoleto"
                            dense
                            prefix="R$"
                          />
                        </v-col>

                        <v-col cols="12" md="2">
                          <span class="font-weight-bold"
                            >Nome taxa Adicional</span
                          >
                          <v-text-field
                            v-model="
                              item.valoresAdicionaisParcela.nomeTaxaAdicional
                            "
                            outlined
                            dense
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="2">
                          <span class="font-weight-bold"
                            >Valor taxa Adicional</span
                          >
                          <v-text-field
                            v-model="
                              item.valoresAdicionaisParcela
                                .valorFixoTaxaAdicional
                            "
                            outlined
                            prefix="R$"
                            dense
                            type="number"
                          ></v-text-field>
                        </v-col>
                      </v-row>

                      <v-divider></v-divider>
                      <br />
                      <v-row dense>
                        <v-col cols="12" md="2">
                          <span class="font-weight-bold"
                            >Juros do Aditamento</span
                          >
                          <v-text-field
                            outlined
                            suffix="%"
                            dense
                            type="number"
                            v-model="item.jurosAditamento"
                          />
                        </v-col>

                        <v-col cols="12" md="2">
                          <span class="font-weight-bold"
                            >Desconto do Aditamento</span
                          >
                          <v-text-field
                            outlined
                            suffix="%"
                            dense
                            type="number"
                            v-model="item.descontoAditamento"
                          />
                        </v-col>
                      </v-row>
                      <br />
                      <v-card-actions class="justify-start">
                        <v-btn outlined @click="tab = 0" color="primary">
                          <v-icon small right>mdi-arrow-left</v-icon> Voltar
                        </v-btn>
                        <v-btn @click="tab = 2" color="primary">
                          Avançar
                          <v-icon small right>mdi-arrow-right</v-icon></v-btn
                        >
                      </v-card-actions>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <v-tab-item>
                  <v-card>
                    <v-card-text>
                      <v-row dense>
                        <v-col cols="12" md="4">
                          <span class="font-weight-bold">Centro de Custo</span>
                          <v-select
                            clearable
                            outlined
                            dense
                            v-model="
                              item.parametroCRMVendas
                                .centroCustoComissaoCorretorId
                            "
                            :items="listaCentroCusto"
                            item-value="key"
                            item-text="value"
                          />
                        </v-col>

                        <v-col cols="12" md="4">
                          <span class="font-weight-bold">Categoria</span>
                          <v-select
                            clearable
                            outlined
                            dense
                            v-model="
                              item.parametroCRMVendas
                                .contaGerencialComissaoCorretorId
                            "
                            :items="listaContaGerencial"
                            item-value="key"
                            item-text="value"
                          />
                        </v-col>
                      </v-row>

                      <v-row dense>
                        <v-col cols="12" md="2">
                          <span class="font-weight-bold">Percentual</span>
                          <v-text-field
                            suffix="%"
                            hint="Comissão do Corretor"
                            persistent-hint
                            outlined
                            dense
                            type="number"
                            v-model="
                              item.parametroCRMVendas.percentualComissaoCorretor
                            "
                          />
                        </v-col>

                        <v-col cols="12" md="2">
                          <span class="font-weight-bold">Dias</span>
                          <v-text-field
                            disabled
                            hint="Para expirar a Reserva"
                            persistent-hint
                            outlined
                            dense
                            type="number"
                            v-model="
                              item.parametroCRMVendas.diasExpiracaoReserva
                            "
                          />
                        </v-col>

                        <v-col cols="12" md="2">
                          <span class="font-weight-bold">Dias</span>
                          <v-text-field
                            disabled
                            hint="Para expirar a Pré Reserva"
                            persistent-hint
                            outlined
                            dense
                            type="number"
                            v-model="
                              item.parametroCRMVendas.diasExpiracaoPreReserva
                            "
                          />
                        </v-col>

                        <v-col cols="12" md="2">
                          <span class="font-weight-bold">Dias</span>
                          <v-text-field
                            hint="Mínimos entre a Reserva com mesmo Lead"
                            persistent-hint
                            outlined
                            dense
                            type="number"
                            v-model="
                              item.parametroCRMVendas
                                .diasMinimosEntreReservaMesmoLead
                            "
                          />
                        </v-col>
                      </v-row>
                      <br />
                      <v-card-actions class="justify-start">
                        <v-btn outlined @click="tab = 1" color="primary">
                          <v-icon small right>mdi-arrow-left</v-icon> Voltar
                        </v-btn>
                        <v-btn @click="tab = 3" color="primary">
                          Avançar
                          <v-icon small right>mdi-arrow-right</v-icon></v-btn
                        >
                      </v-card-actions>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <v-tab-item>
                  <v-card>
                    <v-card-text>
                      <v-form ref="formGateway" v-model="valid" lazy-validation>
                        <!-- Seção Encargos Financeiros -->
                        <v-subheader>Encargos Financeiros</v-subheader>
                        <v-divider class="mb-4"></v-divider>
                        <br />
                        <v-row dense>
                          <v-col cols="12" md="6">
                            <v-select
                              label="Tipo Gateway"
                              outlined
                              :items="tiposGateways"
                              item-text="nome"
                              item-value="id"
                              dense
                              v-model="gatway.tipoId"
                              :rules="fieldRules"
                              :menu-props="{
                                offsetY: true,
                                offsetOverflow: true,
                              }"
                            />
                          </v-col>

                          <v-col cols="12" md="1" class="pa-0 ma-0 ml-4">
                            <v-switch
                              label="Principal"
                              dense
                              color="primary"
                              v-model="gatway.principal"
                            />
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" md="2">
                            <v-text-field
                              outlined
                              dense
                              type="number"
                              v-model="gatway.encargoFinanceiro.jurosDia"
                              label="% Juros ao Dia"
                              placeholder="Informe os juros ao dia"
                            />
                          </v-col>
                          <v-col cols="12" md="2">
                            <v-text-field
                              outlined
                              dense
                              type="number"
                              v-model="gatway.encargoFinanceiro.multa"
                              label="% Multa"
                              placeholder="Informe a multa"
                            />
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-text-field
                              label="Dias"
                              outlined
                              v-model="
                                gatway.encargoFinanceiro.diasDescontoVencimento
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
                              gatway.encargoFinanceiro
                                .isDescontoVencimentoPercentual
                            "
                          >
                            <v-text-field
                              label="Desconto"
                              suffix="%"
                              outlined
                              v-model="
                                gatway.encargoFinanceiro.descontoVencimento
                              "
                              dense
                              type="number"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" md="2" v-else>
                            <v-text-field
                              label="Desconto"
                              prefix="R$"
                              outlined
                              v-model="
                                gatway.encargoFinanceiro.descontoVencimento
                              "
                              dense
                              type="number"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" md="2" class="pa-0 ma-0">
                            <v-switch
                              v-model="
                                gatway.encargoFinanceiro
                                  .isDescontoVencimentoPercentual
                              "
                              class="mb-0 pa-0"
                              :label="
                                gatway.encargoFinanceiro
                                  .isDescontoVencimentoPercentual != false
                                  ? 'Percentual'
                                  : 'Fixo'
                              "
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="2">
                            <v-text-field
                              outlined
                              dense
                              type="number"
                              v-model="
                                gatway.encargoFinanceiro.descontoAntecipacao
                              "
                              label="% Desconto Antecipação"
                              placeholder="Ex: 2"
                            />
                          </v-col>

                          <v-col cols="12" md="2">
                            <v-text-field
                              outlined
                              dense
                              type="number"
                              v-model="
                                gatway.encargoFinanceiro
                                  .diasAposVencimentoNaoReceber
                              "
                              label="Venc. Dias Não Recebidos"
                            />
                          </v-col>

                          <v-col cols="12" md="2">
                            <v-text-field
                              outlined
                              dense
                              type="number"
                              v-model="gatway.encargoFinanceiro.diasProtesto"
                              label="Dias Protesto"
                            />
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12" md="4">
                            <v-text-field
                              outlined
                              dense
                              :counter="60"
                              maxlength="60"
                              v-model="gatway.instrucao1"
                              label="Instrução 1"
                            />
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-text-field
                              outlined
                              dense
                              :counter="60"
                              maxlength="60"
                              v-model="gatway.instrucao2"
                              label="Instrução 2"
                            />
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-text-field
                              outlined
                              dense
                              :counter="60"
                              maxlength="60"
                              v-model="gatway.instrucao3"
                              label="Instrução 3"
                            />
                          </v-col>
                        </v-row>
                        <v-row dense>
                          <!-- Seção Galaxy Pay -->
                          <v-col cols="12" md="4" v-if="gatway.tipoId == 2">
                            <v-subheader>Integração com Galaxy Pay</v-subheader>
                            <v-divider class="mb-4"></v-divider>
                            <v-row dense>
                              <v-col cols="12" md="6">
                                <v-text-field
                                  outlined
                                  label="Id Galaxy Pay"
                                  :counter="25"
                                  maxlength="25"
                                  dense
                                  v-model="gatway.galaxPay.id"
                                />
                              </v-col>

                              <v-col cols="12" md="6">
                                <v-text-field
                                  outlined
                                  label="Hash Galaxy Pay"
                                  :counter="60"
                                  maxlength="60"
                                  dense
                                  v-model="gatway.galaxPay.hash"
                                />
                              </v-col>
                            </v-row>
                          </v-col>

                          <v-col cols="12" md="4" v-if="gatway.tipoId == 6">
                            <v-subheader>Integração com Global Pay</v-subheader>
                            <v-divider class="mb-4"></v-divider>
                            <v-row dense>
                              <v-col cols="12" md="6">
                                <v-text-field
                                  outlined
                                  label="Email Global Pay"
                                  :counter="60"
                                  maxlength="60"
                                  dense
                                  v-model="gatway.globalPay.email"
                                />
                              </v-col>

                              <v-col cols="12" md="6">
                                <v-text-field
                                  outlined
                                  label="Senha Global Pay"
                                  :counter="60"
                                  maxlength="60"
                                  dense
                                  v-model="gatway.globalPay.senha"
                                />
                              </v-col>
                            </v-row>
                          </v-col>

                          <!-- Seção Safra -->
                          <v-col cols="12" md="10" v-if="gatway.tipoId == 3">
                            <v-subheader>Integração com Safra</v-subheader>
                            <v-divider class="mb-4"></v-divider>

                            <v-row dense>
                              <v-col cols="12" md="2">
                                <v-text-field
                                  outlined
                                  label="Id do Cliente"
                                  dense
                                  v-model="gatway.safra.clientId"
                                />
                              </v-col>

                              <v-col cols="12" md="2">
                                <v-text-field
                                  outlined
                                  label="Usuário"
                                  dense
                                  v-model="gatway.safra.usuario"
                                />
                              </v-col>

                              <v-col cols="12" md="2">
                                <v-text-field
                                  outlined
                                  label="Senha"
                                  dense
                                  v-model="gatway.safra.senha"
                                />
                              </v-col>

                              <v-col cols="12" md="2">
                                <v-text-field
                                  outlined
                                  label="Agência"
                                  dense
                                  v-model="gatway.safra.agencia"
                                />
                              </v-col>

                              <v-col cols="12" md="2">
                                <v-text-field
                                  outlined
                                  label="Conta"
                                  dense
                                  v-model="gatway.safra.conta"
                                />
                              </v-col>

                              <v-col cols="12" md="2">
                                <v-text-field
                                  outlined
                                  label="Nosso Número"
                                  dense
                                  v-model="gatway.safra.nossoNumeroInicial"
                                />
                              </v-col>
                            </v-row>
                          </v-col>

                          <!-- Seção ContaPay -->
                          <v-col cols="12" md="4" v-if="gatway.tipoId == 5">
                            <v-subheader>Integração com ContaPay</v-subheader>
                            <v-divider class="mb-4"></v-divider>
                            <v-row dense>
                              <v-col cols="12" md="6">
                                <v-text-field
                                  outlined
                                  label="Email"
                                  :counter="65"
                                  maxlength="65"
                                  dense
                                  v-model="gatway.contaPay.email"
                                />
                              </v-col>

                              <v-col cols="12" md="6">
                                <v-text-field
                                  outlined
                                  label="Token ContaPay"
                                  :counter="65"
                                  maxlength="65"
                                  dense
                                  v-model="gatway.contaPay.accessToken"
                                />
                              </v-col>
                            </v-row>
                          </v-col>

                          <!-- Seção Asaas -->
                          <v-col cols="12" md="3" v-if="gatway.tipoId == 4">
                            <v-subheader>Integração com Asaas</v-subheader>
                            <v-divider class="mb-4"></v-divider>
                            <v-row dense>
                              <v-col cols="12" md="12">
                                <v-text-field
                                  outlined
                                  label="Token de Acesso"
                                  dense
                                  v-model="gatway.asaas.accessToken"
                                />
                              </v-col>
                            </v-row>
                          </v-col>

                          <v-col cols="12" md="2" style="margin-top: 65px">
                            <v-btn color="primary" @click="AdicionarGatway()">
                              <v-icon left>mdi-plus</v-icon>Adicionar
                            </v-btn>
                          </v-col>
                        </v-row>

                        <!-- Tabela de Gateways -->
                        <v-row>
                          <v-col cols="12" sm="4" md="4">
                            <v-data-table
                              hide-default-footer
                              hide-default-header
                              :headers="headers"
                              :items="item.gatways"
                              class="elevation-1"
                              :items-per-page="-1"
                              item-key="item.produtoId"
                            >
                              <template v-slot:[`item.actions`]="{ item }">
                                <v-tooltip left>
                                  <template v-slot:activator="{ on }">
                                    <v-icon
                                      :disabled="item.excluido"
                                      @click="EditarGatway(item)"
                                      v-on="on"
                                      >mdi-pencil</v-icon
                                    >
                                  </template>
                                  <span>Editar</span>
                                </v-tooltip>
                              </template>
                              <template v-slot:[`item.tipoId`]="{ item }">
                                {{
                                  tiposGateways.find((x) => x.id == item.tipoId)
                                    ?.nome
                                }}
                              </template>
                            </v-data-table>
                          </v-col>
                        </v-row>
                      </v-form>

                      <!-- Botões de Navegação -->
                      <v-card-actions class="justify-start">
                        <v-btn outlined @click="tab = 2" color="primary">
                          <v-icon small right>mdi-arrow-left</v-icon> Voltar
                        </v-btn>
                        <v-btn @click="tab = 4" color="primary">
                          Avançar <v-icon small right>mdi-arrow-right</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <v-tab-item>
                  <v-card>
                    <br />
                    <v-card-title>Configurações de Cobrança</v-card-title>

                    <v-card-text>
                      Os boletos são gerados automaticamente sempre
                      <strong> 10 dias antes do vencimento. </strong> <br />
                      Se você possui boletos vencendo em
                      <strong
                        >menos de 10 dias a partir da data da
                        configuração,</strong
                      >
                      eles precisarão ser gerados manualmente, pois não terão
                      tempo hábil para a geração automática. <br />
                      Ao escolher as datas de envio, verifique esse prazo para
                      evitar qualquer imprevisto. Qualquer dúvida, estamos à
                      disposição!
                    </v-card-text>

                    <v-card-text>
                      <v-form
                        ref="formCobranca"
                        v-model="valid"
                        lazy-validation
                      >
                        <v-row dense class="px-3 pt-3">
                          <v-col
                            cols="12"
                            sm="2"
                            md="2"
                            lg="1"
                            xl="1"
                            style="margin-top: 10px"
                          >
                            <div
                              class="font-weight-bold"
                              style="font-size: 17px"
                            >
                              Enviar e-mail
                            </div>
                          </v-col>

                          <v-col cols="12" sm="2" md="2" lg="2" xl="2">
                            <v-text-field
                              outlined
                              suffix="Dia(s)"
                              v-model="cobranca.dias"
                              dense
                              type="number"
                              :rules="fieldRules"
                            />
                          </v-col>

                          <v-col cols="12" sm="2" md="2" lg="2" xl="2">
                            <v-select
                              outlined
                              item-text="nome"
                              v-model="cobranca.posVencimento"
                              item-value="vencido"
                              dense
                              :items="tiposCobrancas"
                              :menu-props="{
                                offsetY: true,
                                offsetOverflow: true,
                              }"
                            />
                          </v-col>

                          <v-col
                            cols="12"
                            sm="2"
                            md="2"
                            lg="1"
                            xl="1"
                            style="margin-top: 10px"
                          >
                            <div
                              class="font-weight-bold"
                              style="font-size: 17px"
                            >
                              do vencimento.
                            </div>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="1"
                            md="1"
                            lg="1"
                            xl="1"
                            style="margin-top: -10px"
                          >
                            <v-checkbox
                              color="primary"
                              v-model="cobranca.enviarSms"
                              label="Enviar SMS"
                            />
                          </v-col>

                          <v-col
                            cols="12"
                            sm="1"
                            md="1"
                            lg="1"
                            xl="1"
                            style="margin-top: -10px"
                            v-if="ehMaster"
                          >
                            <v-checkbox
                              color="primary"
                              v-model="cobranca.enviarWhatsapp"
                              label="Enviar Wpp"
                            />
                          </v-col>

                          <v-col cols="12" sm="2" md="2" lg="2" xl="2">
                            <v-btn color="primary" @click="AdicionarCobranca()">
                              <v-icon left>mdi-plus</v-icon>
                              Adicionar
                            </v-btn>
                          </v-col>
                        </v-row>

                        <v-divider></v-divider>
                        <br />
                        <template v-if="item.id > 0">
                          <v-card-text>
                            Clique no botão abaixo para desmarcar
                            <strong> Boletos </strong> e
                            <strong>Cobranças</strong> automáticos de todos os
                            contratos dessa Parametrização
                          </v-card-text>

                          <v-card-actions>
                            <v-switch
                              class="custom-switch"
                              v-model="
                                item.desmarcarBoletosCobrancasAutomaticas
                              "
                              label="Desmarcar"
                            ></v-switch>
                          </v-card-actions>
                        </template>

                        <v-divider></v-divider>

                        <v-col cols="12" md="6">
                          <v-data-table
                            :headers="headersCobranca"
                            :items="item.cobrancas"
                            :items-per-page="15"
                            item-key="item.id"
                            class="elevation-1"
                          >
                            <template v-slot:[`item.actions`]="{ item }">
                              <v-tooltip left>
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    :disabled="item.excluido"
                                    small
                                    @click="EditarCobranca(item)"
                                    v-on="on"
                                    >mdi-pencil</v-icon
                                  >
                                </template>
                                <span>Editar</span>
                              </v-tooltip>

                              <v-tooltip right>
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    :disabled="item.excluido"
                                    small
                                    @click="ExcluirCobranca(item)"
                                    v-on="on"
                                    >mdi-delete</v-icon
                                  >
                                </template>
                                <span>Excluir</span>
                              </v-tooltip>
                            </template>
                            <!-- e ${item.enviarWhatsapp == true ? 'com' : 'sem'} envio do WhatsApp -->
                            <template v-slot:[`item.posVencimento`]="{ item }">
                              {{
                                tiposCobrancas.find(
                                  (x) => x.id == item.layoutCobrancaId
                                )
                                  ? `${item.dias} Dia(s) ${
                                      tiposCobrancas.find(
                                        (x) => x.id == item.layoutCobrancaId
                                      ).nome
                                    } do vencimento ${
                                      item.enviarSms == true ? "com" : "sem"
                                    } envio de SMS`
                                  : tiposLayouts.find(
                                      (x) => x.id == item.layoutCobrancaId
                                    )
                                  ? tiposLayouts.find(
                                      (x) => x.id == item.layoutCobrancaId
                                    ).nome
                                  : ""
                              }}
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-form>
                      <br />
                      <v-card-actions class="justify-start">
                        <v-btn outlined @click="tab = 4" color="primary">
                          <v-icon small right>mdi-arrow-left</v-icon> Voltar
                        </v-btn>
                        <v-btn @click="tab = 6" color="primary">
                          Avançar <v-icon small right>mdi-arrow-right</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <v-tab-item>
                  <v-card>
                    <v-card-text>
                      <v-row dense class="px-3 pt-3">
                        <v-col cols="12" sm="12" md="3">
                          <span class="font-weight-bold">Centro Custo*</span>
                          <v-autocomplete
                            placeholder="Selecione"
                            outlined
                            v-model="
                              item.parametroControleAgua
                                .centroCustoControleAguaId
                            "
                            :items="listaCentroCusto"
                            item-value="key"
                            item-text="value"
                            dense
                          />
                        </v-col>

                        <v-col cols="12" sm="12" md="3">
                          <span class="font-weight-bold">Categoria*</span>
                          <v-autocomplete
                            placeholder="Selecione"
                            outlined
                            v-model="
                              item.parametroControleAgua
                                .contaGerencialControleAguaId
                            "
                            :items="listaContaGerencial"
                            item-value="key"
                            item-text="value"
                            dense
                          />
                        </v-col>

                        <v-col cols="12" md="3" class="pt-3">
                          <v-switch
                            label="Empresa Padrão?"
                            v-model="
                              item.parametroControleAgua.empresaPadraoBoletoAgua
                            "
                            outlined
                            dense
                          ></v-switch>
                        </v-col>
                      </v-row>

                      <v-row dense class="px-3">
                        <v-col cols="12" md="6">
                          <span class="font-weight-bold"
                            >Instituição Financeira</span
                          >
                          <v-select
                            outlined
                            v-model="item.parametroControleAgua.tipoOperacaoId"
                            :items="tiposOperacaoContrato"
                            item-text="nome"
                            item-value="id"
                            dense
                            :menu-props="{
                              offsetY: true,
                              offsetOverflow: true,
                            }"
                          ></v-select>
                        </v-col>

                        <v-col
                          cols="12"
                          md="6"
                          v-if="item.parametroControleAgua.tipoOperacaoId == 1"
                        >
                          <span class="font-weight-bold">Gateway</span>
                          <v-select
                            outlined
                            clearable
                            v-model="item.parametroControleAgua.tipoGatewayId"
                            :items="gatways"
                            item-text="nome"
                            item-value="id"
                            dense
                            :menu-props="{
                              offsetY: true,
                              offsetOverflow: true,
                            }"
                          ></v-select>
                        </v-col>

                        <v-col
                          cols="12"
                          md="6"
                          v-if="
                            item.parametroControleAgua.tipoOperacaoId == 2 ||
                            item.parametroControleAgua.tipoOperacaoId == 3
                          "
                        >
                          <span class="font-weight-bold">Conta Corrente</span>
                          <v-select
                            outlined
                            v-model="item.parametroControleAgua.contaCorrenteId"
                            :items="listaContaCorrentes"
                            item-text="nome"
                            item-value="id"
                            dense
                            :menu-props="{
                              offsetY: true,
                              offsetOverflow: true,
                            }"
                          ></v-select>
                        </v-col>
                      </v-row>

                      <v-card-actions class="justify-start">
                        <v-btn outlined @click="tab = 5" color="primary">
                          <v-icon small right>mdi-arrow-left</v-icon> Voltar
                        </v-btn>
                      </v-card-actions>
                    </v-card-text>
                  </v-card>
                </v-tab-item>

                <v-tab-item>
                  <v-card v-if="subConta == false">
                    <!-- Card Content -->
                    <v-card-text>
                      <div class="pb-5">
                        <p>
                          Para facilitar suas operações financeiras, você pode
                          gerar uma subconta pela Celcash. Isso permitirá
                          gerenciar cobranças de maneira eficiente e organizada.
                        </p>
                        <p>
                          Para prosseguir, precisamos dos seguintes documentos
                          do responsável legal:
                        </p>
                        <ul>
                          <li>
                            Foto do documento de identificação (RG ou CNH).
                          </li>
                          <li>
                            Selfie segurando o documento de identificação.
                          </li>
                        </ul>
                      </div>
                    </v-card-text>
                    <v-card-actions class="justify-start">
                      <v-btn color="primary" @click="GerarSubConta()">
                        Gerar SubConta
                      </v-btn>
                    </v-card-actions>
                    <v-col cols="12" md="6">
                      <v-data-table
                        :headers="headersSubconta"
                        :items="subcontas"
                        item-key="item.id"
                        class="elevation-1"
                        hide-default-footer
                      >
                        <template v-slot:[`item.actions`]="{ item }">
                          <v-menu offset-y transition="scale-transition">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                text
                                v-bind="attrs"
                                v-on="on"
                                tile
                                color="primary"
                              >
                                <v-icon left>mdi-menu-down</v-icon> Ações
                              </v-btn>
                            </template>

                            <v-list>
                              <v-list-item
                                v-if="item.nomeSubconta == 'Celcoin'"
                                @click="consultarSubconta"
                              >
                                <v-list-item-title>
                                  <v-icon left>mdi-search</v-icon> Consultar
                                  Subconta
                                </v-list-item-title>
                              </v-list-item>
                              <v-list-item
                                @click="
                                  (dialogDocumentoSubconta = true),
                                    (tipoSubcontaCriada = item.nomeSubconta)
                                "
                              >
                                <v-list-item-title>
                                  <v-icon left>mdi-search</v-icon> Reenviar
                                  documentos
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-card>
                  <subconta-card :item="subcontaCard" v-else></subconta-card>
                </v-tab-item>
              </v-form>
            </v-tabs-items>
          </v-form>
        </v-card-text>
      </v-card>
    </v-card>
    <documentos-subconta
      :item="item.empresa"
      :parametroId="item.id"
      :operacao="operacaoSubconta"
      v-model="dialogSubconta"
      @fechou="(dialogSubconta = false), Atualizar()"
      @subconta-criada-com-sucesso="abrirDocumentosSubconta"
    ></documentos-subconta>
    <enviarDocumento-subconta
      :parametroId="item.id"
      v-model="dialogDocumentoSubconta"
      :tipo="tipoSubcontaCriada"
      @fechou="dialogDocumentoSubconta = false"
    ></enviarDocumento-subconta>
    <v-dialog
      v-model="dialogConsultaSubconta"
      width="1000"
      persistent
      transition="dialog-bottom-transition"
      no-click-animation
    >
      <v-card>
        <v-toolbar
          flat
          color="primary"
          dark
          elevation="0"
          style="position: sticky; top: 0; z-index: 1"
        >
          <v-btn icon @click="CloseCosulta()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="title font-weight-regular"
            >Consulta de subconta</v-toolbar-title
          >
        </v-toolbar>
        <v-spacer />
        <v-card-text>
          <v-card-title> Situação da subconta: </v-card-title>
          <v-card-text
            ><p>{{ consultaSubconta.situacao }}</p>
          </v-card-text>
          <v-card-title>
            Descrição:
            <v-card-text>
              <v-textarea
                v-model="consultaSubconta.descricao"
                outlined
                readonly
              ></v-textarea>
            </v-card-text>
          </v-card-title>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-overlay :value="loadingConsulta" opacity="0.5">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Empresa, Permissao } from "@/core/models/cadastros";
import {
  ParametroCobranca,
  ParametroFinanceiro,
  ParametroGatway,
} from "@/core/models/financeiro";
import {
  CentroCustoService,
  ContaCorrenteService,
  ContaGerencialService,
  LayoutCobrancaService,
  ParametroFinanceiroService,
  TipoAmortizacaoService,
  TipoGatewayService,
} from "@/core/services/financeiro";
import { EmpresaService } from "@/core/services/compras/EmpresaService";
import * as jsonpatch from "fast-json-patch";
import { TipoOperacaoFinanceiraService } from "@/core/services/contratos";
import { PageBase } from "@/core/models/shared";
import { hasPermissao } from "@/assets/scripts/helper";

@Component
export default class CadastroParametroDespesa extends PageBase {
  @Prop() public item!: ParametroFinanceiro;
  @Prop() public value!: string;

  tiposCobrancas = [
    { id: 13, nome: "Antes", vencido: false },
    { id: 14, nome: "Depois", vencido: true },
  ];

  service = new ParametroFinanceiroService();
  gatway = new ParametroGatway();
  cobranca = new ParametroCobranca();

  empresas = [] as Empresa[];
  tiposGateways: any[] = [];
  listaCentroCusto = [];
  listaContaGerencial = [];
  tiposAmortizacao = [];
  subcontas: any[] = [];
  consultaSubconta: any = {};
  tipoSubcontaCriada = "";
  loadingConsulta = false;

  tiposLayouts = [];
  centroCustosOrdenada = [];
  contaGerenciaisOrdenada = [];
  tiposOperacaoContrato = [];
  listaContaCorrentes = [];
  gatways = [];
  operacaoSubconta = "";

  tab = 0;

  tabActive = 0;
  valid = true;
  dialog = false;
  dialogSubconta = false;
  dialogGateway = false;
  dialogConsultaSubconta = false;
  dialogDocumentoSubconta = false;
  gatwayIndex = -1;
  cobrancaIndex = -1;
  AplicarDiasProtesto = false;
  subConta = false;

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  $refs!: {
    formParametro: HTMLFormElement;
    formGateway: HTMLFormElement;
    formCobranca: HTMLFormElement;
  };

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Tipo", value: "tipoId" },
    { text: "", value: "subconta" },
  ];

  headersSubconta: any[] = [
    ,
    { text: "", value: "actions", sortable: false },
    { text: "Subconta", value: "nomeSubconta" },
    { text: "Situação", value: "situacao" },
  ];

  headersCobranca: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Regra de envio de e-mail", value: "posVencimento" },
  ];

  subcontaCard: any = {};

  abrirDocumentosSubconta(tipo: any) {
    this.dialogSubconta = false;
    this.tipoSubcontaCriada = tipo; // tipo pode ser 'Celcoin' ou outro
    this.$nextTick(() => {
      this.dialogDocumentoSubconta = true;
    });
  }

  isSubconta() {
    this.subcontas = []; // Limpa subcontas anteriores

    const filtrados: any = this.item.gatways.filter(
      (x) =>
        ((x.tipoId == 2 || x.tipoId == 6) && x.galaxPay.isSubconta) ||
        x.globalPay.isSubconta
    );

    filtrados.forEach((y) => {
      this.subcontas.push({
        nomeSubconta: y.tipoId === 2 ? "Celcoin" : "Global pay",
        situacao:
          y.globalPay.isSubcontaAtiva || y.galaxPay.isSubcontaAtiva
            ? "Ativa"
            : "Pendente",
      });
    });
  }
  consultarSubconta() {
    this.loadingConsulta = true;
    this.service
      .ConsultarSubconta(this.item.id, 2)
      .then(
        (res) => {
          this.consultaSubconta = {
            situacao: res.data.ativo ? "Ativa" : "Pendente",
            descricao: res.data.descricao,
          };
          this.loadingConsulta = false;
          this.dialogConsultaSubconta = true;
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
      .finally(() => (this.loadingConsulta = false));
  }

  resetSubconta() {
    this.subConta = false;
    this.subcontaCard = {};
  }

  @Watch("item", { immediate: true, deep: true })
  onItemChange() {
    this.resetSubconta(); // Reseta os dados antes de verificar
  }

  @Watch("gatway")
  Gatway() {
    if (this.$refs.formGateway) {
      this.$refs.formGateway.resetValidation();
    }
  }

  @Watch("cobranca")
  Cobranca() {
    if (this.$refs.formCobranca) {
      this.$refs.formCobranca.resetValidation();
    }
  }
  @Watch("item")
  Item() {
    this.isSubconta();
    if (this.$refs.formParametro) {
      this.$refs.formParametro.resetValidation();
    }
  }

  observer!: jsonpatch.Observer<ParametroFinanceiro>;

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

  Validacoes() {
    if (
      !this.item.empresaId ||
      !this.item.centroCustoReceitalId ||
      !this.item.contaGerenciaReceitalId
    ) {
      this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
      this.tabActive = 0;
      return true;
    }

    /* if(this.item.gatways.length == 0){
      this.$swal("Aviso", "É necessário adicionar pelo menos um Gatway do financeiro.", "warning");
      this.tabActive = 1;
      return true;
    }*/
  }

  Atualizar() {
    this.service
      .ObterPorId(this.item.id, "Gatways.ContasCorrentesSplit, Cobrancas")
      .then(
        (res) => {
          this.item = res.data;
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

  Salvar() {
    this.$refs.formParametro.validate();

    if (!this.Validacoes()) {
      let pacthModel = jsonpatch.generate(this.observer);

      (this.item.id > 0
        ? this.service.Patch(pacthModel, this.item.id)
        : this.service.Salvar(this.item)
      ).then(
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
      );
    }
  }

  AdicionarCobranca() {
    if (this.$refs.formCobranca.validate()) {
      this.cobranca.posVencimento == true
        ? (this.cobranca.layoutCobrancaId = 14)
        : (this.cobranca.layoutCobrancaId = 13);

      if (this.cobrancaIndex == -1) {
        this.item.cobrancas.push(this.cobranca);
      }
      this.cobranca = new ParametroCobranca();
      this.cobrancaIndex = -1;
    }
  }

  EditarCobranca(item) {
    this.cobrancaIndex = this.item.cobrancas.indexOf(item);
    this.cobranca = item;
  }

  ExcluirCobranca(item) {
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja excluir o registro atual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      focusConfirm: true,
      preConfirm: () => {
        if (item.id > 0) {
          item.excluido = true;
          const index = this.item.cobrancas!.indexOf(item);
          delete this.item.cobrancas![index];
          this.dialog = false;
          this.dialog = true;
          return true;
        } else {
          const index = this.item.cobrancas!.indexOf(item);
          this.item.cobrancas!.splice(index, 1);
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

  AdicionarGatway() {
    if (this.$refs.formGateway.validate()) {
      if (this.gatwayIndex > -1) {
        Object.assign(this.item.gatways[this.gatwayIndex], this.gatway);
      } else {
        if (this.item.gatways.find((x) => x.tipoId == this.gatway.tipoId)) {
          this.$swal(
            "Alerta!",
            "Esse Gateway já se encontra na lista",
            "warning"
          );
          return;
        }

        var objetoClone: any = Object.assign({}, this.gatway);
        objetoClone = new ParametroGatway();
        objetoClone.safra = null;
        objetoClone.galaxPay = null;
        objetoClone.tipoId = this.gatway.tipoId;
        objetoClone.encargoFinanceiro = this.gatway.encargoFinanceiro;
        objetoClone.galaxPay = this.gatway.galaxPay;
        objetoClone.safra = this.gatway.safra;

        if (objetoClone.tipoId == 1) {
          objetoClone.safra = null;
          objetoClone.galaxPay = null;
        }
        if (objetoClone.tipoId == 2) {
          objetoClone.safra = null;
        }
        if (objetoClone.tipoId == 3) {
          objetoClone.galaxPay = null;
        }
        this.item.gatways.push(objetoClone);
      }
      this.gatway = new ParametroGatway();
      this.gatwayIndex = -1;
    }
  }

  EditarGatway(item: ParametroGatway) {
    this.gatwayIndex = this.item.gatways.indexOf(item);
    this.gatway = Object.assign({}, item);
  }

  ExcluirGatway(item) {
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
          const index = this.item.gatways!.indexOf(item);
          delete this.item.gatways![index];
          this.dialog = false;
          this.dialog = true;
          return true;
        } else {
          const index = this.item.gatways!.indexOf(item);
          this.item.gatways!.splice(index, 1);
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

  ExibirGateway(item: ParametroGatway) {
    this.gatwayIndex = this.item.gatways.indexOf(item);
    this.gatway = item;
    this.dialogGateway = true;
  }

  FecharGateway() {
    this.gatway = new ParametroGatway();
    this.gatwayIndex = -1;
    this.dialogGateway = false;
  }

  Close() {
    this.FecharGateway();
    this.dialog = false;
  }
  CloseCosulta() {
    this.dialogConsultaSubconta = false;
  }

  GerarSubConta() {
    this.operacaoSubconta = "gerar";
    this.dialogSubconta = true;
  }

  mounted() {
    new TipoGatewayService().ListarTudo().then((res) => {
      this.gatways = res.data.items;
    });

    new TipoAmortizacaoService()
      .ListarTudo()
      .then((res) => (this.tiposAmortizacao = res.data.items));

    new LayoutCobrancaService()
      .ListarTudo()
      .then((res) => (this.tiposLayouts = res.data.items));

    new TipoGatewayService()
      .Listar(-1, -1, ["nome"], [], "", [], "", "", "Id, nome", "")
      .then((res) => (this.tiposGateways = res.data.items));

    new CentroCustoService()
      .Listagem()
      .then((res) => (this.listaCentroCusto = res.data));

    new ContaGerencialService()
      .Listagem()
      .then((res) => (this.listaContaGerencial = res.data));

    new EmpresaService()
      .Listar(-1, -1, ["nome"], [], "", [], "", "", "Id, nome", "")
      .then((res) => (this.empresas = res.data.items));

    new CentroCustoService().Listagem().then((res) => {
      this.centroCustosOrdenada = res.data;
    });

    new ContaGerencialService().Listagem().then((res) => {
      this.contaGerenciaisOrdenada = res.data;
    });

    const tipoOperacaoContrato = new TipoOperacaoFinanceiraService();
    tipoOperacaoContrato.ListarTudo().then((res) => {
      this.tiposOperacaoContrato = res.data.items;
    });

    const contaCorrenteService = new ContaCorrenteService();
    contaCorrenteService.ListarTudo().then((res) => {
      this.listaContaCorrentes = res.data.items;
    });
  }
  get ehMaster(): boolean {
    return hasPermissao(this.app.permissoes, Permissao.master);
  }
}
</script>
<style scoped>
/* Alternativamente, forçando o tamanho do label */
.custom-switch ::v-deep(.v-label) {
  font-size: 14px !important;
}
</style>
