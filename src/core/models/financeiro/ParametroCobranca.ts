
export default class ParametroCobranca implements Shared.IEntity {
    id: number = 0;
    parametroId:number = 0;
    dias!: number;
    posVencimento:boolean = false;
    layoutCobrancaId:number = 0;
    enviarSms:boolean = false;
    enviarWhatsapp:boolean = false;
} 