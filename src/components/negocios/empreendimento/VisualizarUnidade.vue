<template>
  <v-dialog width="900" v-model="dialog" no-click-animation>
    <v-card>
      <v-toolbar>
        <v-btn color="primary" icon dark @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <span class="title font-weight-light">Informação da Unidade</span>
        <v-spacer />

        <v-card-actions>
          <v-btn
            @click="ExcluirUnidade(item)"
            text
            v-if="excluir == true && item.situacaoId == 1"
            color="red"
            >Excluir
          </v-btn>
          <v-btn @click="Salvar()" text v-if="salvar" color="primary"
            >Salvar</v-btn
          >
          <v-btn
            @click="GerarContrato()"
            text
            v-if="item.situacaoId == 1"
            color="blue"
            >Gerar contrato<v-icon right dark class="pb-1"
              >mdi-rocket</v-icon
            ></v-btn
          >
        </v-card-actions>

        <template v-slot:extension>
          <v-tabs color="primary" v-model="tabAtivaUnidade">
            <v-tab>Dados Básicos</v-tab>
            <v-tab>Dados Adicionais</v-tab>
            <v-tab v-if="item.planoPagamento">Plano de Pagamento</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items v-model="tabAtivaUnidade">
        <v-tab-item>
          <v-card outlined>
            <v-card-text>
              <v-card-title>
                <span class="title-span">Unidade</span>
              </v-card-title>

              <v-row class="px-3" dense>
                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Nome</span>
                  <v-text-field
                    type="text"
                    v-model="item.nome"
                    outlined
                    dense
                    maxlength="30"
                    counter="30"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Situação</span>
                  <v-select
                    :disabled="item.situacaoId == 3"
                    :items="situacoesPermitidas"
                    item-text="nome"
                    item-value="id"
                    v-model="item.situacaoId"
                    outlined
                    dense
                    :menu-props="{ offsetY: true, offsetOverflow: true }"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="4">
                  <span class="font-weight-bold">Tipo</span>
                  <v-select
                    :items="listaTipos"
                    item-text="nome"
                    item-value="id"
                    v-model="item.tipoId"
                    outlined
                    dense
                    :menu-props="{ offsetY: true, offsetOverflow: true }"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="2">
                  <span class="font-weight-bold">Valor</span>
                  <money-input
                    :disabled="item.planoPagamento"
                    v-model="item.valorVenda"
                    @ValorFormatado="(valor) => (item.valorVenda = valor)"
                  ></money-input>
                </v-col>

                <v-col cols="12" md="4">
                  <span class="font-weight-bold">Plano de Pagamento</span>
                  <v-select
                    clearable
                    v-model="item.modeloPlanoPagamentoId"
                    @change="ObterPlanoPagamento()"
                    :items="planosPagamento"
                    item-text="nome"
                    item-value="id"
                    hint="A opção selecionada mudará o plano de pagamento desta unidade."
                    persistent-hint
                    outlined
                    dense
                    type="number"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="2">
                  <v-switch
                    persistent-hint
                    hint="Atualizar com Plano de pagamento"
                    v-model="item.atualizarComPlanoPagamentoModelo"
                    outlined
                    dense
                  ></v-switch>
                </v-col>

                <v-col cols="12" md="12">
                  <span class="font-weight-bold">Descrição</span>
                  <v-textarea
                    type="text"
                    v-model="item.descricao"
                    outlined
                    dense
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <vcard-endereco :item="item.endereco"></vcard-endereco>
        </v-tab-item>

        <v-tab-item>
          <v-card elevation="1">
            <v-card-text v-if="item.lote && item.tipoId == 1">
              <v-card-title>
                <span class="title-span">Área Padrão do Lote</span>
              </v-card-title>

              <v-row class="px-3" dense>
                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Frente</span>
                  <money-input
                    v-model="item.lote.dimensao.frente"
                    @ValorFormatado="
                      (valor) => (item.lote.dimensao.frente = valor)
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Fundos</span>
                  <money-input
                    v-model="item.lote.dimensao.fundo"
                    @ValorFormatado="
                      (valor) => (item.lote.dimensao.fundo = valor)
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Lado Direito</span>
                  <money-input
                    v-model="item.lote.dimensao.ladoDireito"
                    @ValorFormatado="
                      (valor) => (item.lote.dimensao.ladoDireito = valor)
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Lado Esquerdo</span>
                  <money-input
                    suffix="M²"
                    v-model="item.lote.dimensao.ladoEsquerdo"
                    @ValorFormatado="
                      (valor) => (item.lote.dimensao.ladoEsquerdo = valor)
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Área total</span>
                  <money-input
                    suffix="M²"
                    v-model="item.lote.dimensao.areaTotal"
                    @ValorFormatado="
                      (valor) => (item.lote.dimensao.areaTotal = valor)
                    "
                  />
                </v-col>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      outlined
                      color="primary"
                      class="mt-7"
                      dark
                      v-on="on"
                      @click="dialogLadosAdicionais = true"
                    >
                      <v-icon left>mdi-plus</v-icon> Adicionar
                    </v-btn>
                  </template>
                  <span> Lados adicionais </span>
                </v-tooltip>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="1">
            <v-card-text v-if="item.imovel && item.imovel.infraestrutura">
              <v-card-title>
                <span class="title-span">Informações do Imóvel</span>
              </v-card-title>

              <v-row dense class="px-3">
                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Área total</span>
                  <v-text-field
                    type="number"
                    outlined
                    dense
                    v-model="item.imovel.infraestrutura.dimensao.areaImovel"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Área Terreno</span>
                  <v-text-field
                    outlined
                    v-model="item.imovel.infraestrutura.dimensao.areaTerreno"
                    dense
                    type="number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Coe. Aproveitamento</span>
                  <v-text-field
                    outlined
                    v-model="
                      item.imovel.infraestrutura.dimensao
                        .coeficienteAproveitamento
                    "
                    dense
                    type="number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Qtde de banheiro</span>
                  <v-text-field
                    append-icon="mdi-toilet"
                    outlined
                    v-model="
                      item.imovel.infraestrutura.dimensao.quantidadeBanheiro
                    "
                    dense
                    type="number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Qtde de Quarto</span>
                  <v-text-field
                    append-icon="mdi-bed-king-outline"
                    outlined
                    v-model="
                      item.imovel.infraestrutura.dimensao.quantidadeQuarto
                    "
                    dense
                    type="number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Qtde Vagas</span>
                  <v-text-field
                    append-icon="mdi-garage-variant"
                    outlined
                    v-model="
                      item.imovel.infraestrutura.dimensao.quantidadeVagas
                    "
                    dense
                    type="number"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Zona Uso</span>
                  <v-text-field
                    outlined
                    v-model="item.imovel.infraestrutura.dimensao.zonaUso"
                    dense
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="1">
            <v-card-text>
              <v-card-title>
                <span class="title-span">Confrontantes</span>
              </v-card-title>

              <v-row class="px-3" dense>
                <v-col cols="12" md="4">
                  <span class="text-darken-1 font-weight-bold"
                    >Frente Nome</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.confrontante.frenteNome"
                    dense
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    style="margin-top: 22px"
                    suffix="M²"
                    type="number"
                    outlined
                    v-model="item.confrontante.frente"
                    dense
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <span class="text-darken-1 font-weight-bold">Fundo Nome</span>
                  <v-text-field
                    outlined
                    v-model="item.confrontante.fundoNome"
                    dense
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    style="margin-top: 22px"
                    suffix="M²"
                    type="number"
                    outlined
                    v-model="item.confrontante.fundo"
                    dense
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <span class="text-darken-1 font-weight-bold"
                    >Lado Direito Nome</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.confrontante.ladoDireitoNome"
                    dense
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    style="margin-top: 22px"
                    suffix="M²"
                    type="number"
                    outlined
                    v-model="item.confrontante.ladoDireito"
                    dense
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <span class="text-darken-1 font-weight-bold"
                    >Lado Esquerdo Nome</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.confrontante.ladoEsquerdoNome"
                    dense
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                    style="margin-top: 22px"
                    suffix="M²"
                    type="number"
                    outlined
                    v-model="item.confrontante.ladoEsquerdo"
                    dense
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        outlined
                        color="primary"
                        dark
                        v-on="on"
                        @click="dialogLadosAdicionaisConfrontantes = true"
                      >
                        <v-icon left>mdi-plus</v-icon> Adicionar
                      </v-btn>
                    </template>
                    <span> Lados adicionais </span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="1" v-if="item.imovel && item.tipoId == 2">
            <v-card-text>
              <v-card-title>
                <span class="title-span">Taxas</span>
              </v-card-title>

              <v-row class="px-3">
                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Taxa de lixo</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.codigoLixo"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Código Sequencial</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.codigoSequencial"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Código de água</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.codigoAgua"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Código de energia</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.codigoEnergia"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Código de gás</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.codigoGas"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold">Código SPU</span>
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.codigoSpu"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Apolice Seguro</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.apoliceSeguro"
                    type="number"
                    class="form-control"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold">Caução</span>
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.valorCaucao"
                    type="number"
                    class="form-control"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Código Hidrômetro</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.codigoHidrometro"
                    class="form-control"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Valor do Condomínio</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.valorCondominio"
                    type="number"
                    class="form-control"
                    dense
                  />
                </v-col>
              </v-row>

              <v-card-title>
                <span class="title-span">Taxa Cmb</span>
              </v-card-title>

              <v-row class="px-3">
                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Nº Registro</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.cmb.numeroRegistro"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold">Valor</span>
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.cmb.valor"
                    type="number"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold">Multa</span>
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.cmb.multa"
                    type="number"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold">Vencimento</span>
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.cmb.vencimento"
                    type="date"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>
              </v-row>

              <v-card-title>
                <span class="title-span">Taxa Iptu</span>
              </v-card-title>

              <v-row class="px-3">
                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Nº Registro</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.iptu.numeroRegistro"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Valor Venal</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.iptu.valorVenal"
                    type="number"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold">valor Real</span>
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.iptu.valorRealImposto"
                    type="number"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Valor Taxas</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.iptu.valorTaxas"
                    type="number"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>

                <v-col sm="12" md="3" lg="3" xl="3">
                  <span class="text-darken-1 font-weight-bold"
                    >Valor Total</span
                  >
                  <v-text-field
                    outlined
                    v-model="item.imovel.taxa.iptu.valorTotal"
                    type="number"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card elevation="1" v-if="item.legalizacao">
            <v-card-text>
              <v-card-title>
                <span class="title-span">Legalização</span>
              </v-card-title>

              <v-row class="px-3" dense>
                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Escritura</span>
                  <v-text-field
                    outlined
                    v-model="item.legalizacao.escrituraLavrada"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Matrícula</span>
                  <v-text-field
                    outlined
                    v-model="item.legalizacao.matricula"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">RGI</span>
                  <v-text-field
                    outlined
                    v-model="item.legalizacao.rgi"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Processo</span>
                  <v-text-field
                    outlined
                    v-model="item.legalizacao.numeroProcesso"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <span class="font-weight-bold">Orgão Emissor</span>
                  <v-text-field
                    outlined
                    v-model="item.legalizacao.orgaoEmissor"
                    class="form-control"
                    :counter="60"
                    maxlength="60"
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Cartório</span>
                  <v-select
                    outlined
                    v-model="item.legalizacao.cartorioId"
                    :items="listaCartorio"
                    item-text="nome"
                    item-value="id"
                    dense
                    :menu-props="{ offsetY: true, offsetOverflow: true }"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="3">
                  <span class="text-darken-1 font-weight-bold"
                    >N° do livro</span
                  >
                  <v-text-field
                    type="text"
                    v-model="item.legalizacao.livroNumero"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>

                <v-col sm="12" md="12" lg="12" xl="12">
                  <span class="font-weight-bold">Descrição</span>
                  <v-textarea
                    outlined
                    name
                    v-model="item.legalizacao.observacao"
                    auto-grow
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item v-if="item.planoPagamento">
          <v-card outlined>
            <v-card-text>
              <v-card-title>
                <span class="title-span">Índices e Reajustes</span>
              </v-card-title>

              <v-row class="px-4" dense>
                <v-col cols="12" md="3" lg="3">
                  <v-select
                    hint="Índice de correção"
                    persistent-hint
                    v-model="item.planoPagamento.tipoIndiceId"
                    :items="listaIndices"
                    item-value="id"
                    item-text="nomeEditavel"
                    outlined
                    dense
                    :menu-props="{ offsetY: true, offsetOverflow: true }"
                  />
                </v-col>

                <v-col cols="12" md="3" lg="3">
                  <v-select
                    hint="Intervalo de reajuste"
                    persistent-hint
                    v-model="item.planoPagamento.intervaloReajusteId"
                    :items="tiposIntervalos"
                    item-value="id"
                    item-text="nome"
                    outlined
                    dense
                    :menu-props="{ offsetY: true, offsetOverflow: true }"
                  />
                </v-col>

                <v-col cols="12" md="3" lg="3">
                  <v-select
                    hint="Mês de início do reajuste"
                    persistent-hint
                    v-model="item.planoPagamento.tipoMesReajusteId"
                    :items="inicioContagemReajustesMes"
                    item-value="id"
                    item-text="nome"
                    outlined
                    dense
                    :menu-props="{ offsetY: true, offsetOverflow: true }"
                  />
                </v-col>

                <v-col cols="12" md="3" lg="3">
                  <v-select
                    hint="Ano início do reajuste"
                    persistent-hint
                    v-model="item.planoPagamento.tipoAnoInicioReajusteId"
                    :items="inicioContagemReajustesAno"
                    item-value="id"
                    item-text="nome"
                    outlined
                    dense
                    :menu-props="{ offsetY: true, offsetOverflow: true }"
                  />
                </v-col>
              </v-row>
              <br />

              <template v-if="item.planoPagamento">
                <v-card-title>
                  <span class="title-span">Plano de Pagamento</span>
                </v-card-title>

                <v-row dense class="px-4">
                  <v-col cols="12" md="6" lg="6">
                    <v-select
                      v-model="item.planoPagamento.tipoAmortizacaoId"
                      :items="tabelas.filter((x) => x.id != 3)"
                      item-value="id"
                      item-text="nome"
                      outlined
                      dense
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    />
                  </v-col>

                  <v-col cols="12" md="2" style="margin-top: -5px">
                    <v-switch
                      v-if="item.planoPagamento.tipoAmortizacaoId != 1"
                      v-model="item.planoPagamento.isDFIFixo"
                      label="Fixo"
                    />
                  </v-col>
                </v-row>

                <v-row dense class="px-4">
                  <v-col
                    cols="12"
                    md="3"
                    lg="3"
                    v-if="item.planoPagamento.tipoAmortizacaoId != 1"
                  >
                    <v-text-field
                      hint="Juros"
                      persistent-hint
                      type="number"
                      v-model="item.planoPagamento.jurosTabela"
                      outlined
                      dense
                      suffix="%"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="3"
                    lg="3"
                    v-if="item.planoPagamento.tipoAmortizacaoId != 1"
                  >
                    <money-input
                      @ValorFormatado="
                        (valor) => (item.planoPagamento.taxaGestao = valor)
                      "
                      v-model="item.planoPagamento.taxaGestao"
                      dense
                    />
                    <span
                      style="font-size: 13px"
                      class="pl-3 font-weight-regular"
                      >Taxa de gestão</span
                    >
                  </v-col>

                  <v-col
                    cols="12"
                    md="3"
                    lg="3"
                    v-if="item.planoPagamento.tipoAmortizacaoId != 1"
                  >
                    <money-input
                      @ValorFormatado="
                        (valor) => (item.planoPagamento.seguroMPI = valor)
                      "
                      v-model="item.planoPagamento.seguroMPI"
                      dense
                    />
                    <span
                      style="font-size: 13px"
                      class="pl-3 font-weight-regular"
                      >MPI</span
                    >
                  </v-col>

                  <v-col
                    cols="12"
                    md="3"
                    lg="3"
                    v-if="item.planoPagamento.tipoAmortizacaoId != 1"
                  >
                    <v-text-field
                      hint="DFI"
                      persistent-hint
                      outlined
                      type="number"
                      v-model="item.planoPagamento.seguroDFI"
                      :prefix="
                        item.planoPagamento.isDFIFixo == true ? 'R$' : ''
                      "
                      dense
                      :suffix="
                        item.planoPagamento.isDFIFixo == false ? '%' : ''
                      "
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-select
                      hint="Valor por tipo*"
                      persistent-hint
                      v-model="item.planoPagamento.tipoValorTotalId"
                      :items="tiposPlanosPagamento.filter((x) => x.id != 3)"
                      item-value="id"
                      item-text="nome"
                      outlined
                      dense
                      :menu-props="{ offsetY: true, offsetOverflow: true }"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="3"
                    v-if="item.planoPagamento.tipoValorTotalId == 1"
                  >
                    <money-input
                      @ValorFormatado="
                        (valor) =>
                          (item.planoPagamento.valorMetroQuadrado = valor)
                      "
                      v-model="item.planoPagamento.valorMetroQuadrado"
                      dense
                    />
                    <span
                      style="font-size: 13px"
                      class="pl-3 font-weight-regular"
                      >Valor do M²</span
                    >
                  </v-col>

                  <v-col cols="12" md="3" v-else>
                    <money-input
                      @ValorFormatado="
                        (valor) => (item.planoPagamento.valorUnidade = valor)
                      "
                      v-model="item.planoPagamento.valorUnidade"
                      dense
                    />
                    <span
                      style="font-size: 13px"
                      class="pl-3 font-weight-regular"
                      >Valor da unidade</span
                    >
                  </v-col>

                  <v-col
                    cols="12"
                    md="3"
                    class="desativado"
                    v-if="item.planoPagamento.tipoValorTotalId == 1"
                  >
                    <money-input
                      @ValorFormatado="
                        (valor) => (item.valorTotalUnidade = valor)
                      "
                      v-model="item.valorTotalUnidade"
                      dense
                    />
                    <span
                      style="font-size: 13px"
                      class="pl-3 font-weight-regular"
                      >Valor da unidade</span
                    >
                  </v-col>
                </v-row>
              </template>
              <br />
              <v-card-title>
                <span class="title-span">Configuração da Receita</span>
              </v-card-title>

              <template v-if="item.planoPagamento">
                <template>
                  <v-tabs v-model="tabPrazos">
                    <v-tab>Financiamento</v-tab>
                    <v-tab>Entrada</v-tab>
                    <v-tab>Intermediária</v-tab>
                  </v-tabs>
                </template>

                <v-tabs-items v-model="tabPrazos">
                  <v-tab-item>
                    <v-card>
                      <v-card-text>
                        <v-row dense>
                          <v-col class="pt-2" cols="12" sm="4" md="4" lg="4">
                            <v-switch
                              hint="As parcelas do financiamento serão geradas após as parcelas de entrada."
                              persistent-hint
                              v-model="
                                item.planoPagamento.financiamento
                                  .gerarFinanciamentoPosEntrada
                              "
                              label="Pós entrada"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" sm="4" md="4" lg="4">
                            <v-switch
                              hint="As parcelas do financiamento serão geradas sem causar sobreposições com as parcelas da intermediária."
                              persistent-hint
                              v-model="
                                item.planoPagamento.financiamento
                                  .gerarFinanciamentoComIntermediaria
                              "
                              label="Não Gerar financiamento com intermediaria"
                            ></v-switch>
                          </v-col>
                        </v-row>

                        <v-row dense>
                          <v-col cols="12" md="3" class="desativado">
                            <money-input
                              @ValorFormatado="
                                (valor) =>
                                  (item.valorFinanciamentoPlanoPagamento =
                                    valor)
                              "
                              v-model="item.valorFinanciamentoPlanoPagamento"
                              dense
                            />
                            <span
                              style="font-size: 13px"
                              class="pl-3 font-weight-regular"
                              >Valor total financiamento</span
                            >
                          </v-col>

                          <!-- <v-col cols="12" sm="5" md="3" lg="3">
                          <v-select hint="Intervalo" persistent-hint disabled v-model="item.planoPagamento.financiamento.tipoIntervaloParcelaId" :items="tiposIntervaloParcelas" item-value="id" item-text="nome" outlined dense :menu-props="{ offsetY: true, offsetOverflow: true }"/>
                        </v-col> -->

                          <v-col cols="12" sm="5" md="3" lg="3">
                            <v-select
                              hint="Qtde de parcelas"
                              persistent-hint
                              v-model="item.planoPagamento.financiamento.prazo"
                              :items="
                                item.planoPagamento.financiamento
                                  .prazosDisponiveis
                              "
                              outlined
                              dense
                              :menu-props="{
                                offsetY: true,
                                offsetOverflow: true,
                              }"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>

                  <v-tab-item>
                    <v-card>
                      <v-card-text>
                        <v-row dense>
                          <v-col
                            cols="12"
                            md="3"
                            class="desativado"
                            v-if="item.planoPagamento.entrada.tipoId == 3"
                          >
                            <money-input
                              @ValorFormatado="
                                (valor) =>
                                  (item.valorEntradaPlanoPagamento = valor)
                              "
                              v-model="item.valorEntradaPlanoPagamento"
                              dense
                            />
                            <span
                              style="font-size: 13px"
                              class="pl-3 font-weight-regular"
                              >Valor total da Entrada</span
                            >
                          </v-col>
                        </v-row>

                        <v-row dense>
                          <v-col cols="12" sm="5" md="3" lg="3">
                            <v-select
                              hint="Tipo de entrada"
                              persistent-hint
                              v-model="item.planoPagamento.entrada.tipoId"
                              :items="
                                tiposPlanosPagamento.filter((x) => x.id != 1)
                              "
                              item-value="id"
                              item-text="nome"
                              outlined
                              dense
                              :menu-props="{
                                offsetY: true,
                                offsetOverflow: true,
                              }"
                            />
                          </v-col>

                          <v-col
                            cols="12"
                            sm="5"
                            md="3"
                            lg="3"
                            v-if="item.planoPagamento.entrada.tipoId == 2"
                          >
                            <money-input
                              v-model="item.planoPagamento.entrada.valor"
                              @ValorFormatado="
                                (valor) =>
                                  (item.planoPagamento.entrada.valor = valor)
                              "
                              dense
                            />
                            <span
                              style="font-size: 13px"
                              class="pl-3 font-weight-regular"
                              >Valor</span
                            >
                          </v-col>

                          <v-col
                            cols="12"
                            sm="5"
                            md="3"
                            lg="3"
                            v-if="item.planoPagamento.entrada.tipoId == 3"
                          >
                            <v-text-field
                              persistent-hint
                              hint="Este percentual será em base no valor da unidade"
                              suffix="%"
                              type="number"
                              v-model="
                                item.planoPagamento.entrada
                                  .porcentagemValorTotal
                              "
                              outlined
                              dense
                            />
                          </v-col>

                          <!-- <v-col cols="12" sm="5" md="3" lg="3">
                          <v-select hint="Intervalo das parcelas" persistent-hint disabled v-model="item.planoPagamento.entrada.tipoIntervaloParcelaId" :items="tiposIntervaloParcelas" item-value="id" item-text="nome" outlined dense :menu-props="{ offsetY: true, offsetOverflow: true }"/>
                        </v-col>    -->

                          <v-col cols="12" sm="5" md="3" lg="3">
                            <v-select
                              hint="Qtde de parcelas"
                              persistent-hint
                              v-model="item.planoPagamento.entrada.prazo"
                              :items="
                                item.planoPagamento.entrada.prazosDisponiveis
                              "
                              outlined
                              dense
                              :menu-props="{
                                offsetY: true,
                                offsetOverflow: true,
                              }"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>

                  <v-tab-item>
                    <v-card>
                      <v-card-text>
                        <v-row dense>
                          <v-col
                            cols="12"
                            md="3"
                            class="desativado"
                            v-if="item.planoPagamento.intermediaria.tipoId == 3"
                          >
                            <money-input
                              @ValorFormatado="
                                (valor) =>
                                  (item.valorIntermediariaPlanoPagamento =
                                    valor)
                              "
                              v-model="item.valorIntermediariaPlanoPagamento"
                              dense
                            />
                            <span
                              style="font-size: 13px"
                              class="pl-3 font-weight-regular"
                              >Valor total Intermediária</span
                            >
                          </v-col>
                        </v-row>

                        <v-row dense>
                          <v-col cols="12" sm="5" md="3" lg="3">
                            <v-select
                              hint="Tipo"
                              persistent-hint
                              v-model="item.planoPagamento.intermediaria.tipoId"
                              :items="
                                tiposPlanosPagamento.filter((x) => x.id != 1)
                              "
                              item-value="id"
                              item-text="nome"
                              outlined
                              dense
                              :menu-props="{
                                offsetY: true,
                                offsetOverflow: true,
                              }"
                            />
                          </v-col>

                          <v-col
                            cols="12"
                            sm="5"
                            md="3"
                            lg="3"
                            v-if="item.planoPagamento.intermediaria.tipoId == 2"
                          >
                            <money-input
                              hint="Valor total"
                              v-model="item.planoPagamento.intermediaria.valor"
                              @ValorFormatado="
                                (valor) =>
                                  (item.planoPagamento.intermediaria.valor =
                                    valor)
                              "
                            />
                            <span
                              style="font-size: 13px"
                              class="pl-3 font-weight-regular"
                              >Valor total</span
                            >
                          </v-col>

                          <v-col
                            cols="12"
                            sm="5"
                            md="3"
                            lg="3"
                            v-if="item.planoPagamento.intermediaria.tipoId == 3"
                          >
                            <v-text-field
                              hint="Este percentual será em base no valor da unidade"
                              persistent-hint
                              suffix="%"
                              type="number"
                              v-model="
                                item.planoPagamento.intermediaria
                                  .porcentagemValorTotal
                              "
                              outlined
                              dense
                            />
                          </v-col>

                          <v-col cols="12" sm="5" md="3" lg="3">
                            <v-select
                              hint="Intervalo das parcelas"
                              persistent-hint
                              v-model="
                                item.planoPagamento.intermediaria
                                  .tipoIntervaloParcelaId
                              "
                              :items="tiposIntervaloParcelas"
                              item-value="id"
                              item-text="nome"
                              outlined
                              dense
                              :menu-props="{
                                offsetY: true,
                                offsetOverflow: true,
                              }"
                            />
                          </v-col>

                          <v-col cols="12" sm="5" md="3" lg="3">
                            <v-select
                              hint="Qtde de parcelas"
                              persistent-hint
                              v-model="item.planoPagamento.intermediaria.prazo"
                              :items="
                                item.planoPagamento.intermediaria
                                  .prazosDisponiveis
                              "
                              outlined
                              dense
                              :menu-props="{
                                offsetY: true,
                                offsetOverflow: true,
                              }"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs-items>
              </template>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>

      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="50" />
      </v-overlay>
    </v-card>

    <lados-adicionais
      v-model="dialogLadosAdicionaisConfrontantes"
      :lista="item.confrontantesAdicionais"
      :patch="false"
      @salvou="dialogLadosAdicionaisConfrontantes = false"
      @fechou="dialogLadosAdicionaisConfrontantes = false"
    ></lados-adicionais>
    <lados-adicionais
      v-if="item.lote"
      v-model="dialogLadosAdicionais"
      :lista="item.lote.ladosAdicionais"
      :patch="false"
      @salvou="dialogLadosAdicionais = false"
      @fechou="dialogLadosAdicionais = false"
    ></lados-adicionais>
    <novo-cadastro-contrato
      v-model="dialogCadastro"
      :item="contrato"
      @fechou="dialogCadastro = false"
      @salvou="CloseContrato()"
    ></novo-cadastro-contrato>
  </v-dialog>
</template> 
 
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Contrato, Unidade } from "@/core/models/cadastros";
import {
  EmpreendimentoService,
  SituacaoUnidadeService,
  TipoIndiceService,
  TipoUnidadeService,
} from "@/core/services/cadastros";
import { CartorioService } from "@/core/services/imobiliaria";
import {
  PlanoPagamentoService,
  TipoAnoInicioReajusteService,
  TipoIntervaloParcelasService,
  TipoMesReajusteService,
  TipoPlanoPagamentoService,
} from "@/core/services/contratos";
import {
  IntervaloReajusteService,
  TipoAmortizacaoService,
} from "@/core/services/financeiro";
import { PlanoPagamentoModelo } from "@/core/models/contratos";

@Component
export default class CadastroMapaInterativo extends Vue {
  @Prop() public item!: Unidade;
  @Prop() public value!: string;
  @Prop() public excluir!: boolean;
  @Prop() public salvar!: boolean;

  tabAtivaUnidade = 0;
  tabPrazos = 0;

  contrato = new Contrato();
  service = new EmpreendimentoService();

  listaSituacao = [];
  listaTipos = [];
  listaCartorio = [];
  planosPagamento = [];
  tiposIntervaloParcelas = [];
  inicioContagemReajustesAno = [];
  tiposPlanosPagamento = [];
  inicioContagemReajustesMes = [];
  listaIndices = [];
  tabelas = [];
  tiposIntervalos = [];

  dialogLadosAdicionais: boolean = false;
  dialogLadosAdicionaisConfrontantes: boolean = false;
  dialogCadastro: boolean = false;
  overlay: boolean = false;
  valid: boolean = true;
  dialog: boolean = false;

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

  @Watch("item.planoPagamento.tipoValorTotalId")
  @Watch("item.planoPagamento.valorUnidade")
  CalcularValorFixo() {
    if (
      this.item.planoPagamento != null &&
      this.item.planoPagamento.tipoValorTotalId == 2
    ) {
      this.item.valorVenda = this.item.planoPagamento.valorUnidade;
    }
  }

  @Watch("item.planoPagamento.tipoValorTotalId")
  @Watch("item.planoPagamento.valorMetroQuadrado")
  CalcularValorMetroQuadrado() {
    if (
      this.item.planoPagamento != null &&
      this.item.planoPagamento.tipoValorTotalId == 1
    ) {
      this.item.valorTotalUnidade = Number(
        this.item.planoPagamento.valorMetroQuadrado *
          this.item.lote!.dimensao.areaTotal
      );
      this.item.valorVenda = this.item.valorTotalUnidade;
    }
  }

  Close() {
    this.dialog = false;
    this.tabAtivaUnidade = 0;
  }

  GerarContrato() {
    this.contrato = new Contrato();
    this.contrato.unidadePrincipalId = this.item.id;
    this.contrato.tipoId = this.item.tipoId;
    this.contrato.grupoId = this.item.grupoId;
    this.contrato.empreendimentoId = this.item.grupo!.empreendimentoId;
    this.dialogCadastro = true;
  }

  CloseContrato() {
    this.$emit("salvou");
    this.dialog = false;
    this.dialogCadastro = false;
  }

  Salvar() {
    if (this.item.id > 0) {
      let modelo = this.item;

      this.service.SalvarUnidade(this.item.id, modelo).then(
        (res) => {
          this.$swal(
            "Aviso",
            "Operação realizada com sucesso!",
            res.status == 201 || res.status == 200 ? "success" : "warning"
          );
          this.$emit("salvou");
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
    this.Close();
  }

  ExcluirUnidade(item) {
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
          this.service
            .ExcluirUnidade(item.id)
            .then(
              (res) => {
                if (res.status == 200) {
                  this.$emit("salvou");
                }
              },
              (err) => {
                if (!err.response) {
                  this.$swal(
                    "Aviso",
                    "Não foi possível acessar a API",
                    "error"
                  );
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
            .finally(() => this.Close());
        }
      },
      //@ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    });
  }

  get situacoesPermitidas() {
    const situacoesPermitidas = this.listaSituacao.filter(
      (situacao: any) => situacao.id !== 4
    );
    return situacoesPermitidas;
  }

  ObterPlanoPagamento() {
    if (this.item.modeloPlanoPagamentoId > 0) {
      new PlanoPagamentoService()
        .ObterPorId(this.item.modeloPlanoPagamentoId)
        .then(
          (res) => {
            if (this.item.planoPagamento) {
              const idOriginal = this.item.planoPagamento.id;
              this.item.planoPagamento = {
                ...new PlanoPagamentoModelo(res.data),
                id: idOriginal,
              };
            } else {
              this.item.planoPagamento = {
                ...new PlanoPagamentoModelo(res.data),
                id: 0,
              };
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
    } else {
      this.item.planoPagamento = null;
    }
  }

  mounted() {
    new TipoIntervaloParcelasService().ListarTudo().then((res) => {
      this.tiposIntervaloParcelas = res.data.items;
    });

    new PlanoPagamentoService().ListarTudo().then((res) => {
      this.planosPagamento = res.data.items;
    });

    new SituacaoUnidadeService().ListarTudo().then((res) => {
      this.listaSituacao = res.data.items;
    });

    new CartorioService().ListarTudo().then((res) => {
      this.listaCartorio = res.data.items;
    });

    new TipoUnidadeService().ListarTudo().then((res) => {
      this.listaTipos = res.data.items;
    });

    new TipoAnoInicioReajusteService().ListarTudo().then((res) => {
      this.inicioContagemReajustesAno = res.data.items;
    });

    new TipoPlanoPagamentoService().ListarTudo().then((res) => {
      this.tiposPlanosPagamento = res.data.items;
    });

    new TipoMesReajusteService().ListarTudo().then((res) => {
      this.inicioContagemReajustesMes = res.data.items;
    });

    new TipoIndiceService().ListarTudo().then((res) => {
      this.listaIndices = res.data.items;
    });

    new TipoAmortizacaoService().ListarTudo().then((res) => {
      this.tabelas = res.data.items;
    });

    new IntervaloReajusteService().ListarTudo().then((res) => {
      this.tiposIntervalos = res.data.items;
    });
  }
}
</script>
<style scoped>
.desativado {
  pointer-events: none;
  opacity: 0.5; /* ou outro valor que você preferir */
}
</style>
