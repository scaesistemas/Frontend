 <template>
  <master-page
    :titulo="titulo"
    :subTitulo="subTitulo"
  >

  <v-card shaped outlined>
    <v-tabs v-model="tabActive" background-color="transparent" color="primary">
      <v-tab>Usuários</v-tab>
      <v-tab>Permissões</v-tab>
      <v-tab>Auditoria & Log (em DEV)</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabActive">  
      <v-tab-item> 
        <vcardusuario></vcardusuario>
      </v-tab-item>

      <v-tab-item>
        <vcardpermissao></vcardpermissao>
      </v-tab-item>

      <v-tab-item>
        <vcardauditoria></vcardauditoria>
      </v-tab-item>
    </v-tabs-items>
  </v-card>

  </master-page>
</template> 

<script lang="ts"> 
import { Vue, Component, Watch } from "vue-property-decorator";
import { mixins } from 'vue-class-component';
import ListPage from '@/components/shared/ListPage';
import { Usuario } from "@/core/models/cadastros";
import { UsuarioService } from "@/core/services/cadastros";
import { PageBase } from "@/core/models/shared";

@Component
export default class ListaUsuario extends mixins(Vue, ListPage, PageBase) {
  item = new Usuario();
  service = new UsuarioService();

  tabActive = 0;
  titulo: string = 'Usuarios';
  subTitulo: string = 'Lista dos cadastros de usuários para uso no sistema';
 
   
  mounted(){ 

  }
}
</script>
 