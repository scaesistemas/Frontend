<template>
  <router-view/>
</template>

<script lang="ts">
import Vue from 'vue';
 
export default Vue.extend({
  name: 'App',
   //as
  data: () => ({
     
  }),
  mounted() {
    let isScrolling: number;

    const showScrollbar = () => {
      document.body.classList.add('scrollbar-visible');
    };
    //hide
    const hideScrollbar = () => {
      document.body.classList.remove('scrollbar-visible');
    };
    //hand
    const handleScroll = () => {
      showScrollbar();
      clearTimeout(isScrolling);
      isScrolling = window.setTimeout(hideScrollbar, 1000);
    };

    // Adiciona o evento de scroll
    window.addEventListener('scroll', handleScroll);

    // Remove o evento de scroll quando o componente for destruído
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('scroll', handleScroll);
    });
  },
});
</script>
 