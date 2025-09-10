<template>
    <v-app class="fundo">
        <v-content class="page">
       
            <v-app-bar fixed dark flat color="primary" class="d-print-none">
                <v-btn icon dark @click="Fechar()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                
                <v-toolbar-title>{{titulo}}</v-toolbar-title>
                <v-spacer/>
                 <!-- <v-toolbar-items v-if="exportarExcel">
                    <v-btn dark text @click="ExportarExcel2('tabela', headers)"><v-icon left>mdi-file-excel-outline</v-icon>Exportar (Excel)</v-btn>
                </v-toolbar-items> --> 
             
                 <v-toolbar-items v-if="exportarExcel">
                    <v-btn dark text @click="ExportarExcel('tabela')"><v-icon left>mdi-file-excel-outline</v-icon>Exportar (Excel)</v-btn>
                </v-toolbar-items> 

                <v-toolbar-items>
                    <v-btn dark text @click="Imprimir()"><v-icon left>mdi-printer</v-icon>Imprimir</v-btn>
                </v-toolbar-items>
                   
            </v-app-bar>
  
            <v-card flat class="subpage"> 
                <div v-if="marcaDagua" id="background">
                    <p id="bg-text">{{marcaDagua}}</p>
                </div>

                <v-row>
                    <div class="pa-6">
                        <v-img v-if="logo" contain :src="`data:image/jpeg;base64,${logo}`" max-height="100" max-width="150"/>
                    </div> <v-spacer></v-spacer>

                     <div class="pa-6">
                        <v-img  contain src="../../assets/images/logo.png" max-height="100" max-width="150"/>
                     </div>
                </v-row>
                 
            <!-- <v-img src="../../assets/images/logo.png" max-width="150"/>  -->
 
                <!-- <v-row>
                    <v-col cols="6" sm="6">
                        <v-img v-if="logo" contain :src="`data:image/jpeg;base64,${logo}`" max-height="100" max-width="150"/>
                         
                    </v-col>

                    <v-col cols="6" sm="6" class="text-right"> 
                        <p class="overline">® SCAE <br/> {{new Date().ddmmyyyy()}} </p>
                    </v-col>
                </v-row> -->
                 
                <hr class="solid">
                
                <v-row>                                
                    <v-col cols="12" class="text-center">
                        <span class="text-uppercase font-weight-bold">{{titulo}}</span>
                    </v-col>                                
                </v-row>

                <hr class="solid">

                <div>
                    <slot/> 
                </div>
                
                 
                 
                    <v-col class="text-center" cols="12" style="font-size: 12px;">
                        <strong>® SCAE</strong> — Sistema para Loteamentos — {{ new Date().toLocaleString('pt-BR') }}
                    </v-col>
               
            </v-card> 
        </v-content>
                <!-- <v-footer padless color="#A7A7A7">
                    <v-col class="text-center" cols="12">
                        <strong>® SCAE</strong> — {{ new Date().getFullYear() }}
                    </v-col>
                </v-footer> -->
    </v-app>
</template>
 
<script lang="ts">
import { PageBase } from '@/core/models/shared';
import { EmpresaService } from '@/core/services/compras/EmpresaService';
import { Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class RelatorioPage extends PageBase {
    @Prop() private headers!: {};
    @Prop() private lista!: {};

    @Prop() private titulo!: string;
    @Prop() private cabecalhoCompleto?: boolean;
    @Prop() private marcaDagua?: string;
    @Prop() private paisagem?: boolean;
    @Prop() private exportarExcel?: boolean;
    @Prop() private empresaId?:any;

    data: any = Date.now;
    logo:string= "";

     @Watch("empresaId")
     async ObterLogoEmpresa() {
        if (!this.empresaId) {
            return;
        }

        const [primeiroNumero] = this.empresaId.split(",");
        if (this.empresaId.split(",").length === 1) {
            try {
            const res = await new EmpresaService().CarregarFoto(parseInt(primeiroNumero));
            this.logo = res.data;

            } catch (error) {
                this.$swal("Aviso", "Não foi possível carregar a logo.", "warning");
            }
        } else {
            this.logo = "";
        }
    }

    mounted() {
        let root = document.documentElement;
        if(this.paisagem){
            root.style.setProperty("--widthPage", 29.7 + 'cm'); //45 //29.7
            root.style.setProperty("--min-heightPage", 19 + 'cm');
            this.setPageSize('landscape')
        }       
        else{
            root.style.setProperty("--widthPage", 21 + 'cm');
            root.style.setProperty("--min-heightPage", 10 + 'cm');
            this.setPageSize('portrait')
        }        
    }

    setPageSize(size: string){
        const style = document.createElement('style');
        style.innerHTML = `@page {size: ${size}}`;
        document.head.appendChild(style);
    }

    Imprimir(){
        window.print();
    }

    Fechar(){
        window.close();
    }
}
</script>

<style>

@media only screen and (pointer: fine){  

    :root{

        /* DESKTOP */
        --widthPage: 0cm;
        --min-heightPage: 0cm;

    } 

    .subpage {
        margin: 0.5cm;
    }

   .fundo {
        background-color: #a7a7a7 !important;
    }

   .page{

        width: var(--widthPage);
        min-height: var(--min-heightPage);

        height: calc(100/23 * 19vh) auto;

        margin: 2cm auto;
        border: 1px #D3D3D3 solid;
        border-radius: 5px;
        background: white;
    }

    .logoEmpresa{
        max-width: 18vw;
        max-height: 8vh;
    }

    .fotoEmbarcacao{
        max-width: 22vw;
        max-height: 14vh;
    }
}

@media only screen and (hover: none) and (pointer: coarse){
    

    .subpage {
        margin: 0.5cm;
    }
    
    .fundo {
        background-color: #a7a7a7 !important
    } 
    
    .page{
        width: calc(100/23 * 21vw);
        height: calc(100/23 * 29.7vh) auto;
        margin: 2cm auto;
        border: 1px #cccccc solid;
        border-radius: 5px;
        background: rgb(255, 255, 255);
    }

    .logoEmpresa{
        max-width: 20vw;
        max-height: 10vh;
    }

    .fotoEmbarcacao{
        max-width: 78vw;
        max-height: 19vh;
    }
}

@media print{

    .fundo {
        background-color: #ffffff !important
    }
    
    .page{
        width: var(--widthPage);
        min-height: var(--min-heightPage);
        height: calc(100/23 * 21vh) auto;
        background: initial;
        background-color: #ffffff !important;
        -webkit-print-color-adjust: exact;

    }

    .logoEmpresa{
        max-width: 18vw;
        max-height: 8vh;
    }

    .fotoEmbarcacao{
        max-width: 40vw;
        max-height: 10vh;
    }

    #header {
        position: sticky;
    }

    #footer {
        position: sticky;
        margin-bottom: 0px;
    }
}
</style> 