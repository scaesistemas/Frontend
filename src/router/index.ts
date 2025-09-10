import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/painel/kpi.vue'
import Login from '../views/Login.vue'
Vue.use(VueRouter)
 
const routes = [
  {
    path: '*',
    redirect: '/login'
  }, 
  {
    path: '/',  
    alias: '/financeiro/painel/kpi',  
    name: 'home', 
    component: Home,
    beforeEnter: (to: any, from: any, next: any) => {
   
      if (localStorage.getItem('sessionApp') != null) {
         let exp: any = JSON.parse(atob(localStorage.getItem('sessionApp')!.split('.')[1])).exp;
 
        let expDate = new Date(exp * 1000);
        let today = new Date();
        if (today > expDate) {
          localStorage.clear();
          next('/login');
        } else { 
          next();
        }
      } else {
        next('/login');  
      }
    }
  },   
  {path: '/login',  name: 'login',component: Login},
  

  /* NEGOCIOS */ 
  {path: '/negocios/pessoa',name: 'negociosPessoa',component: () => import('@/views/negocios/pessoa/ListaPessoa.vue')},
  {path: '/negocios/empreendimento',name: 'negociosEmpreendimento',component: () => import('@/views/negocios/empreendimento/ListaEmpreendimento.vue')},
  {path: '/negocios/empresa',name: 'negociosEmpresa',component: () => import('../views/negocios/empresa/ListaEmpresa.vue')},
  {path: '/gestao/contrato',name: 'cadastroContrato',component: () => import('@/views/vendas/contratos/ListaContrato.vue')},
 
    
  /*ADM */
  { path: '/cadastro/assinante', name: 'cadastroAssinante',component: () => import('@/views/administracao/base/ListaAssinante.vue')},
  { path: '/cadastro/usuario',name: 'cadastroUsuario',component: () => import('@/views/administracao/usuario/ListaUsuario.vue')},
  { path: "/login/resetSenha/:token", name: "ResetarSenha", component: () => import("../views/ResetarSenha.vue")},
  { path: "/login/:token",name: "ConfirmaEmail",component: () => import("../views/Login.vue")},

  
] 

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router 