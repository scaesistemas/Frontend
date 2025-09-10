<template>
  <v-card elevation="1" class="pa-4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6 font-weight-bold">Boletos e Cobranças</span>

        <div class="d-flex align-center">       
            
          <v-btn @click="ExportarExcel('tabela')" color="teal" dark class="elevation-3">
            Exportar   <v-icon right>mdi-file-excel-outline</v-icon>
          </v-btn>           

          <v-bottom-sheet v-model="sheet">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" color="primary" class="ml-2 elevation-3" dark> Filtrar  <v-icon right>mdi-filter-outline</v-icon></v-btn>
            </template>

            <v-sheet class="text-center">
              <v-toolbar dense flat>
                <v-icon>mdi-filter</v-icon>
                <v-toolbar-title class="pl-3">Filtros</v-toolbar-title>
              </v-toolbar>

              <v-card-text>
                <v-row dense> 
                  <v-col cols="12" md="1">
                    <v-text-field v-model="filter.parcelaId" type="number" outlined label="Cód. Parcela" dense></v-text-field>
                  </v-col>

                  <v-col cols="12" md="1">
                    <v-text-field v-model="filter.transacaoId" type="number" outlined label="Cód. Transação" dense></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-select v-model="selectedOptions" :items="filterOptions" item-text="label" item-value="value" label="Selecione opções" clearable outlined dense></v-select>
                  </v-col>

                  <v-col cols="12" md="2">
                    <v-select v-model="filter.erro" clearable outlined :items="statusItens" item-text="nome" item-value="erro" dense></v-select>
                  </v-col>
                  </v-row>

                  <v-row dense> 
                   <v-col cols="12" md="3" lg="3">
                    <v-text-field v-model="filter.dataHoraInicial" type="datetime-local" outlined label="Data Inicial" dense></v-text-field>
                  </v-col> 

                  <v-col cols="12" md="3" lg="3">
                    <v-text-field v-model="filter.dataHoraFinal" type="datetime-local" outlined label="Data Final" dense></v-text-field>
                  </v-col>      

                  <v-spacer></v-spacer>
                
                  <div>
                    <v-btn block color="primary" @click="Consultar()">Consultar  <v-icon right>mdi-magnify</v-icon></v-btn>
                  </div>
                </v-row>
              </v-card-text>
            </v-sheet>
          </v-bottom-sheet>
        </div>
           <!-- Botão Exportar -->
       
      </v-card-title>


    <v-card-text>
      <!-- Totais em Destaque -->
       <v-row dense>
        <v-col cols="12" sm="4">
          <v-card class="py-8 pl-3 d-flex align-center" outlined>
            <v-icon size="35" color="red darken-1" class="mr-3">mdi-alert-circle-outline</v-icon>
            <div>
              <div class="text-h6 font-weight-medium">Boletos com Erro: 0</div>
              
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="4">
          <v-card class="pa-8 pl-3 d-flex align-center" outlined>
            <v-icon size="35" color="orange darken-2" class="mr-3">mdi-cash-remove</v-icon>
            <div>
              <div class="text-h6 font-weight-medium">Baixas com Erro: 0</div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="4">
          <v-card class="pa-8 pl-3 d-flex align-center" outlined>
            <v-icon size="35" color="blue darken-2" class="mr-3">mdi-email-alert-outline</v-icon>
            <div>
              <div class="text-h6 font-weight-medium">Cobranças Pendentes de Envio: 0</div>
            </div>
          </v-card>
        </v-col>
      </v-row>
     
      <!-- Tabela de Boletos -->
      <v-simple-table  id="tabela elevation-1" dense class="mt-3 py-6 text-caption"  style="border: 1px solid #ccc; border-collapse: collapse;">
            <template v-slot:default>
                <thead class="fonte">
                    <tr> 
                        <th class="font-weight-black" >Assinante ID</th>
                        <th class="font-weight-black" >Parcela ID</th>
                        <th class="font-weight-black" >Descrição</th>
                        <th class="font-weight-black" >Data e Hora</th>
                        <th class="font-weight-black" >Transação ID</th>
                        <th class="font-weight-black" >Origem</th>
                        <th class="font-weight-black" >Situação</th>
                    </tr>    
                </thead>   

                <tbody class="fonte" >
                  <tr v-for="item in lista" :key="item.id">
                     <td class="font-weight-regular" >{{ item.assinanteId }}</td>
                        <td class="font-weight-regular" >{{ item.parcelaId }}</td>
                        <td class="font-weight-regular" >{{ item.descricao }}</td>
                        <td class="font-weight-regular" >{{ item.dataHora ? new Date(item.dataHora).toLocaleString("pt-br") : ''}}</td>
                        
                        <td class="font-weight-regular" >{{ item.transacaoId }}</td>
                        <td class="font-weight-regular" ><div class="row">            
                            <p v-if="item.isBaixa == true" class="pt-4">Baixa</p>
                            <p v-if="item.isCobranca  == true" class="pt-4">Cobrança</p>
                            <p v-if="item.isEmissaoBoleto  == true" class="pt-4">Emissão de boleto</p>
                            <p v-if="item.isCancelamento  == true" class="pt-4">Agrupada cancelada</p>
                          </div>
                        </td>

                      <td class="font-weight-regular" > 
                        <v-chip small :color="getStatusColor2(item.erro)" > {{ item.erro == true ? 'Erro' : 'Enviada' }} </v-chip>
                      </td>
                  </tr>
                 </tbody>
                </template>
        </v-simple-table>

       <!-- <v-simple-table  id="tabela elevation-1" dense class="mt-3 py-6 text-caption"  style="border: 1px solid #ccc; border-collapse: collapse;">
            <template v-slot:default>
                <thead class="fonte">
                    <tr> 
                        <th class="font-weight-regular" style="font-size: 10px">Nº Contrato</th>
                        <th class="font-weight-regular" style="font-size: 10px">N° parcela</th>
                        <th class="font-weight-regular" style="font-size: 10px">Vencimento</th>
                        <th class="font-weight-regular" style="font-size: 10px">Valor</th>
                        <th class="font-weight-regular" style="font-size: 10px">Data e hora do Envio</th>
                        <th class="font-weight-regular" style="font-size: 10px">Status</th>
                        <th class="font-weight-regular" style="font-size: 10px">Origem</th>
                        <th class="font-weight-regular" style="font-size: 10px">Detalhar Contrato</th>
                    </tr>    
                </thead>   

                <tbody class="fonte" >
                  <tr v-for="item in lista" :key="item.id">
                      <td class="font-weight-regular" style="font-size: 10px">{{   }}</td>
                      <td class="font-weight-regular" style="font-size: 10px">{{ item.ParcelaId  }}</td>   
                      <td class="font-weight-regular" style="font-size: 10px">{{   }}</td>                     
                      <td class="font-weight-regular" style="font-size: 10px">{{   }}</td>                     
                      <td class="font-weight-regular" style="font-size: 10px">{{  }}</td> 
                      <td class="font-weight-regular" style="font-size: 10px"> 
                        <v-chip small :color="getStatusColor(item.status)" >{{ item.status }}</v-chip>
                      </td>
                      <td class="font-weight-regular" style="font-size: 10px">  
                        {{ item.origem }}
                      </td>

                      <td>  
                        <v-btn @click="GerenciarContrato(0)" outlined small color="primary">  <v-icon left>mdi-clipboard-text-search-outline</v-icon> Detalhar</v-btn>
                      </td>
                  </tr>
                 </tbody>
                </template>
        </v-simple-table>  -->
 
        <gerenciador-contrato v-model="dialogGerenciador" :clienteNome="clienteNome" :item="contrato" @fechou="dialogGerenciador = false"/>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="50"/>
      </v-overlay>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { TableToExcel } from "@/assets/scripts/helper";
import { Contrato, Usuario } from "@/core/models/cadastros";
import { PageBase } from "@/core/models/shared";
import { ContratoService, UsuarioService } from "@/core/services/cadastros";
import { LogService } from "@/core/services/log";
import { Component, Watch } from "vue-property-decorator";

@Component
export default class Historico extends PageBase {
  item = new Usuario();
  service = new LogService();

  statusItens = [
    {erro:true, nome:"Erro"},
    {erro:false, nome:"Enviado"},
  ]

  dialogGerenciador = false;
  clienteNome = '';
  contrato = new Contrato();
  overlay = false;
 

  GerenciarContrato(item) {  
    this.overlay = !this.overlay;
      new ContratoService().ObterPorId(item, "Despesas.Parcelas.Baixas.FormaPagamento, Despesas.Fornecedor, Despesas.Parcelas.Situacao,Receitas.Parcelas.Transacoes.UsuarioBoletoGerado, UnidadesAdicionais.Unidade, ContratosDigitais.Tipo, ContratosDigitais.Situacao, ContratosDigitais.Signatarios.Cliente, ContratosDigitais.Signatarios.Situacao, Receitas.Parcelas.AntecipacaoAmortizacao.Itens,TipoAmortizacao, Receitas.Parcelas.AntecipacaoComprovante, Observacoes, Receitas.Parcelas.Situacao, Receitas.Parcelas.Baixas.FormaPagamento,TipoIndice").then(res => {
        this.contrato = new Contrato(res.data);  
      //  this.clienteNome = item.clienteNome;
        this.dialogGerenciador = true;
      },
    ).finally(() => {
      this.overlay = false 
    }) 
  }  

  ExportarExcel(tabela: any, worksheet?: string) {
    TableToExcel(tabela, worksheet);
  }
  
  filterOptions = [
    { value: 'isCobranca', label: 'Cobrança Enviada' },
    { value: 'isBaixa', label: 'Baixa Automática' },
    { value: 'isEmissaoBoleto', label: 'Boleto Gerado' },
    { value: 'isCancelamento', label: 'Parcela Cancelada' },
  ];

  headers = [
    { text: 'Boleto', value: 'boleto' },
    { text: 'Cliente', value: 'cliente' },
    { text: 'Valor', value: 'valor' },
    { text: 'Status', value: 'status' },
    { text: 'Enviado', value: 'enviado' },
  ]

  boletos:any = [
    { contrato: '10-0', numeroParcela:1, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Erro na Baixa', origem: "Baixa" },
    { contrato: '12-1', numeroParcela:2, vencimento: '31/07/2025', valor: 'R$ 250,00', dataHora: '31/07/2025 - 14:37', status: 'Erro na Cobrança', origem: "Cobrança" },
    { contrato: '16-0', numeroParcela:3, vencimento: '31/07/2025', valor: 'R$ 700,00', dataHora: '31/07/2025 - 14:37', status: 'Erro no Valor', origem: "Boleto" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
    { contrato: '17-0', numeroParcela:4, vencimento: '31/07/2025', valor: 'R$ 500,00', dataHora: '31/07/2025 - 14:37', status: 'Enviado', origem: "Baixa" },
  ] 

  get totalBoletosComProblemas() {
    return this.boletos.length;
  }
  get totalBaixasComProblemas() {
    return this.boletos.filter(b => b.status.includes('Baixa')).length;
  }
  get totalPendentesEnvio() {
    return this.boletos.filter(b => !b.enviado).length;
  }
  
  getStatusColor(status) {
    if (status.includes('Erro')) return 'red lighten-4';
    if (status == 'Enviado') return 'green lighten-4';
    return 'grey lighten-2';
  }
  

   
  getStatusColor2(erro) {
    if (erro == true) return 'red lighten-4';
    else return 'green lighten-4';
  }
 
   
  lista =[];
  sheet:boolean = false;
  loading: boolean = false;
  dialogCadastro: boolean = false;
  dialog = false
  totalLista: number = 0;

  localBuscaRapida: string = "";
  titulo: string = 'Usuarios';
  subTitulo: string = 'Lista dos cadastros de usuários para uso no sistema';
  temBuscaRapida: boolean = true;
  icone: string = 'mdi-cash';  

  options: any = {
    itemsPerPage: 15 
  };

  inicioDoDia = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0);
  finalDoDia = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999);


  formatarData = (data) => {
    const pad = (num) => (num < 10 ? '0' : '') + num;
    return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}T${pad(data.getHours())}:${pad(data.getMinutes())}`;
  };

  filter:any = {
    dataHoraInicial: this.formatarData(this.inicioDoDia),
    dataHoraFinal: this.formatarData(this.finalDoDia),
    assinanteId:null,
    parcelaId:null,
    transacaoId: null, 
    erro:true,
    isCobranca:false,
    isBaixa:false,
    isEmissaoBoleto:false,
    isCancelamento:false
  }

 
  
  selectedOptions:any = [];

  Consultar(){
    let erro = this.filter.erro == null ? '' : this.filter.erro.toString();
    let isCobranca = false, isBaixa = false, isEmissaoBoleto = false, isCancelamento = false;

    if(this.selectedOptions){
      isCobranca = this.selectedOptions.includes('isCobranca');
      isBaixa = this.selectedOptions.includes('isBaixa');
      isEmissaoBoleto = this.selectedOptions.includes('isEmissaoBoleto');
      isCancelamento = this.selectedOptions.includes('isCancelamento');
    }

    let parcelaId = this.filter.parcelaId ? this.filter.parcelaId.toString() :'';
    let transacaoId = this.filter.transacaoId ? this.filter.transacaoId.toString() :'';
 
    this.loading = true;
    this.service.ListarCobranca(this.filter.dataHoraInicial, this.filter.dataHoraFinal, this.app.assinanteId, parcelaId, transacaoId, erro, isCobranca,isBaixa, isEmissaoBoleto, isCancelamento).then(
      res => {
        this.lista = res.data.cobrancas;
        this.totalLista = res.data.count;
      }, 
      err => {
        if (!err.response) {
          this.$swal("Aviso", "Não foi possível acessar a API", "error");
        } 
        else {
          this.$swal("Aviso", err.response.data, "error");
        }
      } 
    ).finally(() => (this.loading = false));
  } 
 
  mounted(){ 
     
  }
}
</script>

 