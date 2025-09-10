<template>
  <v-app id="inspire" >
    <div class="layout" >  
      <v-img src="../assets/images/logo-white.png" :width="150" cover class="top-left-image"/>
        <div class="login">
        <div style="width: Hug (279px)px; height: Hug (144px)px; gap: 16px; opacity: 0px">
           <div style="height:60px" v-if="!imgUrl"></div> 
          <v-content class="subtitle-2 mb-2" style="font-family: Roboto; font-size: 14px; font-weight: 400; line-height: 16.41px; text-align: center"> 
            Seja bem-vindo(a) ao
          </v-content>

          <div style="font-family: Roboto; font-size: 14px; font-weight: 700; line-height: 16.41px; text-align: center">SISTEMA PARA GESTÃO DE LOTEAMENTOS</div>

          <div class="pt-6 justify-center align-center">
            <center>  
              <v-img v-if="imgUrl" :src="`data:image/jpeg;base64,${imgUrl}`" class="mb-8" max-height="100" max-width="150" contain/>
            </center>
          </div>
        </div>
 
        <div v-if="!resetarSenha">
          <v-form @submit.prevent="Login()">
             <div class="px-2">
              <v-text-field solo label="Usuário" v-model="acesso.login" append-icon="mdi-account-circle-outline"></v-text-field>
              <v-text-field solo label="Senha" :append-icon="esconderSenha ? 'mdi-eye-off' : 'mdi-eye'" v-model="acesso.senha" @click:append="() => esconderSenha = !esconderSenha" :type="esconderSenha ? 'password' : 'text'"></v-text-field>
             </div>

            <v-card-actions>
                <v-spacer/>
                <v-btn dark type="submit" color="#676668" width="30%" :loading="loading">ENTRAR</v-btn>
              </v-card-actions>
            </v-form>

            <div class="mt-6" style="display: flex; justify-content: center; align-items: center;" >                
              <a style="text-decoration: underline; color:#414042 " @click="ResetarSenha(false)">Esqueceu sua senha?</a> 
            </div>
          </div>

            <div v-else-if="resetarSenha">
              <v-form @submit.prevent="ResetarSenha(true)">
                <v-card-text>
                  <v-text-field solo label="Login" prepend-icon="mdi-account" v-model="resetarModel.login" />
                </v-card-text>
                
                <v-card-actions class="px-6">
                  <v-btn text color="secondary" :loading="loading" @click="resetarSenha = false">Voltar</v-btn>
                    <v-spacer/>
                  <v-btn  type="submit" color="primary"  :loading="loading">Redefinir</v-btn>
                </v-card-actions>
              </v-form>
            </div>
        </div>

      <div class="important-links " >
        <a href="https://scae.adm.br/" target="_blank">  <v-icon>mdi-web</v-icon> Site</a>
        <a href="https://web.facebook.com/scae.adm?_rdc=1&_rdr" target="_blank"> <v-icon>mdi-facebook</v-icon> Facebook</a>
        <a href="https://www.instagram.com/scae.adm/" target="_blank"> <v-icon>mdi-instagram</v-icon> Instagram</a>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
 import { PessoaService } from "@/core/services/cadastros";
import { AutenticadorService } from "@/core/services/geral/AutenticadorService";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  public loading: boolean = false;
  private esconderSenha: boolean = true;
  imgUrl:any = null;

  acesso: { login: string; senha: string } = {
    login: "",
    senha: ""
  };

  fieldRules: any[] = [(v: any) => !!v || "Campo obrigatório"];
  service = new AutenticadorService();
  pessoaService = new PessoaService();
  token: string = '';
  resetarSenha: boolean = false;
 
  resetarModel: any = {
    login: "",
    senhaNova: "",
    token: ""
  }

  cpfCnpj: string = '';
 

  mounted(){
    this.token = this.$route.params.token;
    this.service.ObterImagemEmpresa().then(
      (res) => {
        this.imgUrl = res.data;
      }
    )
  }

  @Watch('token')
  WatchToken(){

    if(!this.token)
      return;

    this.service.ConfirmarEmail(this.token).then(
      res =>{
        this.$swal('Aviso', res.data, res.status == 200 ? 'success' : 'warning');
      },
      err =>{
        this.$swal('Aviso', err.response.data, err.response.status === 400 ? 'warning' : 'error')
      }
    )
  }

  Login() {
    this.loading = true;

    this.service.AutenticarUsuario(this.acesso).then(
      res => {
        localStorage.setItem('sessionApp', JSON.stringify(res.data));                  
        this.$router.push({ name: 'home' });
      }, 
      err => {
        localStorage.clear();
        this.$swal('Aviso', err.response.data, err.response.status === 400 ? 'warning' : 'error')
      }
    ).finally(() => {
      this.loading = false;
    });
  }

  ResetarSenha(executar: boolean){
    if(executar){
      this.loading = true;
      this.service.ResetarSenha(this.resetarModel).then(
        res => {
          this.$swal('Aviso', res.data, res.status == 200 ? 'success' : 'warning');
          setTimeout(() => {
            location.reload();
          }, 2500);
        },
        err => {
          this.$swal('Aviso', err.response.data, err.response.status === 400 ? 'warning' : 'error');
        }
      ).finally(() => {
        this.loading = false;
      })
    }
    else{
      this.resetarSenha = true;
    }
  }
}
</script>

<style scoped lang="css">
.login {
  width: 462px;
  height: 560px;
  padding: 48px 64px;
  border-radius: 16px;
  opacity: 1;
  background: linear-gradient(180deg, #ffffff 23.22%, rgba(255, 255, 255, 0.29) 100%);
}

.layout {
  top: 1px;
  gap: 10px;
  background-image: url('../assets/images/FundoLogin/loginproject-03.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  
  display: flex;
  justify-content: center;
  align-items: center;
}

.important-links {
  position: absolute;
  bottom: 10px; /* Espaçamento inferior */
  right: 10px; /* Espaçamento direito */
  text-align: right;
  display: flex;
  flex-direction: column;
}

.important-links a {
  color: white;
  text-decoration: none;
  margin-bottom: 10px;
  font-size: 18px; /* Aumenta o tamanho da fonte */
  font-weight: 600; /* Aumenta a densidade da fonte */
  display: flex;
  align-items: center; /* Centraliza o ícone com o texto */
}

.important-links a:hover {
  text-decoration: underline; /* Efeito de sublinhado ao passar o mouse */
}
.top-left-image {
  position: absolute;
  top: 15px;
  left: 15px;
}
.logo-cliente{
   width:100px; 
   height:100px;
   
}

/* Consultas de mídia para tornar o layout responsivo */
@media (max-width: 768px) {
  .login {
    width: 100%;
    height: auto;
    padding: 32px 16px;
    gap: 16px;
  }

  .layout {
    padding: 80px 16px;
  }

  .v-btn {
    width: 100%; /* Botões ocupam a largura completa em telas menores */
  }
  .important-links{
    position: absolute;
  bottom: 10px; /* Espaçamento inferior */
  right: 40px; /* Espaçamento direito */
    flex-direction: row;
    gap: 15px;
    text-align: center;
  }
}
</style>