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
        <v-toolbar-title>
          {{ item.id > 0 ? item.nome : " Cadastro do Empreendimento" }}
        </v-toolbar-title>
        <v-spacer />

        <v-toolbar-items>
          <v-btn dark text @click="Salvar()" :loading="overlayEmpreendimento"
            >Salvar</v-btn
          >
        </v-toolbar-items>

        <template v-slot:extension>
          <v-tabs v-model="tabAtiva" background-color="primary">
            <v-tab>Dados do Empreendimento</v-tab>
            <v-tab>Sócios</v-tab>
            <v-tab>Corretores</v-tab>
            <v-tab @click="GetDocumentos()">Documentos</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-form ref="formEmpreendimento" v-model="valid" lazy-validation>
        <v-tabs-items v-model="tabAtiva">
          <v-tab-item>
            <v-card flat>
              <v-row dense no-gutters>
                <v-col cols="12" md="3" lg="3">
                  <v-card flat class="pa-2">
                    <v-row
                      v-if="loadingFotoPrincipal"
                      justify="center"
                      align="center"
                      class="py-6"
                      style="height: 200px; width: 200px; margin: 0 auto"
                    >
                      <v-col
                        cols="12"
                        class="d-flex justify-center align-center"
                        style="height: 100%"
                      >
                        <v-progress-circular
                          indeterminate
                          color="primary"
                          size="30"
                        />
                      </v-col>
                    </v-row>
                    <v-row v-else justify="center" class="py-6">
                      <v-img
                        v-if="empreendimento?.imagemPrincipal"
                        :src="empreendimento.imagemPrincipal"
                        max-width="75%"
                        height="210"
                      />
                      <v-img
                        v-else
                        src="../../../assets/images/default/default-img2.jpg"
                        max-width="75%"
                        height="210"
                      />
                    </v-row>

                    <div class="text-center py-3">
                      <v-btn
                        outlined
                        color="primary"
                        class="text-none"
                        depressed
                        @click="Upload"
                      >
                        <v-icon left>mdi-camera </v-icon>
                        {{ imgUrl ? "Alterar foto" : "Adicionar Foto" }}
                      </v-btn>
                      <input
                        ref="uploader"
                        class="d-none"
                        type="file"
                        accept="image/*"
                        @change="(e) => enviarImagem(e, 'fotoPrincipal')"
                      />
                    </div>
                  </v-card>

                  <v-card flat class="pa-2">
                    <v-card-text>
                      <v-card-title class="justify-center">
                        <span class="title-span">Situação das Unidades</span>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title> </v-list-item-title>
                            <v-list-item-subtitle class="d-flex justify-center">
                              {{
                                grupos.reduce(
                                  (total, x) => total + x.quantidadeUnidade,
                                  0
                                )
                              }}
                              unidades
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-card-title>

                      <v-list>
                        <v-list-item>
                          <v-list-item-content>
                            <div class="d-flex flex-column justify-center">
                              <v-list-item-title>Disponíveis</v-list-item-title>
                              <v-list-item-subtitle
                                class="d-flex justify-center"
                                >{{
                                  grupos.reduce(
                                    (total, x) =>
                                      total + x.quantidadeUnidadesDisponivel,
                                    0
                                  )
                                }}
                                unidades</v-list-item-subtitle
                              >
                            </div>
                          </v-list-item-content>

                          <v-list-item-content>
                            <div class="d-flex flex-column justify-center">
                              <v-list-item-title
                                >Indisponíveis</v-list-item-title
                              >
                              <v-list-item-subtitle
                                class="d-flex justify-center"
                              >
                                {{
                                  grupos.reduce(
                                    (total, x) =>
                                      total + x.quantidadeUnidadesIndisponivel,
                                    0
                                  )
                                }}
                                unidades</v-list-item-subtitle
                              >
                            </div>
                          </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>
                            <div class="d-flex flex-column justify-center">
                              <v-list-item-title>Vendidas</v-list-item-title>
                              <v-list-item-subtitle
                                class="d-flex justify-center"
                                >{{
                                  grupos.reduce(
                                    (total, x) =>
                                      total + x.quantidadeUnidadesVendido,
                                    0
                                  )
                                }}
                                unidades</v-list-item-subtitle
                              >
                            </div>
                          </v-list-item-content>

                          <v-list-item-content>
                            <div class="d-flex flex-column justify-center">
                              <v-list-item-title>Reservadas</v-list-item-title>
                              <v-list-item-subtitle
                                class="d-flex justify-center"
                                >{{
                                  grupos.reduce(
                                    (total, x) =>
                                      total + x.quantidadeUnidadesReservado,
                                    0
                                  )
                                }}
                                unidades</v-list-item-subtitle
                              >
                            </div>
                          </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>
                            <div class="d-flex flex-column justify-center">
                              <v-list-item-title>Invadidas</v-list-item-title>
                              <v-list-item-subtitle
                                class="d-flex justify-center"
                                >{{
                                  grupos.reduce(
                                    (total, x) =>
                                      total + x.quantidadeUnidadesInvadido,
                                    0
                                  )
                                }}
                                unidades</v-list-item-subtitle
                              >
                            </div>
                          </v-list-item-content>

                          <v-list-item-content>
                            <div class="d-flex flex-column justify-center">
                              <v-list-item-title>Penhoradas</v-list-item-title>
                              <v-list-item-subtitle
                                class="d-flex justify-center"
                                >{{
                                  grupos.reduce(
                                    (total, x) =>
                                      total + x.quantidadeUnidadesPenhorado,
                                    0
                                  )
                                }}
                                unidades</v-list-item-subtitle
                              >
                            </div>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="9" lg="9">
                  <v-toolbar flat dense height="2px">
                    <template v-slot:extension>
                      <v-tabs v-model="subTabActive">
                        <v-tab>Dados básicos</v-tab>
                        <v-tab :disabled="iconeDados == 'mdi-lock'"
                          >Dados adicionais
                          <v-icon class="pb-1" small>
                            {{ iconeDados }}
                          </v-icon></v-tab
                        >
                        <v-tab :disabled="iconeDados == 'mdi-lock'"
                          >Descrição
                          <v-icon class="pb-1" small>
                            {{ iconeDados }}
                          </v-icon></v-tab
                        >
                        <v-tab :disabled="iconeGrupos == 'mdi-lock'">
                          {{ grupos.length > 0 ? "Grupos" : "Disponibilidade" }}
                          <v-icon class="pb-1" small>
                            {{ iconeGrupos }}
                          </v-icon></v-tab
                        >
                        <v-tab :disabled="inconeUnidades == 'mdi-lock'"
                          >Infraestrutura
                          <v-icon class="pb-1" small>
                            {{ inconeUnidades }}
                          </v-icon>
                        </v-tab>
                      </v-tabs>
                    </template>
                  </v-toolbar>

                  <v-tabs-items v-model="subTabActive">
                    <v-tab-item>
                      <v-card elevation="1">
                        <v-card-text>
                          <v-card-title>
                            <v-icon large left color="primary"
                              >mdi-information</v-icon
                            >
                            <span class="title-span"
                              >Informação do Empreendimento</span
                            >
                          </v-card-title>

                          <v-row class="pt-3 px-3" dense>
                            <v-col cols="12" md="8">
                              <span class="font-weight-bold">Nome</span>
                              <v-text-field
                                outlined
                                v-model="item.nome"
                                dense
                                :rules="fieldRules"
                                :counter="60"
                                maxlength="60"
                              />
                            </v-col>

                            <v-col cols="12" md="4">
                              <span class="font-weight-bold">Empresa</span>
                              <v-select
                                outlined
                                v-model="item.empresaId"
                                :items="listaEmpresa"
                                item-text="nomeFantasia"
                                item-value="id"
                                :rules="fieldRules"
                                dense
                                :menu-props="{
                                  offsetY: true,
                                  offsetOverflow: true,
                                }"
                              />
                            </v-col>

                            <v-col cols="12" md="4">
                              <span class="font-weight-bold">Tipo</span>
                              <v-select
                                outlined
                                v-model="item.tipoId"
                                :items="listaTipoEmpreendimento"
                                item-text="nome"
                                item-value="id"
                                :rules="fieldRules"
                                dense
                                :menu-props="{
                                  offsetY: true,
                                  offsetOverflow: true,
                                }"
                              />
                            </v-col>
                          </v-row>
                        </v-card-text>

                        <br />
                        <v-card
                          elevation="0"
                          v-if="item.tipoId != 3 && item.infraestrutura"
                        >
                          <div
                            id="collapseDVR3"
                            class="panel-collapse collapse in"
                          >
                            <!-- Cabeçalhos -->
                            <div class="d-flex">
                              <div style="width: 50px; color: #757575"></div>
                              <div style="margin-left: 220px; color: #757575">
                                ESPECIFICAÇÕES
                              </div>
                              <div style="margin-left: 260px; color: #757575">
                                ÁREA (M2)
                              </div>
                            </div>

                            <div class="tree">
                              <ul>
                                <li>
                                  1
                                  <span style="margin-left: 200px"
                                    >Área das Unidades</span
                                  >
                                  <money-input
                                    style="
                                      margin-top: -45px;
                                      margin-left: 250px;
                                      width: 250px;
                                    "
                                    v-model="item.infraestrutura.areaUnidade"
                                    @ValorFormatado="
                                      (valor) =>
                                        (item.infraestrutura.areaUnidade =
                                          valor)
                                    "
                                  ></money-input>

                                  <ul>
                                    <li>
                                      2
                                      <span
                                        style="
                                          margin-left: 170px;
                                          font-weight: 500;
                                        "
                                        >Total de Área Públicas</span
                                      >
                                      <money-input
                                        style="
                                          pointer-events: none;
                                          background-color: #f5f5f5;
                                          margin-top: -45px;
                                          margin-left: 225px;
                                          width: 250px;
                                        "
                                        disabled
                                        v-model="totalAreaPublica"
                                        @ValorFormatado="
                                          (valor) => (totalAreaPublica = valor)
                                        "
                                      ></money-input>
                                      <ul>
                                        <li>
                                          2.1
                                          <span style="margin-left: 130px"
                                            >Sistema Viário</span
                                          >
                                          <money-input
                                            style="
                                              margin-top: -45px;
                                              margin-left: 280px;
                                              width: 250px;
                                            "
                                            v-model="
                                              item.infraestrutura.areaRua
                                            "
                                            @ValorFormatado="
                                              (valor) =>
                                                (item.infraestrutura.areaRua =
                                                  valor)
                                            "
                                          ></money-input>
                                        </li>
                                        <li>
                                          2.2
                                          <span style="margin-left: 130px"
                                            >Áreas Institucionais</span
                                          >
                                          <money-input
                                            style="
                                              margin-top: -45px;
                                              margin-left: 244px;
                                              width: 250px;
                                            "
                                            v-model="
                                              item.infraestrutura.areaPrefeitura
                                            "
                                            @ValorFormatado="
                                              (valor) =>
                                                (item.infraestrutura.areaPrefeitura =
                                                  valor)
                                            "
                                          ></money-input>
                                        </li>
                                        <li>
                                          2.3
                                          <span
                                            style="
                                              margin-left: 130px;
                                              font-weight: 500;
                                            "
                                            >Espaços Livres de Uso
                                            Públicos</span
                                          >

                                          <money-input
                                            style="
                                              pointer-events: none;
                                              background-color: #f5f5f5;
                                              margin-top: -45px;
                                              margin-left: 160px;
                                              width: 250px;
                                            "
                                            disabled
                                            v-model="espacoLivrePublico"
                                            @ValorFormatado="
                                              (valor) =>
                                                (espacoLivrePublico = valor)
                                            "
                                          ></money-input>

                                          <ul>
                                            <li>
                                              2.3.1
                                              <span style="margin-left: 90px"
                                                >Área verde / APP</span
                                              >
                                              <money-input
                                                style="
                                                  margin-top: -45px;
                                                  margin-left: 264px;
                                                  width: 250px;
                                                "
                                                v-model="
                                                  item.infraestrutura.areaVerde
                                                "
                                                @ValorFormatado="
                                                  (valor) =>
                                                    (item.infraestrutura.areaVerde =
                                                      valor)
                                                "
                                              ></money-input>
                                            </li>
                                            <li>
                                              2.3.2
                                              <span style="margin-left: 90px"
                                                >Sistema de Lazer</span
                                              >

                                              <money-input
                                                style="
                                                  margin-top: -45px;
                                                  margin-left: 263px;
                                                  width: 250px;
                                                "
                                                v-model="
                                                  item.infraestrutura.areaOutras
                                                "
                                                @ValorFormatado="
                                                  (valor) =>
                                                    (item.infraestrutura.areaOutras =
                                                      valor)
                                                "
                                              ></money-input>
                                            </li>
                                          </ul>
                                        </li>
                                      </ul>
                                    </li>

                                    <li>
                                      3
                                      <span style="margin-left: 170px"
                                        >Outras Áreas</span
                                      >

                                      <money-input
                                        style="
                                          margin-top: -45px;
                                          margin-left: 298px;
                                          width: 250px;
                                        "
                                        v-model="
                                          item.infraestrutura
                                            .areaReservadoProprietario
                                        "
                                        @ValorFormatado="
                                          (valor) =>
                                            (item.infraestrutura.areaReservadoProprietario =
                                              valor)
                                        "
                                      ></money-input>
                                    </li>
                                    <li>
                                      4
                                      <span
                                        style="
                                          margin-left: 170px;
                                          font-weight: 500;
                                        "
                                        >Área Total Loteada</span
                                      >

                                      <money-input
                                        disabled
                                        style="
                                          pointer-events: none;
                                          background-color: #f5f5f5;
                                          margin-top: -45px;
                                          margin-left: 257px;
                                          width: 250px;
                                        "
                                        v-model="areaTotalLoteada"
                                        @ValorFormatado="
                                          (valor) => (areaTotalLoteada = valor)
                                        "
                                      ></money-input>
                                    </li>
                                  </ul>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </v-card>

                        <vcard-endereco :item="item.endereco" />
                      </v-card>
                      <br />
                    </v-tab-item>

                    <v-tab-item>
                      <v-card elevation="1">
                        <v-card-text
                          v-if="
                            item.tipoId == 1 &&
                            item.infraestrutura.dimensaoLotePadrao
                          "
                        >
                          <v-card-title>
                            <span class="title-span">Área padrão do Lote</span>
                          </v-card-title>

                          <v-row class="px-3 pt-3" dense>
                            <v-col cols="12" md="3">
                              <span class="font-weight-bold">Frente</span>
                              <v-text-field
                                type="number"
                                @input="
                                  item.infraestrutura.dimensaoLotePadrao.areaTotal =
                                    item.infraestrutura.dimensaoLotePadrao
                                      .frente *
                                    item.infraestrutura.dimensaoLotePadrao
                                      .ladoDireito
                                "
                                outlined
                                v-model="
                                  item.infraestrutura.dimensaoLotePadrao.frente
                                "
                                dense
                              />
                            </v-col>

                            <v-col cols="12" md="3">
                              <span class="font-weight-bold">Lado Direito</span>
                              <v-text-field
                                type="number"
                                @input="
                                  item.infraestrutura.dimensaoLotePadrao.areaTotal =
                                    item.infraestrutura.dimensaoLotePadrao
                                      .frente *
                                    item.infraestrutura.dimensaoLotePadrao
                                      .ladoDireito
                                "
                                outlined
                                dense
                                v-model="
                                  item.infraestrutura.dimensaoLotePadrao
                                    .ladoDireito
                                "
                              />
                            </v-col>

                            <v-col cols="12" md="3">
                              <span class="font-weight-bold"
                                >Lado Esquerdo</span
                              >
                              <v-text-field
                                type="number"
                                outlined
                                dense
                                v-model="
                                  item.infraestrutura.dimensaoLotePadrao
                                    .ladoEsquerdo
                                "
                              />
                            </v-col>

                            <v-col cols="12" md="3">
                              <span class="font-weight-bold">Fundos</span>
                              <v-text-field
                                type="number"
                                outlined
                                v-model="
                                  item.infraestrutura.dimensaoLotePadrao.fundo
                                "
                                dense
                              />
                            </v-col>

                            <v-col cols="12" md="3">
                              <span class="font-weight-bold">Área total</span>
                              <v-text-field
                                type="number"
                                outlined
                                dense
                                v-model="
                                  item.infraestrutura.dimensaoLotePadrao
                                    .areaTotal
                                "
                              />
                            </v-col>

                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  icon
                                  color="primary"
                                  class="mt-6"
                                  dark
                                  v-on="on"
                                  @click="dialogLadosAdicionais = true"
                                >
                                  <v-icon>mdi-plus</v-icon>
                                </v-btn>
                              </template>
                              <span> Lados adicionais </span>
                            </v-tooltip>
                          </v-row>
                        </v-card-text>
                      </v-card>
                      <br />

                      <v-card elevation="1">
                        <v-card-text v-if="item.legalizacao">
                          <v-card-title>
                            <span class="title-span">Plano de Pagamento</span>
                          </v-card-title>

                          <v-row class="px-3 pt-3" dense>
                            <v-col cols="12" md="5">
                              <div class="d-flex align-center">
                                <span class="font-weight-bold"
                                  >Selecione o Plano de pagamento</span
                                >
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                      color="primary"
                                      v-bind="attrs"
                                      v-on="on"
                                      class="ml-2"
                                      small
                                      >mdi-information-outline</v-icon
                                    >
                                  </template>
                                  <span
                                    >A opção selecionada será atribuída às
                                    unidades deste empreendimento e poderá ser
                                    alterada em cada unidade.</span
                                  >
                                </v-tooltip>
                              </div>

                              <v-select
                                @change="
                                  SelecionarPlano(item.planoPagamentoModeloId)
                                "
                                clearable
                                :items="planosPagamento"
                                item-text="nome"
                                item-value="id"
                                persistent-hint
                                outlined
                                v-model="item.planoPagamentoModeloId"
                                dense
                                type="number"
                              />
                            </v-col>

                            <v-col cols="12" md="4">
                              <v-menu
                                v-if="item.planoPagamentoModeloId"
                                bottom
                                left
                                :close-on-content-click="false"
                                offset-y
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon
                                    v-bind="attrs"
                                    v-on="on"
                                    class="ml-2 mt-8 cursor-pointer"
                                    @click="dialogPlano = true"
                                    >mdi-file-search-outline</v-icon
                                  >
                                </template>
                              </v-menu>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                      <br />

                      <v-card elevation="1">
                        <v-card-text v-if="item.legalizacao">
                          <v-card-title>
                            <span class="title-span"
                              >Administradora do Loteamento</span
                            >
                          </v-card-title>

                          <v-row class="px-3 pt-3" dense>
                            <v-col cols="12" md="3">
                              <span class="font-weight-bold"
                                >Percentual da Administradora</span
                              >
                              <v-text-field
                                outlined
                                v-model="item.percentualAdiministradora"
                                suffix="%"
                                dense
                                type="number"
                              />
                            </v-col>

                            <v-col cols="12" md="4">
                              <span class="font-weight-bold"
                                >Empresa Administradora</span
                              >
                              <v-select
                                outlined
                                v-model="item.empresaAdministradoraId"
                                :items="listaEmpresa"
                                item-text="nomeFantasia"
                                item-value="id"
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

                      <br />

                      <v-card elevation="1">
                        <v-card-text v-if="item.legalizacao">
                          <v-card-title>
                            <span class="title-span">Legalização</span>
                          </v-card-title>

                          <v-row class="px-3 pt-3" dense>
                            <v-col cols="12" md="3">
                              <span class="font-weight-bold">Matrícula</span>
                              <v-text-field
                                type="number"
                                outlined
                                v-model="item.legalizacao.matricula"
                                class="form-control"
                                :counter="60"
                                maxlength="60"
                                dense
                              />
                            </v-col>

                            <v-col cols="12" md="3">
                              <span class="font-weight-bold"
                                >Incrição Cadastral</span
                              >
                              <v-text-field
                                type="number"
                                outlined
                                v-model="item.legalizacao.incricaoCadastral"
                                class="form-control"
                                :counter="60"
                                maxlength="60"
                                dense
                              />
                            </v-col>

                            <v-col cols="12" md="3">
                              <span class="font-weight-bold">RGI</span>
                              <v-text-field
                                type="number"
                                outlined
                                v-model="item.legalizacao.rgi"
                                class="form-control"
                                :counter="60"
                                maxlength="60"
                                dense
                              />
                            </v-col>

                            <v-col cols="12" md="3">
                              <span class="font-weight-bold">Processo</span>
                              <v-text-field
                                type="number"
                                outlined
                                v-model="item.legalizacao.numeroProcesso"
                                class="form-control"
                                :counter="60"
                                maxlength="60"
                                dense
                              />
                            </v-col>

                            <v-col cols="12" md="3">
                              <span class="font-weight-bold"
                                >Orgão Emissor</span
                              >
                              <v-text-field
                                outlined
                                v-model="item.legalizacao.orgaoEmissor"
                                class="form-control"
                                :counter="60"
                                maxlength="60"
                                dense
                              />
                            </v-col>

                            <v-col cols="12" md="3">
                              <span class="font-weight-bold">Nº do Livro</span>
                              <v-text-field
                                type="number"
                                outlined
                                v-model="item.legalizacao.livroNumero"
                                class="form-control"
                                :counter="60"
                                maxlength="60"
                                dense
                              />
                            </v-col>

                            <v-col cols="12" md="3">
                              <span class="font-weight-bold"
                                >Escritura Lavrada</span
                              >
                              <v-text-field
                                type="number"
                                outlined
                                v-model="item.legalizacao.escrituraLavrada"
                                class="form-control"
                                :counter="60"
                                maxlength="60"
                                dense
                              />
                            </v-col>

                            <v-col cols="12" md="3">
                              <span class="font-weight-bold">Cartório</span>
                              <v-select
                                outlined
                                v-model="item.legalizacao.cartorioId"
                                :items="listaCartorio"
                                item-text="nome"
                                item-value="id"
                                dense
                              />
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                      <br />

                      <br />

                      <v-card
                        elevation="1"
                        v-if="
                          item.tipoId != 4 &&
                          item.tipoId != 2 &&
                          item.tipoId != 1 &&
                          item.tipoId != 0
                        "
                      >
                        <v-card-text>
                          <v-col cols="12">
                            <v-row dense v-if="item.infraestrutura">
                              <v-col cols="12" md="4">
                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="item.infraestrutura.lazer.academia"
                                    color="primary"
                                    label="Academia"
                                  ></v-switch>
                                </v-col>

                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="
                                      item.infraestrutura.lazer.hidromassagem
                                    "
                                    color="primary"
                                    label="Hidromassagem"
                                  ></v-switch>
                                </v-col>

                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="item.infraestrutura.lazer.piscina"
                                    color="primary"
                                    label="Piscina"
                                  ></v-switch>
                                </v-col>

                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="
                                      item.infraestrutura.lazer.churrasqueira
                                    "
                                    color="primary"
                                    label="Churrasqueira"
                                  ></v-switch>
                                </v-col>

                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="
                                      item.infraestrutura.lazer.homeCinema
                                    "
                                    color="primary"
                                    label="Home Cinema"
                                  ></v-switch>
                                </v-col>
                              </v-col>

                              <v-col cols="12" md="4">
                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="
                                      item.infraestrutura.lazer
                                        .quadraPoliesportiva
                                    "
                                    color="primary"
                                    label="Quadra poliesportiva"
                                  ></v-switch>
                                </v-col>

                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="
                                      item.infraestrutura.lazer.salaMassagem
                                    "
                                    color="primary"
                                    label="Sala de massagem"
                                  ></v-switch>
                                </v-col>

                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="
                                      item.infraestrutura.lazer.salaoJogos
                                    "
                                    color="primary"
                                    label="Salão de jogos"
                                  ></v-switch>
                                </v-col>

                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="item.infraestrutura.lazer.wifi"
                                    color="primary"
                                    label="Wifi"
                                  ></v-switch>
                                </v-col>
                              </v-col>

                              <v-col cols="12" md="4">
                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="
                                      item.infraestrutura.lazer.playground
                                    "
                                    color="primary"
                                    label="Playground"
                                  ></v-switch>
                                </v-col>

                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="
                                      item.infraestrutura.lazer.quadraTenis
                                    "
                                    color="primary"
                                    label="Quadra de tênis"
                                  ></v-switch>
                                </v-col>

                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="
                                      item.infraestrutura.lazer.salaoFesta
                                    "
                                    color="primary"
                                    label="Salão de festas"
                                  ></v-switch>
                                </v-col>

                                <v-col cols="12" md="12">
                                  <v-switch
                                    v-model="item.infraestrutura.lazer.sauna"
                                    color="primary"
                                    label="Sauna"
                                  ></v-switch>
                                </v-col>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card flat>
                        <v-card-text>
                          <v-card-title>
                            <span class="title-span">Descrição</span>
                          </v-card-title>

                          <v-row class="px-3 pt-3" dense>
                            <v-col cols="12" md="12">
                              <v-textarea
                                outlined
                                v-model="item.observacao"
                                class="form-control"
                                dense
                              ></v-textarea>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="12" md="5" sm="12">
                              <v-card-title>
                                <span class="title-span"
                                  >Documentos compartilhados com CRM
                                </span>
                              </v-card-title>

                              <v-row class="px-3">
                                <v-col cols="12" md="8">
                                  <span class="font-weight-bold pl-8"
                                    >Documentos</span
                                  >
                                  <v-file-input
                                    outlined
                                    chips
                                    accept="*/*"
                                    label="Selecione um documento"
                                    v-model="inputDocumento"
                                    show-size
                                    counter
                                    dense
                                  />
                                </v-col>

                                <v-col cols="12" md="2" class="mt-6 ml-5">
                                  <v-btn
                                    color="primary"
                                    @click="AdicionarArquivo(true)"
                                  >
                                    <v-icon left>mdi-plus</v-icon>
                                    Adicionar
                                  </v-btn>
                                </v-col>
                                <div
                                  class="d-flex"
                                  style="
                                    max-height: 300px;
                                    min-width: 100%;
                                    overflow-y: auto;
                                    overflow-x: hidden;
                                  "
                                >
                                  <v-row class="pa-4" dense>
                                    <v-col
                                      v-for="(
                                        arquivo, index
                                      ) in empreendimento.documentosCompartilhados"
                                      :key="arquivo.id || arquivo.nome || index"
                                      cols="12"
                                      sm="6"
                                      md="4"
                                      lg="3"
                                      xl="4"
                                    >
                                      <v-hover>
                                        <div
                                          class="ma-3 d-flex flex-column align-center"
                                        >
                                          <!-- Ícone genérico de arquivo -->
                                          <v-icon size="80"
                                            >mdi-file-document</v-icon
                                          >

                                          <!-- Nome do arquivo -->
                                          <span
                                            class="text-truncate text-center"
                                            style="max-width: 100%"
                                          >
                                            {{ arquivo.nome }}
                                          </span>

                                          <!-- Ações ao passar o mouse -->
                                          <div
                                            class="mt-2 d-flex justify-center"
                                          >
                                            <!-- Baixar -->
                                            <v-tooltip top>
                                              <template
                                                v-slot:activator="{ on, attrs }"
                                              >
                                                <v-icon
                                                  small
                                                  class="mx-1"
                                                  @click="
                                                    BaixarArquivo(index, true)
                                                  "
                                                  v-bind="attrs"
                                                  v-on="on"
                                                >
                                                  mdi-download
                                                </v-icon>
                                              </template>
                                              <span>Baixar</span>
                                            </v-tooltip>

                                            <!-- Excluir -->
                                            <v-tooltip top>
                                              <template
                                                v-slot:activator="{ on, attrs }"
                                              >
                                                <v-icon
                                                  small
                                                  class="mx-1"
                                                  @click="
                                                    ExcluirDocumentoDois(
                                                      arquivo,
                                                      true
                                                    )
                                                  "
                                                  v-bind="attrs"
                                                  v-on="on"
                                                >
                                                  mdi-delete
                                                </v-icon>
                                              </template>
                                              <span>Excluir</span>
                                            </v-tooltip>
                                          </div>
                                        </div>
                                      </v-hover>
                                    </v-col>
                                  </v-row>
                                </div>
                              </v-row>
                            </v-col>
                            <v-col
                              cols="12"
                              md="1"
                              class="d-flex justify-center"
                            >
                              <v-divider
                                vertical
                                class="my-4"
                                style="height: 100%; background-color: #e0e0e0"
                              ></v-divider>
                            </v-col>
                            <v-col cols="12" md="5" sm="12">
                              <v-card-title>
                                <span class="title-span"
                                  >Imagens do empreendimento</span
                                >
                              </v-card-title>

                              <v-row dense class="px-3">
                                <v-col cols="12" md="8">
                                  <span class="font-weight-bold pl-8"
                                    >Imagem</span
                                  >
                                  <v-file-input
                                    outlined
                                    chips
                                    accept="image/*"
                                    label="Selecione uma foto"
                                    v-model="inputFoto"
                                    show-size
                                    counter
                                    dense
                                  />
                                </v-col>

                                <v-col cols="12" md="2" class="mt-6 ml-5">
                                  <v-btn
                                    color="primary"
                                    @click="AdicionarArquivo(false)"
                                  >
                                    <v-icon left>mdi-plus</v-icon>
                                    Adicionar
                                  </v-btn>
                                </v-col>
                              </v-row>
                              <div
                                style="
                                  max-height: 300px;
                                  overflow-y: auto;
                                  overflow-x: hidden;
                                "
                              >
                                <v-row class="pa-4" dense>
                                  <v-col
                                    v-for="(
                                      foto, index
                                    ) in empreendimento.fotos"
                                    :key="foto.id || foto.nome || index"
                                    cols="12"
                                    sm="4"
                                    md="4"
                                    lg="4"
                                    xl="4"
                                  >
                                    <v-hover>
                                      <div
                                        class="d-flex flex-column align-center"
                                      >
                                        <!-- Imagem -->
                                        <div
                                          tabindex="0"
                                          class="focus-img mb-2"
                                          :style="{
                                            backgroundImage: `url('data:image/gif;base64,${foto.dados}')`,
                                            width: '150px',
                                            height: '150px',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderRadius: '8px',
                                          }"
                                        ></div>

                                        <!-- Ações (ícones) -->
                                        <div class="d-flex justify-center">
                                          <!-- Excluir -->
                                          <v-tooltip top>
                                            <template
                                              v-slot:activator="{ on, attrs }"
                                            >
                                              <v-icon
                                                small
                                                class="mx-1"
                                                @click="
                                                  ExcluirDocumentoDois(
                                                    foto,
                                                    false
                                                  )
                                                "
                                                v-bind="attrs"
                                                v-on="on"
                                              >
                                                mdi-delete
                                              </v-icon>
                                            </template>
                                            <span>Excluir</span>
                                          </v-tooltip>

                                          <!-- Compartilhar -->
                                          <v-tooltip top>
                                            <template
                                              v-slot:activator="{ on, attrs }"
                                            >
                                              <v-icon
                                                small
                                                class="mx-1"
                                                @click="
                                                  CompartilharArquivo(index)
                                                "
                                                v-bind="attrs"
                                                v-on="on"
                                              >
                                                mdi-share
                                              </v-icon>
                                            </template>
                                            <span>Compartilhar</span>
                                          </v-tooltip>

                                          <!-- Baixar -->
                                          <v-tooltip top>
                                            <template
                                              v-slot:activator="{ on, attrs }"
                                            >
                                              <v-icon
                                                small
                                                class="mx-1"
                                                @click="
                                                  BaixarArquivo(index, false)
                                                "
                                                v-bind="attrs"
                                                v-on="on"
                                              >
                                                mdi-download
                                              </v-icon>
                                            </template>
                                            <span>Baixar</span>
                                          </v-tooltip>
                                        </div>
                                      </div>
                                    </v-hover>
                                  </v-col>
                                </v-row>
                              </div>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                      <br />

                      <br />
                    </v-tab-item>
                    <v-tab-item>
                      <v-card flat>
                        <v-card-text>
                          <v-row no-gutters class="mb-2">
                            <v-card-actions class="pa-0 ma-0">
                              <v-btn
                                class="pl-3"
                                dark
                                color="blue"
                                @click="dialogGrupos = true"
                              >
                                Gerar Grupos
                                <v-icon right>mdi-group</v-icon>
                              </v-btn>

                              <v-btn
                                class="pl-3"
                                dark
                                color="primary"
                                @click="carregarMapa"
                              >
                                <template v-if="loadingImagemMapa">
                                  <v-progress-circular
                                    indeterminate
                                    size="20"
                                    color="white"
                                    class="mr-2"
                                    width="2"
                                  />
                                </template>
                                <template v-else>
                                  {{
                                    empreendimento.mapaInterativo?.imagemMapa
                                      ? "Alterar Mapa"
                                      : "Anexar Mapa"
                                  }}
                                  <v-icon right>mdi-paperclip</v-icon>
                                </template>

                                <input
                                  ref="uploaderMapa"
                                  class="d-none"
                                  type="file"
                                  @change="(e) => enviarImagem(e, 'imagemMapa')"
                                />
                              </v-btn>

                              <v-btn
                                class="pl-3"
                                color="success"
                                :disabled="
                                  !this.empreendimento?.mapaInterativo
                                    ?.imagemMapa
                                "
                                @click="mapDialog = true"
                              >
                                Mapeamento
                                <v-icon right>mdi-map-legend</v-icon>
                              </v-btn>
                            </v-card-actions>

                            <v-spacer />

                            <template v-for="situacao in listaSituacoes">
                              <div
                                :key="situacao.id"
                                class="d-flex align-center ml-4"
                              >
                                <v-chip small :color="situacao.color"> </v-chip>
                                <span class="pl-2" :key="situacao.id">
                                  {{ situacao.nome }}
                                </span>
                              </div>
                            </template>
                          </v-row>

                          <v-container fluid class="pa-0 ma-0">
                            <v-row wrap>
                              <v-flex
                                xs12
                                md12
                                v-for="grupo in grupos"
                                :key="grupo.key"
                              >
                                <v-card
                                  elevation="2"
                                  class="d-flex flex-column ma-3 mt-7 base-card"
                                >
                                  <v-card-text>
                                    <v-card-title class="pa-0 ma-0">
                                      <v-edit-dialog
                                        large
                                        :return-value.sync="grupo.nome"
                                        @save="
                                          `${
                                            grupo.id > 0
                                              ? SalvarGrupo(grupo)
                                              : ''
                                          }`
                                        "
                                        persistent
                                        save-text="Salvar"
                                        cancel-text="Cancelar"
                                      >
                                        <v-tooltip right>
                                          <template v-slot:activator="{ on }">
                                            <span
                                              v-on="on"
                                              class="font-weight-bold"
                                              >{{ grupo.nome }}</span
                                            >
                                          </template>
                                          <span>
                                            Editar
                                            <v-icon color="primary" small
                                              >mdi-pencil-circle</v-icon
                                            ></span
                                          >
                                        </v-tooltip>

                                        <template v-slot:input>
                                          <v-text-field
                                            v-model="grupo.nome"
                                            label="Edit"
                                            single-line
                                          />
                                        </template>
                                      </v-edit-dialog>

                                      <v-spacer />

                                      <div class="px-1">
                                        <v-btn
                                          text
                                          tile
                                          @click="ExcluirGrupo(grupo)"
                                          color="red"
                                        >
                                          <v-icon left> mdi-delete</v-icon
                                          >Excluir</v-btn
                                        >
                                      </div>

                                      <div class="px-1">
                                        <v-btn
                                          text
                                          tile
                                          color="primary"
                                          @click="abrirUnidades(grupo)"
                                          ><v-icon left> mdi-grid</v-icon>Gerar
                                          Unidades</v-btn
                                        >
                                      </div>
                                    </v-card-title>
                                  </v-card-text>

                                  <v-col cols="12" class="pa-0 ma-0">
                                    <v-row class="pa-0 ma-0">
                                      <v-col
                                        cols="12"
                                        sm="1"
                                        md="1"
                                        lg="1"
                                        v-for="(
                                          unidade, index
                                        ) in grupo.unidades"
                                        :key="unidade.key"
                                      >
                                        <v-hover v-slot="{ hover }">
                                          <v-card
                                            :elevation="hover ? 12 : 2"
                                            :class="{ 'on-hover': hover }"
                                            link
                                            class="center white--text pa-1 ma-0"
                                            height="80"
                                            width="85"
                                            :color="
                                              getColorSituation(
                                                unidade.situacaoId
                                              )
                                            "
                                            @click="
                                              ObterUnidade(
                                                unidade,
                                                grupo,
                                                index
                                              )
                                            "
                                          >
                                            {{ unidade.nome }}
                                          </v-card>
                                        </v-hover>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-card>
                              </v-flex>
                            </v-row>
                          </v-container>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>

                    <v-tab-item>
                      <v-card outlined>
                        <v-data-table
                          fixed-header
                          hide-default-header
                          hide-default-footer
                          :items="grupos"
                          item-key="item.key"
                          :items-per-page="-1"
                          class="elevation-1"
                        >
                          <template v-slot:body="{ items }">
                            <div v-for="grupo in items" :key="grupo.key">
                              <div v-if="grupo.unidades.length > 0">
                                <!--LOTES-->
                                <v-list
                                  v-if="
                                    grupo.unidades[0]
                                      ? grupo.unidades[0].tipoId == 1
                                      : 0
                                  "
                                >
                                  <v-list-group :value="false">
                                    <template v-slot:activator>
                                      <v-list-item-title
                                        class="font-weight-medium"
                                        >{{ grupo.nome }}</v-list-item-title
                                      >
                                    </template>

                                    <v-data-table
                                      :items-per-page="-1"
                                      item-key="item.key"
                                      :headers="headerLotes"
                                      :items="grupo.unidades"
                                      class="elevation-1"
                                    >
                                      <template v-slot:top>
                                        <v-dialog
                                          v-model="dialogLotesPadrao"
                                          max-width="650"
                                          persistent
                                        >
                                          <template
                                            v-slot:activator="{ on, attrs }"
                                          >
                                            <v-btn
                                              class="ml-1"
                                              color="primary"
                                              v-bind="attrs"
                                              @click="dialogLotesPadrao = true"
                                              v-on="on"
                                              >Editar</v-btn
                                            >
                                          </template>

                                          <v-card>
                                            <v-card-title>
                                              <v-icon
                                                @click="
                                                  dialogLotesPadrao = false
                                                "
                                                class="pr-3"
                                                color="primary"
                                              >
                                                mdi-close</v-icon
                                              >
                                              Dados Padrão dos lotes
                                              <v-spacer />
                                              <v-btn
                                                color="primary"
                                                @click="
                                                  SalvarUnidadesPorGrupo(grupo)
                                                "
                                                text
                                                >Salvar</v-btn
                                              >
                                            </v-card-title>

                                            <v-card outlined>
                                              <v-card-text>
                                                <v-row dense>
                                                  <v-col cols="12" md="4">
                                                    <v-text-field
                                                      type="number"
                                                      outlined
                                                      label="Frente"
                                                      v-model="
                                                        item.infraestrutura
                                                          .dimensaoLotePadrao
                                                          .frente
                                                      "
                                                      dense
                                                    />
                                                  </v-col>

                                                  <v-col cols="12" md="4">
                                                    <v-text-field
                                                      type="number"
                                                      outlined
                                                      label="Lado Direito"
                                                      dense
                                                      v-model="
                                                        item.infraestrutura
                                                          .dimensaoLotePadrao
                                                          .ladoDireito
                                                      "
                                                    />
                                                  </v-col>

                                                  <v-col cols="12" md="4">
                                                    <v-text-field
                                                      type="number"
                                                      outlined
                                                      label="Lado Esquerdo"
                                                      dense
                                                      v-model="
                                                        item.infraestrutura
                                                          .dimensaoLotePadrao
                                                          .ladoEsquerdo
                                                      "
                                                    />
                                                  </v-col>

                                                  <v-col cols="12" md="4">
                                                    <v-text-field
                                                      type="number"
                                                      outlined
                                                      label="Fundos"
                                                      v-model="
                                                        item.infraestrutura
                                                          .dimensaoLotePadrao
                                                          .fundo
                                                      "
                                                      dense
                                                    />
                                                  </v-col>

                                                  <v-col cols="12" md="4">
                                                    <v-text-field
                                                      type="number"
                                                      outlined
                                                      label="Curva"
                                                      v-model="
                                                        item.infraestrutura
                                                          .dimensaoLotePadrao
                                                          .curva
                                                      "
                                                      dense
                                                    />
                                                  </v-col>
                                                </v-row>
                                              </v-card-text>
                                            </v-card>
                                          </v-card>
                                        </v-dialog>

                                        <v-btn
                                          class="ml-1"
                                          :disabled="grupo.id == 0"
                                          @click="SalvarGrupo(grupo)"
                                          color="primary"
                                          >Salvar</v-btn
                                        >
                                      </template>

                                      <template v-slot:[`item.nome`]="{ item }">
                                        <v-text-field
                                          style="margin-bottom: -25px"
                                          outlined
                                          v-model="item.nome"
                                          dense
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.Disponibilidade`]="{
                                          item,
                                        }"
                                      >
                                        <v-select
                                          style="margin-bottom: -25px"
                                          outlined
                                          v-model="item.situacaoId"
                                          :items="listaSituacao"
                                          item-text="nome"
                                          item-value="id"
                                          dense
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.Frente`]="{ item }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -25px"
                                          outlined
                                          v-model="item.lote.dimensao.frente"
                                          dense
                                          type="number"
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.Direito`]="{ item }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -25px"
                                          outlined
                                          v-model="
                                            item.lote.dimensao.ladoDireito
                                          "
                                          dense
                                          type="number"
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.Esquerdo`]="{ item }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -25px"
                                          outlined
                                          v-model="
                                            item.lote.dimensao.ladoEsquerdo
                                          "
                                          dense
                                          type="number"
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.Fundo`]="{ item }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -25px"
                                          outlined
                                          v-model="item.lote.dimensao.fundo"
                                          dense
                                          type="number"
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.Curva`]="{ item }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -25px"
                                          outlined
                                          v-model="item.lote.dimensao.curva"
                                          dense
                                          type="number"
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.areaTotal`]="{ item }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -25px"
                                          outlined
                                          v-model="item.lote.dimensao.areaTotal"
                                          dense
                                          type="number"
                                        />
                                      </template>
                                    </v-data-table>
                                  </v-list-group>
                                </v-list>

                                <!--IMOVEIS-->
                                <v-list
                                  v-if="
                                    grupo.unidades[0]
                                      ? grupo.unidades[0].tipoId == 2
                                      : 0
                                  "
                                >
                                  <v-list-group :value="false">
                                    <template v-slot:activator>
                                      <v-list-item-title class="pl-3">{{
                                        grupo.nome
                                      }}</v-list-item-title>
                                    </template>

                                    <v-data-table
                                      :items-per-page="-1"
                                      item-key="item.key"
                                      :headers="headerImoveis"
                                      height="500px"
                                      :items="grupo.unidades"
                                      multi-sort
                                      class="elevation-1"
                                    >
                                      <template v-slot:top>
                                        <v-btn
                                          :disabled="grupo.id == 0"
                                          @click="SalvarGrupo(grupo)"
                                          color="primary"
                                          >Salvar</v-btn
                                        >
                                      </template>

                                      <template v-slot:[`item.nome`]="{ item }">
                                        <v-text-field
                                          style="margin-bottom: -28px"
                                          outlined
                                          v-model="item.nome"
                                          dense
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.Disponibilidade`]="{
                                          item,
                                        }"
                                      >
                                        <v-select
                                          style="margin-bottom: -28px"
                                          outlined
                                          v-model="item.situacaoId"
                                          :items="listaSituacao"
                                          item-text="nome"
                                          item-value="id"
                                          class="form-control"
                                          dense
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.areaImovel`]="{ item }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -28px"
                                          outlined
                                          v-model="
                                            item.imovel.infraestrutura.dimensao
                                              .areaImovel
                                          "
                                          dense
                                          type="number"
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.areaTerreno`]="{ item }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -28px"
                                          outlined
                                          v-model="
                                            item.imovel.infraestrutura.dimensao
                                              .areaTerreno
                                          "
                                          dense
                                          type="number"
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.coeficienteAproveitamento`]="{
                                          item,
                                        }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -28px"
                                          outlined
                                          v-model="
                                            item.imovel.infraestrutura.dimensao
                                              .coeficienteAproveitamento
                                          "
                                          dense
                                          type="number"
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.quantidadeBanheiro`]="{
                                          item,
                                        }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -28px"
                                          outlined
                                          v-model="
                                            item.imovel.infraestrutura.dimensao
                                              .quantidadeBanheiro
                                          "
                                          dense
                                          type="number"
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.quantidadeQuarto`]="{
                                          item,
                                        }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -28px"
                                          outlined
                                          v-model="
                                            item.imovel.infraestrutura.dimensao
                                              .quantidadeQuarto
                                          "
                                          dense
                                          type="number"
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.quantidadeVagas`]="{
                                          item,
                                        }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -28px"
                                          outlined
                                          v-model="
                                            item.imovel.infraestrutura.dimensao
                                              .quantidadeVagas
                                          "
                                          dense
                                          type="number"
                                        />
                                      </template>

                                      <template
                                        v-slot:[`item.zonaUso`]="{ item }"
                                      >
                                        <v-text-field
                                          style="margin-bottom: -28px"
                                          outlined
                                          v-model="
                                            item.imovel.infraestrutura.dimensao
                                              .zonaUso
                                          "
                                          dense
                                          type="number"
                                        />
                                      </template>
                                    </v-data-table>
                                  </v-list-group>
                                </v-list>
                              </div>
                            </div>
                          </template>
                        </v-data-table>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>
                </v-col>
              </v-row>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card elevation="1">
              <v-card-text>
                <v-card-title>
                  <span class="title-span">Sócios</span>
                </v-card-title>

                <v-form ref="formProprietario" v-model="valid" lazy-validation>
                  <v-row class="px-3" dense>
                    <v-col cols="12" sm="12" md="6">
                      <span class="font-weight-bold">Nome</span>
                      <v-autocomplete
                        placeholder="Selecione"
                        outlined
                        v-model="proprietario.proprietarioId"
                        :items="pessoas"
                        :rules="fieldRules"
                        clearable
                        item-text="nomeCnpjCpf"
                        item-value="id"
                        dense
                      />
                    </v-col>

                    <v-col cols="12" md="2">
                      <span class="font-weight-bold">Participação</span>
                      <v-text-field
                        outlined
                        v-model.number="proprietario.participacao"
                        :rules="fieldRules"
                        type="number"
                        dense
                        suffix="%"
                      />
                    </v-col>

                    <v-col cols="12" md="10">
                      <span class="font-weight-bold">Observação</span>
                      <v-text-field
                        outlined
                        v-model="proprietario.observacao"
                        dense
                      />
                    </v-col>

                    <v-col cols="12" md="2" class="pt-7">
                      <v-btn color="primary" @click="AdicionarProprietario()">
                        <v-icon left>mdi-plus</v-icon>
                        Adicionar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>

                <v-row dense>
                  <v-col sm="12" md="12" lg="12" xl="12">
                    <v-data-table
                      class="elevation-1"
                      :headers="headersProprietario"
                      :items="item.proprietarios"
                      :items-per-page="5"
                      item-key="item.id"
                    >
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-tooltip right>
                          <template v-slot:activator="{ on }">
                            <v-icon
                              :disabled="item.excluido"
                              small
                              @click="EditarProprietario(item)"
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
                              @click="ExcluirProprietario(item)"
                              v-on="on"
                              >mdi-delete</v-icon
                            >
                          </template>
                          <span>Excluir</span>
                        </v-tooltip>
                      </template>

                      <template v-slot:[`item.proprietarioId`]="{ item }">
                        {{
                          pessoas.find((x) => x.id == item.proprietarioId)
                            ? pessoas.find((x) => x.id == item.proprietarioId)
                                .nome
                            : ""
                        }}
                      </template>

                      <template v-slot:[`item.participacao`]="{ item }">
                        {{ item.participacao }}%
                      </template>

                      <template v-slot:[`item.observacao`]="{ item }">
                        {{ item.observacao }}
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card elevation="1">
              <v-card-text>
                <v-card-title>
                  <span class="title-span">Corretores</span>
                </v-card-title>

                <v-form ref="formCorretor" v-model="valid" lazy-validation>
                  <v-row class="px-3" dense>
                    <v-col cols="12" sm="12" md="6">
                      <span class="font-weight-bold">Nome</span>
                      <v-autocomplete
                        placeholder="Selecione"
                        outlined
                        v-model="empreendimentoPessoa.pessoaId"
                        :items="pessoas"
                        :rules="fieldRules"
                        clearable
                        item-text="nomeCnpjCpf"
                        item-value="id"
                        dense
                      />
                    </v-col>

                    <v-col cols="12" md="2" class="pt-7">
                      <v-btn color="primary" @click="AdicionarCorretor()">
                        <v-icon left>mdi-plus</v-icon>
                        Adicionar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>

                <v-row dense>
                  <v-col sm="12" md="12" lg="12" xl="12">
                    <v-data-table
                      class="elevation-1"
                      :headers="headersCorretor"
                      :items="item.empreendimentosPessoas"
                      :items-per-page="5"
                      item-key="item.id"
                    >
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-tooltip right>
                          <template v-slot:activator="{ on }">
                            <v-icon
                              :disabled="item.excluido"
                              small
                              @click="EditarCorretor(item)"
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
                              @click="ExcluirCorretor(item)"
                              v-on="on"
                              >mdi-delete</v-icon
                            >
                          </template>
                          <span>Excluir</span>
                        </v-tooltip>
                      </template>

                      <template v-slot:[`item.pessoaId`]="{ item }">
                        {{
                          pessoas.find((x) => x.id === item.pessoaId)?.nome ||
                          ""
                        }}
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card outlined :loading="overlayDocumentos">
              <v-card-documento-novo
                :empreendimentoDocumento="empreendimentoDocumento"
                :exibirCampos="true"
              />
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-form>
      <v-overlay :value="overlayEmpreendimento" />
    </v-card>

    <v-dialog v-model="dialogUnidade" max-width="290" persistent>
      <v-card>
        <v-card-title class="text-h5 pa-3" style="color: #757575">
          <v-icon class="pr-3" color="primary"> mdi-grid-large </v-icon>
          {{ incluirUnidade.nome }}
        </v-card-title>

        <v-card-text class="py-3">
          <span class="font-weight-bold">Quantas Unidades deseja gerar?</span>

          <v-col cols="12" md="12">
            <v-text-field outlined type="number" v-model="qtdeUnidade" dense />
          </v-col>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="fecharGerarUnidades()"
            >Fechar</v-btn
          >
          <v-btn color="primary" text @click="GerarUnidades()">Gerar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <mapear-mapa
      v-model="mapDialog"
      :empreendimento="empreendimento"
      @fechou="mapDialog = false"
    />
    <gerar-grupos
      v-model="dialogGrupos"
      :grupos="grupos"
      @salvou="(dialogGrupos = false), Atualizar()"
      :item="empreendimento"
      @fechou="dialogGrupos = false"
    />
    <plano-pagamento-info
      v-model="dialogPlano"
      :item="planoPagamento"
      @fechou="dialogPlano = false"
    />
    <lados-adicionais
      v-model="dialogLadosAdicionais"
      :lista="item.ladosAdicionaisPadroes"
      :patch="true"
      @salvou="dialogLadosAdicionais = false"
      @fechou="dialogLadosAdicionais = false"
    />
    <visualizar-unidade
      v-model="dialogUnidadeInformacao"
      @fechou="dialogUnidadeInformacao = false"
      @salvou="(dialogUnidadeInformacao = false), Atualizar()"
      :item="informacaoUnidade"
      :excluir="true"
      :salvar="true"
    />
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  Empreendimento,
  EmpreendimentoPessoa,
  EnumTipoEmpreendimento,
  EnumTipoUnidade,
  Grupo,
  MapaInterativo,
  ProprietarioEmpreendimento,
  ProprietarioUnidade,
  Unidade,
} from "@/core/models/cadastros";
import {
  EmpreendimentoService,
  PessoaService,
  SituacaoUnidadeService,
  TipoUnidadeService,
} from "@/core/services/cadastros";
import { TipoEmpreendimentoService } from "@/core/services/empreendimento/index";
import { CartorioService } from "@/core/services/imobiliaria";
import { Imovel, InfraestruturaImovel, Lote } from "@/core/models/imobiliaria";
import { EmpresaService } from "@/core/services/compras/EmpresaService";
import * as jsonpatch from "fast-json-patch";
import { ArquivoService } from "@/core/services/geral/ArquivoService";
import { TratarErroApi } from "@/assets/scripts/helper";
import { PlanoPagamentoService } from "@/core/services/contratos";
import { PlanoPagamentoModelo } from "@/core/models/contratos";
import { Documento } from "@/core/models/geral";
import { ICoordinatesLot } from "../mapainterativo/Mapear.vue";
import { getColorSituationLot, getSituationsLots } from "@/utils/helperLot";

@Component
export default class CadastroEmpreendimento extends Vue {
  @Prop() public empreendimento!: Empreendimento;
  @Prop() public value!: string;

  item = new Empreendimento();
  observer!: jsonpatch.Observer<Empreendimento>;
  service = new EmpreendimentoService();

  planoPagamento = new PlanoPagamentoModelo();

  SelecionarPlano(id) {
    new PlanoPagamentoService()
      .ObterPorId(
        id,
        "IntervaloReajuste,TipoIndice,TipoAmortizacao,TipoMesReajuste,TipoAnoInicioReajuste,TipoValorTotal,TipoOperacao,TipoGateway,ContaCorrente"
      )
      .then((res) => {
        this.planoPagamento = res.data;
      });
  }

  empreendimentoDocumento = new Empreendimento();
  informacaoUnidade = new Unidade();
  //dimensao = new DimensaoLote();
  loteEspelho: Lote = new Lote();
  unidade = new Unidade();
  incluirUnidade = new Grupo();
  proprietario = new ProprietarioEmpreendimento();
  documento: any = new Documento();

  loadingFotoPrincipal = false;
  loadingImagemMapa = false;
  overlayDocumentos = false;
  imgUrl: any = null;
  imgMapaUrl: any = null;
  dialogLadosAdicionais = false;
  dialogUnidadeInformacao = false;
  overlayEmpreendimento = false;
  dialogLotesPadrao = false;
  dialogUnidade = false;
  mapDialog = false;
  overlay = false;
  valid = true;
  dialog = false;
  arquivo: any = null;
  dialogGrupos = false;
  dialogPlano = false;
  xmlString: string = "";

  tabAtiva = 0;
  qtdeUnidade = 0;
  subTabActive = 0;
  qtdeQuadras = 0;
  index = 0;
  itemIndex = -1;

  listaMunicipio = [];
  listaEstado = [];
  listaTipoEmpreendimento = [];
  listaEmpresa = [];
  listaCartorio = [];
  listaSituacao: any = [];
  listaTipos = [];
  pessoas: any = [];
  grupos: any = [];
  planosPagamento = [];
  inputDocumento: any = null;
  inputFoto: any = null;
  imagemSelecionada: any = null;
  model: any = null;
  transparent: string = "rgba(255, 255, 255, 0)";

  get totalAreaPublica(): number {
    return (
      Number(this.item.infraestrutura.areaPrefeitura) +
      Number(this.item.infraestrutura.areaRua) +
      this.espacoLivrePublico
    );
  }

  get espacoLivrePublico(): number {
    return (
      Number(this.item.infraestrutura.areaVerde) +
      Number(this.item.infraestrutura.areaOutras)
    );
  }

  get areaTotalLoteada(): number {
    return (
      Number(this.item.infraestrutura.areaUnidade) +
      this.totalAreaPublica +
      Number(this.item.infraestrutura.areaReservadoProprietario)
    );
  }

  async AdicionarArquivo(isDocumento) {
    if (!this.inputDocumento && isDocumento) {
      this.$swal("Aviso", "É necessário selecionar um arquivo.", "warning");
      return;
    }
    if (!this.inputFoto && !isDocumento) {
      this.$swal("Aviso", "É necessário selecionar uma foto.", "warning");
      return;
    }
    this.documento = new Documento();
    let dados;
    if (isDocumento) {
      dados = await new ArquivoService().Ler(this.inputDocumento);
    } else {
      dados = await new ArquivoService().Ler(this.inputFoto);
    }

    this.documento.usuarioId = JSON.parse(
      localStorage.sessionApp.split(".")
    ).dados.usuarioId;
    this.documento.dataEmissao = new Date().yyyymmdd();
    this.documento.dados = dados.replace(/^[^,]*,/, "");
    if (isDocumento) {
      this.documento.nome =
        this.documento.nome != ""
          ? this.documento.nome
          : this.inputDocumento.name;
    } else {
      this.documento.nome =
        this.documento.nome != "" ? this.documento.nome : this.inputFoto.name;
    }

    this.documento.tamanho = isDocumento
      ? this.inputDocumento.size
      : this.inputFoto.size;
    this.documento.tipo = isDocumento
      ? this.inputDocumento.type
      : this.inputFoto.type;
    if (isDocumento) {
      this.item.documentosCompartilhados.push(this.documento);
    } else {
      this.item.fotos.push(this.documento);
    }
    this.documento = new Documento();
    this.inputDocumento = null;
    this.inputFoto = null;
  }

  ExcluirDocumentoDois(arquivo, isDocumento) {
    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja excluir o registro atual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const lista = isDocumento
          ? this.empreendimento.documentosCompartilhados
          : this.empreendimento.fotos;

        const index = lista.indexOf(arquivo);

        if (arquivo.id > 0) {
          arquivo.excluido = true;
          lista.splice(index, 1);
          this.SalvarImagem();
        } else {
          lista.splice(index, 1);

          await this.$swal(
            "Aviso",
            "Registro excluído com sucesso!",
            "success"
          );

          return true;
        }
        return true;
      },
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        this.SalvarDoc(arquivo);
      }
    });
  }

  SalvarDoc(doc) {
    const observer: jsonpatch.Observer<Documento> = jsonpatch.observe(doc);
    const patchModel = jsonpatch.generate(observer);
    this.service.Patch(patchModel, this.empreendimento.id).then(
      (res) => {
        this.$emit("salvou");
      },
      (err) => {
        TratarErroApi(err);
      }
    );
  }

  BaixarArquivo(index, isDocumento) {
    const lista = isDocumento
      ? this.empreendimento.documentosCompartilhados
      : this.empreendimento.fotos;

    const arquivo = lista[index];

    if (!arquivo || !arquivo.dados || !arquivo.tipo) {
      this.$swal("Erro", "Arquivo inválido ou não encontrado.", "error");
      return;
    }

    new ArquivoService().Download(arquivo);
  }

  CompartilharArquivo(index) {
    this.imagemSelecionada = this.empreendimento.fotos[index];
    new ArquivoService().Compartilhar(this.imagemSelecionada);
  }

  headersDocumentos: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome", align: "center", sortable: false },
    { text: "Arquivo", value: "dados", align: "center", sortable: false },
    { text: "Data", value: "dataEmissao", align: "center", sortable: false },
  ];

  optionsDocumentos = {
    itemsPerPage: 5,
  };

  $refs!: {
    formEmpreendimento: HTMLFormElement;
    formProprietario: HTMLFormElement;
    uploader: HTMLFormElement;
    uploaderMapa: HTMLFormElement;
    formCorretor: HTMLFormElement;
  };

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  headersProprietario = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "proprietarioId" },
    { text: "Participação", value: "participacao" },
    { text: "Observação", value: "observacao" },
  ];

  headersCorretor = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "pessoaId" },
  ];

  headerLotes = [
    { text: "Nome", value: "nome", align: "center", sortable: false },
    {
      text: "Disponibilidade",
      align: "center",
      value: "Disponibilidade",
      sortable: false,
    },
    { text: "Frente", value: "Frente", align: "center", sortable: false },
    { text: "Direito", value: "Direito", align: "center", sortable: false },
    { text: "Esquerdo", value: "Esquerdo", align: "center", sortable: false },
    { text: "Fundo", value: "Fundo", align: "center", sortable: false },
    { text: "Curva", value: "Curva", align: "center", sortable: false },
    {
      text: "Área Total",
      value: "areaTotal",
      align: "center",
      sortable: false,
    },
  ];

  headerImoveis = [
    { text: "Nome", value: "nome", align: "center", sortable: false },
    {
      text: "Disponibilidade",
      align: "center",
      value: "Disponibilidade",
      sortable: false,
    },
    {
      text: "Área Imovel",
      value: "areaImovel",
      align: "center",
      sortable: false,
    },
    {
      text: "Área Terreno",
      value: "areaTerreno",
      align: "center",
      sortable: false,
    },
    {
      text: "Coe. Aproveitamento",
      value: "coeficienteAproveitamento",
      align: "center",
      sortable: false,
    },
    {
      text: "Qtde Banheiro",
      value: "quantidadeBanheiro",
      align: "center",
      sortable: false,
    },
    {
      text: "Qtde Quarto",
      value: "quantidadeQuarto",
      align: "center",
      sortable: false,
    },
    {
      text: "Qtde Vagas",
      value: "quantidadeVagas",
      align: "center",
      sortable: false,
    },
    { text: "Zona Uso", value: "zonaUso", align: "center", sortable: false },
  ];

  headerJazigos = [
    { text: "Nome", value: "nome", align: "center", sortable: false },
    {
      text: "Disponibilidade",
      align: "center",
      value: "Disponibilidade",
      sortable: false,
    },
  ];

  listaSituacoes = getSituationsLots();

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
    if (this.dialog) {
      this.item = this.empreendimento;

      if (this.item.id > 0) {
        this.ObterGrupos();
        this.observer = jsonpatch.observe(this.item);
      }
    } else {
      jsonpatch.unobserve(this.item, this.observer);
    }
  }

  @Watch("item", { deep: true })
  ObservadorItem() {
    this.observer = jsonpatch.observe(this.item);
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }
  }

  @Watch("item")
  Item() {
    if (this.$refs.formEmpreendimento) {
      this.$refs.formEmpreendimento.resetValidation();
    }
  }

  @Watch("proprietario")
  Proprietario() {
    if (this.$refs.formProprietario) {
      this.$refs.formProprietario.resetValidation();
    }
  }

  @Watch("empreendimentoPessoa")
  EmpreendimentoPessoa() {
    if (this.$refs.formCorretor) {
      this.$refs.formCorretor.resetValidation();
    }
  }

  uploaderMapa() {
    window.addEventListener("focus", () => {}, {
      once: true,
      passive: true,
    });

    this.$refs.uploaderMapa.click();
    this.$swal.close();
  }

  async resetMapping() {
    const empreendimentoService = new EmpreendimentoService();

    const lotsReset = this.empreendimento.grupos.reduce(
      (list: ICoordinatesLot[], nextGroup: Grupo) => {
        nextGroup.unidades.forEach((lot) => {
          list.push({
            mapaInterativoUnidade: {
              id: lot.id,
              nome: lot.nome,
              situacaoId: lot.situacaoId,
            },
            x: 0,
            y: 0,
            saved: true,
            zoomStep: 1,
          });
        });

        return list;
      },
      [] as ICoordinatesLot[]
    );

    await empreendimentoService.salvarPontosMapaInterativo(lotsReset);
  }

  carregarMapa() {
    if (this.empreendimento?.mapaInterativo?.imagemMapa) {
      this.$swal({
        title: "Atenção!",
        text: "Tem certeza que deseja alterar o mapa? O mapeamento será excluído!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          await this.resetMapping();

          return this.uploaderMapa();
        },
      });
    } else {
      this.uploaderMapa();
    }
  }

  GerarUnidades() {
    if (this.qtdeUnidade <= 0) {
      return this.$swal(
        "Atenção!",
        "A quantidade não pode ser menor ou igual a 0.",
        "warning"
      );
    }

    if (this.qtdeUnidade > 260)
      return this.$swal(
        "Atenção!",
        "Não é permitido exceder o limite de 260 unidades.",
        "warning"
      );

    for (let controle = 1; controle <= this.qtdeUnidade; controle++) {
      const unidade = new Unidade();
      unidade.legalizacao = { ...this.item.legalizacao };
      unidade.grupoId = this.incluirUnidade.id;
      unidade.planoPagamento = undefined;

      this.item.proprietarios.forEach((f) => {
        const propUnd = new ProprietarioUnidade();
        propUnd.proprietarioId = f.proprietarioId;
        propUnd.participacao = f.participacao;
        propUnd.observacao = f.observacao;

        if (
          !unidade.proprietarios.some(
            (s) => s.proprietarioId == f.proprietarioId
          )
        ) {
          unidade.proprietarios.push(propUnd);
        }
      });

      unidade.nome = `${controle < 10 ? `0${controle}` : controle}`;
      unidade.endereco = { ...this.item.endereco };
      unidade.lote = undefined;
      unidade.imovel = undefined;
      unidade.jazigo = undefined;

      if (this.item.tipoId == EnumTipoEmpreendimento.Loteamento) {
        this.loteEspelho.dimensao = {
          ...this.item.infraestrutura.dimensaoLotePadrao,
        };
        this.loteEspelho.ladosAdicionais = this.item.ladosAdicionaisPadroes;
        this.loteEspelho.ladosAdicionais.forEach((x: any) => {
          (x.id = 0), (x.empreendimentoId = null);
        });
        unidade.tipoId = EnumTipoUnidade.Lote;
        unidade.lote = Object.assign({}, this.loteEspelho);
      } else if (
        this.item.tipoId == EnumTipoEmpreendimento.Predio ||
        this.item.tipoId == EnumTipoEmpreendimento.Condominio
      ) {
        unidade.tipoId = EnumTipoUnidade.Imovel;
        unidade.imovel = new Imovel();
        unidade.imovel.infraestrutura = new InfraestruturaImovel();
      }

      this.incluirUnidade.unidades.push(unidade);
    }

    if (this.item.id > 0) {
      this.SalvarGrupo(this.incluirUnidade);
    }
    this.qtdeUnidade = 0;
    this.dialogUnidade = false;
  }

  fecharGerarUnidades() {
    this.qtdeUnidade = 0;
    this.dialogUnidade = false;
  }

  AdicionarProprietario() {
    if (this.$refs.formProprietario.validate()) {
      const proprietarioId = this.proprietario.proprietarioId;
      const proprietarioExistente = this.item.proprietarios.find(
        (x, index) =>
          x.proprietarioId === proprietarioId && index !== this.itemIndex
      );

      if (proprietarioExistente)
        return this.$swal(
          "Aviso",
          "Esta pessoa já foi adicionada na lista.",
          "warning"
        );

      if (this.itemIndex > -1) {
        Object.assign(
          this.item.proprietarios[this.itemIndex],
          this.proprietario
        );
      } else {
        this.item.proprietarios.push(this.proprietario);
      }

      this.proprietario = new ProprietarioEmpreendimento();
      this.itemIndex = -1;
    }
  }

  ExcluirProprietario(item: ProprietarioEmpreendimento) {
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
          const index = this.item.proprietarios.indexOf(item);
          delete this.item.proprietarios[index];
          this.dialog = false;
          this.dialog = true;
          return true;
        } else {
          const index = this.item.proprietarios.indexOf(item);
          this.item.proprietarios.splice(index, 1);
          return this.$swal("Aviso", "Item excluído com sucesso!", "success");
        }
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if (result.value) {
      }
    });
  }

  EditarProprietario(item) {
    this.itemIndex = this.item.proprietarios.indexOf(item);
    this.proprietario = Object.assign({}, item);
  }

  empreendimentoPessoa = new EmpreendimentoPessoa();
  itemIndexPessoa = -1;

  AdicionarCorretor() {
    if (this.$refs.formCorretor.validate()) {
      const pessoaId = this.empreendimentoPessoa.pessoaId;
      const pessoaExistente = this.item.empreendimentosPessoas.find(
        (x, index) => x.pessoaId === pessoaId && index !== this.itemIndexPessoa
      );

      if (pessoaExistente)
        return this.$swal(
          "Aviso",
          "Esta pessoa já foi adicionada na lista.",
          "warning"
        );

      if (this.itemIndexPessoa > -1) {
        Object.assign(
          this.item.empreendimentosPessoas[this.itemIndexPessoa],
          this.empreendimentoPessoa
        );
      } else {
        this.item.empreendimentosPessoas.push(this.empreendimentoPessoa);
      }

      this.empreendimentoPessoa = new EmpreendimentoPessoa();
      this.itemIndexPessoa = -1;
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
        if (item.id > 0) {
          item.excluido = true;
          const index = this.item.empreendimentosPessoas.indexOf(item);
          delete this.item.empreendimentosPessoas[index];
          this.dialog = false;
          this.dialog = true;
          return true;
        } else {
          const index = this.item.empreendimentosPessoas.indexOf(item);
          this.item.empreendimentosPessoas.splice(index, 1);
          return this.$swal("Aviso", "Item excluído com sucesso!", "success");
        }
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if (result.value) {
      }
    });
  }

  EditarCorretor(item) {
    this.itemIndexPessoa = this.item.empreendimentosPessoas.indexOf(item);
    this.empreendimentoPessoa = Object.assign({}, item);
  }

  SalvarImagem() {
    this.$refs.formEmpreendimento.validate();

    if (!this.Validacoes()) {
      if (this.item.id == 0) {
        this.item.grupos = this.grupos;
        this.item.documentos = this.empreendimentoDocumento.documentos;
      }

      if (!this.item.kml || this.xmlString) {
        this.item.kml = this.xmlString;
      }

      const modelo = this.item;
      const patchModel = jsonpatch.generate(this.observer);

      return (
        this.item.id > 0
          ? this.service.Patch(patchModel, this.item.id)
          : this.service.Salvar(modelo)
      )
        .then((res) => {
          this.Atualizar();
        })
        .catch((err) => TratarErroApi(err))
        .finally(() => {
          this.overlayEmpreendimento = false;
        });
    }
  }

  Salvar() {
    this.$refs.formEmpreendimento.validate();
    if (!this.Validacoes()) {
      if (this.item.id == 0) {
        this.item.grupos = this.grupos;
        this.item.documentos = this.empreendimentoDocumento.documentos;
      }

      if (!this.item.kml || this.xmlString) {
        this.item.kml = this.xmlString;
      }
      //this.item.tipoId = 1

      let modelo = this.item;
      let pacthModel = jsonpatch.generate(this.observer);

      (this.item.id > 0
        ? this.service.Patch(pacthModel, this.item.id)
        : this.service.Salvar(modelo)
      )
        .then(
          (res) => {
            this.$swal(
              "Aviso",
              "Operação realizada com sucesso!",
              res.status == 201 || res.status == 200 ? "success" : "warning"
            );
            this.$emit("salvou");
            this.Atualizar();
            this.Close();
          },
          (err) => TratarErroApi(err)
        )
        .finally(() => {
          this.overlayEmpreendimento = false;
        });
    }
  }

  GetDocumentos(atualizar = false) {
    if (this.item.id > 0) {
      if (this.empreendimentoDocumento.documentos.length == 0 || atualizar) {
        this.overlayDocumentos = true;

        this.service.ObterPorId(this.item.id, "Documentos").then(
          (res) => {
            this.empreendimentoDocumento = res.data;
            this.overlayDocumentos = false;
          },
          (err) => TratarErroApi(err)
        );
      }
    }
  }

  Close() {
    this.dialog = false;
    this.Reset();
  }

  /* Grupos */
  CriarGrupos() {
    let novosGrupos = this.grupos;
    this.service.SalvarGrupos(novosGrupos).then(
      (res) => {
        this.$emit("salvou");
        this.Atualizar();
      },
      (err) => TratarErroApi(err)
    );
  }

  SalvarUnidadesPorGrupo(item) {
    item.unidades.forEach((x) => {
      (x.lote.dimensao.curva =
        this.item.infraestrutura.dimensaoLotePadrao.curva),
        (x.lote.dimensao.frente =
          this.item.infraestrutura.dimensaoLotePadrao.frente),
        (x.lote.dimensao.fundo =
          this.item.infraestrutura.dimensaoLotePadrao.fundo),
        (x.lote.dimensao.ladoDireito =
          this.item.infraestrutura.dimensaoLotePadrao.ladoDireito),
        (x.lote.dimensao.ladoEsquerdo =
          this.item.infraestrutura.dimensaoLotePadrao.ladoEsquerdo);
    });

    let modelo = item;
    this.service.SalvarGrupo(item.id, modelo).then(
      (res) => {
        this.$swal(
          "Aviso",
          "Operação realizada com sucesso!",
          res.status == 201 || res.status == 200 ? "success" : "warning"
        );
        this.$emit("salvou");

        if (this.item.id > 0) {
          this.Atualizar();
        }
      },
      (err) => TratarErroApi(err)
    );

    this.dialogLotesPadrao = false;
    //this.dimensao = new DimensaoLote();
  }

  SalvarGrupo(item) {
    if (this.item.id > 0) {
      let modelo = item;
      this.service.SalvarGrupo(item.id, modelo).then(
        (res) => {
          this.Atualizar();
        },
        (err) => TratarErroApi(err)
      );
    }
  }

  ExcluirGrupo(item) {
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
        const index = this.grupos.indexOf(item);
        this.grupos.splice(index, 1);

        if (item.id > 0)
          this.service.ExcluirGrupo(item.id).then(
            (res) => {
              if (res.status == 200) {
                this.$emit("salvou");
                this.Atualizar();
              }
            },
            (err) => TratarErroApi(err)
          );
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    });
  }

  async Atualizar() {
    if (this.item.id > 0) {
      await this.service
        .ObterPorId(
          this.item.id,
          "Grupos.Unidades, Fotos, DocumentosCompartilhados, Proprietarios, LadosAdicionaisPadroes"
        )
        .then(
          (res) => {
            this.item = new Empreendimento(res.data);
            this.ObterGrupos();
            this.empreendimento = new Empreendimento(res.data);
            this.model = null;
          },
          (err) => TratarErroApi(err)
        );
    }
  }

  ObterUnidade(unidade, quadra, index) {
    if (unidade.id > 0) {
      this.service
        .ObterUnidade(
          unidade.id,
          "ConfrontantesAdicionais, Imovel, Lote, Lote.Infraestrutura, Lote.LadosAdicionais, Grupo, PlanoPagamento.Intermediaria, PlanoPagamento.Financiamento, PlanoPagamento.Entrada"
        )
        .then((res) => {
          this.setInformacaoUnidade(res.data, index);
        });
    } else {
      this.setInformacaoUnidade(unidade, index);
    }
  }

  setInformacaoUnidade(informacao, index) {
    this.informacaoUnidade = informacao;
    this.dialogUnidadeInformacao = true;
    this.index = index;
  }

  abrirUnidades(item) {
    this.incluirUnidade = item;
    this.dialogUnidade = true;
  }

  /* Obter Informações */
  ObterGrupos() {
    this.service
      .ListarGrupo(this.item.id, "Unidades.Lote, Unidades.Imovel")
      .then(
        (res) => {
          this.grupos = res.data;
        },
        (err) => TratarErroApi(err)
      );
  }

  /* Anexar foto */
  Upload() {
    window.addEventListener("focus", () => {}, { once: true, passive: true });

    this.$refs.uploader.click();
  }

  async enviarMeasuresImgMapa(width: number, height: number) {
    this.item.mapaInterativo.altura = height;
    this.item.mapaInterativo.largura = width;
  }

  async enviarImagem(e: any, tipo: "fotoPrincipal" | "imagemMapa") {
    const maxSizeMBFotoPrincipal = 1;
    const maxSizeMBImagemMapa = 5;
    const sizeMb = 1024 * 1024;
    const file = e.target.files[0];

    if (tipo === "fotoPrincipal") {
      const maxSizeBytes = maxSizeMBFotoPrincipal * sizeMb;

      if (file.size > maxSizeBytes) {
        return this.$swal(
          "Arquivo muito grande",
          `O tamanho máximo permitido é ${maxSizeMBFotoPrincipal} MB.`,
          "warning"
        );
      }
    } else {
      const maxSizeBytes = maxSizeMBImagemMapa * sizeMb;

      if (file.size > maxSizeBytes) {
        return this.$swal(
          "Arquivo muito grande",
          `O tamanho máximo permitido é ${maxSizeMBImagemMapa} MB.`,
          "warning"
        );
      }
    }

    let dados = await new ArquivoService().Ler(file);

    if (tipo === "fotoPrincipal") {
      try {
        this.loadingFotoPrincipal = true;
        const resultUrl = await this.service.updateFotoPrincipal(
          this.empreendimento.id,
          dados
        );

        this.item.imagemPrincipal = resultUrl.data;
        this.empreendimento.imagemPrincipal = resultUrl.data;
        this.$swal("Aviso", "Operação realizada com sucesso!", "success");
      } catch (error) {
        this.$swal("Aviso", "Não foi possível atualizar a imagem!", "warning");
      } finally {
        this.loadingFotoPrincipal = false;
      }
    } else {
      if (this.item.mapaInterativo === null) {
        this.item.mapaInterativo = new MapaInterativo();
      }

      try {
        this.loadingImagemMapa = true;
        const resultUrl = await this.service.updateFotoMapaInterativo(
          this.empreendimento.id,
          dados
        );

        this.item.mapaInterativo.imagemMapa = resultUrl.data;
        this.empreendimento.mapaInterativo.imagemMapa = resultUrl.data;

        this.$swal("Aviso", "Operação realizada com sucesso!", "success");
      } catch (error) {
        this.$swal("Aviso", "Não foi possível atualizar a imagem!", "warning");
      } finally {
        this.loadingImagemMapa = false;
      }
    }
  }

  Validacoes() {
    if (!this.item.empresaId || !this.item.nome) {
      this.$swal("Atenção!", "Campos obrigatórios não preenchidos.", "warning");
      this.tabAtiva = 0;
      this.subTabActive = 0;
      return true;
    }

    if (
      !this.item.endereco.cep ||
      !this.item.endereco.logradouro ||
      !this.item.endereco.bairro ||
      !this.item.endereco.estadoId ||
      !this.item.endereco.municipioId
    ) {
      this.$swal(
        "Atenção!",
        "É necessário preencher o endereço completo do Empreendimento.",
        "warning"
      );
      this.tabAtiva = 0;
      this.subTabActive = 0;
      return true;
    }

    if (this.item.proprietarios.length == 0) {
      this.$swal(
        "Atenção!",
        "É necessário adicionar um ou mais proprietarios para este empreendimento.",
        "warning"
      );
      this.tabAtiva = 1;
      this.subTabActive = 0;
      return true;
    }

    this.overlayEmpreendimento = !this.overlayEmpreendimento;
  }

  Reset() {
    this.grupos = [];
    this.index = 0;
    this.tabAtiva = 0;
    this.subTabActive = 0;
    this.qtdeQuadras = 0;
    this.imgUrl = null;
    this.overlayEmpreendimento = false;
    this.model = null;
  }

  getColorSituation(situationId: number) {
    return getColorSituationLot(situationId);
  }

  get iconeDados() {
    if (
      !this.item.endereco.cep ||
      !this.item.endereco.logradouro ||
      !this.item.endereco.bairro ||
      !this.item.endereco.estadoId ||
      !this.item.endereco.municipioId
    )
      return "mdi-lock";
    return "mdi-lock-open";
  }

  get iconeGrupos() {
    if (
      !this.item.endereco.cep ||
      !this.item.endereco.logradouro ||
      !this.item.endereco.bairro ||
      !this.item.endereco.estadoId ||
      !this.item.endereco.municipioId ||
      !this.item.empresaId ||
      !this.item.tipoId ||
      !this.item.nome
    )
      return "mdi-lock";
    return "mdi-lock-open";
  }

  get inconeUnidades() {
    if (!this.item.grupos.length && !this.grupos.length) return "mdi-lock";
    return "mdi-lock-open";
  }

  mounted() {
    this.model = null;
    this.item.mapaInterativo = new MapaInterativo();

    new PlanoPagamentoService().ListarTudo().then((res) => {
      this.planosPagamento = res.data.items;
    });

    new TipoUnidadeService().ListarTudo().then((res) => {
      this.listaTipos = res.data.items;
    });

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
      .then((res) => {
        this.listaEmpresa = res.data.items;
      });

    new TipoEmpreendimentoService().ListarTudo().then((res) => {
      this.listaTipoEmpreendimento = res.data.items.filter((x) => x.id != 4);
    });

    new CartorioService().ListarTudo().then((res) => {
      this.listaCartorio = res.data.items;
    });

    new SituacaoUnidadeService().ListarTudo().then((res) => {
      this.listaSituacao = res.data.items.filter(
        (situacao: any) => situacao.id !== 4
      );
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
        "Id,nome,cnpjCpf, nomeCnpjCpf, isProprietario, isCorretor",
        ""
      )
      .then((res) => {
        this.pessoas = res.data.items.filter(
          (x) => x.isProprietario == true || x.isCorretor == true
        );
      });
  }
}
</script>
<style scoped>
.show-btns {
  color: #e05a1b !important;
}

.focus-img {
  position: relative;
  display: inline-block;
  background-size: cover;
  /* Ajusta a imagem de fundo */
  background-position: center;
  border-radius: 8px;
  /* Ajuste se quiser bordas arredondadas */
}

.focus-img:focus::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Escurece a imagem */
  z-index: 1;
  border-radius: inherit;
  /* Aplica o mesmo border-radius */
  transition: opacity 0.3s;
}

.focus-img > * {
  position: relative;
  z-index: 2;
  /* Garante que os ícones fiquem acima do escurecimento */
}

.tree {
  min-height: 20px;
  padding: 19px;
  margin-bottom: 20px;
  background-color: #ffffff;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
  -moz-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
}

.tree li {
  list-style-type: none;
  margin: 0;
  padding: 15px 5px 0 05px;
  position: relative;
}

.tree li::before,
.tree li::after {
  content: "";
  left: -25px;
  position: absolute;
  right: auto;
}

.tree li::before {
  border-left: 2px solid #e2dfdf;
  bottom: 50px;
  height: 100%;
  top: 0;
  width: 1px;
}

.tree li::after {
  border-top: 2px solid #e2dfdf;
  height: 20px;
  top: 27px;
  width: 23px;
}

.tree li span {
  margin-left: 10%;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  display: inline-block;
  padding: 5px 5px;
  text-decoration: none;
}

.tree li.parent_li > span {
  cursor: pointer;
}

.tree > ul > li::before,
.tree > ul > li::after {
  border: 0;
}

.tree li:last-child::before {
  height: 30px;
}

.tree li.parent_li > span:hover,
.tree li.parent_li > span:hover + ul li span {
  background: #eee;
  border: 1px solid #94a0b4;
  color: #000;
}
</style>
