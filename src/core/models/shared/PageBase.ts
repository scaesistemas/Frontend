import { Vue } from "vue-property-decorator";
import { JSONToCSVConvertor, TableToExcel, TableToExcel2 } from '@/assets/scripts/helper';

export class PageBase extends Vue {
     
    public sessionApp: any;

    public app: {clienteId?: number, transportadoraId?: number, empresaId: number, empresaNome: string, empresaLogo: string,usuarioId: number, usuarioNome: string, usuarioFoto: string, temaEscuro: boolean, assinanteId:number, permissoes:[], email: string} = {
        clienteId: 0,
        transportadoraId: 0,
        empresaId: 0,
        empresaNome: '',
        empresaLogo: '',
        usuarioId: 0,
        usuarioNome: '',
        usuarioFoto: '',
        temaEscuro: false, 
        assinanteId :0,
        permissoes:[],
        email:''
    };
 
    constructor(){
        super();

        this.app.clienteId = 0;

        if (!localStorage.sessionApp){
            this.$router.push({ name: 'login' });
            return;
        }

        this.sessionApp = JSON.parse(localStorage.sessionApp);

        this.app.clienteId = this.sessionApp.dados.clienteId;
        this.app.empresaId = this.sessionApp.dados.empresaId;
        this.app.transportadoraId = this.sessionApp.dados.transportadoraId;
        this.app.empresaNome = this.sessionApp.dados.empresaNome;
        this.app.empresaLogo = this.sessionApp.dados.empresaLogo;
        this.app.usuarioId = this.sessionApp.dados.usuarioId;
        this.app.usuarioNome = this.sessionApp.dados.usuarioNome;
        this.app.usuarioFoto = this.sessionApp.dados.usuarioFoto;
        this.app.temaEscuro = this.sessionApp.dados.temaEscuro;
        this.app.assinanteId = this.sessionApp.dados.assinanteId;
        this.app.permissoes = this.sessionApp.dados.permissoes;
        this.app.email = this.sessionApp.dados.email;
    }

    ExportarExcel(tabela: string, worksheet: string){
      TableToExcel(tabela, worksheet);
    }

    ExportarExcel2(table: string, sizecols: string){
      TableToExcel2(table, sizecols);
    }
 
    JsonToCSV(JSONData: JSON, ReportTitle: string, ShowLabel: boolean){
        JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel);
    }

    MudarTema(temaEscuro: boolean){
        this.app.temaEscuro = temaEscuro;
        this.sessionApp.dados.temaEscuro = temaEscuro;
        localStorage.setItem('sessionApp', JSON.stringify(this.sessionApp));
        this.$vuetify.theme.dark = temaEscuro;
    }
}