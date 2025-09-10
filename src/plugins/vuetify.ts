import Vue from "vue";
import Vuetify from "vuetify/lib";
import pt from "vuetify/src/locale/pt";
import VueHtmlToPaper from "vue-html-to-paper";

Vue.use(Vuetify);
Vue.use(VueHtmlToPaper);
import "vuetify/dist/vuetify.min.css";

export default new Vuetify({
  lang: {
    locales: { pt },
    current: "pt",
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#F5621D",
        toolbar: "#F5621D",
        fundo: "#ECECEC",
        colorCampo: "#FFFFFF",
        text: "#212121",
        color_theme_vendas_cancelados: "#FEECEB",
        color_theme_vendas_quitados: "#EDF7EE",
        color_theme_vendas_lotes: "#F2F4F7",
        color_theme_simular_reajuste: "#FADEB6",
        color_theme_simular_carteira: "#e9f5fe",
        color_theme_painel_inadimplencia: "#FEECEB",
        color_theme_money: "#459F49",
        color_theme_greenbackground: "#d4edda",
        color_theme_tables_backgroud: "#ffffff",
        fundao: "#ECECEC",
        divider: "#000000",
        fundo_verde_claro: "#EDF7EE",
      },
      dark: {
        primary: "#F5621D",
        toolbar: "#1E1E1E",
        fundo: "#000000",
        colorCampo: "#1E1E1E",
        text: "#D5D5D5",
        color_theme_vendas_cancelados: "#000000",
        color_theme_vendas_quitados: "#000000",
        color_theme_vendas_lotes: "#000000",
        color_theme_simular_reajuste: "#1E1E1E",
        color_theme_simular_carteira: "#1E1E1E",
        color_theme_money: "#1E1E1E",
        color_theme_greenbackground: "#d4edda",
        color_theme_tables_backgroud: "#1B1B1C",
        fundao: "#000000",
        divider: "#ffffff",
        fundo_verde_claro: "#1E1E1E",
      },
    },
  },
});
