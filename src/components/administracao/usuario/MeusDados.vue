<template>
  <v-dialog
    v-model="dialog"
    max-width="800"
    persistent
  >
    <v-card elevation="4">
      <v-toolbar color="#BDBDBD" dark flat>
        <v-toolbar-title>Meus Dados</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="Close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form v-model="valid" ref="form" lazy-validation>

          <v-card-text>
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-row align="start">
                <!-- Foto quadrada -->
                <v-col cols="12" sm="3" class="d-flex justify-center">
                  <v-img
                    v-if="item.foto"
                    :src="`data:image/jpeg;base64,${item.foto}`"
                    max-width="120"
                    max-height="120"
                    class="elevation-2"
                    style="border: 1px solid #ccc;"
                  ></v-img>
                  <div
                    v-else
                    style="width: 120px; height: 120px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center;"
                  >
                    <v-icon size="60" color="grey lighten-1">mdi-account</v-icon>
                  </div>
                </v-col>

                <!-- Login + Botão Alterar Senha -->
                <v-col cols="12" sm="9">
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Login"
                        v-model="item.login"
                        readonly
                        :rules="fieldRules"
                      />
                    </v-col>
                    <!-- <v-col cols="12" sm="12" >
                      <v-btn outlined
                        color="primary"
                         
                        @click="mostrarSenha = !mostrarSenha"
                      >
                        <v-icon left>mdi-lock</v-icon>
                        {{ mostrarSenha ? 'Cancelar' : 'Alterar Senha' }}
                      </v-btn>
                    </v-col> -->
                  </v-row>

                  <!-- <v-expand-transition>
                    <div v-if="mostrarSenha">
                      <v-row dense>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            label="Senha Atual"
                            v-model="alterarSenha.senhaAntiga"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show ? 'text' : 'password'"
                            @click:append="show = !show"
                            :rules="[rules.required]"
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            label="Nova Senha"
                            v-model="alterarSenha.senhaNova"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'"
                            @click:append="show1 = !show1"
                            :rules="[rules.required, rules.min]"
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            label="Confirmar Nova Senha"
                            v-model="password2"
                            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show2 ? 'text' : 'password'"
                            @click:append="show2 = !show2"
                            :rules="[rules.valid]"
                          />
                        </v-col>
                        <v-col cols="12" sm="6" class="pt-5">
                          <v-btn color="primary" @click="TrocarSenha()">
                            <v-icon left>mdi-check</v-icon>Salvar Nova Senha
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </v-expand-transition> -->
                </v-col>
              </v-row>

              <!-- Botão de upload/remover foto embaixo -->
              <v-row>
                <v-col cols="12" sm="3" class="d-flex justify-center">
                  <v-file-input
                    v-if="!item.foto"
                    dense
                    prepend-icon="mdi-camera"
                    accept="image/png, image/jpeg"
                    label="Adicionar Foto"
                    v-model="arquivo"
                    @change="LoadImage()"
                  />
                  <v-btn
                    v-else
                    color="red"
                    text
                    @click="RemoveImage()"
                  >
                    <v-icon left>mdi-delete</v-icon> Remover Foto
                  </v-btn>
                </v-col>
                <v-spacer></v-spacer>

                <v-col cols="12" sm="3" class="d-flex justify-center"> 
                  <v-btn
                    color="primary"
                    text
                    @click="mostrarSenha = !mostrarSenha"
                  >
                    <v-icon left>mdi-lock</v-icon>
                    {{ mostrarSenha ? 'Cancelar' : 'Alterar Senha' }}
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Restante do formulário... -->
            </v-form>
          </v-card-text>
 



          <!-- Avatar -->
          <!-- <v-row justify="center" class="mb-6">
            <v-avatar size="120"> 
              <v-img
                v-if="item.foto"
                :src="`data:image/jpeg;base64,${item.foto}`"
              ></v-img>
              <v-icon v-else size="80" color="grey lighten-1">mdi-account</v-icon>
            </v-avatar>
          </v-row> -->

          <!-- <v-row justify="center" class="mb-4">
            <v-col cols="auto">
              <v-file-input
                v-if="!item.foto"
                dense
                prepend-icon="mdi-camera"
                accept="image/png, image/jpeg"
                label="Adicionar Foto"
                v-model="arquivo"
                @change="LoadImage()"
              />
              <v-btn
                v-else
                color="red"
                text
                @click="RemoveImage()"
              >
                <v-icon left>mdi-delete</v-icon> Remover Foto
              </v-btn>
            </v-col>
          </v-row> -->

          <!-- Dados de Acesso -->
          <!-- <v-divider class="mb-4"></v-divider> -->
          <!-- <v-card-subtitle class="mb-2 font-weight-bold">
            Dados de Acesso
          </v-card-subtitle> -->

          <!-- <v-row dense>
            <v-col cols="12">
              <v-text-field
                label="Login"
                v-model="item.login"
                readonly
                :rules="fieldRules"
              />
            </v-col>
          </v-row> -->

          <!-- <v-row justify="end">
          <v-btn
            color="primary"
            text
            @click="mostrarSenha = !mostrarSenha"
          >
            <v-icon left>mdi-lock</v-icon>
            {{ mostrarSenha ? 'Cancelar' : 'Alterar Senha' }}
          </v-btn>
        </v-row> -->

        <v-expand-transition>
          <div v-if="mostrarSenha">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Senha Atual"
                  v-model="alterarSenha.senhaAntiga"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  @click:append="show = !show"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="Nova Senha"
                  v-model="alterarSenha.senhaNova"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                  :rules="[rules.required, rules.min]"
                />
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  label="Confirmar Nova Senha"
                  v-model="password2"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show2 ? 'text' : 'password'"
                  @click:append="show2 = !show2"
                  :rules="[rules.valid]"
                />
              </v-col>

              <v-col cols="12" sm="6" class="pl-3 pt-4">
                <v-btn color="primary" outlined @click="TrocarSenha()">
                  <v-icon left>mdi-check</v-icon>Salvar Senha
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>


          <!-- <v-row justify="end">
            <v-btn
              color="primary"
              text
              @click="dialogAlteraSenha = true"
            >
              <v-icon left>mdi-lock</v-icon> Alterar Senha
            </v-btn>
          </v-row> -->

          <!-- Dados de Contato -->
          <v-divider class="my-3"></v-divider>
          <p class="mb-2 font-weight-bold">
            Dados de Contato
          </p>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Nome"
                v-model="item.complementar.nome"
                :rules="fieldRules"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Email"
                v-model="item.complementar.email"
                :rules="fieldRules"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Celular"
                v-model="item.complementar.celular"
                v-mask="'(##) #####-####'"
                :rules="fieldRules"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Telefone"
                v-model="item.complementar.telefone"
                v-mask="'(##) ####-####'"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Ramal"
                v-model="item.complementar.ramal"
              />
            </v-col>
          </v-row>

        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="Close()">Cancelar</v-btn>
        <v-btn
          color="primary"
          :disabled="!valid"
          @click="Salvar()"
        >Salvar</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Dialog Alterar Senha -->
    <v-dialog v-model="dialogAlteraSenha" max-width="500">
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Alterar Senha</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogAlteraSenha = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-form v-model="valid" ref="formSenha" lazy-validation>
            <v-text-field
              label="Senha Atual"
              v-model="alterarSenha.senhaAntiga"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              @click:append="show = !show"
              :rules="[rules.required]"
            />
            <v-text-field
              label="Nova Senha"
              v-model="alterarSenha.senhaNova"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
              :rules="[rules.required, rules.min]"
            />
            <v-text-field
              label="Confirmar Nova Senha"
              v-model="password2"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              @click:append="show2 = !show2"
              :rules="[rules.valid]"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogAlteraSenha = false">Cancelar</v-btn>
          <v-btn color="primary" @click="TrocarSenha()">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>


<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import * as jsonpatch from 'fast-json-patch';
import { Usuario } from "@/core/models/cadastros";
import { UsuarioService } from "@/core/services/cadastros";
import { Contato } from "@/core/models/geral";
import { ArquivoService } from "@/core/services/geral/ArquivoService";
 

@Component
export default class CadastroIndice extends Vue {
  @Prop() public item!: Usuario; 
  @Prop() public value!: string;

  service = new UsuarioService();
  complementar = new Contato();
  alterarSenha = new  AlterarSenha(); 
  dialogAlteraSenha:boolean = false;
  mostrarSenha = false;

  observer! : jsonpatch.Observer<Usuario>; 
  
  tabActive = null;
  arquivo = null;
  valid = true;
  dialog = false;
  show1 = false;
  show2 = false;
  show = false;
 
  password:string = "";  
  password2:string = "";
  novaSenha:string='';
  urlImgDoc: string = "";
  lerArquivo: any;
   
  Caracters = /[!|@|#|$|%|^|&|*|(|)|-|_]/;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  $refs!: {
    form: HTMLFormElement;
  };

  rules = {
    required: (value) => !!value || "Campo obrigatório.",
    min: (v) => (v.length >= 8 && !!this.Caracters.test(v)) || "Mínimo 8 caracteres incluindo 1 caracter especial  Ex: ! @ # $ % & * ( ) _  ",
    valid: (value) => value == this.alterarSenha.senhaNova || "As senhas não são iguais.",
    caracter: (value) => !!this.Caracters.test(value) || "Pelo menos 1 caracter especial",
  };

  RemoveImage(){
    this.item.foto = null; 
    this.arquivo = null;
  }

  async LoadImage(){
    if (!this.arquivo)
        return;

    const arquivoService = new ArquivoService();
    const dados = await arquivoService.Ler(this.arquivo);
    this.item.foto = dados.replace(/^[^,]*,/, "");
  } 
 
  excluirAvatar() { 
    this.item.foto = "";
    this.arquivo = null;
  }

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }
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

  Salvar() {
    let pacthModel = jsonpatch.generate(this.observer);
    (this.item.id > 0 ? this.service.Patch(pacthModel, this.item.id) : this.service.Salvar(this.item)).then(
      (res) => {
        this.$swal("Aviso","Operação realizada com sucesso!",res.status == 201 || res.status == 200 ? "success" : "warning");
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

  TrocarSenha(){
    if(this.$refs.form.validate()){
    this.alterarSenha.usuarioId = this.item.id
    let modelo = this.alterarSenha
    
    this.service.AlterarSenha(modelo).then(
      (res) => {
        this.$swal("Aviso","Operação realizada com sucesso!",res.status == 201 || res.status == 200 ? "success" : "warning");
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
  }

  Close() {
    this.dialog = false;
  }
}

class AlterarSenha {
  public usuarioId:number = 0;
  public senhaAntiga:string = "";
  public senhaNova:string = "";
}
</script>