<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
    no-click-animation
  > 
    <v-card tile>  
      <v-toolbar extended dark color="primary" dense>
        <v-btn icon dark @click="Close()">
          <v-icon>mdi-close</v-icon> 
        </v-btn> 

        <v-toolbar-title>Baixar Parcela <v-chip outlined label> {{ item.parcela }}</v-chip></v-toolbar-title>  
        <v-spacer/>
           
        <v-toolbar-items>
          <v-btn dark text @click="Salvar(true)" :disabled="!valid || overlay" :loading="overlay">Pagar e fechar</v-btn>
        </v-toolbar-items>   
      </v-toolbar> 
   
         <v-card flat>    
            <v-row dense no-gutters>
              <v-col cols="12" md="6">

                <v-card outlined>  
                   <v-card-text> 
                      <v-card-title>
                        <span class="title-span">Confirmar o Pagamento</span>
                      </v-card-title> 
                     <br>
                      <v-form v-model="valid" ref="form" lazy-validation>
                        <v-row dense class="px-3">
                          <v-col cols="12" sm="12" md="6">
                            <span class="font-weight-bold">Forma de pagamento</span> 
                            <v-select outlined v-model="baixa.formaPagamentoId" :items="listaFormaPagamento" item-value="id" item-text="nome" :rules="fieldRules" dense :menu-props="{ offsetY: true, offsetOverflow: true }"/>
                          </v-col> 

                          <v-col cols="12" sm="12" md="3">
                            <span class="font-weight-bold">Conta Corrente</span> 
                            <v-select outlined :rules="fieldRules" v-model="baixa.contaCorrenteId" :items="contaCorrentes" item-value="id" item-text="nome" dense :menu-props="{ offsetY: true, offsetOverflow: true }"/>
                          </v-col>

                          <v-col cols="12" md="3">
                            <span class="font-weight-bold">Data</span> 
                            <v-text-field hint="Data do Recebimento" persistent-hint outlined v-model="baixa.dataPagamento" max="9999-12-31" type="date" dense @input="AtualizarValor()" :rules="fieldRules"/>
                          </v-col>

                          <v-col cols="12" sm="12" md="2" lg="3" xl="3" class="mb-2">
                            <span class="font-weight-bold">Á Receber</span> 
                            <money-input v-model="baixa.valor" @ValorFormatado="valor => baixa.valor = valor"/>
                          </v-col>
  
                          <v-col cols="12" xs="12" sm="12"  md="4" lg="3" xl="3" v-if="baixa.juros" class="mb-2">
                            <span class="font-weight-bold">Juros ao dia</span>
                            <money-input disabled v-model="baixa.juros" @ValorFormatado="valor => baixa.juros = valor"/>
                          </v-col>

                          <v-col cols="12" xs="12" sm="12" md="4" lg="3" xl="3" v-if="baixa.multa" class="mb-2">
                            <span class="font-weight-bold">Multa</span>
                            <money-input disabled v-model="baixa.multa" @ValorFormatado="valor => baixa.multa = valor"/>
                          </v-col>

                         <v-col cols="12" xs="12" sm="12" md="4" lg="3" xl="3" v-if="baixa.desconto" class="mb-2">
                            <span class="font-weight-bold">Desconto</span>
                            <money-input disabled v-model="baixa.desconto" @ValorFormatado="valor => baixa.desconto = valor"/>
                          </v-col> 

                          <v-col cols="12" xs="12" sm="12" md="4" lg="3" xl="3" class="mb-2">
                            <span class="font-weight-bold">Valor Final</span>
                            <money-input disabled v-model="baixa.total" @ValorFormatado="valor => baixa.total = valor"/>
                          </v-col>

                          <v-col cols="12" xs="12" sm="12" md="4" lg="2" xl="2" class="pt-7"> 
                            <v-btn elevation="3" color="primary" @click="Salvar(false)" :disabled="!valid || overlay" :loading="overlay">
                              <v-icon left> mdi-plus</v-icon>
                              Pagar
                            </v-btn> 
                          </v-col>
                        </v-row>
                      </v-form>   
                    </v-card-text> 
                  <br> 
                </v-card>
                   
              <v-data-table :headers="headers" :items="parcela.baixas" :items-per-page="5" class="elevation-1" :loading="loading">
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip>
                      <template v-slot:activator="{ on }">
                        <v-menu offset-y v-on="on">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn x-small color="primary" outlined icon dark v-bind="attrs" v-on="on">
                              <v-icon>mdi-menu-down</v-icon>  
                            </v-btn>
                          </template>

                            <v-list>
                              <v-list-item v-if="item.receitaBaixaComprovante == null" @click="GerarComprovante(item)">
                                <v-list-item-title>
                                  <v-icon color="grey">mdi-read</v-icon> Gerar comprovante
                                </v-list-item-title>
                              </v-list-item>

                              <v-list-item v-else @click="VisualizarComprovante(item)">
                                <v-list-item-title>
                                <v-icon color="grey">mdi-receipt</v-icon>Visualizar comprovante
                                </v-list-item-title>
                              </v-list-item>
                            <v-divider/>

                            <v-list-item @click="CancelarBaixa(item)" :disabled="item.cancelado">
                              <v-list-item-title>
                                <v-icon :disabled="item.cancelado" color="red">mdi-cancel</v-icon> Cancelar baixa
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </template>
                    </v-tooltip>
                  </template>
                  
                <template v-slot:[`item.dataPagamento`]="{item}">
                  {{new Date(item.dataPagamento).ddmmyyyy() }}
                </template>

                <template v-slot:[`item.formaPagamento.nome`]="{item}">
                  {{  item.formaPagamento ? item.formaPagamento.nome : '-' }}
                </template>  

                <template v-slot:[`item.contaCorrente.nome`]="{item}">
                  {{  item.contaCorrente ? item.contaCorrente.nome : '-' }}
                </template>

                <template v-slot:[`item.valor`]="{item}">
                  {{item.valor  ? Number(item.valor).toMoeda(true) : new Number(0).toMoeda(true)}}
                </template>

                <template v-slot:[`item.juros`]="{item}">
                  {{item.juros  ? Number(item.juros).toMoeda(true) : new Number(0).toMoeda(true)}}
                </template>

                <template v-slot:[`item.multa`]="{item}">
                  {{item.multa  ? Number(item.multa).toMoeda(true) : new Number(0).toMoeda(true)}}
                </template>

                <template v-slot:[`item.desconto`]="{item}">
                  {{item.desconto  ? Number(item.desconto).toMoeda(true) : new Number(0).toMoeda(true)}}
                </template>
                
                <template v-slot:[`item.total`]="{item}">
                  {{item.total  ? Number(item.total).toMoeda(true) : new Number(0).toMoeda(true)}}
                </template>  

                <template v-slot:[`item.usuario`]="{item}">
                  {{ item.usuario ? item.usuario.login : 'Baixa Automática' }}
                </template>  

                <template v-slot:[`item.cancelado`]="{item}">
                  <v-chip small :color="item.cancelado == true ? 'red lighten-3' : 'teal lighten-3'">
                    <div v-if="item.cancelado == true">Cancelado</div>
                    <div v-else>Ativo</div>
                  </v-chip>
                </template>   
              </v-data-table>   
            </v-col>
  
              <v-col cols="12" md="6">
                <v-card outlined>   
                  <v-card-text>  
                    <v-card-title>
                      <!-- <v-icon color="primary" size="30" left>mdi-information</v-icon> -->
                      <span class="title-span">Informação da Parcela</span>
                    </v-card-title> 
                    <br>
                     <v-list two-line>
                        <v-list-item>
                          <v-row dense> 
                            <v-col cols="12" md="4">
                              <v-list-item-content>
                                <v-list-item-title>Parcela</v-list-item-title>
                                <v-list-item-subtitle>{{item.parcela}}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-col>

                            <v-col cols="12" md="4">
                              <v-list-item-content>
                                <v-list-item-title>Vencimento da parcela</v-list-item-title>
                                <v-list-item-subtitle>{{ new Date(item.dataVencimento).ddmmyyyy() }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-col>                       

                            <v-col cols="12" md="4">
                              <v-list-item-content>
                                <v-list-item-title>Valor da Parcela</v-list-item-title>
                                <v-list-item-subtitle>{{item.valor  ? Number(item.valor).toMoeda(true) : new Number(0).toMoeda(true)}}</v-list-item-subtitle>
                              </v-list-item-content>   
                            </v-col>  
                          </v-row>
                        </v-list-item>
                      <v-divider/>

                      <v-list-item>
                        <v-row dense> 
                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title>Saldo</v-list-item-title>
                              <v-list-item-subtitle>{{parcela.saldo  ? Number(parcela.saldo).toMoeda(true) : new Number(0).toMoeda(true)}}</v-list-item-subtitle>
                            </v-list-item-content>   
                          </v-col>  
                        </v-row>
                      </v-list-item>
                    </v-list>

                    <v-row dense class="px-2">
                      <v-btn tile color="primary" @click="acrescimosDescontos == false ? acrescimosDescontos = true : acrescimosDescontos = false">
                        Acréscimos e Descontos <v-icon right>mdi-menu-down</v-icon>
                      </v-btn>
                    </v-row>
                  </v-card-text>
                </v-card>

                <v-card outlined v-if="acrescimosDescontos">
                  <v-card-text>  
                    <v-row dense>
                      <v-card-text class="title font-weight-medium">Acréscimos</v-card-text>
                     
                      <v-col cols="12" xs="12" sm="12" md="4" lg="3" xl="2">
                        <v-text-field outlined suffix="%" v-model="encargo.percentual" @input="BaixaPercentual('valor', $event)" dense type="number"/>
                      </v-col>

                      <v-col cols="12" xs="12" sm="12" md="4" lg="3" xl="2">
                        <money-input v-model="encargo.juros" @ValorFormatado="valor => encargo.juros = valor"/>
                      </v-col>
                    </v-row>
 
                    <v-row dense>
                      <v-card-text class="title font-weight-medium">Descontos </v-card-text>
                      <v-col cols="12" xs="12" sm="12" md="4" lg="3" xl="2">
                        <v-text-field outlined suffix="%" type="number" v-model="encargo.percentualdesconto" @input="DescontoPercentual('valor', $event)" dense/>
                      </v-col>

                      <v-col cols="12" xs="12" sm="12" md="4" lg="3" xl="2">
                        <money-input v-model="encargo.desconto" @ValorFormatado="valor => encargo.desconto = valor"/>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>  
            </v-row>  
          </v-card>  

          <v-container id="printMe">
                <div style="border: 1px solid grey; max-width: 374px; margin: 0 auto; padding:10px">
                  <h4>COMPROVANTE DE PAGAMENTO</h4>

                  <!-- Logo -->
                  <div v-if="comprovante.empresaLogo">
                    <img style="width: 100%" :src="'data:image/gif;base64,' + comprovante.empresaLogo" alt="Logo">
                  </div>

                  <!-- ✔️ 1) Datas e valores principais -->
                  <div>
                    Data de Vencimento: {{ new Date(comprovante.dataVencimetoParcela).ddmmyyyy() }}<br>
                    Pago em: {{ new Date(comprovante.dataPagamentoBaixa).ddmmyyyy() }}<br>
                    Valor do Documento: {{ comprovante.valorParcela.toMoeda(true) }}<br>
                    Desconto: {{ comprovante.descontos.toMoeda(true) }}<br>
                    Encargos: {{ (Number(comprovante.juros) + Number(comprovante.multa) + Number(comprovante.correcao)).toMoeda(true) }}<br>
                    Valor Pago: {{ comprovante.receitaBaixaComprovante ?   Number(comprovante.receitaBaixaComprovante.receitaBaixa?.total ?? 0).toMoeda(true) : 0 }}<br>
                    Forma de pagamento: {{ comprovante.formaPagamentoNome }}<br>
                  </div>

                  <!-- ✔️ 2) Código de barras -->
                  <div>
                    Código de barras: <br>
                    {{ comprovante.codigoRodape }}
                  </div>

                  <!-- ✔️ 3) Dados do pagador -->
                  <div style="margin-top: 10px;">
                    <strong>Dados do Pagador:</strong><br>
                    Nome: {{ comprovante.clienteNome }}<br>
                    Nº do Contrato: {{ comprovante.contratoNumeroESequencia }}<br>
                    Parcela: {{ comprovante.numeroParcela }} de {{ comprovante.totalParcela }}<br>
                    Loteamento: {{ comprovante.empreendimentoNome }}<br>
                  </div>

                  <!-- ✔️ 4) Dados do beneficiário -->
                  <div style="margin-top: 10px;">
                    <strong>Dados do Beneficiário:</strong><br>
                    Nome: {{ comprovante.empresa.nome }}<br>
                    CNPJ: {{ comprovante.empresa.cpfCnpj }}<br>
                    ID da Transação: {{ comprovante.receitaBaixaComprovante.id }}<br>
                  </div>

                  <!-- ✔️ 5) Endereço e contato, se quiser -->
                  <div style="margin-top: 10px;">
                    {{ comprovante.empresa.endereco.logradouro }}, Nº{{ comprovante.empresa.endereco.numero }}<br>
                    {{ comprovante.empresa.endereco.bairro }} - CEP: {{ comprovante.empresa.endereco.cep }}<br>
                    {{ comprovante.empresa.telefone1 }} - {{ comprovante.empresa.telefone2 }}<br>
                    Email: {{ comprovante.empresa.email }}<br>
                  </div>
                </div>
              </v-container>


          <!-- <v-container id="printMe">
            <div style="border: 1px solid grey; max-width: 374px; margin: 0px auto; padding:10px">
              <h3>COMPROVANTE DE PAGAMENTO</h3>
              <div v-if="comprovante.empresaLogo">
                <img  style="width: 100%" :src="'data:image/gif;base64,' + comprovante.empresaLogo" alt="Logo">
              </div>
              <div>
                {{comprovante.empresa.endereco.logradouro}}<br>
                Nº{{comprovante.empresa.endereco.numero}}, {{comprovante.empresa.endereco.bairro}}<br>
                CEP:{{comprovante.empresa.endereco.cep}}<br>
                {{comprovante.empresa.telefone1}} - {{comprovante.empresa.telefone2}}<br>
                Email: {{comprovante.empresa.email}}<br>
                CNPJ: {{comprovante.empresa.cpfCnpj}}
              </div>
              <div></div>
              <div>
                Atendente: {{comprovante.usuarioNome}}<br>
                Nº do Comprovante: {{comprovante.receitaBaixaComprovante.id}}
              </div>

              <div>
                Cliente: {{comprovante.clienteNome}}<br>
                Contrato: {{comprovante.contratoNumeroESequencia}}<br>
                Loteamento: {{comprovante.empreendimentoNome}}<br>
                Lote/Quadra: {{comprovante.unidadeNome}}/{{comprovante.grupoNome}}<br>
                Data de vencimento: {{new Date(comprovante.dataVencimetoParcela).ddmmyyyy()}}<br>
                Data de pgt: {{new Date(comprovante.dataPagamentoBaixa).ddmmyyyy()}}<br> 
                Parcela: {{comprovante.numeroParcela}} de {{comprovante.totalParcela}}<br>
                Valor da parcela: {{comprovante.valorParcela.toMoeda(true)}}<br>
                Correção monetária: {{comprovante.correcao.toMoeda(true)}}<br>
                Juros: {{comprovante.juros.toMoeda(true)}}<br>
                Multa: {{comprovante.multa.toMoeda(true)}}<br>
                Desconto: {{comprovante.descontos.toMoeda(true)}}<br>
                Valor para pagar hoje: {{Number((comprovante.valorParcela) + Number(comprovante.juros) + Number(comprovante.correcao) + Number(comprovante.multa) - Number(comprovante.descontos)).toMoeda(true)}}
              </div>
              
              <div>
                Valor pago em {{new Date(comprovante.dataPagamentoBaixa).ddmmyyyy()}}: {{(Number(comprovante.valorPagoHoje) +  Number(comprovante.juros) + Number(comprovante.correcao) + Number(comprovante.multa) - Number(comprovante.descontos)).toMoeda(true)}}<br>
                Resta a pagar: {{comprovante.saldo.toMoeda(true)}}
              </div>
              <div>{{comprovante.codigoRodape}}</div>
            </div>
          </v-container> -->
      
    </v-card>
  </v-dialog>
</template> 

<script lang="ts">
import { TratarErroApi } from "@/assets/scripts/helper";
import { Empresa } from "@/core/models/cadastros";
import { PageBase } from "@/core/models/shared";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ReceitaBaixa,ReceitaParcela} from "../../../core/models/financeiro";
import { ReceitaService,FormaPagamentoService, ContaCorrenteService} from "../../../core/services/financeiro";

@Component
export default class ParcelaBaixaReceita extends PageBase {
  @Prop() public item!: ReceitaParcela;
  @Prop() public value!: string;
   
  service = new ReceitaService();
  baixa = new ReceitaBaixa();

  parcela = new ReceitaParcela();
  comprovante = new ComprovanteBaixa();
   
  listaFormaPagamento = [];
  contaCorrentes = [];
     
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  $refs!: { form: HTMLFormElement };

  tabActive = null;
  valid:boolean = true;
  dialog:boolean = false;
  loading:boolean = false;
  acrescimosDescontos:boolean = false;
  overlay:boolean = false;

  private $htmlToPaper:any;
  encargo = {juros:0,percentual:0,desconto:0,percentualdesconto:0} 

  headers = [
    { text: "Ação", value: "actions", sortable: false, align: 'center' },
    { text: "Data", value: "dataPagamento", sortable: false, align: 'center' },
    { text: "Forma de pgt", value: "formaPagamento.nome", sortable: false, align: 'center' },
    { text: "Conta C.", value: "contaCorrente.nome", sortable: false, align: 'center' },
    { text: "Valor da Parcela", value: "valor", sortable: false, align: 'center'},
    { text: "Juros", value: "juros", sortable: false, align: 'center' },
    { text: "Multa", value: "multa", sortable: false, align: 'center' },
    { text: "Desconto", value: "desconto", sortable: false , align: 'center'},
    { text: "Total da Baixa", value: "total", sortable: false, align: 'center' },
    { text: "Usuário", value: "usuario", sortable: false , align: 'center'},
    { text: "Status", value: "cancelado", sortable: false, align: 'center' },
  ];
 
  @Watch("baixa")
  Baixa() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");   
    } else {
      this.Atualizar();
    }
  }

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
  } 
 
  Salvar(fechar:boolean = false) {
    if (this.$refs.form.validate()) {
      if (this.parcela.saldo === 0) {
        this.$swal("Aviso", "Atenção: Parece que esta parcela já foi devidamente paga!", "warning");
        return;
      }
        this.baixa.usuarioId =  this.app.usuarioId;
        this.overlay = true;

        let modelo = this.baixa;
        this.service.BaixarParcela(this.item.id, modelo).then(
          (res) => {
          this.$swal("Aviso", "Operação realizada com sucesso!", res.status == 201 || res.status == 200 ? "success" : "warning");
          this.$emit("salvou");

          if (fechar) {
            this.Close();
          } else {
            this.Atualizar();
          }

          this.encargo = {juros: 0, percentual: 0, desconto: 0, percentualdesconto: 0};
          this.baixa = new ReceitaBaixa();
          this.comprovante = new ComprovanteBaixa();
      },
      (err) => TratarErroApi(err)
      ).finally(() => this.overlay = false);
    }
  }   

  Atualizar(){ 
    this.loading = true;

    this.service.ObterParcelaPorId(this.item.id, 'Baixas.ReceitaBaixaComprovante, Baixas.Usuario, Baixas.FormaPagamento, Baixas.ContaCorrente').then(
      res => {
        this.parcela = res.data;
        this.baixa.valor = this.parcela.saldo;
        this.baixa.total = this.parcela.saldo;
        this.AtualizarValor();
        this.loading = false;
      }) 
  }

  Imprimir(){
    const localOptions = {
      styles: [
        'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
        'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css'
      ]
    }; 
    this.$htmlToPaper('printMe', localOptions);
  }

  VisualizarComprovante(item){
    this.service.VisualizarComprovante(item.id).then(
      (res) => {
        if (res.status == 200) {
          this.comprovante = res.data;
            setTimeout(() => { 
              this.Imprimir()
            },
            1500)
         }},
      (err) => TratarErroApi(err)
    );
  }

  GerarComprovante(item){
     this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja gerar o comprovante?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.service.GerarComprovante(item.id).then(
          (res) => {
            if (res.status == 200) {
            this.Atualizar();
            this.VisualizarComprovante(item);
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

  CancelarBaixa(item){
      this.$swal({
      title: "Atenção!",
      text: "Tem certeza que deseja cancelar a baixa?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCloseButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.service.CancelarBaixa(item.id).then(
          (res) => {
            if (res.status == 200) {
              this.Atualizar();
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

  calcularDiasAtraso(dataPagamento, dataVencimento) {
    return Math.ceil((dataPagamento - dataVencimento) / (1000 * 3600 * 24));
  }

  calcularJuros(diasAtraso, taxaJurosDia, valor, acresc) {
    return (diasAtraso * taxaJurosDia * valor / 100) + acresc;
  }

  calcularMulta(taxaMulta, valor) {
    return taxaMulta * valor / 100;
  }

  calcularDesconto(taxaDesconto, valor, desc) {
    return (taxaDesconto * valor / 100) + desc;
  }


  @Watch("baixa.valor")
  AtualizarValor() {
    const dataPagamento = new Date(this.baixa.dataPagamento);
    const dataVencimento = new Date(this.item.dataVencimento);
    const diasAtraso = this.calcularDiasAtraso(dataPagamento, dataVencimento);
    this.baixa.multa = 0; this.baixa.juros = 0; this.baixa.desconto = 0;

      this.baixa.desconto += this.encargo.desconto;
      this.baixa.juros += this.encargo.juros;
    if (diasAtraso >= 1) {
      this.baixa.juros = parseFloat(this.calcularJuros(diasAtraso, this.item.encargoFinanceiro.jurosDia, this.baixa.valor, this.encargo.juros).toFixed(2));
      this.baixa.multa = parseFloat(this.calcularMulta(this.item.encargoFinanceiro.multa, this.baixa.valor).toFixed(2));
    } else if (diasAtraso <= -this.item.encargoFinanceiro.diasDescontoVencimento) {
      this.baixa.desconto = parseFloat(this.calcularDesconto(this.item.encargoFinanceiro.descontoVencimento, this.baixa.valor, this.encargo.desconto).toFixed(2));
    }

    this.baixa.total = parseFloat((this.baixa.valor + this.baixa.juros + this.baixa.multa - this.baixa.desconto).toFixed(2));
  }

  BaixarParcela(tipo:string, elemento:any){
     if(tipo.toLocaleLowerCase() === "valor"){ 
      var valor = elemento
      valor = valor + '';
      valor = parseInt(valor.replace(/[\D]+/g,''));
      valor = valor + '';
      valor = valor.replace(/([0-9]{2})$/g, ".$1");
       
      this.baixa.valor = valor
      this.AtualizarValor();
     }   
  }

  @Watch("encargo.juros")
  BaixaJuros(){
    if (isNaN(this.encargo.juros) || isNaN(this.baixa.valor)) {
      return;
    }

    const percentual = ((this.encargo.juros * 100) / this.baixa.valor).toFixed(2);
    this.encargo.percentual = Number(percentual);
    this.AtualizarValor();
  }

  BaixaPercentual(tipo:string, elemento:any){
    if(tipo.toLocaleLowerCase() === "valor"){ 
      var percentual = elemento;

      let juros = Number((this.baixa.valor * percentual) / 100).toFixed(2);
      this.encargo.juros = Number(juros);
      this.AtualizarValor();
    }
  }

  @Watch("encargo.desconto")
  DescontoValor(){
    if (isNaN(this.encargo.desconto) || isNaN(this.baixa.valor)) {
      return;
    }

    const percentual = Number((this.encargo.desconto * 100) / this.baixa.valor).toFixed(2);
    this.encargo.percentualdesconto = Number(percentual);
    
    this.AtualizarValor();
  }

  DescontoPercentual(tipo:string, elemento:any){
    if(tipo.toLocaleLowerCase() === "valor"){ 
      var valor = elemento;
      let desconto = Number((this.baixa.valor * valor) / 100).toFixed(2);
      this.encargo.desconto = Number(desconto);

      this.AtualizarValor();
    }
  } 
 
  Close() {
    this.dialog = false;
    this.Reset();
  } 

  Reset(){
    this.parcela = new ReceitaParcela();
    this.encargo = {juros:0,percentual:0, desconto:0, percentualdesconto:0, }
    this.baixa = new ReceitaBaixa();
    this.comprovante = new ComprovanteBaixa();
    this.acrescimosDescontos = false;
  }

  mounted() {   
    new ContaCorrenteService().ListarTudo().then(res => {
      this.contaCorrentes = res.data.items;
    })

    new FormaPagamentoService().ListarTudo().then(
    (res) => {
      this.listaFormaPagamento = res.data.items;
    });
  } 
}
  class ComprovanteBaixa {
    public clientesNomes = [];
    public codigoRodape:string = "";  
    public contratoNumeroESequencia:string ="";
    public correcao:number = 0;
    public dataPagamentoBaixa:number = 0;
    public dataVencimentoParcela:number = 0;
    public descontos:number =0;
    public empreendimentoNome:string ="";
    public empresa = new Empresa();
    public empresaLogo:any = "";
    public grupoNome:string ="";
    public juros:number = 0;
    public multa:number = 0;
    public numeroParcela:number = 0 
    public receitaBaixaComprovante = new ReceitaBaixaComprovante();
    public saldo:number = 0;
    public totalParcela:number = 0; 
    public unidadeNome:string ="";
    public usuarioNome:string ="";
    public valorPagoHoje:number = 0;
    public valorParcela:number = 0;
  }

  class ReceitaBaixaComprovante{
    public dataEmissao:string ="";
    public id:number = 0;
    public receitaBaixaId:number =0
  }
</script>

 <style scoped>
.mt-1 {
  margin-top: 1rem;
}
.pl-1 {
  padding-left: 1rem;
}
.pl-3 {
  padding-left: 3rem;
}
.fundo {
  background-color: #f5f5f5;
}

#printMe {
  border: 1px solid grey;
  display: none;
  text-align: center;
  max-width: 374px;
  margin: 0 auto;
  padding: 20px;
}
#printMe  img{
  width: 200px !important;
}

 
 </style>

 
 
 
 