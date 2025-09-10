<template>
  <v-dialog persistent width="900" v-model="dialog" no-click-animation>
    <v-card v-if="item.unidade != undefined">
      <v-toolbar>
        <v-btn color="primary" icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="title font-weight-regular">Detalhar</v-toolbar-title>
         
        <v-spacer></v-spacer> 
        <v-toolbar-items>  
          <v-btn color="primary" text @click="Salvar()">Salvar</v-btn>
        </v-toolbar-items>  
  
        <template v-slot:extension> 
          <v-tabs v-model="tabAtiva" >
            <v-tab> Informações Gerais</v-tab>
            <v-tab v-if="item.unidade.tipoId != 3">Infraestrutura</v-tab>
            <v-tab>Legalização</v-tab>
            <v-tab v-if="item.unidade.tipoId == 2">Taxas</v-tab>
            <v-tab v-if="item.unidade.tipoId == 2">Vistoria / Reparos</v-tab>
          </v-tabs>
        </template>
      </v-toolbar> 
 
        <v-tabs-items v-model="tabAtiva">
          <v-tab-item> 
            <v-card>

          <v-card-title>
              <v-row v-if="item.unidade.disponibilidadeOperaca != undefined">
                <v-spacer></v-spacer>
                <v-col sm="12" md="2">
                  <v-checkbox v-model="item.unidade.disponibilidadeOperacao.venda" label="Venda" class="form-control" dense></v-checkbox>
                </v-col>

                <v-col sm="12" md="2">
                  <v-checkbox v-model="item.unidade.disponibilidadeOperacao.locacao" label="Locação" class="form-control" dense></v-checkbox>
                </v-col>                 
              </v-row>   
            </v-card-title>
              

          <v-card-text>
            <v-list two-line>

              <v-list-item>
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-list-item-content>
                      <v-list-item-title> Empreendimento </v-list-item-title>
                      <v-list-item-subtitle>{{item.unidade.grupo.empreendimento.nome}}     </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>     

                  <v-col cols="12" md="4">
                    <v-list-item-content>
                      <v-list-item-title> Grupo </v-list-item-title>
                      <v-list-item-subtitle>{{item.unidade.grupo.nome}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>  
                  
                  <v-col cols="12" md="4">
                    <v-list-item-content>
                      <v-list-item-title> Unidade </v-list-item-title>
                      <v-list-item-subtitle>{{item.unidade.nome}}  </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>       
                </v-row>
              </v-list-item>  
            <v-divider></v-divider>
 
             <v-list-item>
               <v-row dense>
                  <v-col cols="12" md="4">
                    <v-list-item-content>
                      <v-list-item-title> Situação </v-list-item-title>
                      <v-list-item-subtitle>{{ item.unidade.situacao.nome }}    </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>     

                <v-col cols="12" md="4">
                  <v-list-item-content>
                    <v-list-item-title> Valor de Venda </v-list-item-title>
                    <v-list-item-subtitle>{{item.unidade.valorVenda}} </v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>

                <v-col cols="12" md="4">
                  <v-list-item-content>
                      <v-list-item-title> Taxa Adm Mensal </v-list-item-title>
                      <v-list-item-subtitle>{{item.unidade.taxaAdmMensal}} </v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-list-item> 
            <v-divider></v-divider>

              <v-list-item>
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-list-item-content>
                      <v-list-item-title> Valor de Indicação </v-list-item-title>
                      <v-list-item-subtitle>{{item.unidade.valorIndicacao}} </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-list-item-content>
                      <v-list-item-title> Percentual Indicação </v-list-item-title>
                      <v-list-item-subtitle>{{item.unidade.percentualIndicacao}} </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-col>
                </v-row>
               </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-tab-item>  
          
          <!-- Infraestrutura Imovel -->
            <v-tab-item v-if="item.unidade.tipoId != 3">
              <v-card >
                <v-toolbar dense flat height="2px" tile>
                  <template v-slot:extension>
                    <v-tabs v-model="tabInfraestruturaImovel" background-color>
                      <v-tab>Dimensões</v-tab>
                      <v-tab v-if="item.unidade.tipoId == 2">Interna</v-tab>
                      <v-tab v-if="item.unidade.tipoId == 2">Externa</v-tab>  
                    </v-tabs>
                  </template>
                </v-toolbar>

              <v-tabs-items v-model="tabInfraestruturaImovel">
                <!-- Dimensões -->
                  <v-tab-item>
                    <v-card class="mx-auto"  flat>
                        <v-list two-line>
                          <template v-if="item.unidade.tipoId == 2">
                            <v-list-item>
                              <v-row dense>

                                <v-col cols="12" md="4">
                                  <v-list-item-content>
                                    <v-list-item-title> Tipo do Imovel </v-list-item-title>
                                      <v-list-item-subtitle>{{item.unidade.imovel.tipoImovel.nome}}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-col>

                                <v-col cols="12" md="4">
                                  <v-list-item-content>
                                    <v-list-item-title> Área do Imóvel </v-list-item-title>
                                    <v-list-item-subtitle>{{ item.unidade.imovel.infraestrutura.dimensao.areaImovel  }}</v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-col>

                                <v-col cols="12" md="4">
                                  <v-list-item-content>
                                    <v-list-item-title> Área do Terreno </v-list-item-title>
                                      <v-list-item-subtitle>{{ item.unidade.imovel.infraestrutura.dimensao.areaTerreno  }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                  </v-col>
                                </v-row>
                              </v-list-item>
                        
                               <v-list-item>
                                  <v-row dense>
                                    <v-col cols="12" md="4">
                                      <v-list-item-content>
                                          <v-list-item-title> Zona de uso </v-list-item-title>
                                          <v-list-item-subtitle>{{item.unidade.imovel.infraestrutura.dimensao.zonaUso}}</v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-list-item-content>
                                        <v-list-item-title> Coef. de Aproveitamento </v-list-item-title>
                                        <v-list-item-subtitle>{{ item.unidade.imovel.infraestrutura.dimensao.coeficienteAproveitamento  }}</v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                      <v-list-item-content>
                                        <v-list-item-title> Quantidade de Quartos </v-list-item-title>
                                          <v-list-item-subtitle>{{ item.unidade.imovel.infraestrutura.dimensao.quantidadeQuarto }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-col>
                                  </v-row>
                              </v-list-item>
                            <v-divider></v-divider>

                            <v-list-item>
                              <v-row dense>
                                <v-col cols="12" md="4">
                                  <v-list-item-content>
                                    <v-list-item-title> Quantidade de Banheiros</v-list-item-title>
                                      <v-list-item-subtitle>{{ item.unidade.imovel.infraestrutura.dimensao.quantidadeBanheiro}}</v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-col>

                                  <v-col cols="12" md="4">
                                    <v-list-item-content>
                                      <v-list-item-title> Quantidade de Vagas </v-list-item-title>
                                        <v-list-item-subtitle>{{ item.unidade.imovel.infraestrutura.dimensao.quantidadeVagas  }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                  </v-col>
                              </v-row>
                          </v-list-item>
                        </template>  
                      </v-list>

                    <!-- Dimensões Lote -->
                    <template v-if="item.unidade.tipoId == 1">

                        <v-list two-line>
                          <v-list-item>
                            <v-row dense>
                              <v-col cols="12" md="4">
                                <v-list-item-content>
                                  <v-list-item-title> Frente </v-list-item-title>
                                  <v-list-item-subtitle>{{ item.unidade.lote.dimensao.frente}}</v-list-item-subtitle>
                                </v-list-item-content>
                              </v-col>

                              <v-col cols="12" md="4">
                                <v-list-item-content>
                                  <v-list-item-title> Fundo </v-list-item-title>
                                  <v-list-item-subtitle>{{ item.unidade.lote.dimensao.fundo  }}</v-list-item-subtitle>
                                </v-list-item-content>
                              </v-col>

                                <v-col cols="12" md="4">
                                  <v-list-item-content>
                                    <v-list-item-title> Lado Esquerdo </v-list-item-title>
                                    <v-list-item-subtitle>{{ item.unidade.lote.dimensao.ladoEsquerdo }}</v-list-item-subtitle>
                                  </v-list-item-content>
                                </v-col>
                             </v-row>
                            </v-list-item>
                            <v-divider></v-divider>

                          <v-list-item>
                            <v-row dense>
                              <v-col cols="12" md="4">
                                <v-list-item-content>
                                  <v-list-item-title> Lado Direito </v-list-item-title>
                                  <v-list-item-subtitle>{{ item.unidade.lote.dimensao.ladoDireito}}</v-list-item-subtitle>
                                </v-list-item-content>
                              </v-col>

                              <v-col cols="12" md="4">
                                <v-list-item-content>
                                  <v-list-item-title> Curva </v-list-item-title>
                                  <v-list-item-subtitle>{{ item.unidade.lote.dimensao.curva }}</v-list-item-subtitle>
                                </v-list-item-content>
                              </v-col>

                              <v-col cols="12" md="4">
                                <v-list-item-content>
                                  <v-list-item-title> Área total</v-list-item-title>
                                  <v-list-item-subtitle>{{ item.unidade.lote.dimensao.areaTotal }}</v-list-item-subtitle>
                                </v-list-item-content>
                              </v-col>
                             </v-row>
                            </v-list-item>
                          </v-list>
                        </template>    
                      </v-card>
                    </v-tab-item>

                 
                <!-- Interna  -->
                  <v-tab-item v-if="item.unidade.tipoId == 2">
                  <v-card class="mx-auto" flat>
                    <v-col cols="auto">
                     
                      <v-container fluid>
                        <v-row no-gutters>
                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.arCondicionado"
                              color="primary"
                              label="Ar Condicionado"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.areaPrivativa"
                              color="primary"
                              label="Área privativa"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.vistaMar"
                              color="primary"
                              label="Vista para o mar"
                            ></v-switch>
                          </v-col>
                        </v-row>

                        <v-row no-gutters>
                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.areaServico"
                              color="primary"
                              label="Área de serviço"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.armarioCozinha"
                              color="primary"
                              label="Armário cozinha"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.armarioBanheiro"
                              color="primary"
                              label="Armário banheiro"
                            ></v-switch>
                          </v-col>
                        </v-row>

                        <v-row no-gutters>
                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.armarioQuarto"
                              color="primary"
                              label="Armário quarto"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.boxBanheiro"
                              color="primary"
                              label="Box banheiro"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.dce"
                              color="primary"
                              label="DCE"
                            ></v-switch>
                          </v-col>
                        </v-row>

                        <v-row no-gutters>
                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.dispensa"
                              color="primary"
                              label="Despensa"
                            ></v-switch>
                          </v-col>
                          
                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.closet"
                              color="primary"
                              label="Closet"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.escritorio"
                              color="primary"
                              label="Escritorio"
                            ></v-switch>
                          </v-col>
                        </v-row>

                        <v-row no-gutters>
                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.lavabo"
                              color="primary"
                              label="Lavabo"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.mobiliado"
                              color="primary"
                              label="Mobiliado"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.rouparia"
                              color="primary"
                              label="Rouparia"
                            ></v-switch>
                          </v-col>
                        </v-row>

                        <v-row no-gutters>
                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.varandaGourmet"
                              color="primary"
                              label="Varanda gourmet"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.interna.solManha"
                              color="primary"
                              label="Sol da manhã"
                            ></v-switch>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-card>
                </v-tab-item>  

                <!-- Externa -->
                <v-tab-item v-if="item.unidade.tipoId == 2">
                  <v-card class="mx-auto" flat>
                    <v-col cols="auto">
                      
                      <v-container fluid>
                        <v-row no-gutters>
                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.vagaGaragem"
                              color="primary"
                              label="Vagas Garagem"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.elevador"
                              color="primary"
                              label="Elevadores"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="
                                item.unidade.imovel.infraestrutura.externa.aquiecimentoEletrico"
                              color="primary"
                              label="Aquec.Elétrico"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.aquecimentoSolar"
                              color="primary"
                              label="Aquec.Solar"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.cercaEletrica"
                              color="primary"
                              label="Cerca elétrica"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.gasCanalizado"
                              color="primary"
                              label="gás canalizado"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.jardim"
                              color="primary"
                              label="jardim"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.portaoEletrico"
                              color="primary"
                              label="Portão elétrico"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.alarme"
                              color="primary"
                              label="Alarme"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.aquecimentoGas"
                              color="primary"
                              label="Aquec.gás"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.boxDespejo"
                              color="primary"
                              label="Box despejo"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.cftv"
                              color="primary"
                              label="Circuito tv"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.interfone"
                              color="primary"
                              label="Interfone"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.aguaIndividual"
                              color="primary"
                              label="Água individual"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.lavanderia"
                              color="primary"
                              label="Lavanderia"
                            ></v-switch>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-switch
                              v-model="item.unidade.imovel.infraestrutura.externa.portaria24Hrs"
                              color="primary"
                              label="Portaria 24hrs"
                            ></v-switch>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-card>
                </v-tab-item>  
              </v-tabs-items>
            </v-card>
          </v-tab-item>

              <!-- Legalização -->
              <v-tab-item>
                <v-card  >
 
                    <v-card-text>
                        <v-list two-line v-if="item.unidade.legalizacao != undefined">
                             <v-list-item>
                                  <v-row dense>
                                    <v-col cols="12" md="4">
                                      <v-list-item-content>
                                        <v-list-item-title> Matrícula </v-list-item-title>
                                        <v-list-item-subtitle>
                                          {{ item.unidade.legalizacao.matricula}}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                      <v-list-item-content>
                                        <v-list-item-title> RGI </v-list-item-title>
                                        <v-list-item-subtitle>
                                          {{ item.unidade.legalizacao.rgi   }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>

                                    <v-col cols="12" md="4">
                                      <v-list-item-content>
                                        <v-list-item-title> Processo </v-list-item-title>
                                        <v-list-item-subtitle>
                                        {{  item.unidade.legalizacao.numeroProcesso }}
                                        </v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>
                                </v-row>  
                            </v-list-item>
                            <v-divider></v-divider>
                                <v-list-item>
                                  <v-row dense>
                                    <v-col cols="12" md="4">
                                      <v-list-item-content>
                                        <v-list-item-title> Orgão Emissor </v-list-item-title>
                                        <v-list-item-subtitle>{{ item.unidade.legalizacao.orgaoEmissor}}</v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>
                                    
                                   <v-col cols="12" md="4" v-if="item.unidade.legalizacao.cartorio != undefined">
                                      <v-list-item-content>
                                        <v-list-item-title> Cartório </v-list-item-title>
                                        <v-list-item-subtitle>{{ item.unidade.legalizacao.cartorio.nome}}</v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>  

                                    <v-col cols="12" md="4">
                                      <v-list-item-content>
                                        <v-list-item-title> Processo </v-list-item-title>
                                        <v-list-item-subtitle>{{   item.unidade.legalizacao.numeroProcesso }}</v-list-item-subtitle>
                                      </v-list-item-content>
                                    </v-col>
                                </v-row>  
                            </v-list-item>  
                          <v-divider></v-divider>
                      </v-list>
                      <v-col cols="12" md="12" > 
                      <v-list-item-content v-if="item.unidade.legalizacao != undefined">
                        <v-list-item-title> Descrição </v-list-item-title>
                        <v-list-item-subtitle>
                        {{ item.unidade.legalizacao.descricao}}
                        </v-list-item-subtitle>
                      </v-list-item-content>  
                    </v-col>  
                  </v-card-text>
                
                
                     
                     
                </v-card>
              </v-tab-item>

          <!-- Taxas -->
          <v-tab-item v-if="item.unidade.tipoId == 2">
            <v-card>

              <v-card-title>
                <v-icon color="primary" large left>mdi-pen</v-icon>
                <span class="title font-weight-light">Taxas</span>
              </v-card-title>

                <v-card-text>
                    <v-list two-line>
                      <v-list-item>
                        <v-row dense>
                         <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> Código taxa de lixo </v-list-item-title>
                              <v-list-item-subtitle>
                              {{item.unidade.imovel.taxa.codigoLixo}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                            <v-col cols="12" md="4">
                              <v-list-item-content>
                                <v-list-item-title> Codigo Sequencial </v-list-item-title>
                                <v-list-item-subtitle>
                                {{ item.unidade.imovel.taxa.codigoSequencial  }}
                                </v-list-item-subtitle>
                              </v-list-item-content>
                            </v-col>

                            <v-col cols="12" md="4">
                              <v-list-item-content>
                                <v-list-item-title> Codigo de água </v-list-item-title>
                                <v-list-item-subtitle>
                                {{ item.unidade.imovel.taxa.codigoAgua}}
                                </v-list-item-subtitle>
                              </v-list-item-content>
                            </v-col>
                          </v-row>
                      </v-list-item>
                      
                     <v-divider></v-divider>
                      <v-list-item>
                        <v-row dense>
                         <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> Codigo de energia </v-list-item-title>
                              <v-list-item-subtitle>
                              {{item.unidade.imovel.taxa.codigoEnergia}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> Codigo de gás </v-list-item-title>
                              <v-list-item-subtitle>
                              {{item.unidade.imovel.taxa.codigoGas }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> codigo SPU </v-list-item-title>
                              <v-list-item-subtitle>
                              {{ item.unidade.imovel.taxa.codigoSpu}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>
                        </v-row>
                      </v-list-item>
                     <v-divider></v-divider>

                      <v-list-item>
                        <v-row dense>
                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> Apolice Seguro</v-list-item-title>
                              <v-list-item-subtitle>
                              {{item.unidade.imovel.taxa.apoliceSeguro}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> Caução </v-list-item-title>
                              <v-list-item-subtitle>
                              {{item.unidade.imovel.taxa.valorCaucao }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> Código Hidrômetro </v-list-item-title>
                              <v-list-item-subtitle>
                              {{ item.unidade.imovel.taxa.codigoHidrometro}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>
                        </v-row>
                      </v-list-item>
                     <v-divider></v-divider>

                     <v-list-item>
                      <v-row dense>
                        <v-col cols="12" md="12">
                          <v-list-item-content>
                            <v-list-item-title> Valor do Condomínio </v-list-item-title>
                            <v-list-item-subtitle>
                            {{item.unidade.imovel.taxa.valorCondominio}}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-col>
                      </v-row>
                    </v-list-item>
                  <v-divider></v-divider>
                </v-list>  
              </v-card-text>

            <v-col cols="auto">
              <v-card-title>
                <v-icon color="primary" large left>mdi-eye</v-icon>
                <span class="title font-weight-light">CMB</span>
              </v-card-title>
                
                <v-card-text>
                  <v-list two-line>
                    <v-list-item>
                        <v-row dense>
                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> Nº Registro </v-list-item-title>
                              <v-list-item-subtitle>
                              {{item.unidade.imovel.taxa.cmb.numeroRegistro}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> Valor </v-list-item-title>
                              <v-list-item-subtitle>
                              {{ item.unidade.imovel.taxa.cmb.valor  }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> Multa </v-list-item-title>
                              <v-list-item-subtitle>
                              {{ item.unidade.imovel.taxa.cmb.multa}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>
                        </v-row>
                    </v-list-item>
                  <v-divider></v-divider>
                     <v-list-item>
                        <v-row dense>
                         <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title>Vencimento</v-list-item-title>
                              <v-list-item-subtitle>
                              {{item.unidade.imovel.taxa.cmb.vencimento}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>
                        </v-row>
                    </v-list-item>
                 <v-divider></v-divider>
              </v-list>
            </v-card-text>
 
              <v-card-title>
                <v-icon color="primary" large left>mdi-eye</v-icon>
                <span class="title font-weight-light">IPTU</span>
              </v-card-title>

                <v-card-text>
                  <v-list two-line>
                    <v-list-item>
                        <v-row dense>
                         <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> Nº Registro </v-list-item-title>
                              <v-list-item-subtitle>
                              {{item.unidade.imovel.taxa.iptu.numeroRegistro}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> Valor Venal </v-list-item-title>
                              <v-list-item-subtitle>
                              {{ item.unidade.imovel.taxa.iptu.valorVenal  }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-list-item-content>
                              <v-list-item-title> Valor Real </v-list-item-title>
                              <v-list-item-subtitle>
                              {{ item.unidade.imovel.taxa.iptu.valorRealImposto}}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-col>
                        </v-row>
                    </v-list-item>
                 <v-divider></v-divider>

                  <v-list-item>
                    <v-row dense>
                      <v-col cols="12" md="4">
                        <v-list-item-content>
                            <v-list-item-title> Valor Taxas </v-list-item-title>
                            <v-list-item-subtitle>
                            {{item.unidade.imovel.taxa.iptu.valorTaxas}}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        </v-col>

                        <v-col cols="12" md="4">
                        <v-list-item-content>
                            <v-list-item-title> Valor Total </v-list-item-title>
                            <v-list-item-subtitle>
                            {{ item.unidade.imovel.taxa.iptu.valorTotal  }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        </v-col>
                    </v-row>
                  </v-list-item>
                <v-divider></v-divider>
              </v-list>
            </v-card-text>

               
            <v-card-title>
              <v-icon color="primary" large left>mdi-eye</v-icon>
              <span class="title font-weight-light">Observações</span>
            </v-card-title>

              <v-card-text>
                <v-list two-line>
                  <v-list-item>
                      <v-row dense>
                        <v-col cols="12" md="12">
                          <v-list-item-content>
                              <v-list-item-title>Descrição</v-list-item-title>
                              <v-list-item-subtitle>
                              {{item.unidade.imovel.taxa.descricao}}
                              </v-list-item-subtitle>
                          </v-list-item-content>
                          </v-col>
                      </v-row>
                  </v-list-item>
                </v-list>
              </v-card-text>  
            </v-col>
          </v-card>
        </v-tab-item>
 
          <!-- Vistoria / Reparos -->
          <v-tab-item v-if="item.unidade.tipoId == 2">
            <v-card >
 
              <v-card-title>
                <v-icon color="primary" large left>mdi-pen</v-icon>
                <span class="title font-weight-light">Vistoria / Reparos</span>
              </v-card-title>

              <br>
              <v-card-text> 
                  <v-row dense>
                    <v-col cols="12" md="9">
                      <v-text-field v-model="contratoVistoria.descricaoReparo" label="Descrição do Reparo" dense ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-text-field v-model="contratoVistoria.data" type="date" label="Data" dense ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-text-field v-model="contratoVistoria.valorReparo" type="number" label="Valor" dense ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="7">
                      <v-file-input dense v-model="files" placeholder="Selecione os documentos" label="Arquivo" multiple  prepend-icon="mdi-camera" accept="image/png, image/jpeg, image/bmp">
                        <template v-slot:selection="{ text }">
                          <v-chip small label color="primary">
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input> 
                    </v-col>
                  
                    <v-col cols="12" md="2" lg="2">
                      <v-btn  @click="AdicionarVistoria()" rounded color="primary">Adicionar</v-btn>
                    </v-col>
                  </v-row>
            
                  <v-row dense>
                    <v-col cols="12" md="12" lg="12" xl="12">
                      <v-data-table :headers="headersVistorias" :items="item.vistorias" class="elevation-1" item-key="item.key">

                        <template v-slot:[`item.actions`] = "{item}">
                          <v-tooltip left> 
                            <template v-slot:activator="{ on }">
                              <v-icon small @click="EditarVistoria(item)"  v-on="on">mdi-pencil</v-icon>
                            </template>
                            <span>Editar</span>
                          </v-tooltip>

                        <v-tooltip right>
                          <template v-slot:activator="{ on }">
                            <v-icon small @click="ExcluirVistoria(item)" v-on="on">mdi-delete</v-icon>
                          </template>
                          <span>Excluir</span>
                        </v-tooltip>
                      </template>

                        <template v-slot:[`item.descricaoReparo`] ="{item}">
                          {{ item.descricaoReparo }}
                        </template>

                         <template v-slot:[`item.data`] ="{item}">
                          {{ item.data.substring(0,10).split('-').reverse().join('/') }}
                        </template>

                        <template v-slot:[`item.valorReparo`] ="{item}">
                          {{ item.valorReparo.toLocaleString("pt-BR",{style: "currency",currency: "BRL"}) }}
                        </template>

                        <template v-slot:[`item.exibirCarrosel`] ="{item}">
                          <v-icon @click="AbrirCarrosel(item)" color="primary" large>mdi-picture-in-picture-top-right-outline</v-icon> 
                        </template>
                      </v-data-table> 
 
                    </v-col>
                  </v-row>
                </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>

      <v-dialog v-model="dialogCarrosel" width="800">
        <v-card>
          <v-carousel :show-arrows="true">
            <v-carousel-item
              v-for="(item,i) in contratoVistoria.fotos"
              :key="i"
              :src="'data:image/gif;base64,' + item.dados"
            ></v-carousel-item>
          </v-carousel>
        </v-card>
      </v-dialog>
 
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Contrato, Unidade } from '@/core/models/cadastros';
import { ContratoVistoria, ContratoVistoriaFoto } from '@/core/models/clientes';
import { ContratoService } from '@/core/services/cadastros/ContratoService';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class EmpreendimentoContrato extends Vue {
  @Prop() public item!: Contrato;
  @Prop() public value!: string;

  public service = new ContratoService();
  public contratoVistoriaFoto = new ContratoVistoriaFoto() 
  public contratoVistoria = new ContratoVistoria();
  public unidade: Unidade = new Unidade();
  public dialogCarrosel: boolean = false;
  public dialog:boolean = false;
  public files = []
  public vistoriaIndex = -1;
  
  public tabAtiva: any = null;
  public tabInfraestruturaImovel: any = null;
  
  public headersVistorias: any[] = [
    { text: "", value:"actions", sortable: false },
    { text: "Descrição do Reparo", value: "descricaoReparo" }, 
    { text: "Data", value: "data" },
    { text: "Valor do Reparo", value: "valorReparo" },
    { text: "Exibir Carrosel", value: "exibirCarrosel" },
  ];

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

  Salvar() {
    let modelo = this.item
    this.service.Salvar(modelo).then(
      (res) => {
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
      });
  }

  Close() {
    this.dialog = false
  }

  async AdicionarVistoria(){
    if(this.vistoriaIndex == -1){
    this.item.vistorias.push(this.contratoVistoria)
      if(this.item.vistorias.length != 0){
        for(let i = 0; i < this.files.length; i++){
          let dados = await this.LerArquivo2(this.files[i]);
          this.contratoVistoriaFoto.dados = dados.replace(/^[^,]*,/, "");
          this.contratoVistoria.fotos.push(this.contratoVistoriaFoto)
          this.contratoVistoriaFoto = new ContratoVistoriaFoto();
        }
      }
    }
    this.contratoVistoria = new ContratoVistoria();
    this.vistoriaIndex = -1;
    this.files = [];
  }

  ExcluirVistoria(item:ContratoVistoria){
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
        const index = this.item.vistorias.indexOf(item);
        this.item.vistorias.splice(index, 1);
        this.$swal("Aviso", "Registro excluído com sucesso!", "success");
      }
    }); 
  }

  EditarVistoria(item:ContratoVistoria){
    this.vistoriaIndex  = this.item.vistorias.indexOf(item)
    this.contratoVistoria = item;
  }

  AbrirCarrosel(item:ContratoVistoria){
    this.vistoriaIndex  = this.item.vistorias.indexOf(item)
    this.contratoVistoria = item
    this.dialogCarrosel = true;
  }

  LerArquivo2(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();

      fr.onload = (file: any) => {
        resolve(file!.target!.result);
      };

      fr.readAsDataURL(file);
    });
  } 

  mounted() {
   
  }
}
</script>
 