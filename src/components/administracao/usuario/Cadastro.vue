<template>
  <v-dialog persistent
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    no-click-animation
  >
    <v-card> 
      <v-toolbar dark color="primary"> 
        <v-btn icon dark @click="Close()"><v-icon>mdi-close</v-icon></v-btn>
        <v-toolbar-title>Cadastro do Usuário</v-toolbar-title>
        <v-spacer/>
  
        <v-toolbar-items>
          <v-btn dark text @click="Salvar()">Salvar</v-btn>
        </v-toolbar-items>

        <template v-slot:extension>
          <v-tabs background-color="primary" dark>
            <v-tab>Usuário</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
 
        <v-tabs-items v-model="tabActive">
          <v-form v-model="valid" lazy-validation ref="form">
            <v-tab-item>
              <v-card elevation="3" outlined>
                <v-card-text>              
                  <v-row class="mt-3">
                    <v-card class="ml-3" height="225px"> 
                      <v-col cols="12" md="2">
                        <v-avatar color="grey" size="200" tile>
                          <v-img v-if="item.foto && arquivo" :src="'data:image/gif;base64,' + item.foto"></v-img>
                        </v-avatar>
                      </v-col>
                    </v-card>

                    <v-col sm="9" md="9" lg="9" xl="9">        
                      <v-row dense>
                        <v-col cols="12" md="5">
                          <v-text-field v-model="item.login" outlined label="Login" :rules="fieldRules" :counter="120" maxlength="120" dense></v-text-field>
                        </v-col>

                        <v-col cols="12" md="1">
                          <v-switch color="primary" v-model="item.ativo" outlined label="Ativo"></v-switch>
                        </v-col>
                      </v-row>

                      <v-row dense v-if="item.id === 0">
                        <v-col cols="12" md="5">
                          <v-text-field v-model="item.senha" outlined :rules="[rules.required, rules.min, mensagem]" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'" label="Senha"  hint="Pelo menos 8 caracteres" counter @click:append="show1 = !show1" dense></v-text-field>                      
                        </v-col>
                      </v-row>

                      <v-row dense v-if="item.id === 0">
                        <v-col cols="12" md="5">
                          <v-text-field v-model="password2" outlined :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min, mensagem]" :type="show2 ? 'text' : 'password'" label="Confirmar Senha" counter @click:append="show2 = !show2" dense></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                <div style="width: 220px;">
                  <v-row dense class="mt-2">
                    <v-file-input outlined v-model="arquivo" @change="AdicionarArquivo()" dense small-chips color="primary" accept="image/png, image/jpeg, image/bmp" append-icon="mdi-camera" label="Avatar"></v-file-input>
                  </v-row>
                </div>
              </v-card-text>

              <v-card-text>
                <v-card-title>
                  <v-icon color="primary" size="25" left>mdi-email</v-icon>
                  <span class="title font-weight-light">Contato</span>
                </v-card-title>

                <v-row dense class="px-3">
                  <v-col cols="12" sm="6">
                    <v-text-field label="Nome" dense v-model="item.complementar.nome" :rules="fieldRules" :counter="60" maxlength="60" outlined></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="3">
                    <v-text-field label="Telefone" dense v-model="item.complementar.telefone" v-mask="'(##) ####-####'" outlined></v-text-field>
                  </v-col>
                  
                  <v-col cols="12" sm="3">
                    <v-text-field label="Celular" v-model="item.complementar.celular" dense v-mask="'(##) #####-####'" :rules="fieldRules" outlined></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="Ramal" dense v-model="item.complementar.ramal" outlined></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="Email" :rules="fieldRules" dense v-model="item.complementar.email" outlined></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text> 
            </v-card>
          </v-tab-item>
          
        </v-form>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Usuario } from "@/core/models/cadastros";
import { Contato } from "@/core/models/geral";
import { UsuarioService } from "@/core/services/cadastros";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import * as jsonpatch from 'fast-json-patch';
import { ArquivoService } from "@/core/services/geral/ArquivoService";

@Component
export default class CadastroIndice extends Vue {
  @Prop() public item!: Usuario;
  @Prop() public value!: string;

  service = new UsuarioService();
  observer! : jsonpatch.Observer<Usuario>;

  tabActive = 0;
  arquivo:any = null;
  valid = true;
  dialog = false;
  show1 = false;
  show2 = false;
    
  password2 = "";
  Caracters = /[!|@|#|$|%|^|&|*|(|)|-|_]/;
  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];

  @Watch("item")
  Item() {
    if (this.$refs.form) {
      this.$refs.form.resetValidation();
    }
  }

  @Watch("value")
  Value() {
    this.dialog = this.value ? true : false; 

    if (this.dialog){
      this.observer = jsonpatch.observe(this.item);
    }else {
      jsonpatch.unobserve(this.item, this.observer);
    }
  }

  @Watch("dialog")
  Dialog() {
    if (!this.dialog) {
      this.$emit("fechou");
    }
  }  

  $refs!: {
    form: HTMLFormElement;
  };

  rules = {
    required: (value) => !!value || "Campo obrigatório.",
    min: (v) =>(v.length >= 8 && !!this.Caracters.test(v)) || "Mínimo 8 caracteres incluindo 1 caracter especial",
  };
 
  Salvar() {
    this.$refs.form.validate();

    if (!this.Validacoes()) {
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
      this.arquivo = null; 
    }
  }

 get mensagem(){
      if(this.item.senha != this.password2)
    {
      return  "As senhas não são iguais."
    }
      else
    {
      return ''
    }
  }
  
  Validacoes(){
    if(this.item.id == 0){
      if(!this.item.login || !this.item.senha || !this.password2 || !this.item.complementar.nome || !this.item.complementar.celular || !this.item.complementar.email){
        this.$swal("Aviso", "Campos obrigatórios não preenchidos.", "warning");
        this.tabActive = 0;
        return true;
      }
    }
  }

  Close() {
    this.dialog = false;
    this.password2 = "";
    this.arquivo = null;
  }

  async AdicionarArquivo() {
    let src: string = <string>await new ArquivoService().Ler(this.arquivo);
    this.item.foto = src.replace(/^[^,]*,/, "");
  }
}
</script>