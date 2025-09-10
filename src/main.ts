import Vue from 'vue'
import App from './App.vue'
import router from './router'
 
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './components/';
import './assets/scripts/custom';
import {mask} from 'vue-the-mask' ;
import GChart from 'vue-google-charts';
import money from 'v-money';
import './assets/scss/main.scss'
import vuetify from './plugins/vuetify';

const sweetAlertOptions = {
  confirmButtonColor: '#F5621D',
  cancelButtonColor: '#a8a7a8',
  backdrop:true
};
 
Vue.use(money, {precision: 4})
Vue.use(GChart)
Vue.directive("mask", mask); 
Vue.use(VueSweetalert2, sweetAlertOptions);

 
Vue.config.productionTip = false
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
