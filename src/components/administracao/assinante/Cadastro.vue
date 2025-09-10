<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    no-click-animation
  > 
    <v-card> 
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>Cadastro Assinante</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="Salvar()" :disabled="!valid">Salvar</v-btn>
        </v-toolbar-items>
        <template v-slot:extension>
          <v-tabs v-model="tabActive" background-color="primary" dark>
            <v-tab>Assinante</v-tab>
            <v-tab>Endereço</v-tab>
            <v-tab>Contato</v-tab>
            <v-tab>Contato Principal</v-tab>
            <v-tab>Empresa Responsável</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-card-text class="mt-3">
        
        <v-tabs-items v-model="tabActive">
          <v-form lazy-validation v-model="valid" ref="form">
            <!-- Identificação -->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-card-title>
                  <v-icon color="primary" large left>mdi-information</v-icon>
                  <span class="title font-weight-light">Identificação do Assinante</span>
                </v-card-title>
                <v-col cols="auto">
                  <v-row>
                     <v-col cols="12" md="2">
                      <v-checkbox
                        v-model="item.pessoaJuridica"
                        :label="`Pessoa Juridica`"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="item.nomeFantasia"
                        label="Nome"
                        dense 
                        :rules="fieldRules"
                        :counter="60"
                        maxlength="60"
                      />
                    </v-col>
                     
                    <v-col cols="12" sm="3" v-if="item.pessoaJuridica == false">
                      <v-text-field
                        v-model="item.cpfCnpj"
                        label="CPF"  
                        dense  v-mask="'###.###.###-##'"
                        :rules="fieldRules"                        
                      />
                    </v-col> 

                    <v-col cols="12" sm="3" v-if="item.pessoaJuridica == true">
                      <v-text-field
                        v-model="item.cpfCnpj"
                        label="CNPJ"  
                        dense  v-mask="'##.###.###/####-##'"
                        :rules="fieldRules"                        
                      />
                    </v-col> 
                                      
                    <v-col cols="12" sm="3">
                      <v-text-field
                        v-model="item.inscricaoMunicipal"
                        label="Inscrição Municipal"
                        dense
                        :rules="fieldRules"
                        :counter="11"
                        maxlength="11"
                      />
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="item.inscricaoEstadual"
                        label="Inscrição Estadual"
                        dense
                        :rules="fieldRules"
                        :counter="9"
                        maxlength="9"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-card>
            </v-tab-item>
            
            <!-- Endereço -->
            <v-tab-item>
              <v-card>
                 <v-card flat>
                    <v-card-title>
                      <v-icon color="primary" large left>mdi-map</v-icon>
                      <span class="title font-weight-light">Endereço</span>
                    </v-card-title>
                    <v-card-text> 
                      <v-col cols="12">
                        <v-row dense>
                          <v-col cols="12" md="2">
                            <v-text-field
                              v-model.trim="item.endereco.cep"
                              dense v-mask="'#####-###'"
                              label="CEP" @input="BuscarCep('cep', $event)"
                              hint="Somente números" 
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              dense
                              label="Logradouro"
                              v-model="item.endereco.logradouro"
                              :loading="carregando"
                            ></v-text-field>
                          </v-col> 
                          <v-col cols="12" md="1">
                            <v-text-field
                              dense
                              label="Número"
                              v-model="item.endereco.numero"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-text-field
                              dense
                              label="Complemento"
                              v-model="item.endereco.complemento"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field
                              dense
                              label="Bairro"
                              v-model="item.endereco.bairro"
                              :loading="carregando"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-autocomplete
                              :items="listaEstado"
                              item-value="id"
                              item-text="nome"
                              dense
                              label="Estado"
                              v-model="item.endereco.estadoId"
                              :loading="carregando"
                              placeholder="Selecione"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-autocomplete
                              :items="listaMunicipio"
                              item-value="id"
                              item-text="nome"
                              dense
                              label="Município"
                              v-model="item.endereco.municipioId"
                              placeholder="Selecione"
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-card-text>
                  </v-card>
                 <!-- <vcard-endereco :endereco.sync="item.endereco" /> -->
              </v-card>
            </v-tab-item> 

            <v-tab-item>
               <v-card class="mx-auto">
                <v-card-title
                  ><v-icon color="primary" large left>mdi-email</v-icon>
                  <span class="title font-weight-light">Contato </span>
                </v-card-title>
                <v-col cols="auto">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="item.nome"
                        label="Contato"
                        dense
                        :counter="60"
                        maxlength="60"
                      />
                    </v-col>
 
                    <v-col cols="12" sm="3">
                      <v-text-field
                        v-model="item.telefone1"
                        label="Telefone"
                        dense v-mask="'(##) #####-####'"
                        :rules="fieldRules"
                       
                      />
                    </v-col> 
 
                    <v-col cols="12" sm="3">
                      <v-text-field
                        v-model="item.telefone2"
                        label="Telefone 2"
                        dense
                        v-mask="'(##) #####-####'"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="item.email"
                        label="Email"
                        :rules="fieldRules"
                        dense
                      />
                    </v-col>
                     <v-col cols="12" md="6">
                      <v-text-field
                        v-model="item.subDominio"
                        label="Sub Dominio"
                        :rules="fieldRules"
                        dense
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-card>
            </v-tab-item>

             <!-- Contato  Principal-->
            <v-tab-item>
              <v-card class="mx-auto">
                <v-card-title
                  ><v-icon color="primary" large left>mdi-email</v-icon>
                  <span class="title font-weight-light">Contato Principal</span>
                </v-card-title>

               <v-form v-model="validContato" lazy-validation ref="formContato">
                  <v-col cols="auto">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.trim="contatoPessoa.nome"
                          label="Nome"
                          :counter="60"
                          maxlength="60"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.trim="contatoPessoa.email"
                          label="Email"
                          :counter="120"
                          maxlength="120"
                          dense
                          :rules="fieldRules"
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model.trim="contatoPessoa.telefone"
                          label="Telefone"
                          v-mask="'(##) ####-####'"
                          dense
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model.trim="contatoPessoa.celular"
                          label="Celular"
                          v-mask="'(##) #####-####'"
                          dense
                          :rules="fieldRules"
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model.trim="contatoPessoa.ramal"
                          label="Ramal"
                          :counter="10"
                          maxlength="10"
                          dense
                        />
                      </v-col>

                      <v-col cols="12" md="9">
                        <v-text-field
                          v-model.trim="contatoPessoa.observacao"
                          label="Observacao"
                          :counter="100"
                          maxlength="100"
                          dense
                        />
                      </v-col>
                    
                    <v-col cols="12" md="1">
                      <v-checkbox
                        v-model="contatoPessoa.principal"
                        :label="`Principal:`"
                      ></v-checkbox>
                    </v-col>

                      <v-col cols="12" md="2">
                        <v-btn
                          rounded
                          color="primary"
                          @click="AdicionarContato()"
                          >Adicionar</v-btn
                        >
                      </v-col>
                    </v-row>
 
                  <v-data-table
                    :headers="headers"
                    :items="item.contatos"
                    :items-per-page="5"
                  >
                    <template v-slot:[`item.actions`] = "{item}">
                      <v-tooltip left>
                        <template v-slot:activator="{ on }">
                          <v-icon small @click="Editar(item)" v-on="on"
                            >mdi-pencil</v-icon
                          >
                        </template>
                        <span>Editar</span>
                      </v-tooltip>
                      <v-tooltip right>
                        <template v-slot:activator="{ on }">
                          <v-icon small @click="Excluir(item)" v-on="on"
                            >mdi-delete</v-icon
                          >
                        </template>
                        <span>Excluir</span>
                      </v-tooltip>
                    </template>

                    <template v-slot:[`item.nome`] = "{item}">
                      {{item.nome}}
                    </template>

                    <template v-slot:[`item.celular`] = "{item}">
                      {{item.celular}}
                    </template>

                    <template v-slot:[`item.telefone`] = "{item}">
                      {{item.telefone}}
                    </template>

                    <template v-slot:[`item.ramal`] = "{item}"> 
                      {{item.ramal}}
                    </template>

                    <template v-slot:[`item.email`] = "{item}">
                      {{item.email}}
                    </template>

                    <template v-slot:[`item.observacao`] = "{item}">
                      {{item.observacao}}
                    </template>

                    <template v-slot:[`item.principal`] = "{item}">
                      {{item.principal.toSimNao()}}
                    </template>
                  </v-data-table>
                 </v-col>
                </v-form>

              <v-card-title
                ><v-icon color="primary" large left>mdi-email</v-icon>
                <span class="title font-weight-light">Dominio Principal</span>
              </v-card-title>

               <v-form v-model="validContato" lazy-validation ref="formDominio">
                  <v-col cols="auto">
                    <v-row>
                     
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.trim="dominioPrincipal.nome"
                        label="Nome"
                        :counter="60"
                        maxlength="60"
                        dense
                      />
                    </v-col>
                    <v-col cols="12" md="1">
                      <v-checkbox
                        v-model="dominioPrincipal.principal"
                        :label="`Principal:`"
                      ></v-checkbox>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-btn
                          rounded
                          color="primary"
                          @click="AdicionarDominio()"
                          >Adicionar</v-btn
                        >
                      </v-col>
                    </v-row>
 
                  <v-data-table
                    :headers="headersDominio"
                    :items="item.dominios"
                    :items-per-page="5"
                  >
                    <template v-slot:[`item.actions`] = "{item}">
                      <v-tooltip left>
                        <template v-slot:activator="{ on }">
                          <v-icon small @click="EditarDominio(item)" v-on="on"
                            >mdi-pencil</v-icon
                          >
                        </template>
                        <span>Editar</span>
                      </v-tooltip>
                      <v-tooltip right>
                        <template v-slot:activator="{ on }">
                          <v-icon small @click="ExcluirDominio(item)" v-on="on"
                            >mdi-delete</v-icon
                          >
                        </template>
                        <span>Excluir</span>
                      </v-tooltip>
                    </template>

                    <template v-slot:[`item.nome`] = "{item}">
                      {{item.nome}}
                    </template>

                    <template v-slot:[`item.principal`] = "{item}">
                      {{item.principal.toSimNao()}}
                    </template>
                  </v-data-table>
                 </v-col>
                </v-form>
              </v-card>
            </v-tab-item>

             
      <!-- Empresa Responsavél -->
      <v-tab-item>
        <v-card class="mx-auto">
          <v-tabs v-model="tab" align-with-title>
            <v-tabs-slider></v-tabs-slider>
              <v-tab>Assinante</v-tab>
              <v-tab>Endereço</v-tab>
              <v-tab>Contato</v-tab>
            </v-tabs>
                
         <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card flat>
                     <v-card-title
                      ><v-icon color="primary" large left>mdi-email</v-icon>
                      <span class="title font-weight-light">Identificação do Assinante Responsável</span>
                    </v-card-title>
                    <v-col cols="auto">
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="item.responsavel.nome"
                            label="Nome"
                            dense
                            :rules="fieldRules" 
                          />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="item.responsavel.sobrenome"
                              label="Sobrenome"
                              dense  
                              :rules="fieldRules"
                              :counter="60"
                              maxlength="60"
                            />
                          </v-col>

                        <v-col cols="12" sm="3">
                          <v-text-field
                            v-model="item.responsavel.cpf"
                            label="CPF"
                            dense
                            :rules="fieldRules"
                            v-mask="'###.###.###-##'"
                          />
                        </v-col>

                        <v-col cols="12" sm="6" md="3">
                          <v-text-field :rules="fieldRules" v-model="item.responsavel.dataNascimento" label="Data nascimento" dense type="date"/>
                        </v-col>
 
                        <v-col cols="12" sm="3">
                          <v-text-field
                            v-model="item.responsavel.codigoCategoriaComerciante "
                            label="Cód Categoria Comerciante"
                            dense  
                            :rules="fieldRules"
                            :counter="60"
                            maxlength="60"
                          />
                        </v-col>

                        <v-col cols="12" sm="3">
                          <v-text-field
                            v-model="item.responsavel.categoriaComerciante "
                            label="Categoria Comerciante"
                            dense  
                            :rules="fieldRules"
                            :counter="60"
                            maxlength="60"
                          />
                        </v-col>

                          <v-col cols="12" sm="3">
                          <v-text-field
                            v-model="item.responsavel.codigoZoop "
                            label="Cód Zoop"
                            dense  
                            :rules="fieldRules"
                            :counter="60"
                            maxlength="60"
                          />
                        </v-col> 
                      </v-row>
                    </v-col>
                </v-card>
              </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                    <v-card-title>
                      <v-icon color="primary" large left>mdi-map</v-icon>
                      <span class="title font-weight-light">Endereço</span>
                    </v-card-title>
                    <v-card-text> 
                      <v-col cols="12">
                        <v-row dense>
                          <v-col cols="12" md="2">
                            <v-text-field
                              v-model.trim="item.responsavel.endereco.cep"
                              dense v-mask="'#####-###'" @input="BuscarCepResponsavel('cep', $event)"
                              label="CEP"
                              hint="Somente números" 
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              dense
                              label="Logradouro"
                              v-model="item.responsavel.endereco.logradouro"
                              :loading="carregando2"
                            ></v-text-field>
                          </v-col> 
                          <v-col cols="12" md="1">
                            <v-text-field
                              dense
                              label="Número"
                              v-model="item.responsavel.endereco.numero"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-text-field
                              dense
                              label="Complemento"
                              v-model="item.responsavel.endereco.complemento"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field
                              dense
                              label="Bairro"
                              v-model="item.responsavel.endereco.bairro"
                              :loading="carregando2"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-autocomplete
                              :items="listaEstado"
                              item-value="id"
                              item-text="nome"
                              dense
                              label="Estado"
                              v-model="item.responsavel.endereco.estadoId"
                              :loading="carregando2"
                              placeholder="Selecione"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-autocomplete
                              :items="listaMunicipio"
                              item-value="id"
                              item-text="nome"
                              dense
                              label="Município"
                              v-model="item.responsavel.endereco.municipioId"
                              placeholder="Selecione"
                            ></v-autocomplete>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-card-text>
                <!-- <vcard-endereco :endereco.sync="item.responsavel.endereco" /> -->
              </v-card>
            </v-tab-item>

                <v-tab-item>
                  <v-card flat>
                    <v-card-title
                      ><v-icon color="primary" large left>mdi-email</v-icon>
                      <span class="title font-weight-light">Contato</span>
                    </v-card-title>

                      <v-col cols="auto">
                        <v-row>
                          <v-col cols="12" sm="3">
                            <v-text-field
                              v-model="item.responsavel.telefone"
                              label="Telefone"
                              dense
                              :rules="fieldRules"
                              v-mask="'(##)#-####-####'"
                            />
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="item.responsavel.email"
                              label="Email"
                              dense  
                              :rules="fieldRules"
                              :counter="60"
                              maxlength="60"
                            />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>  
             </v-card>
            </v-tab-item>
          </v-form>
        </v-tabs-items> 

      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Endereco } from "@/core/models/shared";
import { Municipio, Estado } from "../../../core/models/geral";
import ExternalServices from "@/core/services/geral/ExternalServices";
import { AssinanteService } from "@/core/services/cadastros";
import { Assinante, AssinanteContato, AssinanteDominio } from "@/core/models/cadastros";
import { EnderecoService } from "@/core/services/geral/EnderecoService";

@Component
export default class CadastroAssinante extends Vue {
  @Prop() public item!: Assinante;
  @Prop() public value!: string;
 
  contatoIndex: number = -1;
  dominioIndex: number = -1;
  tabActive = null;
  tab = null
  municipios: Municipio[] = [];
  contatoPessoa = new AssinanteContato();
  dominioPrincipal = new AssinanteDominio();
  private listaMunicipio: Municipio[] = [];
  private listaEstado: Estado[] = [];
  private serviceEndereco: EnderecoService = new EnderecoService();
  private debounce: any = null;
  private carregando:boolean = false;
 
  estados: Estado[] = [];
  readonly: boolean = true;

  service = new AssinanteService();

  @Watch("item.endereco.estadoId")
  CarregarMunicipio(id: any) {
    this.serviceEndereco.ListarMunicipiosPorIdEstadual(id).then(res => {
      this.listaMunicipio = res.data.items;
      this.listaMunicipio.sort((x,y) => (x.nome > y.nome) ? 1 : ((y.nome > x.nome) ? -1 : 0) )
    }, err => err);
  }
 
  BuscarCep(tipo:string, value:any){
    if(tipo.toLocaleLowerCase() === "cep"){
     if (value.length == 9) { 
      clearTimeout(this.debounce);
      this.carregando = true;
      this.debounce = setTimeout(async () => {
        await this.serviceEndereco.EncontrarEnderecoPorCep(this.item.endereco.cep).then((res) => {
          
          if(res.status == 204){
            this.$swal("Atenção!", `Erro ao efetuar a consulta do cep ${this.item.endereco.cep}. Verifique se o CEP informado é válido e tente novamente.`, "warning");
            this.carregando = false;
            return;  
          }
          let endereco = new Endereco();
          endereco.cep = res.data.cep;
          endereco.bairro = res.data.bairro;
          endereco.logradouro = res.data.logradouro;
          endereco.municipioId = res.data.municipioId;
          endereco.estadoId = res.data.estadoId;
         
          this.item.endereco.cep = endereco.cep;
          this.item.endereco.bairro = endereco.bairro;
          this.item.endereco.logradouro = endereco.logradouro;
          this.item.endereco.municipioId = endereco.municipioId;
          this.item.endereco.estadoId = endereco.estadoId;
          
          this.carregando = false;
        }, err => {
          this.$swal("Erro!", `Erro ao efetuar a consulta do cep ${this.item.endereco.cep}. Verifique se o CEP informado é válido e tente novamente.`, "error");          
          this.carregando = false;
        });
      }, 2500);
    }
    }
  }
  private debounce2: any = null;
  private carregando2:boolean = false;

  BuscarCepResponsavel(tipo:string, value:any){
    if(tipo.toLocaleLowerCase() === "cep"){
      if (value.length == 9) { 
      clearTimeout(this.debounce2);
      this.carregando2 = true;
      this.debounce2 = setTimeout(async () => {
        await this.serviceEndereco.EncontrarEnderecoPorCep(this.item.responsavel.endereco.cep).then((res) => {
          
          if(res.status == 204){
            this.$swal("Atenção!", `Erro ao efetuar a consulta do cep ${this.item.responsavel.endereco.cep}. Verifique se o CEP informado é válido e tente novamente.`, "warning");
            this.carregando2 = false;
            return;  
          }
           
          let endereco = new Endereco();
          endereco.cep = res.data.cep;
          endereco.bairro = res.data.bairro;
          endereco.logradouro = res.data.logradouro;
          endereco.municipioId = res.data.municipioId;
          endereco.estadoId = res.data.estadoId;
         
          this.item.responsavel.endereco.cep = endereco.cep;
          this.item.responsavel.endereco.bairro = endereco.bairro;
          this.item.responsavel.endereco.logradouro = endereco.logradouro;
          this.item.responsavel.endereco.municipioId = endereco.municipioId;
          this.item.responsavel.endereco.estadoId = endereco.estadoId;
          
          this.carregando2 = false;
        }, err => {
          this.$swal("Erro!", `Erro ao efetuar a consulta do cep ${this.item.responsavel.endereco.cep}. Verifique se o CEP informado é válido e tente novamente.`, "error");          
          this.carregando2 = false;
        });
      }, 2500);
    }
      }
  }
 
  headersDominio: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome" },
    { text: "Principal", value: "principal" },
  ];

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome" },
    { text: "Telefone", value: "telefone" },
    { text: "Celular", value: "celular" },
    { text: "Ramal", value: "ramal" },
    { text: "Email", value: "email" },
    { text: "Observaçao", value: "observacao" },
    { text: "Principal", value: "principal" },
  ];
  
  validContato = true
  valid = true;
  dialog = false;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

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

  $refs!: {
    form: HTMLFormElement;
    formContato:HTMLFormElement
    formDominio:HTMLFormElement
  };
  
  @Watch('item')
  Item2(){
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }


  @Watch("contatoPessoa")
  ContatoPessoa() {
    if (this.$refs.formContato) {
      this.$refs.formContato.resetValidation();
    }
  }

  @Watch("dominioPrincipal")
  DominioPrincipal() {
    if (this.$refs.formDominio) {
      this.$refs.formDominio.resetValidation();
    }
  }

  async PesquisaCep() {
    if (this.item.endereco.cep.length == 8) {
      let endereco: any = await new ExternalServices().PesquisaCep(
        this.item.endereco.cep
      );
      endereco
        ? (this.item.endereco = endereco)
        : this.$swal("Aviso", "CEP inválido!", "error");
      endereco ? (this.readonly = true) : (this.readonly = false);
    }
  }
  //DOMINIO PRINCIPAL
  AdicionarDominio(){
     if (this.$refs.formDominio.validate()) {
      if (this.dominioIndex == -1) {
        this.item.dominios.push(this.dominioPrincipal);
      }
      this.dominioPrincipal = new AssinanteDominio();
      this.dominioIndex = -1;
    }
  }

  EditarDominio(item: AssinanteDominio) {
    if (this.dominioIndex != -1) {
      this.$swal(
        "Cuidado!",
        "Não é possível editar um registro sem finalizar uma edição já em andamento.",
        "error"
      );
      return;
    }
    this.dominioPrincipal = item;
    this.dominioIndex = this.item.dominios.indexOf(item);

    //this.item.contatos = this.item.contatos.filter(f => f.id != item.id);
  }

  ExcluirDominio(item: AssinanteDominio) {
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
        const index = this.item.dominios.indexOf(item);
        this.item.dominios.splice(index, 1);
        this.$swal("Aviso", "Contato excluído com sucesso!", "success");
      }
    });
  }


//CONTATO PRINCIPAL
 AdicionarContato() {
    if (this.$refs.formContato.validate()) {
      if (this.contatoIndex == -1) {
        this.item.contatos.push(this.contatoPessoa);
      }
      this.contatoPessoa = new AssinanteContato();
      this.contatoIndex = -1;
    }
  }

  Editar(item: AssinanteContato) {
    if (this.contatoIndex != -1) {
      this.$swal(
        "Cuidado!",
        "Não é possível editar um registro sem finalizar uma edição já em andamento.",
        "error"
      );
      return;
    }
    this.contatoPessoa = item;
    this.contatoIndex = this.item.contatos.indexOf(item);

    //this.item.contatos = this.item.contatos.filter(f => f.id != item.id);
  }

  Excluir(item: AssinanteContato) {
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
        const index = this.item.contatos.indexOf(item);
        this.item.contatos.splice(index, 1);
        this.$swal("Aviso", "Contato excluído com sucesso!", "success");
      }
    });
  }

  Salvar() {
    if (this.$refs.form.validate()) {
      let modelo = this.item;

      this.service.Salvar(modelo).then(
        (res) => {
          this.$swal(
            "Aviso",
            "Operação realizada com sucesso!",
            res.status == 201 || res.status == 200 ? "success" : "warning"
          );
          this.$emit("salvou");
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

    this.Close();
    }
  }

  Close() {
    this.dialog = false;
  }
 
  mounted() {
    this.serviceEndereco.ListarEstados().then(res => {
      this.listaEstado = res.data.items;
      this.listaEstado.sort((x,y) => (x.nome > y.nome) ? 1 : ((y.nome > x.nome) ? -1 : 0))
    }, err => err);

  }
}
</script>
