<template>
  <v-dialog persistent v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition" no-click-animation>
    <v-card>
      <v-toolbar dark color="primary" extended>
        <v-btn icon dark @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Aditar Contrato</v-toolbar-title>
        <v-chip outlined label style="margin-left:5px">{{item.numero}} - {{item.sequencia}}</v-chip> 
        <v-spacer/> 
           
        <v-toolbar-items>
          <v-btn dark text @click="Confirmar()">Aditar</v-btn>
        </v-toolbar-items>
      </v-toolbar>   
        
        <template>  
          <v-form v-model="valid" lazy-validation ref="form">
            <v-stepper v-model="e13" vertical class="fundo">

              <v-stepper-step :complete="e13 > 1" step="1" editable edit-icon="mdi-check">Informações do contrato atual</v-stepper-step>
                <v-stepper-content step="1">
                    <v-card class="mb-6" outlined shaped>
                      <v-card-text>  
                        <v-list two-line> 
                          <v-list-item>
                            <v-row dense>
                              <v-col cols="12" md="4">
                                <v-list-item-content>
                                  <v-list-item-title> Número do contrato </v-list-item-title>
                                  <v-list-item-subtitle>{{`${item.numero} - ${item.sequencia}` }}</v-list-item-subtitle>
                                </v-list-item-content>
                              </v-col>

                              <v-col cols="12" md="4">
                                <v-list-item-content>
                                  <v-list-item-title>Data do contrato</v-list-item-title>
                                  <v-list-item-subtitle>{{ new Date(item.data).ddmmyyyy() }}</v-list-item-subtitle>
                                </v-list-item-content>
                              </v-col>

                                <v-col cols="12" md="4">
                                  <v-list-item-content>
                                    <v-list-item-title> Tipo do contrato </v-list-item-title>
                                    <v-list-item-subtitle>{{item.tipo ? item.tipo.nome : '' }}</v-list-item-subtitle>  
                                  </v-list-item-content>
                                </v-col> 
                                </v-row> 
                          </v-list-item>
                          <v-divider/>  

                          <v-list-item>
                            <v-row dense> 
                              <v-col cols="12" md="4">
                                <v-list-item-content>
                                  <v-list-item-title> Empreendimento </v-list-item-title>
                                  <v-list-item-subtitle>{{ item.empreendimento ? item.empreendimento.nome : '' }}</v-list-item-subtitle>  
                                </v-list-item-content>
                              </v-col>

                              <v-col cols="12" md="4">
                                <v-list-item-content>
                                  <v-list-item-title> Grupo </v-list-item-title>
                                  <v-list-item-subtitle>{{ item.unidadePrincipal != null ?  item.unidadePrincipal.grupo.nome : ''}}</v-list-item-subtitle> 
                                </v-list-item-content>
                              </v-col>

                              <v-col cols="12" md="4">
                                <v-list-item-content>
                                  <v-list-item-title> Unidade </v-list-item-title>
                                  <v-list-item-subtitle>{{ item.unidadePrincipal  ? item.unidadePrincipal.nome : ''}}</v-list-item-subtitle>  
                                </v-list-item-content>
                              </v-col>
                            </v-row>  
                          </v-list-item> 
                          <v-divider/>

                          <v-list-item>   
                            <v-row dense>
                               <v-col cols="12" md="4">
                                  <v-list-item-content>
                                    <v-list-item-title>Empresa</v-list-item-title> 
                                    <v-list-item-subtitle>{{item.empresa ? item.empresa.nome : 'Não cadastrado'}} </v-list-item-subtitle>  
                                  </v-list-item-content>
                                </v-col>

                                <v-col cols="12" md="4">
                                  <v-list-item-content>
                                    <v-list-item-title>Qtde de parcelas pagas</v-list-item-title> 
                                    <v-list-item-subtitle>{{item.quantidadeParcelasPagasGeral}} </v-list-item-subtitle>  
                                  </v-list-item-content>
                                </v-col>

                                <v-col cols="12" md="4">
                                  <v-list-item-content>
                                    <v-list-item-title>Total pago</v-list-item-title>
                                    <v-list-item-subtitle>{{item.totalPagoGeral  ? Number(item.totalPagoGeral).toMoeda(true) : new Number(0).toMoeda(true) }}</v-list-item-subtitle>  
                                  </v-list-item-content>
                                </v-col> 
                            </v-row> 
                          </v-list-item>
                        <v-divider/>

                          <v-list-item> 
                              <v-row dense>
                                <v-col cols="12" md="4">
                                  <v-list-item-content>
                                    <v-list-item-title>Qtde de parcelas à pagar</v-list-item-title>
                                    <v-list-item-subtitle>{{item.quantidadeParcelasAPagar}}</v-list-item-subtitle>   
                                  </v-list-item-content> 
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-list-item-content>
                                    <v-list-item-title>Débito do Contrato</v-list-item-title>
                                    <v-list-item-subtitle> {{item.saldoGeral ? Number(item.saldoGeral).toMoeda(true) : new Number(0).toMoeda(true) }} </v-list-item-subtitle> 
                                    </v-list-item-content>
                                </v-col> 

                                <v-col cols="12" md="4">
                                  <v-list-item-content>
                                  <v-list-item-title>Encargos</v-list-item-title>
                                  <v-list-item-subtitle> {{totalEncargos ? Number(totalEncargos).toMoeda(true) : new Number(0).toMoeda(true)}} </v-list-item-subtitle> 
                                  </v-list-item-content>
                                </v-col>
                              </v-row> 
                          </v-list-item>
                          
                          <v-divider/>
                            <v-list-item>  
                            <v-row dense>
                                <v-col cols="12" md="4">
                                <v-list-item-content>
                                    <v-list-item-title>Total à pagar</v-list-item-title>
                                    <v-list-item-subtitle>{{ Number(item.saldoGeral + totalEncargos).toMoeda(true) }}</v-list-item-subtitle>   
                                </v-list-item-content> 
                                </v-col>
                            </v-row> 
                            </v-list-item>  
                          </v-list> 
                        </v-card-text>
                      </v-card>

                <v-card outlined shaped>
                  <v-tabs v-model="tab">
                    <v-tab v-if="item.receitas.some(x=> x.tipoId == 1)">Financiamento</v-tab>
                    <v-tab v-if="item.receitas.some(x=> x.tipoId == 3)">Entrada</v-tab>
                    <v-tab v-if="item.receitas.some(x=> x.tipoId == 5)">Intermediária</v-tab>
                    <v-tab v-if="item.receitas.some(x=> x.tipoId == 4)">Aditamento</v-tab>
                    <v-tab v-if="item.receitas.some(x=> x.tipoId == 9)">Serviços</v-tab>
                  </v-tabs>

                    <v-tabs-items v-model="tab">
                      <v-tab-item v-for="item in item.receitas" item-key="item.key" :key="item.id">
                        <v-card flat v-if="item"> 
                          <v-card-text>
                            <v-list two-line> 
                              <v-list-item>
                                <v-row dense>
                                  <v-col cols="12" md="4">
                                    <v-list-item-content>
                                      <v-list-item-title>Qtde de parcelas</v-list-item-title>
                                      <v-list-item-subtitle>{{item.quantidadeParcela}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                  </v-col>

                                  <v-col cols="12" md="4">
                                    <v-list-item-content>
                                      <v-list-item-title>Qtde de parcelas pagas</v-list-item-title>
                                      <v-list-item-subtitle>{{item.quantidadeParcelasPagas}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                  </v-col>

                                  <v-col cols="12" md="4">
                                    <v-list-item-content>
                                      <v-list-item-title>Qtde de parcelas á pagar</v-list-item-title>
                                      <v-list-item-subtitle>{{item.quantidadeParcela - item.quantidadeParcelasPagas}}</v-list-item-subtitle>
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
                                        <v-list-item-subtitle>{{item.saldo.toMoeda(true)}}</v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                      <v-list-item-content>
                                        <v-list-item-title>Total Pago</v-list-item-title>
                                        <v-list-item-subtitle>{{item.totalPagoParcelas.toMoeda(true)}}</v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                      <v-list-item-content>
                                        <v-list-item-title>Total Cancelado</v-list-item-title>
                                        <v-list-item-subtitle>{{item.totalCanceladoParcelas.toMoeda(true)}}</v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>
                                  </v-row>
                                </v-list-item> 
                              <v-divider/>

                              <v-list-item>
                                <v-row dense> 
                                  <v-col cols="12" md="4">
                                    <v-list-item-content>
                                      <v-list-item-title>Primeiro vencimento</v-list-item-title>
                                      <v-list-item-subtitle>{{item.primeiroVencimento ? new Date(item.primeiroVencimento).ddmmyyyy() : '-' }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                  </v-col>  
                                </v-row>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs-items> 
                  </v-card>
                     
                  <v-btn class="mt-4" color="primary" @click="e13 = 2">Avançar</v-btn>
                </v-stepper-content>

              <v-stepper-step :complete="e13 > 2" step="2" editable edit-icon="mdi-check">Informações do Produto</v-stepper-step>
 
                <v-stepper-content step="2">
                  <v-card class="mb-6" shaped outlined>
                    <v-card-text>  
                     <v-row dense class="pt-3">
                       <v-col cols="12" md="4">
                        <div class="font-weight-bold">Empreendimento</div>
                        <v-autocomplete placeholder="Selecione" outlined v-model="item.empreendimentoId" @change="ObterGrupos()" dense  :items="listaEmpreendimentos" :rules="fieldRules" item-value="id" item-text="nome" :disabled="item.tipoId==0"/>
                      </v-col>

                      <v-col cols="12" md="2" v-if="item.unidadePrincipal">
                        <div class="font-weight-bold">Grupo</div>
                        <v-autocomplete placeholder="Selecione" outlined v-model="item.unidadePrincipal.grupoId" @change="ObterUnidades()" dense  :items="listaGrupos" :rules="fieldRules" item-value="id" item-text="nome" :disabled="item.empreendimentoId ==0"/>
                      </v-col>

                      <v-col cols="12" md="2" v-if="item.unidadePrincipal">
                        <div class="font-weight-bold">Unidade</div>
                        <v-autocomplete placeholder="Selecione" outlined dense v-model="item.unidadePrincipalId" :items="listaUnidades" :rules="fieldRules" item-value="id" item-text="nome" :disabled="item.unidadePrincipal.grupoId==0"/>
                      </v-col> 

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn large icon color="primary" class="mt-7" dark v-on="on" @click="dialogMultiLotes = true">
                            <v-icon large>mdi-plus</v-icon>
                          </v-btn>
                        </template>
                        <span>Adicionar lotes </span>
                      </v-tooltip> 
                    </v-row> 
                  </v-card-text> 
                </v-card>

                  <v-btn text  @click="e13 = 1">Voltar</v-btn>
                  <v-btn color="primary" @click="e13 = 3">Avançar</v-btn>
                </v-stepper-content>

              <v-stepper-step :complete="e13 > 3" step="3" editable edit-icon="mdi-check">Informações do novo contrato</v-stepper-step>
                <v-stepper-content step="3">

                  <v-card class="mb-6" outlined shaped>
                    <v-card-text>
                      <v-col cols="12" md="12">
                        <v-row dense>  
                          <v-col cols="12" md="2">
                            <div class="font-weight-bold">Tipo de aditamento</div>
                            <v-select placeholder="Selecione" outlined :rules="fieldRules" :items="tiposAditamentos" v-model="item.tipoAditamentoId" item-value="id" item-text="nome" dense/>
                          </v-col>

                          <v-col cols="12" md="2">
                            <div class="font-weight-bold">Situação</div>
                            <v-select placeholder="Selecione" outlined :rules="fieldRules"  :items="listasSituacoes" v-model="item.situacaoId" item-value="id" item-text="nome" dense/>
                          </v-col>

                          <v-col cols="12" md="2">
                            <div class="font-weight-bold">Data do aditamento</div>
                            <v-text-field placeholder="Selecione" outlined v-model="item.data" type="date" dense :rules="fieldRules"/>
                          </v-col>
                        </v-row>
                      <v-divider/> 

                      <v-row dense class="pt-6">  
                        <v-col cols="12" md="2">
                          <div class="font-weight-bold">Índice de reajuste</div>
                          <v-autocomplete placeholder="Selecione" outlined :rules="fieldRules" :items="listarTipoIndice" v-model="item.tipoIndiceId" item-value="id" item-text="nome" dense/>
                        </v-col>
 
                        <v-col cols="12" md="2">
                          <div class="font-weight-bold">Intervalo do reajuste</div>
                          <v-select placeholder="Selecione" outlined :items="tiposIntervalos" v-model="item.intervaloReajusteId" item-value="id" item-text="nome" dense :rules="fieldRules"/>
                        </v-col> 

                        <v-col cols="12" md="2" v-if="item.intervaloReajusteId ==1">  
                          <div class="font-weight-bold">Mês do índice de reajuste</div>
                          <v-autocomplete placeholder="Selecione" outlined :rules="fieldRules" v-model="item.mesReajuste" dense :items="meses" item-text="nome" item-value="id"/>
                        </v-col>

                        <v-col cols="12" md="2"> 
                          <div class="font-weight-bold">Ano do 1º reajuste</div>
                          <v-autocomplete placeholder="Selecione" outlined v-model="item.anoPrimeiroReajuste" dense :items="anos" :rules="fieldRules"/>
                        </v-col>
                                                        
                        <v-col cols="12" md="2">
                          <div class="font-weight-bold">Tipo de tabela</div>
                          <v-select placeholder="Selecione" outlined :items="tiposAmortizacao" v-model="item.tipoAmortizacaoId" item-value="id" item-text="nome" dense :rules="fieldRules"/>
                        </v-col>    

                        <v-col cols="12" lg="2" md="2" xl="1" v-if="item.tipoAmortizacaoId != 1">
                          <div class="font-weight-bold">Juros</div>
                          <v-text-field type="number" suffix="%" outlined v-model="item.jurosAmortizacao" dense :rules="fieldRules"/>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-row dense class="pt-6">
                      <v-col sm="12" md="6" lg="6" xl="6">
                        <v-card>
                          <v-card-title>
                            <v-icon color="primary" large left>mdi-account-multiple-outline</v-icon>
                            <span class="title font-weight-light">Clientes</span>
                        
                            <v-tooltip right>
                              <template v-slot:activator="{ on }">
                                <v-icon right color="primary" @click="dialogPessoa = true" v-on="on">mdi-plus</v-icon>
                              </template>
                              <span>Adicionar cliente</span>
                            </v-tooltip>
                          </v-card-title>

                          <v-card-text>
                            <v-row dense>
                              <v-col sm="12" md="12" lg="12" xl="12">
                                <v-data-table :headers="headerClientes" :items="item.clientes" item-key="item.key" class="elevation-0">
                                  <template v-slot:[`item.actions`]= "{item}">
                                    <v-tooltip left>
                                      <template v-slot:activator="{ on }">
                                        <v-icon small @click="EditarCliente(item)" v-on="on">mdi-pencil</v-icon>
                                      </template>
                                      <span>Editar</span>
                                    </v-tooltip> 

                                    <v-tooltip right>
                                      <template v-slot:activator="{ on }">
                                        <v-icon small @click="ExcluirCliente(item)" v-on="on">mdi-delete</v-icon>
                                      </template>
                                      <span>Excluir</span>
                                    </v-tooltip> 
                                  </template> 

                                    <template v-slot:[`item.clienteId`] = "{item}">
                                      {{ pessoas.find(x=>x.id == item.clienteId )  ? pessoas.find(x=>x.id == item.clienteId).nome : ''}}  
                                    </template> 
                                </v-data-table>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card> 
                      </v-col>

                      <v-col sm="12" md="6" lg="6" xl="6">
                        <v-card>
                          <v-card-title>
                            <v-icon color="primary" large left>mdi-account-multiple-outline</v-icon>
                            <span class="title font-weight-light">Responsável pelo Aditamento</span>

                            <v-tooltip right>
                              <template v-slot:activator="{ on }">
                                <v-icon color="primary" right @click="dialogCorretor = true" v-on="on">mdi-plus</v-icon>
                              </template>
                              <span>Adicionar responsável pelo aditamento</span>
                            </v-tooltip>
                          </v-card-title>
                      
                          <v-card-text> 
                          <v-row dense> 
                            <v-col cols="12" md="12">
                              <v-data-table :headers="headerCorretores" :items="item.corretores" item-key="item.key" class="elevation-0">
                                  <template v-slot:[`item.actions`]= "{item}">
                                    <v-tooltip left>
                                      <template v-slot:activator="{ on }">
                                        <v-icon small @click="EditarCorretor(item)" v-on="on">mdi-pencil</v-icon>
                                      </template>
                                      <span>Editar</span>
                                    </v-tooltip>

                                    <v-tooltip right>
                                      <template v-slot:activator="{ on }">
                                          <v-icon small @click="ExcluirCorretor(item)" v-on="on">mdi-delete</v-icon>
                                      </template>
                                    <span>Excluir</span>
                                    </v-tooltip> 
                                  </template> 

                                  <template v-slot:[`item.corretorId`] = "{item}">
                                    {{ pessoas.find(x=>x.id == item.corretorId) ?  pessoas.find(x=>x.id == item.corretorId).nome : ''}}  
                                  </template>  
                                </v-data-table>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

              <v-btn text  @click="e13 = 2">Voltar</v-btn>
              <v-btn color="primary" @click="e13 = 4">Avançar</v-btn>
                </v-stepper-content>                   

              <v-stepper-step :complete="e13 > 4" step="4" editable edit-icon="mdi-check">Receitas</v-stepper-step>
                <v-stepper-content step="4">
                  <v-card class="mb-6" shaped outlined>
                    <v-card-text>   
                      <v-row>
                        <v-col cols="12" md="4"> 
                          <v-card-title class="title-span">Gerencie suas Receitas</v-card-title>
                          
                          <v-card-text> 
                           <v-row dense>
                              <v-col cols="12" md="6">
                                <span class="font-weight-bold">Entrada</span>
                                <money-input v-model="receitaEntrada.valor" @ValorFormatado="valor => receitaEntrada.valor = valor" dense  @input="ValorTotalContrato('valor', $event)"/>
                              </v-col>

                              <v-col cols="12" md="6" class="pt-7">
                                <v-btn :disabled="receitaEntrada.valor < 1" color="primary" @click="ObterReceita(receitaEntrada)">Gerenciar</v-btn>
                              </v-col>
                            </v-row>

                            <v-row dense> 
                              <v-col cols="12" md="6">
                                <span class="font-weight-bold">Intermediária</span>
                                <money-input v-model="receitaIntermediaria.valor" @ValorFormatado="valor => receitaIntermediaria.valor = valor" dense  @input="ValorTotalContrato('valor', $event)"/>
                              </v-col> 

                              <v-col cols="12" md="6" class="pt-7">
                                <v-btn :disabled="receitaIntermediaria.valor < 1" color="primary" @click="ObterReceita(receitaIntermediaria)">Gerenciar</v-btn>
                              </v-col>
                            </v-row>

                             <v-row dense>
                              <v-col cols="12" md="6">
                                <span class="font-weight-bold">Honorários do Aditivo</span>
                                <money-input v-model="receitaAditamento.valor" @ValorFormatado="valor => receitaAditamento.valor = valor" dense  @input="ValorTotalContrato('valor', $event)"/>
                              </v-col> 

                              <v-col cols="12" md="6" class="pt-7">
                                <v-btn :disabled="receitaAditamento.valor < 1" color="primary" @click="ObterReceita(receitaAditamento)">Gerenciar</v-btn>
                              </v-col>
                            </v-row>

                            <v-row dense>
                              <v-col cols="12" md="6">
                                <span class="font-weight-bold">Financiamento</span>
                                <money-input v-model="receitaSaldoDevedor.valor" @ValorFormatado="valor => receitaSaldoDevedor.valor = valor" dense  @input="ValorTotalContrato('valor', $event)"/>
                              </v-col>
 
                              <v-col cols="12" md="6" class="pt-7">
                                <v-btn :disabled="receitaSaldoDevedor.valor < 1" color="primary" @click="ObterReceita(receitaSaldoDevedor)">Gerenciar</v-btn>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-col>

                    <v-divider vertical/> 
                      <v-col cols="12" md="8"> 

                        <span class="font-weight-bold">
                          <v-subheader> 
                            <v-icon small color="primary" class="mr-2">mdi-credit-card</v-icon> Encargos Financeiros
                          </v-subheader>
                        </span>
  
                        <v-divider class="mb-4"></v-divider>
                        <br>
 
                        <v-row dense class="px-3 pt-3">
                          <v-col cols="12" md="6">
                            <v-select label="Instituição Financeira*" :rules="fieldRules" outlined v-model="item.tipoOperacaoId" :items="tiposOperacaoContrato" item-text="nome" item-value="id" dense :menu-props="{ offsetY: true, offsetOverflow: true }"></v-select>
                          </v-col> 

                          <v-col cols="12" md="6" v-if="item.tipoOperacaoId == 1">
                            <v-select label="Fintech" outlined clearable v-model="item.tipoGatewayId" @change="e => {ObterParametroGatway(item.tipoGatewayId)}" return-object :items="gatways" item-text="tipo.nome" item-value="tipo.id" dense :menu-props="{ offsetY: true, offsetOverflow: true }"></v-select>
                          </v-col> 
                        
                          <v-col cols="12" md="6" v-if="item.tipoOperacaoId == 2 || item.tipoOperacaoId == 3">
                            <v-select label="Conta Corrente" @change="ObterEncargosContaCorrente()" outlined v-model="item.contaCorrenteId" :items="listaContaCorrentes" item-text="nome" item-value="id" dense :menu-props="{ offsetY: true, offsetOverflow: true }"></v-select>
                          </v-col> 
                        </v-row>
                                                                          
                        <v-row dense class="px-3">
                          <v-col cols="12" md="3">
                            <v-text-field label="Juros ao dia" outlined v-model="item.encargoFinanceiro.jurosDia" dense type="number" suffix="%"></v-text-field>
                          </v-col>

                          <v-col cols="12" md="3">
                            <v-text-field label="Multa" outlined v-model="item.encargoFinanceiro.multa" dense type="number" suffix="%"></v-text-field>
                          </v-col>

                          <v-col cols="12" md="3" v-if="item.tipoAmortizacaoId ==1">
                            <v-text-field :suffix="item.encargoFinanceiro.isDescontoVencimentoPercentual == true ? '%' : ''" label="Desconto" outlined v-model="item.encargoFinanceiro.descontoVencimento" dense type="number"></v-text-field>
                          </v-col>

                          <v-switch  style="margin-top:-5px" label="Percentual?" v-if="item.tipoAmortizacaoId ==1" v-model="item.encargoFinanceiro.isDescontoVencimentoPercentual" class="py-3 pt-3"></v-switch>
                        </v-row> 
  
                        <!-- <v-divider></v-divider>
                        <v-row dense class="px-3 pt-2">
                          <v-col cols="12" md="3">
                            <v-switch v-model="AplicarDiasProtesto" label="Aplicar dias de protesto?"/>
                          </v-col>                         
                        </v-row> -->

                        <v-row dense class="px-3">
                          <v-col cols="12" md="3">
                            <v-text-field label="Dias" outlined v-model="item.encargoFinanceiro.diasProtesto" dense type="number" hint="Nº de dias necessário para protestar após o vencimento." persistent-hint></v-text-field>
                          </v-col> 

                          <v-col cols="12" md="3" v-if="item.tipoAmortizacaoId ==1">
                            <v-text-field label="Dias para desconto" outlined v-model="item.encargoFinanceiro.diasDescontoVencimento" dense type="number" hint="Nº de dias necessário antes do vencimento para ter o desconto." persistent-hint></v-text-field>
                          </v-col>

                          <v-col cols="12" md="3" v-if="item.tipoAmortizacaoId ==1">
                            <v-text-field label="Desconto" outlined v-model="item.encargoFinanceiro.descontoAntecipacao" suffix="%" dense type="number" hint="Antecipação/Quitação" persistent-hint></v-text-field>
                          </v-col>

                          <v-col cols="12" md="3">
                            <v-text-field label="Dias para não receber" outlined v-model="item.encargoFinanceiro.diasAposVencimentoNaoReceber" dense type="number" hint="Nº de dias para não receber após o vencimento." persistent-hint></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col> 
                    </v-row>
                  </v-card-text>
                </v-card>

                  <v-btn text @click="e13 = 3">Voltar</v-btn>
                  <v-btn color="primary" @click="e13 = 5">Avançar</v-btn>
                </v-stepper-content>

              <v-stepper-step :complete="e13 > 5" step="5" editable edit-icon="mdi-check">Dados adicionais</v-stepper-step>
                <v-stepper-content step="5">
                  <vcard-observacao :lista.sync="item.observacoes" />
                  
                  <v-btn text @click="e13 = 4"> Voltar</v-btn>
                  <v-btn @click="Confirmar()" color="primary" :loading="overlay">Finalizar</v-btn>
                </v-stepper-content>
              </v-stepper>
            </v-form>
          </template>

        <v-overlay :value="overlay"/>
      </v-card> 
    
    <v-dialog v-model="dialogPessoa" width="600" persistent>
      <v-card height="250" outlined>
          <v-toolbar flat>
            <v-btn @click="FecharDialogCliente()" icon color="primary">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          <v-toolbar-title class="title font-weight-regular"> {{ `${itemIndex === -1 ? 'Adicionar' : 'Editar'} Cliente` }} </v-toolbar-title>
        </v-toolbar> 

        <v-container> 
          <v-card-text class="pl-6">
            <v-row dense>   
              <v-col cols="12" md="10"> 
                <span class="font-weight-bold">Cliente</span>
                <v-autocomplete outlined placeholder="Digite" dense v-model="itemPessoa.clienteId" :items="pessoas.filter(x=>x.isCliente==true)" item-value="id" item-text="nomeCnpjCpf"/>
              </v-col> 

              <v-col cols="12" md="2" class="mt-5"> 
                <v-btn icon large color="primary" @click="AdicionarCliente()">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row> 
          </v-card-text>
        </v-container> 
      </v-card> 
    </v-dialog>  

    <v-dialog v-model="dialogCorretor" width="600" persistent>
      <v-card height="250" outlined>
        <v-toolbar flat>
          <v-btn @click="CloseCorretor()" icon color="primary">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        <v-toolbar-title class="title font-weight-regular"> Responsável pelo Aditamento</v-toolbar-title>
      </v-toolbar> 

        <v-container> 
          <v-card-text>
            <v-row dense>   
              <v-col cols="12" md="10"> 
                <span class="font-weight-bold">Responsável</span>
                <v-autocomplete outlined placeholder="Selecione" v-model="itemPessoa.corretorId" :items="pessoas" item-value="id" item-text="nomeCnpjCpf"  dense/>
              </v-col> 
              
                <v-col cols="12" md="2" class="mt-5"> 
                  <v-btn color="primary" icon large  @click="AdicionarCorretor()">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row> 
            </v-card-text>
        </v-container> 
      </v-card> 
    </v-dialog>     

    <gerenciador-receitaprice v-model="dialogGerencialPrice"  :receitaIntermediaria="receitaIntermediaria" :receitaEntrada="receitaEntrada" :item="receitaGerenciada" @fechou="dialogGerencialPrice = false"/>   
    <gerenciador-receita v-model="dialogGerencial" :receitaIntermediaria="receitaIntermediaria" :receitaEntrada="receitaEntrada"  :item="receitaGerenciada" @fechou="dialogGerencial = false"/>  
    <multi-lotes v-model="dialogMultiLotes" :tipoId="item.tipoId" :unidadeId="item.unidadePrincipalId" :lista.sync="item.unidadesAdicionais" @salvou="dialogMultiLotes = false" @fechou="dialogMultiLotes = false"/> 
  </v-dialog>
</template>
    
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Contrato } from '@/core/models/cadastros';
import { Receita,EnumTipoReceita, Encargo, ValoresAdicionais, TipoAmortizacao } from '@/core/models/financeiro';
import { ContaCorrenteService, IntervaloReajusteService, ParametroFinanceiroService, ReceitaService, TipoAmortizacaoService, TipoDocumentoService} from '@/core/services/financeiro';
import { ContratoService } from '@/core/services/cadastros/ContratoService';
import { EmpreendimentoService, PessoaService, SituacaoContratoService, TipoAditamentoContrato, TipoIndiceService } from '@/core/services/cadastros';
import Pessoa from '@/core/models/cadastros/Pessoa';
import { EnumSitucaoContrato } from '@/core/models/cadastros/contrato/SituacaoContrato';
import { TratarErroApi } from '@/assets/scripts/helper';
import { TipoOperacaoFinanceiraService } from '@/core/services/contratos';
  
@Component 
export default class AditarContrato extends Vue {
  @Prop() public item!: Contrato;
  @Prop() public value!: string;

  service = new ContratoService();
  itemPessoa:any = new Pessoa();
  valoresAdicionaisParcela = new ValoresAdicionais();

  receitaGerenciada = new Receita();
  receitaIntermediaria = new Receita(5); 
  receitaSaldoDevedor = new Receita(1);
  receitaAditamento = new Receita(4);
  receitaEntrada = new Receita(3);

  pessoa = new Pessoa(); 

  dialogMultiLotes:boolean = false;
  dialogGerencialPrice:boolean = false;
  dialogCorretor:boolean = false;
  dialogGerencial:boolean = false;
  dialogPessoa:boolean = false;
  dialog:boolean = false;
  overlay:boolean = false;
  valid:boolean = true;

  totalEncargos:number = 0;
  itemIndex: number = -1;
  e13: number = 1;
  tab =  0;
         
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  $refs!: {
    form: HTMLFormElement;
  };

  tiposAditamentos = [];
  listarTipoIndice = [];
  gatways:any = [];
  pessoas = [];
  listasSituacoes = [];
  tiposAmortizacao = [];
  tiposIntervalos = [];
  listaTiposDocumentos:any = [];
  listaEmpreendimentos = [];
  listaGrupos = [];
  listaUnidades = []; 
 
  headerClientes: any[] = [ 
    { text: "", value: "actions" },
    { text: "Nome", value: "clienteId" }, 
  ]; 

  headerCorretores: any[] = [
    { text: "", value: "actions" },
    { text: "Nome", value: "corretorId" },
  ];
   
  ObterMesAno(){
    let dataReajuste = new Date(this.item.data).yyyymmdd();    

    const partes =  new Date(this.item.data).ddmmyyyy().split('/');
    const data = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
    const mes = data.getMonth() + 1;

    let ano = new Date(dataReajuste).getFullYear();
    this.item.anoPrimeiroReajuste = ano;
    this.item.mesReajuste = mes;
  } 
 
  @Watch("item")
  Item() {
  if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  } 
  
  @Watch("value")
  Value() { 
    this.dialog = this.value ? true : false; 
  } 
  
  @Watch('dialog')
  Dialog() {
    if (!this.dialog) {
      this.$emit('fechou');
    }else{
      this.GetEncargosContrato();
      this.ObterMesAno();
      this.ObterParametroPorId(this.item.empresaId), this.ObterGrupos(), this.ObterUnidades();
    }  
  } 

  ObterParametroPorId(id){
    new ParametroFinanceiroService().ObterParametroEmpresaPorId(id, 'Gatways.Tipo').then(
      (res) => { 
        this.gatways = res.data.gatways;
        this.valoresAdicionaisParcela = res.data.valoresAdicionaisParcela;
      }, 
      (err) => {
        this.item.encargoFinanceiro = new Encargo();
        this.valoresAdicionaisParcela = new ValoresAdicionais();
      }
    )
  }

  GetEncargosContrato(){
    new ReceitaService().EncargosContrato(this.item.id).then(
      (res) => {
        this.totalEncargos = res.data;

        if(this.item.tipoAmortizacaoId == TipoAmortizacao.Price)
          {
            let saldoAmortizacao = this.item.receitas.find(x => x.tipoId == EnumTipoReceita.Titulo).saldoAmortizacao;
            this.receitaSaldoDevedor.valor = saldoAmortizacao;
            this.item.valor = saldoAmortizacao;
          }
          else
          {
            let total = Number((this.item.saldoGeral + this.totalEncargos).toFixed(2));
            this.receitaSaldoDevedor.valor = total;
            this.item.valor = total;
          }
        }
      )
  }
 
  Confirmar() {
    this.$refs.form.validate();

    if (!this.Validacoes()) { 
       this.$swal({
        title: "Atenção!",
        text: "Tem certeza que deseja Aditar esse contrato?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        showCloseButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.Salvar();
        },
        // @ts-ignore: Unreachable code error
        allowOutsideClick: () => !this.$swal.isLoading(),
      }) 
    }
  }

  Validacoes(){
    if(!this.item.tipoAditamentoId  || !this.item.situacaoId || !this.item.data || !this.item.mesReajuste || !this.item.tipoIndiceId){
      this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
      this.e13 = 3;
      return true;
    }

    if(this.item.tipoAmortizacaoId != 1 && this.item.jurosAmortizacao <= 0){
      this.$swal("Aviso", "O Juros da tabela precisa ser maior que 0", "warning");
      this.e13 = 3;
      return true;
    }
  }
 
  Salvar(){
    this.overlay = !this.overlay;
    this.item.receitas = [];  

    let ReceitasAdicionais = [this.receitaSaldoDevedor, this.receitaAditamento, this.receitaIntermediaria, this.receitaEntrada];
    let modelo = this.item.PrepararContrato(this.item, ReceitasAdicionais);

    this.service.AditarContrato(this.item.id, modelo).then(
      (res) => {
        this.$swal("Aviso","Operação realizada com sucesso!", res.status == 201 || res.status == 200 ? "success" : "warning");
        this.$emit("salvou");
        this.Close();
      },
      (err) => {
        TratarErroApi(err);
        this.overlay = false;
      }
    );  
  } 
 
  Close() {
    this.Reset();
    this.overlay = false;
    this.dialog = false;
  }

  ObterReceita(receita){
    this.CarregarTipoReceita(receita.tipoId);
    this.receitaGerenciada = receita; 

    if(this.item.tipoAmortizacaoId == TipoAmortizacao.Price && receita.tipoId == EnumTipoReceita.Titulo){
      this.dialogGerencialPrice = true;
    } else {
      this.dialogGerencial = true;
    }
  }

  CarregarTipoReceita(tipoId){
    switch (tipoId) {
      case EnumTipoReceita.Titulo:
          this.ConfigurarReceita(this.receitaSaldoDevedor, "Financiamento");
        break;

      case EnumTipoReceita.TituloEntrada:
          this.ConfigurarReceita(this.receitaEntrada, "Entrada");
        break;

      case EnumTipoReceita.TituloAditamento:
          this.ConfigurarReceita(this.receitaAditamento, "Honorários do Aditivo");
        break;

        case EnumTipoReceita.TituloIntermediaria:
          this.ConfigurarReceita(this.receitaIntermediaria, "Intermediária");
        break;
      }  
      
  } 

  ConfigurarReceita(receita, titulo) {
    receita.melhorDia = this.item.melhorDia;
    receita.dataInicialParcelas = new Date().yyyymmdd();
    //receita.empresaId = this.item.empresaId;
    receita.tipoAmortizacaoId = this.item.tipoAmortizacaoId;
    receita.jurosAmortizacao = this.item.jurosAmortizacao;
    receita.valoresAdicionaisParcela = this.valoresAdicionaisParcela;
    receita.tipoDocumentoId = this.listaTiposDocumentos[0].id;
    receita.titulo = titulo;
  };

  /* CLIENTE */
  AdicionarCliente(){
    const clienteId = this.itemPessoa.clienteId;
    const clienteExistente = this.item.clientes.find((x, index) => x.clienteId === clienteId && index !== this.itemIndex);
    
    if (clienteExistente){
      return this.$swal("Aviso", "Este cliente já foi adicionada na lista.", "warning");
    }
    
    if (this.itemIndex > -1) {
      Object.assign(this.item.clientes[this.itemIndex], this.itemPessoa);
    }else{
      this.item.clientes.push(this.itemPessoa);
    }
    this.FecharDialogCliente();
  }
 
  ExcluirCliente(item){ 
    this.$swal({ 
      title: "Atenção!", 
      text: "Tem certeza que deseja excluir o registro atual?", 
      icon: "question", 
      showCancelButton: true, 
      confirmButtonText: "Sim", 
      cancelButtonText: "Não", 
      showCloseButton: true, 
    }).then((result) => { 
      if (result.value) { 
        const index = this.item.clientes.indexOf(item); 
        this.item.clientes.splice(index, 1); 
        this.$swal("Aviso", "Registro excluído com sucesso!", "success"); 
      } 
    }); 
  } 

  FecharDialogCliente(){
    this.dialogPessoa = false;
    this.itemPessoa = new Pessoa();
    this.itemIndex = -1;
  }

  EditarCliente(item){
    this.itemPessoa = Object.assign({}, item);
    this.itemIndex = this.item.clientes.indexOf(item);
    this.dialogPessoa = true; 
  }

  /* CORRETOR */
  AdicionarCorretor(){
    const corretorId = this.itemPessoa.corretorId;
    const corretorExistente = this.item.corretores.find((x, index) => x.corretorId === corretorId && index !== this.itemIndex);
    
    if (corretorExistente) 
      return this.$swal("Aviso", "Este corretor já foi adicionada na lista.", "warning");
      
    if (this.itemIndex > -1) {
      Object.assign(this.item.corretores[this.itemIndex], this.itemPessoa);
    } else {
      this.item.corretores.push(this.itemPessoa);
    }
    this.CloseCorretor();
  }

  EditarCorretor(item){
    this.itemPessoa = Object.assign({}, item);
    this.itemIndex = this.item.corretores.indexOf(item);
    this.dialogCorretor = true;
  }
 
  ExcluirCorretor(item){
    this.$swal({ 
      title: "Atenção!", 
      text: "Tem certeza que deseja excluir o registro atual?", 
      icon: "question", 
      showCancelButton: true, 
      confirmButtonText: "Sim", 
      cancelButtonText: "Não", 
      showCloseButton: true, 
    }).then((result) => { 
      if (result.value) { 
        const index = this.item.corretores.indexOf(item); 
        this.item.corretores.splice(index, 1); 
        this.$swal("Aviso", "Registro excluído com sucesso!", "success"); 
      } 
    }); 
  }

  CloseCorretor(){ 
    this.dialogCorretor = false;
    this.itemPessoa = new Pessoa();
    this.itemIndex = -1;
  }
  
  @Watch('receitaEntrada.valor')
  @Watch('receitaIntermediaria.valor')
  @Watch('receitaAditamento.valor')
  @Watch('receitaSaldoDevedor.valor')
  ValorTotalContrato(){
    this.item.valor =+ Number(this.receitaSaldoDevedor.valor) + Number(this.receitaAditamento.valor) + Number(this.receitaIntermediaria.valor)  + Number(this.receitaEntrada.valor) 
  } 

  Reset(){
    this.receitaSaldoDevedor = new Receita(1);
    this.receitaEntrada = new Receita(3);
    this.receitaAditamento = new Receita(4);
    this.receitaIntermediaria = new Receita(5);
    this.e13 = 1;
    this.tab = 0;
  }

  ObterGrupos(){
    new EmpreendimentoService().ListarGrupo(this.item.empreendimentoId).then(
      res => {
        this.listaGrupos = res.data
      },
      (err) => {
        TratarErroApi(err);
      }
    );
  } 

  ObterUnidades(){
    new EmpreendimentoService().ListarUnidade(this.item.unidadePrincipal!.grupoId).then(
      (res) => {
        this.listaUnidades = res.data.filter(x => x.situacaoId ==  1 || x.id == this.item.unidadePrincipalId)
      },
      (err) => {
        TratarErroApi(err);
      }
    );
  }

  get anos() {
    var currentYear = new Date().getFullYear();
    var min = currentYear - 10;
    var max = currentYear + 5;

    const anos:any = []; 

    for (let i = min; i <= max; i++) {
      anos.push(i);
    }

    return anos; 
  }

  ObterParametroGatway(item){
    if(item){
      this.item.encargoFinanceiro = item.encargoFinanceiro;
      this.item.tipoGatewayId = item.tipoId;
    }else{
      this.item.encargoFinanceiro = new Encargo();
      this.item.tipoGatewayId = 0;
    }
  }

  meses = [
    { id: 1, nome: "Janeiro" },
    { id: 2, nome: "Fevereiro" },
    { id: 3, nome: "Março" },
    { id: 4, nome: "Abril" },
    { id: 5, nome: "Maio" },
    { id: 6, nome: "Junho" },
    { id: 7, nome: "Julho" },
    { id: 8, nome: "Agosto" },
    { id: 9, nome: "Setembro" },
    { id: 10, nome: "Outubro" },
    { id: 11, nome: "Novembro" },
    { id: 12, nome: "Dezembro" },
  ]; 

  ObterEncargosContaCorrente(){
    new ContaCorrenteService().ObterPorId(this.item.contaCorrenteId).then(
      res => {
       this.item.encargoFinanceiro = res.data.encargoFinanceiro;
      }
    )
  }

  tiposOperacaoContrato = [];
  listaContaCorrentes = [];
 // AplicarDiasProtesto:boolean = false;

  mounted() {
    new ContaCorrenteService().ListarTudo().then(
      (res) => {
        this.listaContaCorrentes = res.data.items;
      }
    )

    new TipoOperacaoFinanceiraService().ListarTudo().then( 
      (res) => {
        this.tiposOperacaoContrato = res.data.items;
      }
    )

    new EmpreendimentoService().Listar(-1, -1, ['nome'], [], undefined, [], '', '', "Id,Nome", "").then(
      res => {
        this.listaEmpreendimentos = res.data.items
      });

    new TipoDocumentoService().ListarTudo().then(
      res => {
        this.listaTiposDocumentos = res.data.items
      });

    new  IntervaloReajusteService().ListarTudo().then(
      res => {
        this.tiposIntervalos = res.data.items
      });

    new TipoAmortizacaoService().ListarTudo().then(
      res => {
        this.tiposAmortizacao = res.data.items.filter(x=>x.id != 3)
      });

    new SituacaoContratoService().ListarTudo().then(
      res => {
        this.listasSituacoes = res.data.items.filter(x => x.id != EnumSitucaoContrato.Aditado && x.id != EnumSitucaoContrato.Cancelado)
      });

    new TipoAditamentoContrato().ListarTudo().then(
      res => {
        this.tiposAditamentos = res.data.items
      });
  
    new PessoaService().Listar(-1, -1, ['nome'],[],'',[], '', '' , 'Id,nome, cnpjCpf, nomeCnpjCpf, isCliente, isCorretor', '').then(
      res =>  {
        this.pessoas = res.data.items
      });
 
    new TipoIndiceService().ListarTudo().then(
      res => {
        this.listarTipoIndice = res.data.items
      });
   }
 } 
</script>
  