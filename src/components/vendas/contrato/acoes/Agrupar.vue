<template>
  <v-dialog persistent v-model="dialog" width="1200" no-click-animation>
    <v-card>
      <v-toolbar flat>
        <v-btn icon color="primary" @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title class="title-toolbar"
          >Gerenciar Parcelas</v-toolbar-title
        >
        <v-spacer />
        <v-toolbar-items>
          <v-card-actions>
            <v-btn
              outlined
              color="primary"
              @click="AbrirDialogBaixarParcelas(SelecionarParcelas)"
            >
              Baixar Parcelas
            </v-btn>

            <v-btn
              outlined
              color="primary"
              @click="GerarCarne(SelecionarParcelas)"
            >
              Gerar Carnê
            </v-btn>

            <v-btn
              outlined
              color="primary"
              @click="Antecipar(SelecionarParcelas)"
              v-if="item.contrato ? item.contrato.tipoAmortizacaoId != 2 : 0"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  Antecipar
                  <v-icon right dark v-on="on">mdi-information</v-icon>
                </template>
                <span>Aplicação de encargos e desconto de antecipação.</span>
              </v-tooltip>
            </v-btn>

            <v-btn
              outlined
              color="primary"
              @click="Agrupar(SelecionarParcelas)"
              v-if="item.contrato ? item.contrato.tipoAmortizacaoId != 2 : 0"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  Agrupar
                  <v-icon right dark v-on="on">mdi-information</v-icon>
                </template>
                <span>Aplicação de encargos e desconto da parcela.</span>
              </v-tooltip>
            </v-btn>
          </v-card-actions>
        </v-toolbar-items>
      </v-toolbar>

      <v-row dense class="mt-4 pa-4">
        <!-- Total de Parcelas Selecionadas -->
        <v-col cols="12" md="2">
          <v-card outlined class="pa-3" flat>
            <v-row align="center">
              <!-- <v-icon color="primary" size="30">mdi-file-document-outline</v-icon> -->
              <v-col>
                <div class="font-weight-regular text-h6">Parcelas Selec.</div>
                <div class="font-weight-bold text-h5">
                  {{ SelecionarParcelas.length }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- Total Somatório das Parcelas -->
        <v-col cols="12" md="3">
          <v-card outlined class="pa-3" flat>
            <v-row align="center">
              <!-- <v-icon color="green darken-2" size="35">mdi-cash</v-icon> -->
              <v-col>
                <div class="font-weight-regular text-h6">
                  Total das Parcelas
                </div>
                <div class="font-weight-bold text-h5">
                  {{
                    SelecionarParcelas.reduce(
                      (total, x) => total + (x.saldo || 0),
                      0
                    ).toMoeda(true)
                  }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="12" md="2">
          <v-card outlined class="pa-3" flat>
            <v-row align="center">
              <!-- <v-icon color="green darken-2" size="35">mdi-cash</v-icon> -->
              <v-col>
                <div class="font-weight-regular text-h6">Desconto</div>
                <div class="font-weight-bold text-h5">
                  {{
                    SelecionarParcelas.reduce(
                      (total, x) => total + (x.descontoAplicado || 0),
                      0
                    ).toMoeda(true)
                  }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="12" md="2">
          <v-card outlined class="pa-3" flat>
            <v-row align="center">
              <!-- <v-icon color="green darken-2" size="35">mdi-cash</v-icon> -->
              <v-col>
                <div class="font-weight-regular text-h6">Encargos</div>
                <div class="font-weight-bold text-h5">
                  {{
                    SelecionarParcelas.reduce(
                      (total, x) =>
                        total + (x.jurosAplicado + x.multaAplicado || 0),
                      0
                    ).toMoeda(true)
                  }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col cols="12" md="3">
          <v-card outlined class="pa-3" flat>
            <v-row align="center">
              <!-- <v-icon color="green darken-2" size="35">mdi-cash</v-icon> -->
              <v-col>
                <div class="font-weight-regular text-h6">Total</div>
                <div class="font-weight-bold text-h5">
                  {{ Number(valorTotal).toMoeda(true) }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-card flat>
        <v-form v-model="valid" lazy-validation ref="form">
          <v-card-text>
            <v-row dense v-if="urlCarne">
              <v-col cols="12" md="3">
                <v-btn dark color="primary" @click="VisualizarCarne(item)"
                  >Visualizar Carnê
                  <v-icon right>mdi-book-multiple</v-icon></v-btn
                >
              </v-col>

              <v-col cols="12" md="3" class="px-4">
                <v-btn dark color="green" @click="VisualizarCarneWpp()"
                  >Enviar Carnê WhatsApp
                  <v-icon right>mdi-whatsapp</v-icon></v-btn
                >
              </v-col>
            </v-row>

            <v-col cols="12">
              <v-data-table
                class="elevation-1"
                fixed-header
                height="320"
                :headers="headers"
                v-model="SelecionarParcelas"
                :items="item.parcelas"
                :options.sync="optionsParcelas"
                :footer-props="{ showFirstLastPage: true }"
                item-key="id"
                show-select
                sort-by="parcela"
                :loading="loading"
              >
                <template v-slot:[`item.editar`]="{ item }">
                  <v-btn
                    style="margin-left: -50px"
                    icon
                    @click="EditarParcela(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
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

                <template v-slot:[`item.desconto`]="{ item }">
                  {{
                    item.descontoAplicado
                      ? Number(item.descontoAplicado).toMoeda(true)
                      : new Number(0).toMoeda(true)
                  }}
                </template>

                <template v-slot:[`item.encargos`]="{ item }">
                  {{
                    item.valor
                      ? Number(item.jurosAplicado + item.multaAplicado).toMoeda(
                          true
                        )
                      : new Number(0).toMoeda(true)
                  }}
                </template>

                <template v-slot:[`item.urlBoleto`]="{ item }">
                  <div v-if="item.linhaDigitavelBoleto || item.urlBoleto">
                    <v-btn icon @click="VisualizarBoleto(item)">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon color="primary" v-on="on">mdi-barcode</v-icon>
                        </template>
                        <span>Visualizar boleto</span>
                      </v-tooltip>
                    </v-btn>
                  </div>
                </template>

                <template v-slot:[`item.situacao.nome`]="{ item }">
                  <v-chip :color="SituacaoColor(item)">
                    <div v-if="item.agrupadorId != null">Agrupada</div>

                    <div v-else>
                      {{
                        listaSituacao.find((x) => x.id == item.situacaoId).nome
                      }}
                    </div>
                  </v-chip>
                </template>

                <template v-slot:[`item.dataVencimento`]="{ item }">
                  {{
                    item.dataVencimento != undefined
                      ? item.dataVencimento.toDateDDMMYYYY()
                      : "-"
                  }}
                </template>
              </v-data-table>
            </v-col>
          </v-card-text>
        </v-form>
      </v-card>
    </v-card>
 
      <v-dialog v-model="dialogBaixa" persistent max-width="800px">
        <v-card>
          <v-card-title>
            <v-btn icon color="primary"  @click="dialogBaixa = false">
              <v-icon>mdi-close</v-icon>
            </v-btn> 
            <span class="text-h5">Baixar Múltiplas Parcelas</span>
          </v-card-title>
          <br>
          <v-card-text> 
            <v-container>
              <v-row dense>
                <v-col cols="12" sm="6" md="6">
                  <span>Forma de Pagamento </span>
                  <v-select :rules="fieldRules" v-model="baixa.formaPagamentoId" :items="listaFormaPagamento" item-text="nome" item-value="id" outlined dense label="Selecione" required></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          </br>
        </v-card>
      </v-dialog>

    <v-dialog v-model="dialogBaixa" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <v-btn icon color="primary" @click="dialogBaixa = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <span class="text-h5">Baixar Múltiplas Parcelas</span>
        </v-card-title>
        <br />
        <v-card-text>
          <v-container>
           <v-row dense>
              <v-col cols="12" sm="6" md="6">
                <span>Forma de Pagamento </span>
                <v-select
                  :rules="fieldRules"
                  v-model="baixa.formaPagamentoId"
                  :items="listaFormaPagamento"
                  item-text="nome"
                  item-value="id"
                  outlined
                  dense
                  label="Selecione"
                  required
                ></v-select>
              </v-col>

                <v-col cols="12" sm="7" md="7">
                  <span>Data de Pagamento</span>
                  <v-text-field :disabled="PagarNoVencimento" :rules="fieldRules" v-model="baixa.dataPagamento" type="date" outlined dense></v-text-field>
                </v-col>

                <v-col cols="12" sm="5" md="5">
                  <span>Total a Pagar</span>
                  <money-input disabled v-model="valorTotal" @ValorFormatado="valor => valorTotal = valor"/>
                </v-col>

                 <v-switch v-model="PagarNoVencimento" :label="`Pagar no vencimento das parcelas`"></v-switch>
            </v-row>
           <v-row>
            <small>*indica campos obrigatórios</small>

              <v-col cols="12" sm="5" md="5">
                <span>Total a Pagar</span>
                <money-input
                  disabled
                  v-model="valorTotal"
                  @ValorFormatado="(valor) => (valorTotal = valor)"
                />
              </v-col>
            </v-row>
          </v-container>
            
          <small>*indica campos obrigatórios</small>
        </v-card-text>   
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="BaixarParcelas(SelecionarParcelas)">
            Baixar Parcelas
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <antecipar-contrato
      v-model="dialogAnteciparContrato"
      :item="contratoAntecipacao"
      @fechou="dialogAnteciparContrato = false"
      @salvou="ObterReceitaId()"
    />
    <agrupar-parcela
      v-model="dialogAgrupar"
      :item="agruparParcela"
      @fechou="dialogAgrupar = false"
      @salvou="ObterReceitaId()"
    />
    <editar-parcelaManual
      v-model="dialogParcela"
      :item="parcela"
      @fechou="dialogParcela = false"
      @salvou="ObterReceitaId()"
    />
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import {
  ContaCorrenteService,
  FormaPagamentoService,
  ReceitaService,
  SituacaoReceitaParcelaService,
} from "@/core/services/financeiro";
import {
  Receita,
  ReceitaBaixa,
  ReceitaParcela,
} from "@/core/models/financeiro";
import { FormatarNumeroTelefone, SituacaoColor } from "@/assets/scripts/helper";

@Component
export default class AgruparAntecipar extends Vue {
  @Prop() public item!: Receita;
  @Prop() public value!: string;

  agruparParcela = new ReceitaParcela();
  contratoAntecipacao = new ReceitaParcela();
  receitaService = new ReceitaService();
  parcela = new ReceitaParcela();

  baixa = new ReceitaBaixa();

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  dialogBaixa = false;
  valid = true;
  dialog = false;

  $refs!: {
    form: HTMLFormElement;
  };

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "", value: "editar", align: "center", sortable: false },
    { text: "Nº", value: "parcela", align: "center", sortable: false },
    {
      text: "Valor da Parcela",
      value: "valor",
      align: "center",
      sortable: false,
    },
    { text: "Desconto", value: "desconto", align: "center", sortable: false },
    { text: "Encargos", value: "encargos", align: "center", sortable: false },
    { text: "Boleto", value: "urlBoleto", align: "center", sortable: false },
    {
      text: "Situação",
      value: "situacao.nome",
      align: "center",
      sortable: false,
    },
    {
      text: "Vencimento",
      value: "dataVencimento",
      align: "center",
      sortable: false,
    },
  ];

  get valorTotal() {
    const saldoTotal = this.SelecionarParcelas.reduce(
      (total, x: any) => total + (x.saldo || 0),
      0
    );
    const descontoTotal = this.SelecionarParcelas.reduce(
      (total, x: any) => total + (x.descontoAplicado || 0),
      0
    );
    const encargosTotal = this.SelecionarParcelas.reduce(
      (total, x: any) =>
        total + ((x.jurosAplicado || 0) + (x.multaAplicado || 0)),
      0
    );

    return saldoTotal - descontoTotal + encargosTotal;
  }

  contaCorrentes = [];
  listaFormaPagamento = [];

  SelecionarParcelas = [];
  parcelasEmAberto = [];
  listaSituacao = [];

  pdfUrl: string = "";
  urlCarne: string = "";
  dialogAgrupar: boolean = false;
  dialogAnteciparContrato: boolean = false;
  loading: boolean = false;
  dialogParcela: boolean = false;

  optionsParcelas: any = {
    itemsPerPage: -1,
  };

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

  Agrupar(listaParcela) {
    if (listaParcela.length <= 1)
      return this.$swal(
        "Aviso",
        "É necessário selecionar duas ou mais parcelas para fazer o agrupamento de parcelas.",
        "warning"
      );

    if (listaParcela.find((x) => x.urlBoleto))
      return this.$swal(
        "Aviso",
        "Não é possível agrupar com boleto gerado.",
        "warning"
      );

    this.agruparParcela = listaParcela;
    this.dialogAgrupar = true;
  }

  Antecipar(listaParcela) {
    if (listaParcela[0] == undefined)
      return this.$swal(
        "Aviso",
        "É necessário selecionar uma ou mais parcelas.",
        "warning"
      );

    if (listaParcela.find((x) => x.urlBoleto))
      return this.$swal(
        "Aviso",
        "Não é possível antecipar com boleto gerado.",
        "warning"
      );

    this.contratoAntecipacao = listaParcela;
    this.dialogAnteciparContrato = true;
  }

  GerarCarne(listaParcela) {
    if (listaParcela.length <= 1)
      return this.$swal(
        "Aviso",
        "É necessário selecionar duas ou mais parcelas para gerar o carnê.",
        "warning"
      );

    this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja gerar o carnê?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return (
          this.item.tipoOperacaoId == 3
            ? this.receitaService.GerarCarneBancoBrasil(
                listaParcela.map((x) => x.id)
              )
            : this.receitaService.GerarCarne(listaParcela.map((x) => x.id))
        ).then(
          (res) => {
            if (res.status == 200) {
              this.SelecionarParcelas = [];
              let file = new Blob([res.data], {
                type: res.headers["content-type"],
              });
              this.pdfUrl = URL.createObjectURL(file);
              return res;
            }
          },
          (err) => this.$swal("Aviso", err.response.data, "error")
        );
      },
      //allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result: any) => {
      if (result.value.status == 200) {
        this.$swal("Aviso", "Operação realizada com sucesso!", "success");
        this.urlCarne = result.value.data;
      } else {
        this.$swal("Aviso", result.value.data, "warning");
      }
    });
  }

  AbrirDialogBaixarParcelas(listaParcela) {
    if (listaParcela[0] == undefined)
      return this.$swal(
        "Aviso",
        "É necessário selecionar uma ou mais parcelas.",
        "warning"
      );

    this.baixa.valor = listaParcela[0].valor;
    this.dialogBaixa = true;
  }

  PagarNoVencimento: boolean = false;

  BaixarParcelas(listaParcela) {
    let modelo = {
      parcelaIds: listaParcela.map((x) => x.id),
      modeloBaixa: this.baixa,
      PagarNoVencimento: this.PagarNoVencimento,
    };

    this.receitaService.BaixarMultiplasParcelas(modelo).then(
      (res) => {
        this.$swal(
          "Aviso",
          "Operação realizada com sucesso!",
          res.status == 201 || res.status == 200 ? "success" : "warning"
        );
        this.$emit("salvou");
        this.ObterReceitaId();
        this.Reset();
        this.dialogBaixa = false;
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

  VisualizarBoleto(item) {
    if (item.tipoGatewayId == 3) {
      let routeLink = this.$router.resolve({
        name: "RelBoletoSafra",
        query: {
          codigoZoop: item.codigoZoop ? item.codigoZoop.toString() : "",
        },
      });
      window.open(routeLink.href, "_blank");
    } else {
      window.open(item.urlBoleto);
    }
  }

  VisualizarCarne(item) {
    if (item.tipoOperacaoId == 3) {
      window.open(this.pdfUrl);
    } else {
      window.open(this.urlCarne);
    }
  }

  VisualizarCarneWpp() {
    var telefone = FormatarNumeroTelefone(this.item.cliente!.telefone);

    window.open(
      `https://api.whatsapp.com/send?phone=55${telefone}&text=Olá, Segue a baixo o link do seu carnê: ${this.urlCarne}`
    );
  }

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

  ObterReceitaId() {
    this.loading = true;
    this.receitaService
      .ObterPorId(this.item.id, "Cliente, Parcelas.Baixas")
      .then((res) => {
        this.atualizarParcelas(res.data.parcelas);
        this.Reset();
        this.loading = false;
      });
  }

  atualizarParcelas(parcelas) {
    const filtrarParcelas = (parcela) =>
      parcela.agrupadorId === null &&
      parcela.situacaoId !== 3 &&
      parcela.situacaoId !== 2 &&
      parcela.isAgrupador === false;
    this.item.parcelas = parcelas.filter(filtrarParcelas);
  }

  Reset() {
    this.SelecionarParcelas = [];
    this.baixa = new ReceitaBaixa();
  }

  Close() {
    this.urlCarne = "";
    this.parcelasEmAberto = [];
    this.Reset();
    this.dialog = false;
  }

  SituacaoColor(item) {
    return SituacaoColor(item);
  }

  mounted() {
    new ContaCorrenteService().ListarTudo().then((res) => {
      this.contaCorrentes = res.data.items;
    });

    new FormaPagamentoService().ListarTudo().then((res) => {
      this.listaFormaPagamento = res.data.items;
    });

    new SituacaoReceitaParcelaService().ListarTudo().then((res) => {
      this.listaSituacao = res.data.items;
    });
  }
}
</script>