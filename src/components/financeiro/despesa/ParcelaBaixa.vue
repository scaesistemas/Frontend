<template>
  <v-dialog persistent v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" no-click-animation> 
    <v-card flat>
      <v-toolbar dark color="primary" extended>
        <v-btn icon dark @click="Close()"> 
          <v-icon>mdi-close</v-icon> 
        </v-btn>
        <v-toolbar-title>Baixar Parcela <v-chip outlined label> {{ item.parcela }}</v-chip></v-toolbar-title>
        <v-spacer/> 
 
        <v-toolbar-items>
          <v-btn dark text @click="Salvar(true)" :disabled="!valid || overlay" :loading="overlay">Pagar e fechar</v-btn>
        </v-toolbar-items> 
      </v-toolbar>
   
      <v-card>    
        <v-row dense>
          <v-col cols="12" md="6"> 
            <v-card outlined> 
              <v-card-text>
                <v-card-title>
                  <span class="title-span">Confirmar o Pagamento</span>
                </v-card-title> 
                 
                  <v-form v-model="valid" ref="form" lazy-validation>
                
                    <v-row dense class="pt-3 px-3">
                      <v-col cols="12" sm="12" md="3">
                        <span class="font-weight-bold">Forma de pagamento</span>
                        <v-select outlined v-model="baixa.formaPagamentoId" :items="formaPagamentos"  item-value="id" item-text="nome" :rules="fieldRules" dense :menu-props="{ offsetY: true, offsetOverflow: true }"/>
                      </v-col>

                      <v-col cols="12" sm="12" md="3">
                        <span class="font-weight-bold">Conta Corrente</span>
                        <v-select outlined :rules="fieldRules" v-model="baixa.contaCorrenteId" :items="contaCorrentes" item-value="id" item-text="nome" dense :menu-props="{ offsetY: true, offsetOverflow: true }"/>
                      </v-col>

                       <v-col cols="12" sm="12" md="3" v-if="item.despesa.contratoId">
                          <span class="font-weight-bold">Centro de Custo*</span>
                          <v-autocomplete placeholder="Selecione" outlined v-model="baixa.centroCustoId" :items="centroCustosOrdenada" item-value="key" item-text="value" dense :rules="fieldRules"/> 
                        </v-col>
                      
                        <v-col cols="12" sm="12" md="3" v-if="item.despesa.contratoId">
                          <span class="font-weight-bold">Categoria*</span>
                          <v-autocomplete placeholder="Selecione" outlined v-model="baixa.contaGerencialId" :items="contaGerenciaisOrdenada" item-value="key" item-text="value" dense :rules="fieldRules"/> 
                        </v-col>

                      <v-col cols="12" md="3">
                        <span class="font-weight-bold">Data de Pagamento</span>
                        <v-text-field outlined v-model="baixa.dataPagamento" max="9999-12-31" type="date" dense :rules="fieldRules"/>
                      </v-col>

                      <v-col cols="12" sm="12" md="3">
                        <span class="font-weight-bold">Valor à Pagar</span>
                        <money-input v-model="baixa.valor" @ValorFormatado="valor => baixa.valor = valor"/>
                      </v-col>

                        <v-col cols="12" sm="12" md="3">
                        <v-card disabled flat>
                          <span class="font-weight-bold">Valor Final</span>
                          <money-input v-model="baixa.total" @ValorFormatado="valor => baixa.total = valor"/>
                        </v-card>
                      </v-col>
                     

                    
                      <v-col cols="12" sm="12" md="6">
                        <span class="font-weight-bold">Comprovante</span>
                       
                        <v-file-input outlined dense v-model="arquivo" placeholder="Upload do comprovante" prepend-icon="mdi-paperclip" @change="AdicionarArquivo()">
                          <template v-slot:selection="{ text }">
                            <v-chip small label color="primary">{{ text}}</v-chip>
                          </template>
                        </v-file-input>
                      </v-col>
                        
                     
                      
                      <v-col cols="12" sm="12" md="2" class="pt-7">
                        <v-btn color="primary" outlined @click="Salvar(false)"  :disabled="!valid || overlay" :loading="overlay">Pagar</v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text> 
              </v-card>
           
              <v-data-table 
                :loading="loading"
                :headers="headers" 
                :items="baixas" 
                :items-per-page="5" 
                class="elevation-1">
                  
                <template v-slot:[`item.cancelar`]="{item}">
                  <v-icon :disabled="item.cancelado" @click="CancelarBaixa(item)" color="red">mdi-cancel</v-icon>
                </template>

                <template v-slot:[`item.dataPagamento`]="{item}">
                  {{item.dataPagamento.toDateDDMMYYYY() }}
                </template>

                <template v-slot:[`item.formaPagamento.nome`]="{item}">
                  {{ item.formaPagamento ? item.formaPagamento.nome : '-'}}
                </template>  

                <template v-slot:[`item.contaCorrente.nome`]="{item}">
                  {{ item.contaCorrente ? item.contaCorrente.nome : '-'}}
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
                  {{ item.usuario != undefined ? item.usuario.login : '-' }}
                </template>  
  
                <template v-slot:[`item.cancelado`]="{item}">
                  <v-chip small :color="item.cancelado ? 'red lighten-3' : 'teal lighten-3'" >
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
                    <span class="title-span">Informação da Parcela</span>
                  </v-card-title> 

                  <v-list two-line v-if="item.despesa">
                    <v-list-item>
                      <v-row dense class="pt-2">
                        <v-col cols="12" md="2">
                          <v-list-item-content>
                            <v-list-item-title>Id</v-list-item-title>
                            <v-list-item-subtitle>{{item.despesaId}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-col>

                        <v-col cols="12" md="8" lg="6">
                          <v-list-item-content>
                            <v-list-item-title>Num. Doc</v-list-item-title>
                            <v-list-item-subtitle>{{item.despesa.numeroDocumento}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-col>
                      </v-row>
                    </v-list-item> 
                  </v-list>

                  <div v-if="item.despesa">
                    <span class="font-weight-bold">Observação</span>
                    <p>{{item.despesa.observacao}}</p>
                  </div>
                
                  <v-row dense>
                    <v-col cols="12" md="2">
                      <span class="font-weight-bold">Parcela</span>
                      <v-text-field disabled outlined v-model="item.parcela" dense/>
                    </v-col>
              
                    <v-col cols="12" md="4">
                      <span class="font-weight-bold">Vencimento</span>
                      <v-text-field disabled outlined max="9999-12-31" type="date" v-model="item.dataVencimento" dense/>
                    </v-col>

                    <v-col cols="12" md="3"> 
                      <v-card flat disabled>
                        <span class="font-weight-bold">Valor da Parcela</span>
                        <money-input v-model="item.valor" @ValorFormatado="valor => item.valor = valor"/>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="3"> 
                      <v-card flat disabled>
                        <span class="font-weight-bold">Saldo</span>
                        <money-input v-model="item.saldo" @ValorFormatado="valor => item.saldo = valor"/>
                      </v-card>
                    </v-col>
                  </v-row>
 
                  <v-row dense>
                    <v-col cols="12" md="8">
                      <span class="font-weight-bold">Linha Digitável</span>
                      <v-text-field id="teste" disabled outlined dense v-model="item.linhaDigitavelBoleto" :counter="60" maxlength="60" />
                    </v-col>

                    <v-col cols="12" md="3" class="pt-6">
                      <v-btn icon color="primary" @click="Copiar(item.linhaDigitavelBoleto,'teste')">
                        <v-icon>mdi-content-copy</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                                                 
                  <v-btn tile color="primary" @click="acrescimosDescontos == false ? acrescimosDescontos = true : acrescimosDescontos = false">
                    <v-icon left> mdi-plus</v-icon>Acréscimos e Descontos
                  </v-btn>
                </v-card-text>  
              </v-card>

              <v-card outlined v-if="acrescimosDescontos">
                <v-card-text>
                  <v-row dense>
                    <v-card-text>ACRÉSCIMOS</v-card-text>

                    <v-col cols="12" md="3">
                      <v-text-field outlined  suffix="%" v-model="percentual"  @input="BaixaPercentual('valor', $event)"  dense type="number"/>
                    </v-col>

                    <v-col cols="12" md="3">
                      <money-input v-model="baixa.juros" @ValorFormatado="valor => baixa.juros = valor"/>
                    </v-col>
                  </v-row>

                  <v-row dense>
                    <v-card-text>DESCONTOS </v-card-text>
                    <v-col cols="12" md="3">
                      <v-text-field outlined suffix="%" type="number" @input="DescontoValor()" v-model="percentualDesconto" dense/>
                    </v-col>

                    <v-col cols="12" md="3">
                      <money-input v-model="baixa.desconto" @ValorFormatado="valor => baixa.desconto = valor"/>
                    </v-col>
                  </v-row>
                </v-card-text> 
              </v-card>  
            </v-col>
          </v-row>
          <br>
          <div v-if="item.despesa && item.despesa.dataCriacao && item.despesa.horaCriacao" style="font-size: 10px !important" class="pl-3 overline text--secondary">Data de criação da Despesa: {{ new Date(item.despesa.dataCriacao).ddmmyyyy() }} - {{ item.despesa.horaCriacao.split('.')[0] }}</div>
          <div v-if="item.despesa && item.despesa.usuario" style="font-size: 10px !important" class="pl-3 overline text--secondary">Criada por: {{ item.despesa.usuario.login }}</div>
        <v-overlay :value="overlay"/>
      </v-card>

      <v-snackbar shaped :timeout="3000" v-model="snack" color="primary">
        Linha digitável copiada!
      </v-snackbar>
      
    </v-card> 
  </v-dialog>
</template>  

<script lang="ts">
import {PageBase } from "@/core/models/shared";
import {Component, Prop, Watch } from "vue-property-decorator";
import {DespesaParcela} from "../../../core/models/financeiro";
import {DespesaService,ContaCorrenteService,FormaPagamentoService, CentroCustoService, ContaGerencialService} from "@/core/services/financeiro";
import {DespesaBaixa} from "@/core/models/financeiro";
import { ArquivoService } from "@/core/services/geral/ArquivoService";
 
@Component
export default class ParcelaBaixa extends PageBase {
  @Prop() public item!: DespesaParcela;
  @Prop() public value!: string;

  service = new DespesaService();
  baixa = new DespesaBaixa();

  formaPagamentos = [];
  contaCorrentes = [];
  baixas = [];

  centroCustosOrdenada = [];
  contaGerenciaisOrdenada = [];

  percentualDesconto: number = 0.0;
  percentual: number = 0.0;
  acrescimosDescontos:boolean = false;
  valid:boolean = true;
  dialog:boolean = false;
  urlImgDoc: string = "";
  lerArquivo: any;
  arquivo = null;
  tabActive = null;

  overlay:boolean = false; 
  snack = false;
  loading:boolean = false;

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  $refs!: {
    form: HTMLFormElement;
  };

  @Watch("baixa")
  Baixa() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
  } 

 
  
  MontarHeaders(){
    this.headers = [];

      this.headers.push(
        {text: "Cancelar", value: "cancelar", sortable: false },
        { text: "Data", value: "dataPagamento" },
        { text: "Forma de pgt", value: "formaPagamento.nome" })

        if (this.item.despesa.contratoId) {
          this.headers.push({ text: "Centro de custo", value: "centroCusto.nome" });
          this.headers.push({ text: "Categoria", value: "contaGerencial.nome" });
        }
        this.headers.push(
          { text: "Valor", value: "valor" },
          { text: "Encargos", value: "juros", sortable: false },
          { text: "Multa", value: "multa", sortable: false },
          { text: "Desconto", value: "desconto", sortable: false },
          { text: "Total", value: "total", sortable: false },
          { text: "Usuário", value: "usuario", sortable: false },
          { text: "Status", value: "cancelado", sortable: false }
        );
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    } else {
     
      this.Atualizar();
      this.MontarHeaders();
     }
  }

  headers:any = [
   /*{text: "Cancelar", value: "cancelar", sortable: false },
    { text: "Data", value: "dataPagamento" },
    { text: "Forma de pgt", value: "formaPagamento.nome" },
    { text: "Conta Corrente", value: "contaCorrente.nome"},
    { text: "Centro de custo", value: "centroCusto.nome" }, 
    { text: "Categoria", value: "contaGerencial.nome"},
    { text: "Valor", value: "valor" },
    { text: "Encargos", value: "juros", sortable: false },
    { text: "Multa", value: "multa", sortable: false},
    { text: "Desconto", value: "desconto" , sortable: false},
    { text: "Total", value: "total", sortable: false },
    { text: "Usuário", value: "usuario", sortable: false },
    { text: "Status", value: "cancelado", sortable: false },*/
  ];

  Atualizar(){
    this.loading =  true;
    // adicionar depois que fizer o migration Baixas.ContaGerencial, Baixas.CentroCusto
    this.service.ObterParcelaPorId(this.item.id, "Baixas, Baixas.Usuario, Baixas.FormaPagamento, Baixas.ContaCorrente, Baixas.ContaGerencial, Baixas.CentroCusto").then(   
      res => {
        this.baixas = res.data.baixas;
        this.baixa.valor = res.data.saldo;
        this.baixa.total = res.data.saldo;
        this.loading = false;
      }
    );
  }
 
  DescontoValor(){
    let valor = Number(Number(this.item.saldo) * Number(this.percentualDesconto) / 100).toFixed(2);
    this.baixa.desconto =  Number(valor);
    this.CalculoGeral();
  }

  @Watch("baixa.desconto")
  DescontoPercentual(desconto){
    if(desconto == null)
      return;

    let valor = Number((Number(desconto) * 100) / Number(this.item.saldo)).toFixed(2);
    this.percentualDesconto = Number(valor);
    this.CalculoGeral();
  }

  @Watch("baixa.juros")
  BaixaJuros(juros){
    if(juros == null)
      return;
    
    let percentual = Number(Number(juros * 100) / Number(this.item.saldo)).toFixed(2);
    this.percentual = Number(percentual);
    this.CalculoGeral();
  }

  BaixaPercentual(){
    let juros = Number((Number(this.item.saldo) * Number(this.percentual)) / 100).toFixed(2);
    this.baixa.juros  = Number(juros);
    this.CalculoGeral();
  }

  @Watch("baixa.valor")
  CalculoGeral(){
    if(this.baixa.valor == null)
      return; 
    
    let total = Number(Number(this.baixa.valor) + Number(this.baixa.juros) - Number(this.baixa.desconto)).toFixed(2);
    this.baixa.total =  Number(total);
  }

  Salvar(fechar: boolean = false){
    if (this.$refs.form.validate()) {
      this.overlay = true;
      this.baixa.usuarioId =  this.app.usuarioId;

      let modelo = this.baixa;
      this.service.BaixarParcela(this.item.id, modelo).then(
      (res) => {
        this.$swal("Aviso","Operação realizada com sucesso!", res.status == 201 || res.status == 200 ? "success" : "warning");
          if(fechar){
            this.Close();
          }else{
            this.Atualizar();
          }
          this.baixa = new DespesaBaixa();
          this.percentual = 0;
          this.percentualDesconto = 0;
          this.arquivo = null;
      },
        (err) => {
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status == 403) {
            this.$swal("Aviso", err.response.data.message, "warning" );
          } else {
            this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
          }
        }).finally(() => this.overlay = false); 
    }
  }

  Close() {
    this.dialog = false;
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
          (err) => this.$swal("Aviso", err.response.data, "error")
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

  Copiar(data: string, iD: string): void {
    
    // document.designMode = "on";
    // const element = document.getElementById(iD);
    // element!.contentEditable = "true";
    // const listener = (e: ClipboardEvent) => {
    //   e.clipboardData!.setData('text/plain', data);
    //   e.preventDefault();
    //   document.removeEventListener('copy', listener);
    // };
    this.snack = true;

    //document.addEventListener('copy', listener, { passive: true });
    document.execCommand('copy');
    navigator.clipboard.writeText(data).catch(err => {console.error("Erro ao copiar texto: ", err)});
  }
 
  async AdicionarArquivo() {
    this.lerArquivo = this.arquivo;
    let src: string = <string>await new ArquivoService().Ler(this.lerArquivo);
    this.urlImgDoc = src;

    this.baixa.comprovante.nome = this.baixa.comprovante.nome != "" ? this.baixa.comprovante.nome: this.lerArquivo.name;
    this.baixa.comprovante.dados = this.urlImgDoc.replace(/^[^,]*,/, "");
    this.baixa.comprovante.tamanho = this.lerArquivo.size / 1024;
    this.baixa.comprovante.tipo = this.lerArquivo.type;
  }

  mounted() {
    new ContaCorrenteService().Listar(-1, -1, ['nome'],[],'',[], '', '' , 'Id, nome', '').then(
      res => this.contaCorrentes = res.data.items)

    new FormaPagamentoService().ListarTudo().then(
      res => this.formaPagamentos = res.data.items)


    new CentroCustoService().Listagem().then(
      (res) => {this.centroCustosOrdenada = res.data;},
    );

    new ContaGerencialService().Listagem().then(
      (res) => {this.contaGerenciaisOrdenada = res.data},
    );
  }
}


</script>

<style scoped>
.overflow-wrap {
   overflow-wrap: break-word;
}
</style>

