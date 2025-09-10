<template>
  <v-dialog v-model="dialog" fullscreen persistent hide-overlay  no-click-animation transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-toolbar-title>Gerenciar Receita Financiamento</v-toolbar-title> 
        <v-spacer/>

        <v-toolbar-items>
          <v-btn dark text @click="Salvar()">Confirmar</v-btn>
        </v-toolbar-items> 
      </v-toolbar> 
  
      <v-card elevation="1">   
        <v-card-text>   
          <v-card-title> 
            <v-icon large left color="primary">mdi-information</v-icon>
            <span class="title-span">Informação da Receita</span>
          </v-card-title>  
      
          <v-row class="px-3" dense> 
            <v-col cols="12" xs="12" sm="12" md="5" lg="5" xl="5">
              <span class="font-weight-bold">Empresa</span> 
              <v-autocomplete placeholder="Selecione" outlined :items="listaEmpresa" item-value="id" item-text="nomeFantasia" dense  v-model="item.empresaId"/>
            </v-col> 

            <v-col cols="12" xs="12" sm="12" md="2" lg="2" xl="2">
              <span class="font-weight-bold">Valor a ser parcelado</span> 
              <money-input readonly v-model="item.valor" @ValorFormatado="valor => item.valor = valor"/>
            </v-col>

            <v-col class="pt-2" cols="12" md="2" v-if="item.tipoId == 1 && receitaEntrada != null && receitaEntrada.parcelas.length > 0">
              <v-switch hint="As parcelas do financiamento serão geradas após as parcelas de entrada." persistent-hint color="primary" v-model="item.gerarFinanciamentoPosEntrada" label="Pós entrada"/>
            </v-col>

            <v-col cols="12" md="2" v-if="item.tipoId == 1 && receitaIntermediaria != null && receitaIntermediaria.parcelas.length > 0">
              <v-switch hint="As parcelas do financiamento serão geradas sem causar sobreposições com as parcelas da intermediária." persistent-hint color="primary" v-model="item.gerarFinanciamentoComIntermediaria" label="Não Gerar financiamento com intermediaria"/>
            </v-col>
          </v-row>   
        </v-card-text>
      </v-card>
    <br>

      <v-card elevation="1">  
        <v-card-text>  
          <v-card-title>
            <span class="title-span">Valores adicionais</span>
          </v-card-title> 

          <v-row class="px-3" dense>
            <v-col cols="12" xs="12" sm="12" md="2" lg="2" xl="2">
              <span class="font-weight-bold">Gestão</span> 
              <v-text-field outlined type="number" v-model="item.valoresAdicionaisParcela.gestao" dense prefix="R$"/>
            </v-col>
<!-- 
            <v-col cols="12" xs="12" sm="12" md="2" lg="2" xl="2">
              <span class="font-weight-bold">MPI</span> 
              <v-text-field outlined type="number" v-model="item.valoresAdicionaisParcela.percentualMPI" dense suffix="%"/>
            </v-col>

            <v-col cols="12" xs="12" sm="12" md="2" lg="2" xl="2">
              <span class="font-weight-bold">DFI</span> 
              <v-text-field outlined type="number" v-model="item.valoresAdicionaisParcela.percentualDFI" :prefix="item.valoresAdicionaisParcela.isDFIFixo == true ? 'R$' : '' " dense :suffix="item.valoresAdicionaisParcela.isDFIFixo==false ? '%' : '' "/>
            </v-col>

            <v-switch v-model="item.valoresAdicionaisParcela.isDFIFixo" class="pt-4" label="Fixo"/> -->
          </v-row> 
        </v-card-text>
      </v-card>
    <br>

  <v-card elevation="1">  
    <v-card-text>  
      <v-card-title>
        <span class="title-span">Parcela </span>
      </v-card-title> 

      <v-row class="px-3" dense>
        <v-col cols="12" md="2">
          <span class="font-weight-bold">Quantidade de Parcelas</span> 
          <v-text-field outlined type="number" v-model="numeroParcelas" dense/>
        </v-col> 

        <v-col cols="12" md="2">
          <span class="font-weight-bold">1º Vencimento</span> 
          <v-text-field outlined v-model="item.dataInicialParcelas" type="date" dense/>
        </v-col>

        <v-col cols="12" md="2" lg="1">
          <span class="font-weight-bold">Melhor dia</span> 
          <v-text-field outlined type="number" v-model="item.melhorDia" dense append-icon="mdi-calendar"/>
        </v-col> 

        <v-col class="pt-7">
          <v-btn :disabled="isLoading || numeroParcelas <= 0" color="primary" @click="ObterPrice(numeroParcelas, item.dataInicialParcelas)">
            <v-icon left>mdi-plus</v-icon> Gerar
          </v-btn> 
        </v-col> 

        <v-col cols="12" md="12">
          <v-data-table :headers="headerParcelas" :items="item.parcelas" :items-per-page="10" class="elevation-1" :loading="isLoading" item-key="item.id" sort-by="parcela" :footer-props="{showFirstLastPage:true}">
            <template v-slot:[`item.actions`]="{ item }">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark v-bind="attrs" v-on="on" outlined>
                    <v-icon size="25px" left>mdi-menu-down</v-icon>Ações
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="EditarParcela(item)" :disabled="item.situacaoId != 1">
                    <v-list-item-title>
                      <v-icon>mdi-pencil</v-icon> Editar
                    </v-list-item-title>
                  </v-list-item> 
                  <v-divider/> 

                  <v-list-item @click="ExcluirParcela(item)" :disabled="item.situacaoId != 1">
                    <v-list-item-title>
                      <v-icon >mdi-delete</v-icon> Excluir
                    </v-list-item-title>
                  </v-list-item> 

                  <v-list-item :disabled="item.situacaoId != 1" @click="AbrirDialogValorAdicional(item)">
                    <v-list-item-title>
                      <v-icon>mdi-plus-circle-multiple-outline</v-icon> Valores adicionais
                    </v-list-item-title>
                  </v-list-item> 
                </v-list>
              </v-menu>
            </template>

            <template v-slot:[`item.parcela`] = "{item}">
              {{ item.parcela }}
            </template>

            <template v-slot:[`item.valor`] = "{item}"> 
              {{ item.valor  ? Number(item.valor).toMoeda(true) : new Number(0).toMoeda(true) }}
            </template>

            <template v-slot:[`item.dataVencimento`] = "{item}">
              <v-edit-dialog :return-value.sync="item.dataVencimento">
                {{item.dataVencimento.toDateDDMMYYYY()}}
                
                <template v-slot:input>
                  <v-text-field type="date" v-model="item.dataVencimento" @input="item.dataVencimentoOriginal = item.dataVencimento" label="Editar"/>
                </template>
              </v-edit-dialog>
            </template>

            <template v-slot:[`item.situacaoId`] = "{item}">
              <v-chip :color="SituacaoColor(item)">
                {{ situacaoParcelas.find((f) => f.id == item.situacaoId) ? situacaoParcelas.find((f) => f.id == item.situacaoId).nome : ''}}
              </v-chip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      </v-card-text>  
    </v-card>
  </v-card>
             
    <v-dialog v-model="dialogParcela" persistent max-width="700">
      <v-card>
       <v-toolbar flat>
          <v-card-actions>
            <v-btn @click="dialogParcela = false" icon color="primary">
              <v-icon>mdi-close</v-icon>
            </v-btn>

            <v-card-title class="title font-weight-light">Editar Parcela</v-card-title>
          </v-card-actions>
        </v-toolbar>
  
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Parcela</span>
                  <v-text-field outlined type="number" v-model="parcela.parcela" disabled dense/>
                </v-col>

                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Valor</span> 
                  <money-input v-model="parcela.valor" @ValorFormatado="valor => parcela.valor = valor"/>
                </v-col>

                <v-col cols="12" md="6">
                  <span class="font-weight-bold">Situação</span>
                  <v-select outlined v-model="parcela.situacaoId" :items="situacaoParcelas" readonly item-value="id" item-text="nome" dense disabled/>
                </v-col>

                <v-col cols="12" md="6">
                  <span class="font-weight-bold">1º vencimento</span>
                  <v-text-field outlined v-model="parcela.dataVencimento"  @input="parcela.dataVencimentoOriginal = parcela.dataVencimento" type="date" dense/>
                </v-col>
              </v-row>
            </v-container> 
          </v-card-text>
 
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" text @click="Confirmar()">Editar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <valores-adicionais v-model="dialogValoresAdicionais" :valoresParcela="valoresParcela" :item="receita" @fechou="dialogValoresAdicionais = false"/>
  </v-dialog> 
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { EnumSituacaoReceitaParcela, EnumTipoReceita, Receita,ReceitaParcela, ValoresAdicionais,} from "@/core/models/financeiro";
import { SituacaoReceitaParcelaService, ReceitaService } from "@/core/services/financeiro";
import { EmpresaService } from "@/core/services/compras/EmpresaService";
import { CalcularDataParcela, ObterMelhorDia, SituacaoColor, TratarErroApi } from '@/assets/scripts/helper';
 
@Component
export default class GerenciamentoReceita extends Vue {
  @Prop() public item!: Receita;
  @Prop() public receitaEntrada!:Receita;
  @Prop() public receitaIntermediaria!:Receita;
  @Prop() public value!: string;
     
  service = new ReceitaService(); 
  parcela = new ReceitaParcela();
  receita = new Receita();
  valoresParcela = new ReceitaParcela();

  situacaoParcelas = [];
  listaEmpresa = [];
  
  dialogValoresAdicionais:boolean = false; 
  dialogParcela:boolean = false; 
  dialog:boolean = false;
  isLoading: boolean = false;


  numeroParcelas:number = 0;
  parcelaIndex:number = -1;
   
  headerParcelas: any[] = [
    { text: "", value: "actions", sortable: false},
    { text: "Nº Parcela", value: "parcela", sortable: false},
    { text: "Valor", value: "valor", sortable: false},
    { text: "Vencimento", value: "dataVencimento", sortable: false},
    { text: "Situação", value: "situacaoId", sortable: false}
  ];

  @Watch("dialog")
  Dialog() { 
    if (!this.dialog) {
      this.$emit("fechou");  
    }else{
      this.ObterMelhorDia(this.item.dataInicialParcelas);
    }
  }

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false; 
  }

  @Watch("item.gerarFinanciamentoPosEntrada")
  FinanciamentoPosEntrada(){
    if(this.item.gerarFinanciamentoPosEntrada == true){
      const ultimaParcela = this.receitaEntrada.parcelas[this.receitaEntrada.parcelas.length - 1];
      
      if(ultimaParcela){
        const dataVencimentoParcela = new Date(ultimaParcela.dataVencimento);
        dataVencimentoParcela.setMonth(dataVencimentoParcela.getMonth() + 1);
        this.item.dataInicialParcelas = new Date(dataVencimentoParcela).yyyymmdd();
      }else{
        this.item.dataInicialParcelas = new Date().yyyymmdd();
      } 
    }
  }

  @Watch("item.dataInicialParcelas")
  ObterMelhorDia(value){
    const dataVencimentoParcela = new Date(value);
    dataVencimentoParcela.setDate(dataVencimentoParcela.getDate() + 1);
    this.item.melhorDia = dataVencimentoParcela.getDate();
  }
  
  Salvar(){
    if(this.item.empresaId == 0)
      return this.$swal("Aviso","É necessário selecionar a Empresa.", "warning");
    
    if(this.item!.parcelas.length == 0)
      return this.$swal("Aviso","É necessário gerar as parcelas.", "warning");
      
    this.Close();
  }  

  Reset(){
    this.item.parcelas.forEach((x:any) => { x.id = 0; x.receitaId = 0; x.contratoId = 0; x.situacao = null; x.tipoServicoId = null; x.ultimaDataPagamento = null; x.ultimaFormaPagamento = null}) 
    this.numeroParcelas = 0;
    this.item.dataInicialParcelas = new Date().yyyymmdd();
    this.item.valoresAdicionaisParcela = new ValoresAdicionais();
  }
 
  Close() {
    this.Reset();
    this.dialog = false;
  }
 
  ObterPrice(numeroParcelas: number = 0, dataInicialParcelas: string = ""){ 
        this.isLoading = true;

    //if(numeroParcelas == 0){
     // this.isLoading = false
     // return this.$swal("Aviso", "É necessário colocar a quantidade de números de parcelas", "warning" );
   // }
  
      this.item.parcelas!.length = 0;
    
     this.service.ParcelamentoPrice(this.item.valor,this.item.jurosAmortizacao,numeroParcelas, this.item.valoresAdicionaisParcela.isDFIFixo, this.item.valoresAdicionaisParcela.percentualMPI,this.item.valoresAdicionaisParcela.percentualDFI,this.item.valoresAdicionaisParcela.gestao).then(
      (res) => {
        this.GerarParcelas(res.data, dataInicialParcelas);
        
      },
      (err) => { 
        TratarErroApi(err);
       
      }
    ).finally(() => this.isLoading = false)
  }

  GerarParcelas(resultado, dataInicialParcelas){
    for(let i = 0; i < resultado.length; i++){
      let parcela = new ReceitaParcela();

      let dataInicial = new Date(Date.parse(`${dataInicialParcelas} 00:00:00`));      
      const dia = ObterMelhorDia(dataInicial, this.item.melhorDia, i+1);

        parcela.parcela = resultado[i].parcela;
        parcela.dataVencimento = CalcularDataParcela(dataInicial, 0, i+1, dia, 0,).yyyymmdd();;
        parcela.dataVencimentoOriginal =  parcela.dataVencimento;
        parcela.valor = resultado[i].valorParcela.toFixed(2);
        parcela.saldoAmortizacaoPeriodoOriginal = resultado[i].saldoInicialPeriodo;
        parcela.saldoAmortizacaoInicioPeriodoCorrigido = resultado[i].saldoInicialPeriodo;
        parcela.saldoAmortizacaoFimPeriodoCorrigido = resultado[i].saldoFinalPeriodo;
        parcela.situacaoId = EnumSituacaoReceitaParcela.Aberto;
        parcela.juros = resultado[i].juros;
        parcela.amortizacao = resultado[i].amortizacao;
        parcela.valoresAdicionais = resultado[i].valoresAdicionais;
        parcela.valoresAdicionais.taxaBoleto = this.item.valoresAdicionaisParcela.taxaBoleto;

         if (this.item.tipoId == EnumTipoReceita.Titulo) {
            const intermediariaParcelas = this.receitaIntermediaria.parcelas;
            let vencimentoCalculadoAux = new Date(parcela.dataVencimento);

            if (this.item.parcelas.length > 0) {
              vencimentoCalculadoAux = new Date(this.item.parcelas[this.item.parcelas.length - 1].dataVencimento);
              vencimentoCalculadoAux.setMonth(vencimentoCalculadoAux.getMonth() + 1);
            }

            if (intermediariaParcelas && this.item.gerarFinanciamentoComIntermediaria) {
                intermediariaParcelas.forEach(x => {
                  const dataIntermediaria = new Date(x.dataVencimento);
                    if (dataIntermediaria.getMonth() === vencimentoCalculadoAux.getMonth() && dataIntermediaria.getFullYear() === vencimentoCalculadoAux.getFullYear()) {
                      vencimentoCalculadoAux.setMonth(vencimentoCalculadoAux.getMonth() + 1);
                    }
                });
            }

            parcela.dataVencimento = vencimentoCalculadoAux.yyyymmdd();
            parcela.dataVencimentoOriginal = parcela.dataVencimento;
        }

      /* if(this.item.tipoId == EnumTipoReceita.Titulo){
          const intermediariaParcelas = this.receitaIntermediaria.parcelas;
          let vencimentoCalculadoAux;

          if(this.item.parcelas.length > 0){
            vencimentoCalculadoAux = new Date(this.item.parcelas[this.item.parcelas.length -1].dataVencimento);
            vencimentoCalculadoAux = new Date((vencimentoCalculadoAux).setMonth(new Date(vencimentoCalculadoAux).getMonth() + 1));
            vencimentoCalculadoAux = new Date((vencimentoCalculadoAux).setDate(dia -1))
          }
          else
          {
           vencimentoCalculadoAux = new Date(parcela.dataVencimento);
          }

        if(intermediariaParcelas && this.item.gerarFinanciamentoComIntermediaria == true){
          if(intermediariaParcelas.some(x=>new Date(x.dataVencimento).getMonth() == new Date(vencimentoCalculadoAux).getMonth() && new Date(x.dataVencimento).getFullYear() == new Date(vencimentoCalculadoAux).getFullYear()))
            {
                intermediariaParcelas.forEach(x => {
                  if(new Date(vencimentoCalculadoAux).getMonth() ==  new Date(x.dataVencimento).getMonth() && new Date(vencimentoCalculadoAux).getFullYear() ==  new Date(x.dataVencimento).getFullYear()){
                    vencimentoCalculadoAux = new Date((vencimentoCalculadoAux).setMonth(new Date((vencimentoCalculadoAux).getMonth() +1)))
                  }      
                })
            }
        } 

        parcela.dataVencimento = new Date(vencimentoCalculadoAux).yyyymmdd();
        parcela.dataVencimentoOriginal = parcela.dataVencimento;
      };*/

      this.item!.parcelas.push(parcela);
    }

    this.ResetParcela();
  } 

  ExcluirParcela(item) {
    this.$swal({
    title: "Atenção!",
    text: "Tem certeza que deseja excluir o registro atual?",
    icon: "question",
    showCancelButton: true, 
    confirmButtonText: "Sim",
    cancelButtonText: "Não",
    showCloseButton: true,
    showLoaderOnConfirm:true,
      preConfirm:() => {
        const index = this.item.parcelas!.indexOf(item);
        this.item.parcelas!.splice(index, 1);
        return this.$swal("Aviso", "Registro excluído com sucesso!", "success");
      },
      // @ts-ignore: Unreachable code error
      allowOutsideClick: () => !this.$swal.isLoading(),
    }).then((result) => {
      if(result.value){
      }
    })
  } 
 
  EditarParcela(item) {
    this.parcela = item;
    this.parcela.dataVencimento = new Date(item.dataVencimento).yyyymmdd();
    this.dialogParcela = true;
  }

  Confirmar(){
   // Obtenha o índice da parcela editada na lista item.parcelas
    let indiceParcelaEditada = this.item.parcelas.indexOf(this.parcela);
    let valorParcelaEditada = this.parcela.valor;

    // Calcule o valor total das parcelas anteriores à parcela editada
    let valorParcelasAnteriores = 0;
    for (let i = 0; i < indiceParcelaEditada; i++) {
      valorParcelasAnteriores += this.item.parcelas[i].valor;
    }

    // Calcule o saldo restante após a edição da parcela
    let saldoRestante = this.item.valor - valorParcelasAnteriores - valorParcelaEditada;
    
    // Atualize as parcelas posteriores à parcela editada
    for (let i = indiceParcelaEditada + 1; i < this.item.parcelas.length; i++) {
      let parcela = this.item.parcelas[i];
      let saldo =  (saldoRestante > 0 ? saldoRestante : 0) / (this.item.parcelas.length - (indiceParcelaEditada + 1));
      parcela.valor = parseFloat(Number(saldo).toFixed(2)); 
    }

    this.item.valor = Number(this.item.parcelas.reduce((total, parcela) => total + parcela.valor, 0).toFixed(2)); 
    this.parcela = new ReceitaParcela();
    this.dialogParcela = false;
  }
  
  AbrirDialogValorAdicional(item){
    this.valoresParcela = item;
    this.receita = this.item;
    this.dialogValoresAdicionais = true;
  }

  SituacaoColor(item:ReceitaParcela){
    return SituacaoColor(item);
  }

  ResetParcela(){
    this.item.gerarFinanciamentoComIntermediaria = false;
    this.item.gerarFinanciamentoPosEntrada = false;
    this.numeroParcelas  = 0;
    this.item.valoresAdicionaisParcela = new ValoresAdicionais();
  }

  mounted() {
    new SituacaoReceitaParcelaService().ListarTudo().then(
      res => {
        this.situacaoParcelas = res.data.items;
     });

    new EmpresaService().Listar(-1, -1, ['nomeFantasia'],[],'',[], '', '' , 'Id, nomeFantasia', '').then(
      res => {
        this.listaEmpresa = res.data.items;
    });
  } 
}
</script>
 