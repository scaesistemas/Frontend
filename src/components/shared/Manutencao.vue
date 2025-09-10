<template>
 
    <div class="d-flex flex-column align-center justify-center" style="; text-align: center;">
        <v-card-title class="mt-4">Painel Em manutenção!</v-card-title>
        <v-card-text>Aguarde enquanto nossa equipe realiza ajustes para uma melhor experiência. Agradecemos sua compreensão.</v-card-text>
        <v-img src="../../assets/images/Computer troubleshooting-amico.png" max-height="500" max-width="500" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ListPage from "@/components/shared/ListPage";
 
@Component
export default class ListaDespesa extends mixins(Vue, ListPage) {
}
</script>

<style scoped>
.custom-icon-field ::v-deep .v-input__icon--append .v-icon {
  color: #E05A1B;
}

.custom-icon-field ::v-deep .v-label {
  color: var(--v-text-base);
}

.titulo {
  font-family: Roboto;
  font-size: 12px;
  font-weight: 700;
  line-height: 18.75px;
}
.tituloTotalApagar{
  font-family: Roboto;
  font-size: 12px;
  font-weight: 700;
  line-height: 18.75px;
}

@media (max-width: 600px) {
  .titulo {
    font-size: 9px;  
    line-height: 16px;  
    margin-left: 5px;
  }

  .tituloTotalApagar{
    font-size: 9px;  
    line-height: 16px;  
    margin-left: 20px;
  }

  .titulovcard{
    font-size: 11px;
  }
}

.valor {
  color: var(--Secondary-secondary-500, #F6631E);
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.horizontal-scroll-container {
  overflow-x: auto;
  white-space: nowrap;
}

.parent-row {
  cursor: pointer;
}

.child-row {
  background-color: #f5f5f5;
}

.pl-4 {
  padding-left: 16px; /* Ajuste para indicar o nível de hierarquia */
}
</style>
 