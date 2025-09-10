<template> 
    <master-page titulo="kpi"> 

  </master-page>
</template> 

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ListPage from "@/components/shared/ListPage";


@Component 
export default class Kpi extends mixins(Vue, ListPage) {
}
</script>