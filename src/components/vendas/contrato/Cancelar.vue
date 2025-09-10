 <template>
    <v-dialog persistent v-model="dialog" width="1000" no-click-animation>
       <v-toolbar dark color="primary">
                <v-btn icon dark @click="Close()"> 
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Resumo do Distrato</v-toolbar-title> 
            </v-toolbar>
        <v-card flat class="pa-8">
                <v-card flat class="pa-0 ma-0">
                    <v-card-text>
                        <v-row>
                            <v-col><v-card-title>Número do contrato: {{ item.numero }}</v-card-title></v-col>
                            <v-col><v-card-title>Unidade: {{ item.unidadePrincipal?.nome }}</v-card-title></v-col>
                            <v-col><v-card-title>Cliente: {{ clienteNome }}</v-card-title></v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            
               <v-divider></v-divider>
              <div class="pl-8 pr-8">
                <ul class="list">
                  <li class="list-item"><span style="font-weight: 600; font-size: medium;">Descrição</span><span style="font-weight: 600; font-size: medium;">Valor</span></li>
                </ul>
                <ul class="list">
                    <li class="list-item">
                      <span>Parcelas liquidadas</span>
                      <div>
                         <v-text-field
                        v-model.number="valores.parcelasLiquidadas"
                        type="number"
                        hide-details
                        dense
                        underlined
                        class="amount-input"
                        prefix="R$"
                        @input="atualizarPenaContratual"
                      ></v-text-field>
                      </div>
                    </li>

                    <li class="list-item expandable" @click="toggle">
                      <span>
                        Retenções contratuais (<v-icon small>{{ expanded ? 'mdi-minus' : 'mdi-plus' }}</v-icon>)                   
                      </span>
                      <span style="color: green;">R$ {{ Number(retencoesTotal).toMoeda(false) }}</span>
                    </li>
                    <li v-show="expanded" class="list-item child">
                      <span>
                        Encargos moratórios                   
                      </span>
                      <div>
                        <v-text-field
                        v-model.number="valores.retencoesContratuais.encargosAtrasados"
                        type="number"
                        hide-details
                        dense
                        underlined
                        prefix="R$"
                        class="amount-input"
                      ></v-text-field>
                      </div>                  
                    </li>
                    <li v-show="expanded" class="list-item child">
                      <span>
                        Débitos de impostos               
                      </span>
                      <div>
                        <v-text-field
                          v-model.number="valores.retencoesContratuais.debitosImpostos"
                          type="number"
                          hide-details
                          dense
                          underlined
                          class="amount-input"
                          prefix="R$"
                        ></v-text-field>
                      </div>
                     
                    </li>
                    <li v-show="expanded" class="list-item child">
                      <span>
                        Comissão de corretagem              
                      </span>
                      <div>
                         <v-text-field
                          v-model.number="valores.retencoesContratuais.comissaoCorretagem"
                          type="number"
                          hide-details
                          dense
                          underlined
                          class="amount-input"
                          prefix="R$"
                        ></v-text-field>
                      </div>                     
                    </li>
                    <li v-show="expanded" class="list-item child">
                      
                      <span>
                        Pena contratual 
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              small
                              color="primary"
                              v-bind="attrs"
                              v-on="on"
                              class="ml-1"
                            >
                              mdi-information
                            </v-icon>
                          </template>
                          <span>Se for alienação fiduciária pode descontar até 50%</span>
                        </v-tooltip>            
                      </span>
                      <div style="display: flex; align-items: center; gap: 8px;">
                      <span>R$ {{ Number(valores.retencoesContratuais.penaContratual).toMoeda(false) }}</span>  / <v-text-field
                        v-model.number="porcentagemPena"
                        type="number"
                        dense
                        underlined
                        class="amount-input"
                        suffix="%"
                        hide-details
                        style="width: 60px;"
                        @input="atualizarPenaContratual"
                      ></v-text-field>
                      </div>
                    </li>

                    <li class="list-item">
                      <span>
                        Valor a ser devolvido
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              small
                              color="primary"
                              v-bind="attrs"
                              v-on="on"
                              class="ml-1"
                            >
                              mdi-information
                            </v-icon>
                          </template>
                          <span>Este valor NÃO está atualizado por indice inflacionário</span>
                        </v-tooltip> 
                      </span>
                      <span style="color: red;">R$ {{ Number(valorDevolvido).toMoeda(false) }}</span>
                    </li>
                  </ul>
               </div> 
               <div class="d-flex justify-end mt-5">
                  <v-btn @click="Distratar" color="primary">Distratar</v-btn>
               </div>
        </v-card>
        <cadastro-despesa v-model="dialogCadastroDespesa" :pedidos="[]" :item="despesa" @fechou="(dialogCadastroDespesa = false, dialog = false)"/>
    </v-dialog>   
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ContratoService, EmpreendimentoService } from '@/core/services/cadastros';
import { Contrato } from '@/core/models/cadastros';
import { TratarErroApi } from "@/assets/scripts/helper";
import { Despesa } from "@/core/models/financeiro";

@Component
export default class CancelarContrato extends Vue {
  @Prop() public value!: string;
  @Prop() public item!: Contrato;
  @Prop() public clienteNome!: string;

  service =  new ContratoService();
  serviceEmpreendimento = new EmpreendimentoService();
  contratoService = new ContratoService();
  despesa = new Despesa();
  dialogCadastroDespesa = false;
  unidade: any = {}
   expanded = false;

  valid = true;
  dialog = false;

  porcentagemPena = 25;


  loading: boolean = false;

  options: any = {
    itemsPerPage: 15
  }; 

  headers = [
    { text: "", value: "actions", sortable: false },
    { text: "Descrição", value: "nome" },
    { text: "Valor", value: "valor" },
  ]

   valores: any = {
      parcelasLiquidadas: 0,
      retencoesContratuais: {
        encargosAtrasados: 0,
        debitosImpostos: 0,
        comissaoCorretagem: 0,
        penaContratual: 0
      }
    };

  get retencoesTotal(): number {
    const r = this.valores.retencoesContratuais;
    return (
      (r.encargosAtrasados || 0) +
      (r.debitosImpostos || 0) +
      (r.comissaoCorretagem || 0) +
      (r.penaContratual || 0)
    );
  }

  get valorDevolvido(): number {
    return (this.valores.parcelasLiquidadas || 0) - this.retencoesTotal;
  }
  gerarDespesa(){
    this.despesa.contratoId = this.item.id;
    this.despesa.valor = this.valorDevolvido;
    this.despesa.empreendimentoId = this.item.empreendimentoId;
    this.despesa.origemId = 1;
    this.despesa.fornecedorId = this.item.clientes[0].clienteId;
    this.despesa.empresaId = this.item.empresaId;
    this.despesa.numeroDocumento = this.item.numero + " Distrato"
    this.dialogCadastroDespesa = true;
  }

  Distratar(){
      this.$swal({
      title: "Deseja cancelar o contrato?",
      text: "Você quer apenas cancelar o contrato ou também gerar uma despesa?",
      icon: "question",
      confirmButtonText: "Cancelar e gerar despesa",
      denyButtonText: "Somente cancelar",
      showDenyButton: true,
      showCloseButton: true,
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        // Confirm: Cancelar e gerar despesa
        return this.contratoService.Cancelar(this.item.id)
          .then(res => {
            if (res.status === 200) {
              return { gerarDespesa: true, response: res };
            } else {
              throw new Error("Falha ao cancelar contrato");
            }
          })
          .catch(err => {
            TratarErroApi(err);
            throw err;
          });
      },
      preDeny: () => {
        // Deny: Somente cancelar
        return this.contratoService.Cancelar(this.item.id)
          .then(res => {
            if (res.status === 200) {
              return { gerarDespesa: false, response: res };
            } else {
              throw new Error("Falha ao cancelar contrato");
            }
          })
          .catch(err => {
            TratarErroApi(err);
            throw err;
          });
      },
      allowOutsideClick: () => !this.$swal.isLoading()
    }).then((result: any) => {
      if (result.value) {
        this.$swal("Aviso", result.value.response.data, "success");
        this.dialog = false;

        // Só gera despesa se for o caso
        if (result.value.gerarDespesa) {
          this.gerarDespesa();
          this.resetarValores()
        }
      }
    });
  }

  atualizarPenaContratual() {
  this.valores.retencoesContratuais.penaContratual =
    (this.valores.parcelasLiquidadas || 0) * (this.porcentagemPena || 0) / 100;
  }
    toggle() {
      this.expanded = !this.expanded;
    }
   
  calcularDistrato(){
    this.service.CalcularDistrato(this.item.id).then(res => {
        this.valores = res.data;
        this.atualizarPenaContratual();
      },
       (err) => {
        if (!err.response) {
          this.$swal("Aviso", "Não foi possível acessar a API", "error");
        } else if (err.response.status == 403) {
          this.$swal("Aviso", err.response.data.message, "warning" );
        } else {
          this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
        }
      } 
    )
  }

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false;
    if(this.value){
      this.calcularDistrato()
    } 
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }
  }
  resetarValores(){
    this.valores = {
      parcelasLiquidadas: 0,
      retencoesContratuais: {
        encargosAtrasados: 0,
        debitosImpostos: 0,
        comissaoCorretagem: 0,
        penaContratual: 0
      }
    };
    this.porcentagemPena = 25;
  }

  Close() {
    this.resetarValores()
    this.dialog = false;
  } 
   
}

</script>

<style scoped>
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}
.amount-input ::v-deep input {
  max-width: 100px;
  margin-left: auto;
  text-align: right;
}
.expandable {
  cursor: pointer;
}
.child {
  padding-left: 32px;
  background-color: #f9f9f9;
}
.child span {
  color: #7a7676;
}
</style>