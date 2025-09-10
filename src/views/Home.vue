 <template> 
    <master-page titulo="Dashboard"> 
    <!--Desenvolvendo-->
  </master-page>
</template> 

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ListPage from "@/components/shared/ListPage";


@Component 
export default class DashboardEmpreendimento extends mixins(Vue, ListPage) {
}
</script>
