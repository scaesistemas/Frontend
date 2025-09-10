<template>
  <master-page :titulo="titulo" :subTitulo="subTitulo">
    <v-row>
      <v-col cols="12">
        <v-breadcrumbs :items="breadCrumbLinks" divider="/"></v-breadcrumbs>
      </v-col>
    </v-row>

    <h3>Empreendimentos</h3>
    <br />

    <v-card>
      <v-card-title>
        <v-icon large left></v-icon>
        <span class="title font-weight-light"></span>
        <v-spacer />

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="primary"
              class="mb-2"
              dark
              v-on="on"
              @click="Novo()"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Novo {{ titulo }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="primary"
              class="mb-2"
              dark
              v-on="on"
              @click="Atualizar()"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>Atualizar</span>
        </v-tooltip>
        <slot name="botoes"></slot>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :search="search"
          :headers="headers"
          sort-by="nome"
          :items="lista"
          :options.sync="options"
          :footer-props="{ showFirstLastPage: true }"
          :server-items-length="totalLista"
          :loading="loading"
          class="elevation-0"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-menu offset-y transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined v-bind="attrs" v-on="on" tile color="primary">
                  <v-icon left>mdi-menu-down</v-icon> Ações
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="Gerenciar(item.id)">
                  <v-list-item-title>
                    <v-icon color="primary" size="30px"
                      >mdi-file-document-edit</v-icon
                    >
                    Gerenciar
                  </v-list-item-title>
                </v-list-item>

                <v-divider />
                <v-list-item @click="visualizarMapa(item.id)">
                  <v-list-item-title>
                    <v-icon color="teal" size="25"
                      >mdi mdi-map-marker-radius</v-icon
                    >
                    Mapa Interativo
                  </v-list-item-title>
                </v-list-item>

                <v-divider />
                <v-list-item :disabled="item.id == 1" @click="Excluir(item)">
                  <v-list-item-title>
                    <v-icon color="red" size="25">mdi-delete</v-icon> Excluir
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <template v-slot:[`item.nome`]="{ item }">
            {{ item.nome }}
          </template>

          <template v-slot:[`item.quantidadeUnidade`]="{ item }">
            {{ item.quantidadeUnidade }}
          </template>
        </v-data-table>
      </v-card-text>

      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="50" />
      </v-overlay>
    </v-card>

    <visualizar-mapa-interativo
      v-model="dialogVisualizarMapa"
      :empreendimentoId="emprenedimentoId"
      @fechou="dialogVisualizarMapa = false"
      @salvou="dialogVisualizarMapa = false"
    />
    <novo-empreendimento
      v-model="dialogCadastro"
      :empreendimento="empreendimento"
      @fechou="(dialogCadastro = false), Atualizar()"
      @salvou="Atualizar()"
    />
  </master-page>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ListPage from "@/components/shared/ListPage";
import { Empreendimento, Grupo } from "@/core/models/cadastros";
import { EmpreendimentoService } from "@/core/services/cadastros";

@Component
export default class ListaEmpreendimento extends mixins(Vue, ListPage) {
  service = new EmpreendimentoService();
  item = new Empreendimento();
  empreendimento = new Empreendimento();
  emprenedimentoId: number = 0;

  titulo: string = "Empreendimento";
  subTitulo: string = "Lista dos Empreendimentos para o uso no sistema";

  overlay = false;
  loading = false;
  dialogCadastro = false;
  dialogVisualizarMapa = false;

  options: any = {
    itemsPerPage: 15,
  };

  headers: any[] = [
    { text: "", value: "actions", sortable: false },
    { text: "Nome", value: "nome" },
    { text: "Qtde de unidades", value: "quantidadeUnidade", sortable: false },
  ];

  breadCrumbLinks: any[] = [
    { text: "Home", href: "/financeiro/painel/kpi" },
    {
      text: "Lista de Empreendimentos",
      disabled: true,
      href: "/financeiro/painel/despesas",
    },
  ];

  @Watch("options", { deep: true })
  Atualizar() {
    const { page, itemsPerPage, sortBy, sortDesc, search, columns } =
      this.options;
    this.loading = true;

    this.service
      .Listar(
        page,
        itemsPerPage,
        sortBy,
        sortDesc,
        search,
        columns,
        undefined,
        "",
        "id, nome,quantidadeUnidade",
        "Grupos.Unidades"
      )
      .then(
        (res) => {
          this.lista = res.data.items;
          this.totalLista = res.data.count;
        },
        (err) => {
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status == 403) {
            this.$swal("Aviso", err.response.data.message, "warning");
          } else {
            this.$swal(
              "Aviso",
              err.response.data,
              err.response.status == 400 ? "warning" : "error"
            );
          }
        }
      )
      .finally(() => (this.loading = false));
  }

  Novo() {
    this.empreendimento = new Empreendimento();
    this.dialogCadastro = true;
  }

  Gerenciar(empreendimentoId: number) {
    this.overlay = true;
    this.service
      .ObterPorId(
        empreendimentoId,
        "EmpreendimentosPessoas, Proprietarios, LadosAdicionaisPadroes, Fotos, DocumentosCompartilhados, Grupos.Unidades, MapaInterativo"
      )
      .then(
        (res) => {
          res.data.grupos.sort((a: Grupo, b: Grupo) =>
            a.nome.localeCompare(b.nome)
          );

          res.data.grupos.forEach((grupo: Grupo) => {
            if (grupo.unidades) {
              grupo.unidades.sort((a, b) => a.nome.localeCompare(b.nome));
            }
          });
          this.empreendimento = new Empreendimento(res.data);
          this.dialogCadastro = true;
          this.overlay = false;
        },
        (err) => {
          if (!err.response) {
            this.$swal("Aviso", "Não foi possível acessar a API", "error");
          } else if (err.response.status == 403) {
            this.$swal("Aviso", err.response.data.message, "warning");
          } else {
            this.$swal(
              "Aviso",
              err.response.data,
              err.response.status == 400 ? "warning" : "error"
            );
          }
        }
      );
  }

  visualizarMapa(emprendimentoId: number) {
    this.emprenedimentoId = emprendimentoId;
    this.dialogVisualizarMapa = true;
  }

  //   VisualizarMapaKml(item) {
  //     this.overlay = true;
  //     this.service.ObterPorId(item.id, "Grupos.Unidades").then(
  //       (res) => {
  //         this.item = res.data;
  //         this.dialogVisualizarMapa = true;
  //         this.overlay = false;
  //       },
  //       (err) => {
  //         if (!err.response) {
  //           this.$swal("Aviso", "Não foi possível acessar a API", "error");
  //         } else if (err.response.status == 403) {
  //           this.$swal("Aviso", err.response.data.message, "warning");
  //         } else {
  //           this.$swal(
  //             "Aviso",
  //             err.response.data,
  //             err.response.status == 400 ? "warning" : "error"
  //           );
  //         }
  //       }
  //     );
  //   }
}
</script>
