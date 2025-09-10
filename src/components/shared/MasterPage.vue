<template >
  <v-app >
    <v-app-bar  flat extended :src="app.temaEscuro ? require('../../assets/images/fundoMaster/fundoTeste.jpg') : require('../../assets/images/fundoMaster/fundoTeste.jpg')" >
  
      <v-spacer/> 
         <v-menu bottom left offset-x>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on"  icon color="white" @click="toggleSpin">
             <v-icon :class="{ spinning: isSpinning }">mdi-cog-outline</v-icon>
          </v-btn>
        </template>

        <v-list flat>
          <v-list-item @click="Assinante(assinante)" class="tile "> 
           <v-icon left >mdi-account-edit</v-icon> 
            <v-list-item-title>Assinante</v-list-item-title>
          </v-list-item>

          <v-list-item @click="MeusDados()" class="tile">
           <v-icon left >mdi-account-box</v-icon> 
            <v-list-item-title>Meus Dados</v-list-item-title>
          </v-list-item>

          <v-list-item class="tile"  to="/cadastro/usuario">
           <v-icon color="#757575" left>mdi-account-multiple-outline</v-icon> 
            <v-list-item-title>Gestão de Usuários</v-list-item-title>
          </v-list-item>

          <!-- <v-list-item @click="toggleFull()" class="tile">  
            <v-icon left>{{ isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
            <v-list-item-title>{{ isFullScreen ? 'Minimizar' : 'Maximizar' }}</v-list-item-title>
          </v-list-item> -->

          <v-list-item @click="MudarTema()" class="tile">
            <v-icon left >mdi-invert-colors</v-icon>
            <v-list-item-title>Alterar tema</v-list-item-title>
          </v-list-item>

         <v-list-item @click="AbrirWhatsApp()" class="tile">
            <v-icon left>mdi-help-circle</v-icon> 
            <v-list-item-title>Suporte</v-list-item-title> 
         </v-list-item>
        </v-list> 
      </v-menu> 

       <v-btn @click="Logout()" text small color="white" class="mx-3">
        <v-icon class="mr-1" >mdi-logout</v-icon> Sair
      </v-btn>
    </v-app-bar> 
 <LinksDashboard  class="ml-12 hidden-sm-and-down" ></LinksDashboard>


    <v-navigation-drawer v-click-outside="closeDrawerOnOutsideClick" v-model="drawer" app permanent expand-on-hover  >
   <router-link :to="{ path: '/financeiro/painel/kpi' }">
    <img :src="app.temaEscuro ? require('../../assets/images/logoSCAE3-SVG.svg') : require('../../assets/images/logo.png')" style="height:30px; width:100px" class="ml-16 mt-8 mb-2" />
  </router-link>
        <v-list-item>
          <v-list-item-avatar style=" margin-left:-5px">
            <img v-if="app.usuarioFoto" :src="`data:image/gif;base64,${app.usuarioFoto}`"/>
            <v-icon v-else>mdi-account</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ app.usuarioNome }}</v-list-item-title>
            <v-list-item-subtitle>{{ app.email }}</v-list-item-subtitle>
          </v-list-item-content>
      
        </v-list-item>

      

      <v-divider></v-divider>

      <v-list dense>

        <v-list-item @click="handleClick('DashboardDrawer')" link>
          <v-list-item-icon v-if="DashboardDrawer">
            <v-icon color="#E05A1B">mdi-chart-bar</v-icon>
          </v-list-item-icon>
          
          <v-list-item-icon v-else>
            <v-icon >mdi-chart-bar</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Dashboards</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-icon>
        </v-list-item>

         <v-list-item @click="handleClick('NegociosDrawer')" link>
          <v-list-item-icon v-if="NegociosDrawer">
            <v-icon color="#E05A1B">mdi-grid</v-icon>
          </v-list-item-icon>

           <v-list-item-icon v-else>
            <v-icon>mdi-grid</v-icon>
          </v-list-item-icon>
          
          <v-list-item-content>
            <v-list-item-title>Negócios</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-icon>
        </v-list-item>

         <v-list-item @click="handleClick('VendasDrawer')" link>
          <v-list-item-icon v-if="VendasDrawer">
            <v-icon color="#E05A1B"> mdi-file-sign</v-icon>
          </v-list-item-icon>

            <v-list-item-icon>
            <v-icon> mdi-file-sign</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Vendas</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item @click="handleClick('FinanceiroDrawer')" link>
          <v-list-item-icon v-if="FinanceiroDrawer">
            <v-icon color="#E05A1B">mdi-finance</v-icon>
          </v-list-item-icon>

            <v-list-item-icon>
            <v-icon>mdi-finance</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Financeiro</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-icon>
        </v-list-item>
        
      </v-list>

      <template v-slot:append>
        <div class="pa-2" >
          <v-btn block @click="Logout()" class="no-hover" text color="error" style=" margin-left:-5px" >
          <v-icon class="mr-3" >mdi-logout</v-icon> SAIR
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
    
  <transition name="drawer-transition">
    <v-navigation-drawer v-if="DashboardDrawer" class="sub-drawer" app permanent v-model="drawer">
      <v-list dense width="256">
        <router-link :to="{ path: '/financeiro/painel/kpi' }">
          <v-img :src="app.temaEscuro ? require('../../assets/images/logoSCAE3-SVG.svg') : require('../../assets/images/logo.png')" max-width="100" class="ml-2 mt-6 mb-12" />
        </router-link>
          <v-btn icon @click.stop="resetDrawers()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="mx-4 mt-10" style="font-size:20px; font-weight:500; color:#f98038">DASHBOARD</span>
        
        <v-list-item to="/financeiro/painel/kpi">
          <v-list-item-content>
            <v-list-item-title>KPIs</v-list-item-title>
          </v-list-item-content>
        </v-list-item>            
      </v-list>
    </v-navigation-drawer>
  </transition>



     <transition name="drawer-transition">
     <v-navigation-drawer v-if="NegociosDrawer  " class="sub-drawer"  app permanent  v-model="drawer">
      <v-list dense width="256">
          <router-link :to="{ path: '/financeiro/painel/kpi' }">
          <v-img :src="app.temaEscuro ? require('../../assets/images/logoSCAE3-SVG.svg') : require('../../assets/images/logo.png')" max-width="100" class="ml-2 mt-6 mb-12" />
        </router-link>
         <v-btn icon @click.stop="resetDrawers()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="mx-4 " style="font-size:20px; font-weight:500; color:#f98038">NEGÓCIOS</span>
        
          <v-list-item to="/negocios/pessoa">
            <v-list-item-content>
              <v-list-item-title>Pessoas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          
           <v-list-item to="/negocios/empresa">
            <v-list-item-content>
              <v-list-item-title>Empresas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
 
 
          <v-list-item to="/negocios/empreendimento">
            <v-list-item-content>
              <v-list-item-title>Empreendimentos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
       </v-list>
      </v-navigation-drawer> 
     </transition>




     <transition name="drawer-transition">
     <v-navigation-drawer v-if="VendasDrawer  " class="sub-drawer"  app permanent  v-model="drawer">
      <v-list dense width="256" >
           <router-link :to="{ path: '/financeiro/painel/kpi' }">
          <v-img :src="app.temaEscuro ? require('../../assets/images/logoSCAE3-SVG.svg') : require('../../assets/images/logo.png')" max-width="100" class="ml-2 mt-6 mb-12" />
        </router-link>
         <v-btn icon @click.stop="resetDrawers()" >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="mx-4 " style="font-size:20px; font-weight:500; color:#f98038">VENDAS</span>
        
          <v-list-item to="/gestao/contrato">
            <v-list-item-content>
              <v-list-item-title>Contratos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
      </v-list>
    </v-navigation-drawer> 
    </transition>

    <transition name="drawer-transition">
    <v-navigation-drawer v-if="VendasDrawer  " class="sub-drawer"  app permanent  v-model="drawer">
    <v-list dense width="256" >
          <router-link :to="{ path: '/financeiro/painel/kpi' }">
        <v-img :src="app.temaEscuro ? require('../../assets/images/logoSCAE3-SVG.svg') : require('../../assets/images/logo.png')" max-width="100" class="ml-2 mt-6 mb-12" />
      </router-link>
        <v-btn icon @click.stop="resetDrawers()" >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <span class="mx-4 " style="font-size:20px; font-weight:500; color:#f98038">VENDAS</span>
      
        <v-list-item to="/gestao/contrato">
          <v-list-item-content>
            <v-list-item-title>Contratos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
    </v-list>
  </v-navigation-drawer> 
    </transition>

    <transition name="drawer-transition">
     <v-navigation-drawer v-if="FinanceiroDrawer  " class="sub-drawer"  app permanent  v-model="drawer">
      <v-list dense width="256">
           <router-link :to="{ path: '/financeiro/painel/kpi' }">
          <v-img :src="app.temaEscuro ? require('../../assets/images/logoSCAE3-SVG.svg') : require('../../assets/images/logo.png')" max-width="100" class="ml-2 mt-6 mb-12" />
        </router-link>
         <v-btn icon @click.stop="resetDrawers()" >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="mx-4 " style="font-size:20px; font-weight:500; color:#f98038">FINANCEIRO</span>
        
         <v-list-item to="/financeiro/receita">
            <v-list-item-content>
              <v-list-item-title>Receitas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>            
       </v-list>
     </v-navigation-drawer> 
    </transition>

 
  
    <v-flex>
      <v-sheet class="fundao col-12 appCard pb-3"  min-height="800px">
          <slot name="header">
            <div class="d-flex align-center justify-start appCard__header mb-3"></div>
            <br />
          </slot>
          <v-flex class="pl-3 pr-3 pb-3 container-scroll ml-12">
            <slot></slot>
          </v-flex>
        </v-sheet>
    </v-flex>
   
    <v-footer padless color="fundo">
      <v-col class="text-center" cols="12">
        <strong>® SCAE</strong> — {{ new Date().getFullYear() }}
      </v-col>
    </v-footer>

    <meus-dados v-model="dialogCadastro" :item="item" @fechou="dialogCadastro = false"></meus-dados>
    <dados-assinante v-model="dialogCadastroAssinante" :assinante="assinante" @fechou="dialogCadastroAssinante = false"> </dados-assinante>
  </v-app>
</template>

<script lang="ts">
import { Assinante, Permissao, Usuario } from "@/core/models/cadastros";
import { PageBase } from "@/core/models/shared";
import { AssinanteService, UsuarioService } from "@/core/services/cadastros";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { defineComponent, computed } from 'vue';

@Component
export default class MasterPage extends PageBase {
  @Prop() private titulo!: string;
  @Prop() private subTitulo!: string;


  item = new Usuario();
  service = new UsuarioService();
  assinante = new Assinante();
   
  dialogCadastro: boolean = false; 
  dialogCadastroAssinante:boolean = false;
  drawer: boolean = false;
   isFullScreen: boolean = false

mini: boolean = true

      DashboardDrawer= false
      NegociosDrawer= false
      VendasDrawer= false
      FinanceiroDrawer= false
      SuprimentosDrawer= false
      ProjetosDrawer= false
      AguasDrawer= false
      AdmDrawer= false
      LayoutDevDrawer= false
      isSpinning = false
      SplitDrawer = false;

      toggleSpin(){
        this.isSpinning = !this.isSpinning

         setTimeout(() => {
        this.isSpinning = false;
      }, 500); 
    }
      


     
    resetDrawers() {
      this.DashboardDrawer = false;
      this.NegociosDrawer = false;
      this.VendasDrawer = false;
      this.FinanceiroDrawer = false;
      this.SuprimentosDrawer = false;
      this.ProjetosDrawer = false;
      this.AguasDrawer = false;
      this.AdmDrawer = false;
      this.LayoutDevDrawer = false;
      this.SplitDrawer = false;
    }

    
    resetAndToggle(drawer: string) {
      const currentValue = this[drawer];
      this.resetDrawers();
      this[drawer] = !currentValue;
    }



      handleClick(drawer: string) {
      setTimeout(() => {
        this.resetAndToggle(drawer);
      }, 0);
    }
  





 toggleFull() {
      let elem = document.documentElement;

      if (!document.fullscreenElement) {
        elem.requestFullscreen()
          .then(() => {
            this.isFullScreen = true;
          })
          .catch((err) => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
          });
      } else {
        document.exitFullscreen()
          .then(() => {
            this.isFullScreen = false;
          });
      }
    }
  
  Assinante(){   
    let serviceAssinante = new AssinanteService();
      serviceAssinante.ObterPorId(this.app.assinanteId, 'Dominios, Contatos').then(
        res => {
        this.assinante = new Assinante(res.data);
        //this.assinante.responsavel.dataNascimento = new Date(`${res.data.responsavel.dataNascimento}`).yyyymmdd()
        this.dialogCadastroAssinante = true
    }) 
  }

  MeusDados(){
    this.service.getUsuario(this.app.usuarioId).then(
      res => { 
        this.item = res.data;
        this.item.foto = this.app.usuarioFoto;
        this.dialogCadastro = true;
      })
  }
  
  MudarTema(){
    const usuarioService = new UsuarioService();
      usuarioService.MudarTema(this.app.usuarioId).then(
        res => super.MudarTema(res.data),
        err => this.$swal('Aviso', err.message, 'error')
      );
  };

  AbrirWhatsApp(){                  
    window.open(`https://api.whatsapp.com/send?phone=5521995343298`);         
  }

  Logout() {
    localStorage.clear();
    this.$vuetify.theme.dark = false;
    this.$router.push({ name: "login" });
  }

  permissao =   Permissao; 

  opcoesMenu = [
    { title: 'Meu espaço', icon: 'mdi-home', linkPath:'/home', condicao:true,lista:[] },
    { title: 'Dashboards', icon: 'mdi-chart-bar',linkPath: '/relatorio/financeiro/kpi', condicao:this.app.permissoes.some(x => (x == this.permissao.Modulos_Modulo_KPI) || (x == this.permissao.master) || (x == this.permissao.administrador)) || this.app.permissoes.some(x => (x == this.permissao.Modulos_Modulo_Contrato) || (x == this.permissao.master) || (x == this.permissao.administrador)) || this.app.permissoes.some(x => (x == this.permissao.Modulos_Modulo_Financeiro) || (x == this.permissao.master) || (x == this.permissao.administrador)), lista:[]},
    { title: 'Negócios', icon: 'mdi-grid',linkPath: '', condicao: this.app.permissoes.some(x => (x == this.permissao.Modulos_Modulo_Negocio) || (x == this.permissao.master) || (x == this.permissao.administrador)), 
      lista:[
        {title: 'Empresas',linkPath: '/gerencial/empresa'}, {title: 'Pessoas',linkPath: '/cadastro/pessoa'},{title: 'Empreendimento',linkPath: '/cadastro/empreendimento'}, {title: 'Cartórios',linkPath: '/cadastro/cartorio'}
      ]
    },
  ]

  mounted() {
    this.$vuetify.theme.dark = this.app.temaEscuro;
  }

  closeDrawerOnOutsideClick(event) {
    // Check if the click was inside a v-list-group or its children
    const clickedElement = event.target;
    const isInsideListGroup = clickedElement.closest('.v-list-group') || 
                              clickedElement.closest('.v-list-group__items') ||
                              clickedElement.closest('.v-list-item');
    
    // Only close if any drawer is currently open and click was not inside a list group
    if (!isInsideListGroup && (this.DashboardDrawer || this.NegociosDrawer || this.VendasDrawer || 
        this.FinanceiroDrawer || this.SuprimentosDrawer || this.ProjetosDrawer || 
        this.AguasDrawer || this.AdmDrawer || this.SplitDrawer)) {
      this.resetDrawers();
    }
  }
}
</script>  

<style scoped lang="css">

.spinning {
  animation: spin 0.5s infinite linear;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.itemExcluido{
  text-decoration: line-through;
  text-decoration: red;
} 
.appCard__subTitle {
  font-size: 13px !important;
}
.appCard {
  overflow: hidden;
  border-radius: 8px;
}
.appCard__header {
  text-align: start;
}
.theme--light.v-sheet {
  background: #ffffff;
}
.appCard__avatar {
  max-width: 60px;
}
.theme--dark.v-sheet {
  background: #1E1E1E;
}
.theme--dark.v-navigation-drawer {
  background: #1E1E1E;
}
.appCard__title {
  font-size: 20px;
}

.appCard__subTitle {
  text-align: justify;
  word-wrap: break-word;
  margin-right: 15px;
  display: block;
}

@media (max-width: 960px) {
  .appCard__avatar {
    display: none !important;
  }
}

 .tile {
    margin: 5px;
    border-radius: 25px;
  }
  .tile:hover {
    background: #E05A1B
  }
  .tile:active {
       
    background: #FFD54F;
  } 


.sub-drawer {
   
  left: 56px; /* Ajuste conforme necessário para alinhar com o primeiro drawer */

}


.drawer-transition-enter-active, .drawer-transition-leave-active {
  transition: width 0.4s;
}

.drawer-transition-enter, .drawer-transition-leave-to /* .drawer-transition-leave-active em versões anteriores ao Vue 2.1.8 */ {
  width: 0 !important;
}
</style>
