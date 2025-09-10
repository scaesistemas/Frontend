 <template>
  <v-dialog v-model="dialog" width="430" no-click-animation>
    <v-card>
      <v-toolbar>
        <v-btn icon color="primary" @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
 
      <v-toolbar-title class="title-toolbar">Simular amortização</v-toolbar-title>

      <v-spacer/> 
        <v-btn icon color="primary">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon color="primary" v-on="on">mdi-information-outline</v-icon>
            </template>
            <span>A redução de contratos e parcelas ocorre pela negociação com o credor ou pagamento antecipado. Isso pode resultar em pagamentos menores e dívida menor no final do contrato.</span>
          </v-tooltip>
        </v-btn>
      </v-toolbar>  
  
      <v-card outlined>  
        <v-card-text>  
          <span class="title font-weight-regular">Quanto você gostaria de <b> antecipar </b> no seu Contrato?</span>
            <p class="px-1 caption">saldo devedor na data indicada: <b> {{saldoDevedor ? Number(saldoDevedor).toMoeda(true) : new Number(0).toMoeda(true)}} </b></p> 
              <v-card outlined>
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                      <span class="font-weight-medium">Qual opção deseja selecionar?</span>
                      <v-select dense @change="reduzirParcelas = false" outlined :items="tiposAntecipacao" item-value="id" item-text="nome" placeholder="Selecione" v-model="simularAntecipacao.tipoAntecipacaoId"/>
                    </v-col>

                    <template v-if="simularAntecipacao.tipoAntecipacaoId==2">
                      <v-col cols="12" sm="12" md="12" style="margin-top:-15px" class="d-flex align-center"> 
                        <v-switch v-model="isQtdeParcela" color="primary" @change="GetQuitacao()" label="Por quantidade de parcelas"/>
                        
                        <v-tooltip bottom  >
                          <template v-slot:activator="{ on }">
                            <v-icon class="mt-n3" color="primary" small right v-on="on">mdi-information-outline</v-icon>
                          </template>
                          <span>Ao selecionar a opção "Por quantidade de parcelas", o valor para quitar as parcelas selecionadas será gerado automaticamente.</span>
                        </v-tooltip>
                      </v-col>
 
                      <v-col cols="12" sm="12" md="12" v-if="isQtdeParcela">
                        <span class="font-weight-medium">Quantidade de parcela</span>
                        <v-text-field v-model="qtdeParcela" outlined dense type="number" @input="GetQuitacao()"/>
                      </v-col>
                    </template>

                    <v-col cols="12" sm="12" md="12">
                      <span class="font-weight-medium">Valor para antecipar</span>  
                      <money-input :disabled="isQtdeParcela" v-model="simularAntecipacao.valorAmortizado" @ValorFormatado="valor => simularAntecipacao.valorAmortizado = valor"/>
                      <small>{{`insira um valor até ${saldoDevedor ? Number(saldoDevedor).toMoeda(true) : new Number(0).toMoeda(true)}`}}</small>
                    </v-col>
                    
                    <v-col cols="12" sm="12" md="12">
                      <span class="font-weight-medium">Data para pagamento</span>
                      <v-text-field outlined dense  filled v-model="simularAntecipacao.dataPagamento" @input="ObterSaldoDevedor(), GetQuitacao()" type="date"/>
                    </v-col>  
                  </v-row>
                </v-card-text>
              </v-card>
            <v-btn outlined :disabled="simularAntecipacao.valorAmortizado > saldoDevedor || simularAntecipacao.valorAmortizado == 0" large color="primary" block @click="ObterSimulacao()">Simular</v-btn>
            <br>
 
          <v-card v-if="reduzirParcelas" outlined>
            <v-card-text>
              <v-card-title>
                <v-icon color="primary" size="30" left>{{`${simularAntecipacao.tipoAntecipacaoId == 1 ? 'mdi-cash-multiple' : 'mdi-calendar-clock'}`}}</v-icon>
                <span class="title font-weight-light">{{`${simularAntecipacao.tipoAntecipacaoId == 1 ? 'Reduzir o valor das parcelas' : 'Reduzir prazo do contrato'}`}}</span>
              </v-card-title>
              
                <span class="subtitle font-weight-regular">{{`${simularAntecipacao.tipoAntecipacaoId == 1 ? ' Ideal pra quem precisa diminuir os gastos mensais' : 'Ideal pra quem quer terminar de pagar em menos tempo. Neste caso, a parcela pode ficar um pouco maior.'}`}}</span>
                
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>
                        <div>Saldo devedor</div>
                        <div style="font-size:13px; text-decoration: line-through; color:grey">{{simulacaoAmortizacao.saldoAmortizacaoAtual ? Number(simulacaoAmortizacao.saldoAmortizacaoAtual).toMoeda(true) : new Number(0).toMoeda(true)}}</div>
                        <div>{{simulacaoAmortizacao.saldoAmortizacaoNovo ? Number(simulacaoAmortizacao.saldoAmortizacaoNovo).toMoeda(true) : new Number(0).toMoeda(true) }}</div>
                      </v-list-item-title>

                      <v-list-item-icon>
                        <v-icon>mdi-equal</v-icon>
                      </v-list-item-icon>

                      <v-list-item-subtitle class="text-right" style="color:green">
                        <div>Valor abatido</div>
                        <div>{{simulacaoAmortizacao.valorAmortizado ? Number(simulacaoAmortizacao.valorAmortizado).toMoeda(true) : new Number(0).toMoeda(true) }}</div>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                <v-divider/>

                  <v-list>
                    <v-list-item>
                      <v-list-item-title>
                        <div>Próxima parcela</div>
                        <div style="font-size:13px; text-decoration: line-through; color:grey">{{simulacaoAmortizacao.valorParcelaAtual ? Number(simulacaoAmortizacao.valorParcelaAtual).toMoeda(true) : new Number(0).toMoeda(true)}}</div>
                        <div>{{simulacaoAmortizacao.valorParcelaNovo ? Number(simulacaoAmortizacao.valorParcelaNovo).toMoeda(true) : new Number(0).toMoeda(true)}}</div>
                      </v-list-item-title>

                      <v-list-item-icon>
                        <v-icon>mdi-equal</v-icon>
                      </v-list-item-icon>

                      <v-list-item-subtitle class="text-right" style="color:green">
                        <div>{{`${simulacaoAmortizacao.valorReduzidoParcela >= 0 ? 'Redução' : 'Aumento'}`}}</div>
                        <div>{{`${simulacaoAmortizacao.valorReduzidoParcela >= 0 ?  Number(simulacaoAmortizacao.valorReduzidoParcela).toMoeda(true) : Number(simulacaoAmortizacao.valorReduzidoParcela * -1).toMoeda(true)}`}}</div>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                <v-divider/>
                
                <v-list>
                  <v-list-item>
                    <v-list-item-title>
                      <div>Prazo restante</div>
                      <div style="font-size:13px; text-decoration: line-through; color:grey">{{simulacaoAmortizacao.quantidadeParcelasAtual}}</div>
                      <div>{{simulacaoAmortizacao.quantidadeParcelasNovo}}</div>
                    </v-list-item-title>

                    <v-list-item-icon>
                      <v-icon>mdi-equal</v-icon>
                    </v-list-item-icon>

                    <v-list-item-subtitle class="text-right" style="color:green">
                      <div>{{simulacaoAmortizacao.quantidadeParcelasAmortizadas == 0 ? 'Mesmo prazo' : `${simulacaoAmortizacao.quantidadeParcelasAmortizadas} parcelas`  }}</div>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-btn :disabled="simularAntecipacao.valorAmortizado > item.saldoAmortizacao || simularAntecipacao.valorAmortizado == 0" large color="primary" block @click="GerarParcela()">Gerar Boleto</v-btn>
          </v-card>  
        </v-card-text>
      </v-card>
    </v-card> 
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ReceitaService, TipoAntecipacaoService } from "@/core/services/financeiro";
import { Receita } from "@/core/models/financeiro";
import * as jsonpatch from 'fast-json-patch';

@Component
export default class Simular extends Vue {
  @Prop() public item!: Receita;
  @Prop() public value!: string;

  isQtdeParcela = false;
  qtdeParcela = 0;

  receitaService = new ReceitaService();
  observer! : jsonpatch.Observer<Receita>;

  simularAntecipacao = new SimularAntecipacao();
  simulacaoAmortizacao = new SimulacaoAmortizacao();

  saldoDevedor:number = 0;

  tiposAntecipacao = [];
  reduzirParcelas = false;
  valid = true;
  dialog = false;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];
 
  ObterSimulacao(){
    this.simularAntecipacao.receitaId = this.item.id;
    if(this.reduzirParcelas == false){
      this.reduzirParcelas = !this.reduzirParcelas;
    }

    if(this.reduzirParcelas == true)
      this.receitaService.ObterSimulacaoAmortizacao(this.simularAntecipacao.receitaId, this.simularAntecipacao.valorAmortizado,this.simularAntecipacao.dataPagamento, this.simularAntecipacao.tipoAntecipacaoId).then(res =>{ 
      this.simulacaoAmortizacao = res.data;
    }, 
      (err) => {
      if (!err.response) {
        this.$swal("Aviso", "Não foi possível acessar a API", "error");
      } else if (err.response.status == 403) {
        this.$swal("Aviso", err.response.data.message, "warning" );
      } else {
        this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
      }
    })
  }

  GetQuitacao() {
    if ((this.simularAntecipacao.dataPagamento.length === 10 && parseInt(this.simularAntecipacao.dataPagamento.charAt(0)) > 0) && this.qtdeParcela > 0 && this.isQtdeParcela == true) {
      new ReceitaService().GetTotalSimulacaoQuitacao(this.item.id, this.qtdeParcela, this.simularAntecipacao.dataPagamento, 3).then(
        res => {
          this.simularAntecipacao.valorAmortizado = res.data;
          this.valid = true;
        },
          (err) => {  
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status == 403) {
            this.$swal("Aviso", err.response.data.message, "warning");
          } else {
            this.$swal("Aviso",err.response.data,err.response.status == 400 ? "warning" : "error");
          }
        }
      )
    }else{
      this.simularAntecipacao.valorAmortizado = 0;
    }
  }

  ObterSaldoDevedor(){
    this.receitaService.ObterSaldoDevedor(this.item.id, this.simularAntecipacao.dataPagamento).then(res => {
      this.saldoDevedor = res.data;
    })
  }
  
  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false; 

    if (this.dialog){
      this.observer = jsonpatch.observe(this.item);
    }
    else {
      jsonpatch.unobserve(this.item, this.observer);
    }
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }else{
      this.ObterSaldoDevedor();
    }
  }

  $refs!: { 
    form: HTMLFormElement;
  }; 

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    } 
  }

  Close() { 
    this.dialog = false;
    this.reduzirParcelas = false;
    this.isQtdeParcela = false;
    this.qtdeParcela = 0;
    this.simulacaoAmortizacao = new SimulacaoAmortizacao();
    this.simularAntecipacao = new SimularAntecipacao();
  }
 
  GerarParcela() {
    this.$swal({
    title: "Atenção!",
    text: "Tem certeza que deseja Gerar uma parcela de Amortização?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sim",
    cancelButtonText: "Não",
    showCloseButton: true,
    showLoaderOnConfirm: true,
      preConfirm: () => {
         this.receitaService.CriarParcelaAmortizacao(this.simularAntecipacao.receitaId, this.simularAntecipacao.valorAmortizado,this.simularAntecipacao.dataPagamento, this.simularAntecipacao.tipoAntecipacaoId).then(res =>{ 
          this.$swal("Aviso","Operação realizada com sucesso!", res.status == 201 || res.status == 200 ? "success" : "warning");
          this.$emit("salvou");
          this.Close();
        }, 
          (err) => {
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status == 403) {
            this.$swal("Aviso", err.response.data.message, "warning" );
          } else {
            this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
          }
        })
       return;
      }, 
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }); 
  }
  
  mounted(){
    new TipoAntecipacaoService().ListarTudo().then(
      res => {
        this.tiposAntecipacao = res.data.items;
      }
    )
  }
}

class SimularAntecipacao{
  receitaId:number = 0;
  valorAmortizado:number = 0;
  dataPagamento = new Date().yyyymmdd();
  tipoAntecipacaoId:number = 1;
}

class SimulacaoAmortizacao{
  quantidadeParcelasAmortizadas:number = 0;
  quantidadeParcelasAtual:number = 0;
  quantidadeParcelasNovo:number = 0;
  saldoAmortizacaoAtual:number = 0;
  saldoAmortizacaoNovo:number = 0;
  valorAmortizado:number = 0;
  valorParcelaAtual:number = 0;
  valorParcelaNovo:number = 0;
  valorReduzidoParcela:number = 0;
}
</script>