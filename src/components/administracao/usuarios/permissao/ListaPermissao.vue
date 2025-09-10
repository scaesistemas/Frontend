<template>
  <v-card elevation="1">
    <v-card-text>
        <v-toolbar flat color="primary" dark>
    <v-toolbar-title>Gerenciar Permissões</v-toolbar-title>
    <v-spacer />
    <v-btn  text dark @click="Salvar()">
      <v-icon left>mdi-content-save</v-icon> Salvar
    </v-btn>
  </v-toolbar>

  <v-card-text> 
    <v-row dense>
      <!-- Usuário --> 
      <v-col cols="12" md="4">
        <v-autocomplete
          v-model="item.id"
          :items="usuarios"
          item-text="login"
          item-value="id"
          label="Selecione o Usuário"
          outlined
          dense
          clearable
          @change="getUsuario()"
        />
      </v-col>

      <!-- Permissão -->
      <v-col cols="12" md="2">
        <v-select  
          v-model="filterId"
          :items="modulos"
          item-text="nome"
          item-value="id"
          label="Módulo"
          outlined
          dense
          clearable
          :menu-props="{ offsetY: true, offsetOverflow: true }"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <!-- Permissões Globais -->
    <v-row dense>
      <v-col cols="12" md="2">
        <v-checkbox
          v-model="item.permissoes"
          :value="permissao.administrador"
          label="Administrador"
          color="primary"
          dense
        />
      </v-col>

      <v-col cols="12" md="2">
        <v-checkbox
          v-model="item.permissoes"
          :value="permissao.gerente"
          label="Gerente Corretor"
          color="primary"
          dense
        />
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <!-- Permissões por Módulo -->
    <v-row dense>
      <v-col
        v-for="modulo in modulos"
        :key="modulo.id"
        cols="12"
        md="2"
        v-show="filterId == modulo.id"
      >
        <v-btn
          small
          outlined
          color="primary"
          @click="selectAll(modulo.id)"
        >
          <v-icon left>mdi-select</v-icon>
          Selecionar {{ modulo.nome }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</v-card-text>
 
    <div v-show="filterId == 1">
    <v-card-text>
        <v-simple-table dense fixed-header>
        <thead class="grey lighten-3">
            <tr>
            <th>Permissão</th>
            <th  >Visualizar</th>
            <th  >Cadastrar</th>
            <th  >Alterar</th>
            <th  >Excluir</th>
            </tr>
        </thead>

        <tbody>
            <!-- Almoxarifado -->
            <tr>
            <td>Almoxarifado</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Almoxarifado_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Almoxarifado_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Almoxarifado_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Almoxarifado_Excluir" hide-details></v-checkbox></td>
            </tr>

            <!-- Grupo de Produto -->
            <tr>
            <td>Grupo de Produto</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_GrupoProduto_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_GrupoProduto_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_GrupoProduto_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_GrupoProduto_Excluir" hide-details></v-checkbox></td>
            </tr>

            <!-- Inventário -->
            <tr>
            <td>Inventário</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Inventario_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Inventario_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Inventario_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Inventario_Excluir" hide-details></v-checkbox></td>
            </tr>

            <!-- Movimentação com Dialog -->
            <tr>
            <td>
                Movimentação
                <v-btn icon small @click="dialogMovimentacao = true" class="ml-2" color="primary">
                <v-icon small>mdi-plus-circle</v-icon>
                </v-btn>
            </td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Movimentacao_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Movimentacao_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Movimentacao_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Movimentacao_Excluir" hide-details></v-checkbox></td>
            </tr>

            <!-- Produto -->
            <tr>
            <td>Produto</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Produto_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Produto_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Produto_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Produto_Excluir" hide-details></v-checkbox></td>
            </tr>

            <!-- Requisição -->
            <tr>
            <td>Requisição</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Requisicao_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Requisicao_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Requisicao_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_Requisicao_Excluir" hide-details></v-checkbox></td>
            </tr>

            <!-- Unidade de Medida -->
            <tr>
            <td>Unidade de Medida</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_UnidadeMedida_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_UnidadeMedida_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_UnidadeMedida_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_UnidadeMedida_Excluir" hide-details></v-checkbox></td>
            </tr>

            <!-- Tipo de Movimentação -->
            <tr>
            <td>Tipo de Movimentação</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_TipoMovimentacao_Listar" hide-details></v-checkbox></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            </tr>

            <!-- Tipo de Produto -->
            <tr>
            <td>Tipo de Produto</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Almoxarifado_TipoProduto_Listar" hide-details></v-checkbox></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            </tr>
        </tbody>
        </v-simple-table>
    </v-card-text>

    <!-- Dialog de Permissões Adicionais Movimentação -->
    <v-dialog v-model="dialogMovimentacao" max-width="400">
        <v-card>
        <v-card-title class="headline">Permissões Adicionais</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-checkbox label="Transferir" v-model="item.permissoes" :value="permissao.Almoxarifado_Movimentacao_Transferir" color="primary"></v-checkbox>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogMovimentacao = false">Fechar</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
    </div>

    <div v-show="filterId == 2">
        <v-card-text>
        <v-simple-table dense fixed-header>
          <thead class="grey lighten-3">
            <tr>
              <th>Permissão</th>
              <th>Visualizar</th>
              <th>Cadastrar</th>
              <th>Alterar</th>
              <th>Excluir</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Base</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Base_Assinante_Listar" hide-details></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Base_Assinante_Cadastrar" hide-details></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Base_Assinante_Alterar" hide-details></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Base_Assinante_Excluir" hide-details></v-checkbox></td>
            </tr>
          </tbody>
        </v-simple-table>
        </v-card-text>
    </div>

    <div v-show="filterId == 3">
    <v-card-text>
        <v-simple-table dense fixed-header>
        <thead class="grey lighten-3">
            <tr>
            <th>Permissão</th>
            <th>Visualizar</th>
            <th>Cadastrar</th>
            <th>Alterar</th>
            <th>Excluir</th>
            </tr>
        </thead>

        <tbody>
            <!-- Contrato -->
            <tr>
            <td>
                Contrato
                <v-btn icon small class="ml-2" @click="dialogContrato = true" color="primary">
                <v-icon small>mdi-plus-circle</v-icon>
                </v-btn>
            </td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Clientes_Contrato_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Clientes_Contrato_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Clientes_Contrato_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Clientes_Contrato_Excluir" hide-details></v-checkbox></td>
            </tr>

            <!-- Tipo de Contrato -->
            <tr>
            <td>Tipo de Contrato</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Clientes_TipoContrato_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Clientes_TipoContrato_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Clientes_TipoContrato_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Clientes_TipoContrato_Excluir" hide-details></v-checkbox></td>
            </tr>

            <!-- Tipos com só visualizar -->
            <tr>
            <td>Tipo Operação de Contrato</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Clientes_TipoOperacaoContrato_Listar" hide-details></v-checkbox></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            </tr>

            <tr>
            <td>Tipo de Produto</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Clientes_TipoProdutoContrato_Listar" hide-details></v-checkbox></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            </tr>

            <tr>
            <td>Tipos de Aditamentos</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Clientes_TipoAditamentoContrato_Listar" hide-details></v-checkbox></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            </tr>
        </tbody>
        </v-simple-table>
    </v-card-text>

    <!-- Dialog Contrato -->
    <v-dialog v-model="dialogContrato" max-width="400">
        <v-card>
        <v-card-title class="headline">Permissões Adicionais</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-checkbox label="Aditar contrato" v-model="item.permissoes" :value="permissao.Clientes_Contrato_Aditar" color="primary"></v-checkbox>
            <v-checkbox label="Reverter aditamento" v-model="item.permissoes" :value="permissao.Clientes_Contrato_ReverterAditamento" color="primary"></v-checkbox>
            <v-checkbox label="Cancelar contrato" v-model="item.permissoes" :value="permissao.Clientes_Contrato_Cancelar" color="primary"></v-checkbox>
            <v-checkbox label="Atualizar instruções do contrato" v-model="item.permissoes" :value="permissao.Clientes_Contrato_AtualizarInstrucao" color="primary"></v-checkbox>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogContrato = false">Fechar</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
    </div>

    <div v-show="filterId == 4">
    <v-card-text>
        <v-simple-table dense fixed-header>
        <thead class="grey lighten-3">
            <tr>
            <th>Permissão</th>
            <th>Visualizar</th>
            <th>Cadastrar</th>
            <th>Alterar</th>
            <th>Excluir</th>
            </tr>
        </thead>

        <tbody>
            <!-- Compras -->
            <tr>
            <td>
                Compras
                <v-btn icon small class="ml-2" @click="dialogCompras = true" color="primary">
                <v-icon small>mdi-plus-circle</v-icon>
                </v-btn>
            </td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_Orcamento_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_Orcamento_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_Orcamento_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_Orcamento_Excluir" hide-details></v-checkbox></td>
            </tr>

            <!-- Pedido -->
            <tr>
            <td>
                Pedido
                <v-btn icon small class="ml-2" @click="dialogPedido = true" color="primary">
                <v-icon small>mdi-plus-circle</v-icon>
                </v-btn>
            </td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_Pedido_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_Pedido_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_Pedido_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_Pedido_Excluir" hide-details></v-checkbox></td>
            </tr>

            <!-- Parâmetro -->
            <tr>
            <td>Parâmetro</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_Parametro_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_Parametro_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_Parametro_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_Parametro_Excluir" hide-details></v-checkbox></td>
            </tr>

            <!-- Situação Orcamento -->
            <tr>
            <td>Situação do Orçamento</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_SituacaoOrcamento_Listar" hide-details></v-checkbox></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            </tr>

            <!-- Situação Pedido Item -->
            <tr>
            <td>Situação do Pedido Item</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Compras_SituacaoPedidoItem_Listar" hide-details></v-checkbox></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
            </tr>
        </tbody>
        </v-simple-table>
    </v-card-text>

    <!-- Dialog Compras -->
    <v-dialog v-model="dialogCompras" max-width="400">
        <v-card>
        <v-card-title class="headline">Permissões Adicionais</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-checkbox label="Cancelar orçamento" v-model="item.permissoes" :value="permissao.Compras_Orcamento_Cancelar" color="primary"></v-checkbox>
            <v-checkbox label="Aprovar orçamento" v-model="item.permissoes" :value="permissao.Compras_Orcamento_Aprovar" color="primary"></v-checkbox>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogCompras = false">Fechar</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Dialog Pedido -->
    <v-dialog v-model="dialogPedido" max-width="400">
        <v-card>
        <v-card-title class="headline">Permissões Adicionais</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-checkbox label="Receber pedido" v-model="item.permissoes" :value="permissao.Compras_Pedido_Receber" color="primary"></v-checkbox>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialogPedido = false">Fechar</v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
    </div>

    <div v-show="filterId == 5">
        <v-card-text>
            <v-simple-table dense fixed-header>
            <thead class="grey lighten-3">
                <tr>
                <th>Permissão</th>
                <th>Visualizar</th>
                <th>Cadastrar</th>
                <th>Alterar</th>
                <th>Excluir</th>
                </tr>
            </thead>
 
            <tbody>
                <!-- Empreendimento -->
                <tr>
                <td>
                    Empreendimento
                    <!-- <v-btn icon small class="ml-2" @click="dialogEmpreendimento = true" color="primary">
                    <v-icon small>mdi-plus-circle</v-icon>
                    </v-btn> -->
                </td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_Empreendimento_Listar" hide-details></v-checkbox></td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_Empreendimento_Cadastrar" hide-details></v-checkbox></td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_Empreendimento_Alterar" hide-details></v-checkbox></td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_Empreendimento_Excluir" hide-details></v-checkbox></td>
                </tr>

                <!-- Vício -->
                <tr>
                <td>Vício</td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_Vicio_Listar" hide-details></v-checkbox></td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_Vicio_Cadastrar" hide-details></v-checkbox></td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_Vicio_Alterar" hide-details></v-checkbox></td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_Vicio_Excluir" hide-details></v-checkbox></td>
                </tr>

                <!-- Situação da Unidade -->
                <tr>
                <td>Situação da Unidade</td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_SituacaoUnidade_Listar" hide-details></v-checkbox></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                </tr>

                <!-- Tipo de Empreendimento -->
                <tr>
                <td>Tipo de Empreendimento</td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_TipoEmpreendimento_Listar" hide-details></v-checkbox></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                </tr>

                <!-- Tipo de Produto -->
                <tr>
                <td>Tipo de Produto</td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_TipoGrupo_Listar" hide-details></v-checkbox></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                </tr>

                <!-- Tipo de Imóvel -->
                <tr>
                <td>Tipo de Imóvel</td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_TipoImovel_Listar" hide-details></v-checkbox></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                </tr>

                <!-- Tipo de Unidade -->
                <tr>
                <td>Tipo de Unidade</td>
                <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Empreendimento_TipoUnidade_Listar" hide-details></v-checkbox></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                <td><v-icon color="grey lighten-1" small>mdi-close</v-icon></td>
                </tr>
            </tbody>
            </v-simple-table>
        </v-card-text>
    </div>

    <div v-show="filterId == 7">
    <v-card-text>
      <v-simple-table dense fixed-header>
        <thead class="grey lighten-3">
          <tr>
            <th class="text-left">Permissão</th>
            <th class="text-left">Visualizar</th>
            <th class="text-left">Cadastrar</th>
            <th class="text-left">Alterar</th>
            <th class="text-left">Excluir</th>
          </tr>
        </thead>

        <tbody>
          <!-- Cartório -->
          <tr>
            <td>Cartório</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Cartorio_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Cartorio_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Cartorio_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Cartorio_Excluir" hide-details></v-checkbox></td>
          </tr>

          <!-- Empresa com Permissões Adicionais -->
          <tr>
            <td>
              Empresa
              <v-dialog v-model="dialogEmpresa" scrollable max-width="350px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" icon v-on="on" color="primary" small>
                    <v-icon>mdi-plus-circle</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="headline">Permissões adicionais</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-checkbox label="Listar Extrato" v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Empresa_ListarExtrato"></v-checkbox>
                    <v-checkbox label="Listar Saldo da Zoop" v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Empresa_ListarSaldoZoop"></v-checkbox>
                    <v-checkbox label="Transferir saldo da Zoop" v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Empresa_TransferirSaldoZoop"></v-checkbox>
                    <v-checkbox label="Cadastrar documento Zoop" v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Empresa_CadastrarDocumentoZoop"></v-checkbox>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialogEmpresa = false">Fechar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Empresa_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Empresa_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Empresa_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Empresa_Excluir" hide-details></v-checkbox></td>
          </tr>

          <!-- Pessoa -->
          <tr>
            <td>Pessoa</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Pessoa_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Pessoa_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Pessoa_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Pessoa_Excluir" hide-details></v-checkbox></td>
          </tr>

          <!-- Seguradora -->
          <tr>
            <td>Seguradora</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Seguradora_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Seguradora_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Seguradora_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Seguradora_Excluir" hide-details></v-checkbox></td>
          </tr>

          <!-- Tipo de processo judicial -->
          <tr>
            <td>Tipo de processo judicial</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_TipoProcessoJudicial_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_TipoProcessoJudicial_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_TipoProcessoJudicial_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_TipoProcessoJudicial_Excluir" hide-details></v-checkbox></td>
          </tr>

          <!-- Usuário com Permissões Adicionais -->
          <tr>
            <td>
              Usuário
              <v-dialog v-model="dialogUsuario" scrollable max-width="350px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" icon v-on="on" color="primary" small>
                    <v-icon>mdi-plus-circle</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="headline">Permissões adicionais</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-checkbox label="Resetar senha" v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Usuario_ResetarSenha"></v-checkbox>
                    <v-checkbox label="Alterar senha" v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Usuario_AlterarSenha"></v-checkbox>
                    <v-checkbox label="Mudar tema" v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Usuario_MudarTema"></v-checkbox>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialogUsuario = false">Fechar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Usuario_Listar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Usuario_Cadastrar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Usuario_Alterar" hide-details></v-checkbox></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Usuario_Excluir" hide-details></v-checkbox></td>
          </tr>

          <!-- Linhas com apenas Visualizar -->
          <tr v-for="(itemLabel, index) in [
            { label: 'Log', perm: 'Geral_Log' },
            { label: 'Sexo', perm: 'Geral_Sexo' },
            { label: 'Situação do frete', perm: 'Geral_SituacaoFrete' },
            { label: 'Tipo de Origem', perm: 'Geral_TipoOrigem' },
            { label: 'Tipo de Pessoa', perm: 'Geral_TipoPessoa' },
            { label: 'Profissão', perm: 'Geral_Profissao' },
            { label: 'Nacionalidade', perm: 'Geral_Nacionalidade' },
            { label: 'Estado civil', perm: 'Geral_EstadoCivil' },
            { label: 'Endereco', perm: 'Geral_Endereco' }
          ]" :key="index">
            <td>{{ itemLabel.label }}</td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao[`${itemLabel.perm}_Listar`]" hide-details></v-checkbox></td>
            <td><v-icon color="grey">mdi-lock</v-icon></td>
            <td><v-icon color="grey">mdi-lock</v-icon></td>
            <td><v-icon color="grey">mdi-lock</v-icon></td>
          </tr>

          <!-- Usuário (Criar usuário) -->
          <tr>
            <td>Usuário</td>
            <td><v-icon color="grey">mdi-lock</v-icon></td>
            <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Geral_Pessoa_CriarUsuario" hide-details></v-checkbox></td>
            <td><v-icon color="grey">mdi-lock</v-icon></td>
            <td><v-icon color="grey">mdi-lock</v-icon></td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
    </div>

    <div v-show="filterId == 6">
      <v-card-text>
        <v-simple-table dense fixed-header>
          <thead>
            <tr>
              <th class="text-left">Permissão</th>
              <th class="text-left">Visualizar</th>
              <th class="text-left">Cadastrar</th>
              <th class="text-left">Alterar</th>
              <th class="text-left">Excluir</th>
            </tr>
          </thead>

          <tbody>
            <!-- Banco -->
            <tr>
              <td>Banco</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Banco_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Banco_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Banco_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Banco_Excluir"></v-checkbox></td>
            </tr>

            <!-- Centro de Custo -->
            <tr>
              <td>
                <v-dialog v-model="dialogCentroCusto" scrollable max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" icon v-on="on" @click="dialogCentroCusto = true" color="primary">
                      <v-icon dark>mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>Permissões adicionais</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 300px;">
                      <v-checkbox label="Transferência" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_CentroCusto_Transferencia"></v-checkbox>
                    </v-card-text>
                  </v-card>
                </v-dialog>
                Centro de Custo
              </td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_CentroCusto_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_CentroCusto_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_CentroCusto_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_CentroCusto_Excluir"></v-checkbox></td>
            </tr>

            <!-- Categoria -->
            <tr>
              <td>
                <v-dialog v-model="dialogContaGerencial" scrollable max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" icon v-on="on" @click="dialogContaGerencial = true" color="primary">
                      <v-icon dark>mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>Permissões adicionais</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 300px;">
                      <v-checkbox label="Transferência" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ContaGerencial_Transferencia"></v-checkbox>
                    </v-card-text>
                  </v-card>
                </v-dialog>
                Categoria
              </td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ContaGerencial_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ContaGerencial_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ContaGerencial_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ContaGerencial_Excluir"></v-checkbox></td>
            </tr>

            <!-- Conta Corrente -->
            <tr>
              <td>Conta Corrente</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ContaCorrente_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ContaCorrente_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ContaCorrente_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ContaCorrente_Excluir"></v-checkbox></td>
            </tr>

            <!-- Condição de pagamento -->
            <tr>
              <td>Condição de pagamento</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_CondicaoPagamento_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_CondicaoPagamento_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_CondicaoPagamento_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_CondicaoPagamento_Excluir"></v-checkbox></td>
            </tr>

            <!-- Despesa com diálogo -->
            <tr>
              <td>
                <v-dialog v-model="dialogDespesa" scrollable max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" icon v-on="on" @click="dialogDespesa = true" color="primary">
                      <v-icon dark>mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>Permissões adicionais</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 600px;">
                      <v-checkbox label="Listar parcelas" v-model="item.permissoes" :value="permissao.Financeiro_Despesa_ListarParcela" dense color="primary"></v-checkbox>
                      <v-checkbox label="Listar baixas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_ListarBaixa"></v-checkbox>
                      <v-checkbox label="Listar documentos" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_ListarDocumento"></v-checkbox>
                      <v-checkbox label="Excluir documentos" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_ExcluirDocumento"></v-checkbox>
                      <v-checkbox label="Cancelar baixas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_CancelarBaixa"></v-checkbox>
                      <v-checkbox label="Excluir classificações" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_ExcluirClassificacao"></v-checkbox>
                      <v-checkbox label="Baixar parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_BaixarParcela"></v-checkbox>
                      <v-checkbox label="Cancelar parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_CancelarParcela"></v-checkbox>
                      <v-checkbox label="Alterar parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_AlterarParcela"></v-checkbox>
                      <v-checkbox label="Deletar parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_ExcluirParcela"></v-checkbox>
                    </v-card-text>
                  </v-card>
                </v-dialog>
                Despesa
              </td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Despesa_Excluir"></v-checkbox></td>
            </tr>

            <!-- Receita com diálogo -->
            <tr>
              <td>
                <v-dialog v-model="dialogReceita" scrollable max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" icon v-on="on" @click="dialogReceita = true" color="primary">
                      <v-icon dark>mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>Permissões adicionais</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 600px;">
                      <v-checkbox label="Cadastrar parcela" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_CadastrarParcela"></v-checkbox>
                      <v-checkbox label="Cancelar boleto" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_CancelarBoleto"></v-checkbox>
                      <v-checkbox label="Atualizar encargos" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_AtualizarEncargos"></v-checkbox>
                      <v-checkbox label="Alterar parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_VisualizarEncargos"></v-checkbox>
                      <v-checkbox label="Antecipar parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_Antecipar"></v-checkbox>
                      <v-checkbox label="Visualizar antecipação" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_VisualizarAntecipacao"></v-checkbox>
                      <v-checkbox label="Gerar boleto" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_GerarBoleto"></v-checkbox>
                      <v-checkbox label="Agrupar parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_Agrupar"></v-checkbox>
                      <v-checkbox label="Quitar" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_Quitar"></v-checkbox>
                      <v-checkbox label="Visualizar quitação" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_VisualizarQuitacao"></v-checkbox>
                      <v-checkbox label="Gerar comprovante" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_GerarComprovante"></v-checkbox>
                      <v-checkbox label="Visualizar comprovante" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_VisualizarComprovante"></v-checkbox>
                      <v-checkbox label="Reajustar parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_Reajustar"></v-checkbox>
                      <v-checkbox label="Listar Parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_ListarParcela"></v-checkbox>
                      <v-checkbox label="Baixar parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_BaixarParcela"></v-checkbox>
                      <v-checkbox label="Cancelar parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_CancelarParcela"></v-checkbox>
                      <v-checkbox label="Alterar parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_AlterarParcela"></v-checkbox>
                      <v-checkbox label="Deletar parcelas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_ExcluirParcela"></v-checkbox>
                      <v-checkbox label="Excluir classificações" v-model="item.permissoes" :value="permissao.Financeiro_Receita_ExcluirClassificacao" dense color="primary"></v-checkbox>
                      <v-checkbox label="Cancelar baixas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_CancelarBaixa"></v-checkbox>
                      <v-checkbox label="Excluir documentos" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_ExcluirDocumento"></v-checkbox>
                      <v-checkbox label="Listar documentos" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_ListarDocumento"></v-checkbox>
                      <v-checkbox label="Listar baixas" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_ListarBaixa"></v-checkbox>
                      <v-checkbox label="Gerar comprovante de antecipação" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_GerarComprovanteAntecipacao"></v-checkbox>
                      <v-checkbox label="Visualizar comprovante de antecipação" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_VisualizarComprovanteAntecipacao"></v-checkbox>
                      <v-checkbox label="Visualizar simulação de antecipação" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_VisualizarComprovanteSimulacaoAntecipacao"></v-checkbox>
                      <v-checkbox label="Visualizar simulação de quitação" v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_VisualizarComprovanteSimulacaoQuitacao"></v-checkbox>
                    </v-card-text>
                  </v-card>
                </v-dialog>
                Receita
              </td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Receita_Excluir"></v-checkbox></td>
            </tr>

            <!-- Forma de Pagamento -->
            <tr>
              <td>Forma de Pagamento</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_FormaPagamento_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_FormaPagamento_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_FormaPagamento_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_FormaPagamento_Excluir"></v-checkbox></td>
            </tr>

            <!-- Índice -->
            <tr>
              <td>Índice</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Indice_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Indice_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Indice_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Indice_Excluir"></v-checkbox></td>
            </tr>

            <!-- Parâmetro -->
            <tr>
              <td>Parâmetro</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Parametro_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Parametro_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Parametro_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_Parametro_Excluir"></v-checkbox></td>
            </tr>

            <!-- Tipo de Documento -->
            <tr>
              <td>Tipo de Documento</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_TipoDocumento_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_TipoDocumento_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_TipoDocumento_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_TipoDocumento_Excluir"></v-checkbox></td>
            </tr>

            <!-- Tipo de Serviços -->
            <tr>
              <td>Tipo de Serviços</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_TipoServicoParcela_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_TipoServicoParcela_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_TipoServicoParcela_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_TipoServicoParcela_Excluir"></v-checkbox></td>
            </tr>

            <!-- Régua de Cobrança -->
            <tr>
              <td>Régua de Cobrança</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ReguaCobranca_Listar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ReguaCobranca_Cadastrar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ReguaCobranca_Alterar"></v-checkbox></td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_ReguaCobranca_Excluir"></v-checkbox></td>
            </tr>

            <!-- Situação parcela da despesa -->
            <tr>
              <td>Situação parcela da despesa</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_SituacaoDespesaParcela_Listar"></v-checkbox></td>
              <td><v-icon  small>mdi-close</v-icon></td>
              <td><v-icon  small>mdi-close</v-icon></td>
              <td><v-icon  small>mdi-close</v-icon></td>
            </tr>

            <!-- Situação parcela da receita -->
            <tr>
              <td>Situação parcela da receita</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_SituacaoReceitaParcela_Listar"></v-checkbox></td>
              <td><v-icon  small>mdi-close</v-icon></td>
              <td><v-icon  small>mdi-close</v-icon></td>
              <td><v-icon  small>mdi-close</v-icon></td>
            </tr>

            <!-- Tipo de receita -->
            <tr>
              <td>Tipo de receita</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_TipoReceita_Listar"></v-checkbox></td>
              <td><v-icon small>mdi-close</v-icon></td>
              <td><v-icon small>mdi-close</v-icon></td>
              <td><v-icon small>mdi-close</v-icon></td>
            </tr>

            <!-- Tipo de índice -->
            <tr>
              <td>Tipo de índice</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_TipoIndice_Listar"></v-checkbox></td>
              <td><v-icon small>mdi-close</v-icon></td>
              <td><v-icon small>mdi-close</v-icon></td>
              <td><v-icon small>mdi-close</v-icon></td>
            </tr>

            <!-- Tipo Gateway -->
            <tr>
              <td>Tipo Gateway</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_TipoGateway_Listar"></v-checkbox></td>
              <td><v-icon small>mdi-close</v-icon></td>
              <td><v-icon small>mdi-close</v-icon></td>
              <td><v-icon small>mdi-close</v-icon></td>
            </tr>

            <!-- Tipo de Despesa -->
            <tr>
              <td>Tipo de Despesa</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_TipoDespesa_Listar"></v-checkbox></td>
              <td><v-icon small>mdi-close</v-icon></td>
              <td><v-icon small>mdi-close</v-icon></td>
              <td><v-icon small>mdi-close</v-icon></td>
            </tr>

            <!-- Layout de cobrança -->
            <tr>
              <td>Layout de cobrança</td>
              <td><v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Financeiro_LayoutCobranca_Listar"></v-checkbox></td>
              <td><v-icon small>mdi-close</v-icon></td>
              <td><v-icon small>mdi-close</v-icon></td>
              <td><v-icon small>mdi-close</v-icon></td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </div>



    <div v-show="filterId == 8">
      <v-card-text>
        <v-simple-table dense fixed-header>
          <thead class="grey lighten-3">
            <tr>
              <th class="text-left">Permissão</th>
              <th class="text-left">Visualizar</th>
              <th class="text-left">Cadastrar</th>
              <th class="text-left">Alterar</th>
              <th class="text-left">Excluir</th>
            </tr>
          </thead>

          <tbody>
            <!-- Contrato de Fornecedor -->
            <tr>
              <td>Contrato de Fornecedor</td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_ContratoFornecedor_Listar" hide-details></v-checkbox>
              </td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_ContratoFornecedor_Cadastrar" hide-details></v-checkbox>
              </td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_ContratoFornecedor_Alterar" hide-details></v-checkbox>
              </td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_ContratoFornecedor_Excluir" hide-details></v-checkbox>
              </td>
            </tr>

            <!-- Etapa -->
            <tr>
              <td>Etapa</td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_Etapa_Listar" hide-details></v-checkbox>
              </td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_Etapa_Cadastrar" hide-details></v-checkbox>
              </td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_Etapa_Alterar" hide-details></v-checkbox>
              </td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_Etapa_Excluir" hide-details></v-checkbox>
              </td>
            </tr>

            <!-- Medição com botão de mais opções -->
            <tr>
              <td>
                Medição
                <v-dialog v-model="dialogMedicao" scrollable max-width="300px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" icon v-on="on" @click="dialogMedicao = true" color="primary" small>
                      <v-icon>mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="headline">Permissões adicionais</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 200px;">
                      <v-checkbox 
                        label="Gerar Despesa"
                        v-model="item.permissoes"
                        dense 
                        color="primary" 
                        :value="permissao.Projeto_Medicao_GerarDespesa"
                      ></v-checkbox>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dialogMedicao = false">Fechar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </td>

              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_Medicao_Listar" hide-details></v-checkbox>
              </td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_Medicao_Cadastrar" hide-details></v-checkbox>
              </td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_Medicao_Alterar" hide-details></v-checkbox>
              </td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_Medicao_Excluir" hide-details></v-checkbox>
              </td>
            </tr>

            <!-- Orçamento -->
            <tr>
              <td>Orçamento</td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_Orcado_Listar" hide-details></v-checkbox>
              </td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_Orcado_Cadastrar" hide-details></v-checkbox>
              </td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_Orcado_Alterar" hide-details></v-checkbox>
              </td>
              <td class="text-center">
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_Orcado_Excluir" hide-details></v-checkbox>
              </td>
            </tr>

            <!-- Tipo de Contrato do Fornecedor -->
            <tr>
              <td>Tipo de Contrato do Fornecedor</td>
              <td>
                <v-checkbox v-model="item.permissoes" dense color="primary" :value="permissao.Projeto_TipoContratoFornecedor_Listar" hide-details></v-checkbox>
              </td>
              <td>
                <v-icon color="grey">mdi-lock</v-icon>
              </td>
              <td>
                <v-icon color="grey">mdi-lock</v-icon>
              </td>
              <td>
                <v-icon color="grey">mdi-lock</v-icon>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </div>

    <div v-show="filterId == 9">
      <v-card-text>
        <v-simple-table dense fixed-header>
          <thead class="grey lighten-3">
            <tr>
              <th class="text-left">Permissão</th>
              <th class="text-left">Visualizar</th>
              <th class="text-left">Cadastrar</th>
              <th class="text-left">Alterar</th>
              <th class="text-left">Excluir</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Relatório</td>
              <td>
                <v-checkbox
                  v-model="item.permissoes"
                  dense
                  color="primary"
                  :value="permissao.Financeiro_Relatorio_Listar"
                  hide-details
                ></v-checkbox>
              </td>
              <td>
                <v-icon color="grey">mdi-lock</v-icon>
              </td>
              <td>
                <v-icon color="grey">mdi-lock</v-icon>
              </td>
              <td>
                <v-icon color="grey">mdi-lock</v-icon>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </div>

    <div v-show="filterId == 10">
      <v-card-text>
        <v-simple-table dense fixed-header>
          <thead class="grey lighten-3">
            <tr>
              <th>Módulo</th>
              <th>Acesso</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Negócio</td>
              <td>
                <v-checkbox
                  v-model="item.permissoes"
                  dense
                  color="primary"
                  :value="permissao.Modulos_Modulo_Negocio"
                  hide-details
                ></v-checkbox>
              </td>
            </tr>
            <tr>
              <td>Contrato</td>
              <td>
                <v-checkbox
                  v-model="item.permissoes"
                  dense
                  color="primary"
                  :value="permissao.Modulos_Modulo_Contrato"
                  hide-details
                ></v-checkbox>
              </td>
            </tr>
            <tr>
              <td>Financeiro</td>
              <td>
                <v-checkbox
                  v-model="item.permissoes"
                  dense
                  color="primary"
                  :value="permissao.Modulos_Modulo_Financeiro"
                  hide-details
                ></v-checkbox>
              </td>
            </tr>
            <tr>
              <td>Administração</td>
              <td>
                <v-checkbox
                  v-model="item.permissoes"
                  dense
                  color="primary"
                  :value="permissao.Modulos_Modulo_Administracao"
                  hide-details
                ></v-checkbox>
              </td>
            </tr>
            <tr>
              <td>KPIs</td>
              <td>
                <v-checkbox
                  v-model="item.permissoes"
                  dense
                  color="primary"
                  :value="permissao.Modulos_Modulo_KPI"
                  hide-details
                ></v-checkbox>
              </td>
            </tr>
            <tr>
              <td>Almoxarifado</td>
              <td>
                <v-checkbox
                  v-model="item.permissoes"
                  dense
                  color="primary"
                  :value="permissao.Modulos_Modulo_Almoxarifado"
                  hide-details
                ></v-checkbox>
              </td>
            </tr>
            <tr>
              <td>Compras</td>
              <td>
                <v-checkbox
                  v-model="item.permissoes"
                  dense
                  color="primary"
                  :value="permissao.Modulos_Modulo_Compra"
                  hide-details
                ></v-checkbox>
              </td>
            </tr>
            <tr>
              <td>Projetos</td>
              <td>
                <v-checkbox
                  v-model="item.permissoes"
                  dense
                  color="primary"
                  :value="permissao.Modulos_Modulo_Projeto"
                  hide-details
                ></v-checkbox>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </div>     
 
  </v-card>
</template>

<script lang="ts">
import { Permissao, Usuario } from "@/core/models/cadastros";
import { UsuarioService } from "@/core/services/cadastros";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class Historico extends Vue {
  item = new Usuario();
  service = new UsuarioService();
  permissao = Permissao;
    
  titulo: string = 'Permissão do Sistema SCAE';
  subTitulo: string = 'Atenção, as permissões serão concedida ao usuário.';
  tabActive = null;
  usuarios = [];

  dialogDespesa:boolean = false;
  dialogReceita:boolean = false;
  dialogEmpresa:boolean = false;
  dialogUsuario:boolean = false;
  dialogCompras:boolean = false;
  dialogCentroCusto:boolean = false;
  dialogContaGerencial:boolean = false;
  dialogMovimentacao:boolean = false;
  dialogContrato:boolean = false;
  dialogPedido:boolean =false;
  dialogMedicao:boolean = false;

  filterId:number = 1;

  modulos = [
    {id:1, nome:'Almoxarifado'},
    {id:2, nome:'Base'},
    {id:3, nome:'Contrato'},
    {id:4, nome:'Compras'}, 
    {id:5, nome:'Empreendimento'},
    {id:6, nome:'Financeiro'},
    {id:7, nome:'Geral'},
    {id:8, nome:'Projeto'},
    {id:9, nome:'Relatório'},
    {id:10, nome:'Módulo'}
  ]

  
  breadCrumbLinks: any[] = [
    { text: 'Home', href: '/financeiro/painel/kpi',},
    { text: 'Lista de Permissão', disabled: true, href: '/financeiro/painel/despesas'}
  ]

  headers: any[] = [
    { text: '', value: 'actions', sortable: false },
    { text: 'permissaoa', value: 'permissao' },
    { text: 'Visualizar', value: 'visualizar' },
    { text: 'Cadastrar', value: 'cadastrar' } ,
    { text: 'alterar', value: 'alterar' }  ,
    { text: 'excluir', value: 'excluir' } 
  ];


  getUsuario(){
    this.service.getUsuario(this.item.id).then(res => {
      this.item = res.data;

      if(this.item.permissoes == null){
        this.item.permissoes = [];
      }
    })
  }

  permissoesAlmoxarifado:any = [1004,1001,1002,1003,2004,2001,2002,2003, 3001,3002,3003,3004,4004,4001,4002,4003,4005,5001,5002,5003,5004,6001,6002,6003,6004,7001,8001,9001,9002,9003,9004];

  permissoesBase:any = [10001,10002,10003,10004];

  permissoesContrato:any = [11001,11002,11003,11004,11005,11006,11007,12001,12002,12003,12004,13001,14001];

  permissoesCompras:any = [15001,15002,15003,15004, 15005,15006, 16001,16002,16003,16004, 17001,17002,17003,17004, 17005,18001,19001 ];

  permissoesEmpreendimento:any = [20001,20002,20003,20004, 21001,22001, 23001,24001,25001,26001, 26002,26003,26004];

  permissoesRelatorio:any = [38001];

  permissoesProjeto:any = [61001,61002,61003,61004,62001,62002,62003,62004, 63001,63002,63003,63004,63005,64001,64002,64003,64004,65001];

  permissoesGerais:any = [46001,46002,46003,46004,47001,47002,47003,47004, 47005,47006,47007,47008,48001,49001,50001,50002,51001,52001,52002,52003,52004,52005,53001,54001,54002,54003,
  54004,55001,56001,57001,58001,59001,59002,59003,59004,60001,60002,60003,60004,60005,60006,60007];

  permissoesFinanceiro:any = [27001,27002,27003,27004,28001,28002,28003,28004,28005,29001,29002,29003,29004,30001,30002,30003,30004,31001,31002,31003,31004,31005,32001,32002,32003,32004,
  32005,32006,32007,32008,32009,32010,32011,32012,32013,33001,33002,33003,33004,33005,33006,33007,33008,33009,33010,33011,33012,33013,33014,33015,33016,33017,33018,33019,33020,33021,33022,33023
  ,33024,33025,34001,34002,34003,34004,35001,35002,35003,35004,37001,37002,37003,37004,38001,39001,40001,36001,41001,43001,44001,45001,42001,42002,42003,42004,33027,67001,67002,67003,67004,68004,68001,68002,68003,33028,33029,33030,33031, 32014,33032];

  permissoesModulos:any = [999001, 999002, 999003,999004, 999005, 999006, 999007, 999008,999009];


  /* VERIFICAÇÃO INCLUDES */
  get includeAlmoxarifado(){
    return this.item.permissoes.some((el) => this.permissoesAlmoxarifado.includes(el))
  };

  get includeBase(){
    return this.item.permissoes.some((el) => this.permissoesBase.includes(el))
  };
  
  get includeContrato(){
    return this.item.permissoes.some((el) => this.permissoesContrato.includes(el))
  }

  get includeCompras(){
    return this.item.permissoes.some((el) => this.permissoesCompras.includes(el))
  }

  get includeEmpreendimento(){
    return this.item.permissoes.some((el) => this.permissoesEmpreendimento.includes(el))
  }

  get includeRelatorio(){
    return this.item.permissoes.some((el) => this.permissoesRelatorio.includes(el))
  }

  get includeProjeto(){
    return this.item.permissoes.some((el) => this.permissoesProjeto.includes(el))
  }

  get includeGeral(){
    return this.item.permissoes.some((el) => this.permissoesGerais.includes(el))
  }

  get includeFinanceiro(){
    return this.item.permissoes.some((el) => this.permissoesFinanceiro.includes(el))
  }

  get includeModulo(){
    return this.item.permissoes.some((el) => this.permissoesModulos.includes(el))
  }

  /* ICONES */

  get iconAlmoxarifado(){
    if (this.includeAlmoxarifado) return 'mdi-close-box'
    return 'mdi-checkbox-blank-outline'
  }

  get iconBase(){
    if (this.includeBase) return 'mdi-close-box'
    return 'mdi-checkbox-blank-outline'
  }

  get iconContrato(){
    if (this.includeContrato) return 'mdi-close-box'
    return 'mdi-checkbox-blank-outline'
  }

  get iconCompras(){
    if (this.includeCompras) return 'mdi-close-box'
    return 'mdi-checkbox-blank-outline'
  }

  get iconEmpreendimento(){
    if (this.includeEmpreendimento) return 'mdi-close-box'
    return 'mdi-checkbox-blank-outline'
  }

  get iconRelatorio(){
    if (this.includeRelatorio) return 'mdi-close-box'
    return 'mdi-checkbox-blank-outline'
  }

  get iconProjeto(){
    if (this.includeProjeto) return 'mdi-close-box'
    return 'mdi-checkbox-blank-outline'
  }

  get iconGeral(){
    if (this.includeGeral) return 'mdi-close-box'
    return 'mdi-checkbox-blank-outline'
  }

  get iconFinanceiro(){
    if (this.includeFinanceiro) return 'mdi-close-box'
    return 'mdi-checkbox-blank-outline'
  }
  get iconModulo(){
    if (this.includeModulo) return 'mdi-close-box'
    return 'mdi-checkbox-blank-outline'
  }

  selectAll(moduloId) {
    switch (moduloId) {
      case 1:
        this.SelectAllAlmoxarifado();
        break;
      case 2:
        this.SelectAllBase();
        break;
      case 3:
        this.SelectAllContrato();
        break;
      case 4:
        this.SelectAllCompras();
        break;
      case 5:
        this.SelectAllEmpreendimento();
        break;
      case 6:
        this.SelectAllFinanceiro();
        break;
      case 7:
        this.SelectAllGeral();
        break;
      case 8:
        this.SelectAllProjeto();
        break;
      case 9:
        this.SelectAllRelatorio();
        break;
      case 10:
        this.SelectAllModulo();
        break;
    }
  }
  
  SelectAllAlmoxarifado(){
    this.$nextTick(() => {  
      if (this.includeAlmoxarifado) {
         this.item.permissoes = this.item.permissoes.filter(x => x != 1001 && x != 1002 && x != 1003 && x != 1004 && x != 2004 && x != 2001 && x != 2002 && x != 2003 && x != 3004 && x != 3001 && x != 3002 && x != 3003
         && x != 4004 && x != 4001 && x != 4002 && x != 4003 && x != 4005 && x != 5004 && x != 5001 && x != 5002 && x != 5003 && x != 6004 && x != 6001 && x != 6002 && x != 6003 && x != 7001 && x != 8001  && x != 9001 && x != 9002 && x != 9003 && x != 9004);
      } else {
        this.permissoesAlmoxarifado.forEach(element =>{
          this.item.permissoes.push(element)
        })
      }
    })
  }

  SelectAllBase(){
     this.$nextTick(() => {  
      if (this.includeBase) {
        this.item.permissoes = this.item.permissoes.filter(x => x != 10001 && x != 10002 && x != 10003 && x != 10004);
      } else {

        this.permissoesBase.forEach(element => {
          this.item.permissoes.push(element)
        })
      }
    })
  }
 
  SelectAllContrato(){
    this.$nextTick(() => {  
      if (this.includeContrato) {
        this.item.permissoes = this.item.permissoes.filter(x => x != 11001 && x != 11002 && x != 11003 && x != 11004 && x != 11005 && x != 11006 && x != 11007 && x != 12001 && x != 12002 && x != 12003 && x != 12004 && x != 13001 && x != 14001);
      } else {

        this.permissoesContrato.forEach(element => {
          this.item.permissoes.push(element)
        })
      }
    })
  }

  SelectAllCompras(){
     this.$nextTick(() => {  
      if (this.includeCompras) {
        this.item.permissoes = this.item.permissoes.filter(x => x != 15001 && x != 15002 && x != 15003 && x != 15004 && x != 15005 && x != 15006
         && x != 16001 && x != 16002 && x != 16003 && x != 16004 && x != 17001 && x != 17002 && x != 17003 && x != 17004  && x != 17005 && x != 18001 && x != 19001);
      } else {

        this.permissoesCompras.forEach(element => {
          this.item.permissoes.push(element)
        })
      }
    })
  }

  SelectAllEmpreendimento(){
    this.$nextTick(() => {  
      if (this.includeEmpreendimento) {
        this.item.permissoes = this.item.permissoes.filter(x => x != 20001 && x != 20002 && x != 20003 && x != 20004 && x != 21001 && x != 22001
         && x != 23001 && x != 24001 && x != 25001 && x != 26001 && x != 26002 && x != 26003 && x != 26004);
      } else {

        this.permissoesEmpreendimento.forEach(element => {
          this.item.permissoes.push(element)
        })
      }
    })
  }

  SelectAllRelatorio(){
    this.$nextTick(() => {  
      if (this.includeRelatorio) {
        this.item.permissoes = this.item.permissoes.filter(x => x != 38001);
      } else {

        this.permissoesRelatorio.forEach(element => {
          this.item.permissoes.push(element)
        })
      }
    })
  }

  SelectAllProjeto(){
    this.$nextTick(() => {  
      if (this.includeProjeto) {
        this.item.permissoes = this.item.permissoes.filter(x => x != 61001 && x != 61002 && x != 61003 && x != 61004 && x != 62001 && x != 62002 && x != 62003 && x != 62004 && x != 63001
        && x != 63002 && x != 63003 && x != 63004 && x != 63005 && x != 64001 && x != 64002 && x != 64003 && x != 64004 && x != 65001);
      } else {

        this.permissoesProjeto.forEach(element => {
          this.item.permissoes.push(element)
        })
      }
    })
  }

  SelectAllGeral(){
    this.$nextTick(() => {  
      if (this.includeGeral) {
        this.item.permissoes = this.item.permissoes.filter(x => x  != 46001 && x != 46002 && x != 46003 && x != 46004 && x != 47001 && x != 47002 && x != 47003 && x != 47004
         && x != 47005  && x != 47006  && x != 47007  && x != 47008  && x != 48001 && x != 49001 && x != 50001 && x != 50002 && x != 51001 && x != 52001 && x != 52002 && x != 52003 && x != 52004
          && x != 52005  && x != 53001  && x != 54001  && x != 54002  && x != 54003  && x != 54004 && x != 55001 && x != 56001 && x != 57001 && x != 58001 && x != 59001 && x != 59002 && x != 59003 && x != 59004
          && x != 60001 && x != 60002 && x != 60003 && x != 60004 && x != 60005 && x != 60006 && x != 60007);
      } else {

        this.permissoesGerais.forEach(element => {
          this.item.permissoes.push(element)
        })
      }
    })
  }

  SelectAllFinanceiro(){
     this.$nextTick(() => {  
      if (this.includeFinanceiro) {
        this.item.permissoes = this.item.permissoes.filter(x => x  != 27001 && x != 27002 && x != 27003 && x != 27004 && x != 28001 && x != 28002 && x != 28003 && x != 28004 && x != 28005 
          && x != 29001 && x != 29002 && x != 29003 && x != 29004 && x != 30001 && x != 30002 && x != 30003 && x != 30004 && x != 31001 && x != 31002 && x != 31003 && x != 31004 && x != 31005
          && x != 32001 && x != 32002 && x != 32003  && x != 32004 && x != 32005 && x != 32006 && x != 32007 && x != 32008 && x != 32009 && x != 32010 && x != 32011 && x != 32012 && x != 32013
          && x != 33001 && x != 33002 && x != 33003 && x != 33004 && x != 33005 && x != 33006 && x != 33007 && x != 33008 && x != 33009 && x != 33010 && x != 33011 && x != 33012
          && x != 33013  && x != 33014  && x != 33015  && x != 33016  && x != 33017  && x != 33018  && x != 33019  && x != 33020  && x != 33021  && x != 33022  && x != 33023  && x != 33024
          && x != 33025  && x != 34001  && x != 34002  && x != 34003  && x != 34004  && x != 35001  && x != 35002  && x != 35003  && x != 35004  && x != 37001  && x != 37002 && x != 37003 
          && x != 37004  && x != 38001  && x != 39001  && x != 40001  && x != 36001  && x != 41001  && x != 43001  && x != 44001  && x != 45001  && x != 42001  && x != 42002  && x != 42003 && x != 42004 && x != 33027 
          && x != 67001 && x != 67002 && x != 67003 && x != 67004 && x != 68004 && x != 68001 && x != 68002 && x != 68003 && x != 33028 && x != 33029 && x != 33030 && x != 33031 && x != 33032 && x != 32014
                                                                                                                                                                                   
        );
      } else {
        this.permissoesFinanceiro.forEach(element => {
          this.item.permissoes.push(element)
        })
      }
    })
  }

  SelectAllModulo(){
    this.$nextTick(() => {  
      if (this.includeModulo) {
        this.item.permissoes = this.item.permissoes.filter(x => x != 999001 && x != 999002 && x != 999003 && x != 999004 && x != 999005 && x != 999006 && x != 999007 && x != 999008 && x != 999009);
      } else {

        this.permissoesModulos.forEach(element => {
          this.item.permissoes.push(element)
        })
      }
    })
  }
 
  Salvar() {
    this.service.PostPermissoes(this.item.id, this.item.permissoes).then(
    (res) => {
      this.$swal("Aviso","Operação realizada com sucesso!",res.status == 201 || res.status == 200 ? "success" : "warning");
      this.$emit("salvou");
    }, 
    (err) => {
      if (!err.response) {
        this.$swal("Aviso", "Não foi possível acessar a API", "error");
      } else if (err.response.status == 403) {
        this.$swal("Aviso", err.response.data.message, "warning" );
      } else {
        this.$swal("Aviso",  err.response.data, err.response.status == 400 ? "warning" : "error");
      }
    });
  }

  mounted(){
    new UsuarioService().Listar(-1, -1, ['login'],[],'',[], '', '' , 'Id, Login', '').then(
      res => this.usuarios = res.data.items
    )
  }
}
</script>

 