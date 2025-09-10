import { Component, Prop, Watch, Vue, } from 'vue-property-decorator'
import { Service } from '@/core/services/Service';

@Component
export default class ListPage extends Vue {
  protected service!: Service;
  protected item!: Shared.IEntity;
  protected lista: [] = [];
  protected totalLista: number = 0;
  protected loading: boolean = false;
  protected dialogCadastro: boolean = false;
  protected dialogBaixar: boolean = false;
  protected dialogEditar: boolean = false;
  protected dialogGerenciador: boolean = false;
  protected dialogAditar: boolean = false;
  protected dialogVisualizar: boolean = false;
  protected dialogDigital: boolean = false;
  protected dialogMapaInterativo:boolean = false;
  protected dialogReceberPedido:boolean = false;
  protected dialogRequisicao:boolean = false;

  protected timeout: any;
  public search: string = '';

  protected options: any = {
    itemsPerPage: 15
  };

  
 /* @Watch("dialogRequisicao", { deep: true })
  DialogRequisicao() {
    const container:any = document.querySelector('html');
    if (!this.dialogRequisicao) {
      container!.classList.remove('no-scroll');
    }else{
      container!.classList.add('no-scroll');
    }
  }  

  @Watch("dialogReceberPedido", { deep: true })
  DialogReceberPedido() {
    const container:any = document.querySelector('html');
    if (!this.dialogReceberPedido) {
      container!.classList.remove('no-scroll');
    }else{
      container!.classList.add('no-scroll');
    }
  }  

  @Watch("dialogCadastro", { deep: true })
  DialogCadastro() {
    const container:any = document.querySelector('html');
    if (!this.dialogCadastro) {
      container!.classList.remove('no-scroll');
    }else{
      container!.classList.add('no-scroll');
    }
  }  

  @Watch("dialogBaixar", { deep: true })
  DalogBaixar() {
    const container:any = document.querySelector('html');
    if (!this.dialogBaixar) {
      container!.classList.remove('no-scroll');
    }else{
      container!.classList.add('no-scroll');
    }
  }
   
  @Watch("dialogGerenciador", { deep: true })
  DialogGerenciador() {
    const container:any = document.querySelector('html');
    if (!this.dialogGerenciador) {
      container!.classList.remove('no-scroll');
    }else{
      container!.classList.add('no-scroll');
    }
  }

  @Watch("dialogDigital", { deep: true })
  DialogDigital() {
    const container:any = document.querySelector('html');
    if (!this.dialogDigital) {
      container!.classList.remove('no-scroll');
    }else{
      container!.classList.add('no-scroll');
    }
  }

  @Watch("dialogVisualizar", { deep: true })
  DialogVisualizar() {
    const container:any = document.querySelector('html');
    if (!this.dialogVisualizar) {
      container!.classList.remove('no-scroll');
    }else{
      container!.classList.add('no-scroll');
    }
  }

  @Watch("dialogAditar", { deep: true })
  DialogAditar() {
    const container:any = document.querySelector('html');
    if (!this.dialogAditar) {
      container!.classList.remove('no-scroll');
    }else{
      container!.classList.add('no-scroll');
    }
  }

  @Watch("dialogEditar", { deep: true })
  DialogEditar() {
    const container:any = document.querySelector('html');
    if (!this.dialogEditar) {
      container!.classList.remove('no-scroll');
    }else{
      container!.classList.add('no-scroll');
    }
  }

  @Watch("dialogMapaInterativo", { deep: true })
  DialogMapaInterativo() {
    const container:any = document.querySelector('html');
    if (!this.dialogMapaInterativo) {
      container!.classList.remove('no-scroll');
    }else{
      container!.classList.add('no-scroll');
    }
  }*/
 

  NovoCadastro(itemNovo: Shared.IEntity) {
    //this.item = itemNovo;
    this.dialogCadastro = true;
  }

  Listar() {
    this.loading = true;
    const { sortBy, sortDesc, page, itemsPerPage } = this.options;

    this.service.Listar(page, itemsPerPage, sortBy, sortDesc)
      .then(
        res => {
          
          this.lista = res.data.items;
          this.totalLista = res.data.count;
          this.loading = false;
        },
        err => {
          this.$swal('Aviso', err.response.data, 'error');
          this.loading = false;
        }
      );
  }

  ListarTudo() {
    this.loading = true;
    this.service.ListarTudo().then(
      res => {
        // setTimeout(() => {
        //   this.loading = false;
        //   this.lista = res.data.items;
        //   this.totalLista = res.data.total;
        // }, 1000);
        this.loading = false;
        this.lista = res.data.items;
        this.totalLista = res.data.total;
      },
      err => {
        this.loading = false;
      }
    );
  }

  Editar(item: Shared.IEntity) {
    this.service.ObterPorId(item.id).then( res =>{
      this.item = res.data;
      this.dialogCadastro = true;
    });
  }

  Excluir(item: Shared.IEntity) {
    this.$swal({
      title: 'Atenção!',
      text: 'Tem certeza que deseja excluir o registro atual?',
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      showCloseButton: true,
      showLoaderOnConfirm: true,

      preConfirm: () => {
        return this.service.Excluir(item.id)
          .then(res => {
            if (res.status == 200) {
              return res;
            }
          },
            err => this.$swal('Aviso', err.response.data, 'error')
          )
      },
      allowOutsideClick: false/*() => !this.$swal.isLoading()*/
    })
      .then((result:any) => {
        if (result.value) {
          this.$swal('Aviso', result.value.data, result.value.status == 200 ? 'success' : 'warning');
          this.Listar();
        }
      })
  }

  BuscaRapida(termo: string) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
    }, 1000);
  }

  Salvar(item?: Shared.IEntity) {
    let modelo = item != undefined ? item : this.item;
    this.service.Salvar(modelo!).then(
      res => { 
        this.$swal(
          "Aviso",
          "Operação realizada com sucesso!",
          res.status == 201 || res.status == 200 ? "success" : "warning"
        ); 
        this.dialogCadastro = false;
        this.$emit("fecharDialog");
      },
      err => {
        if (err.response.status == 400) {
          this.$swal("Aviso", err.response.data.title, "warning");
        } else {
          this.$swal("Aviso", err.response.data, "error");
        }
      }
    );
  }
}

