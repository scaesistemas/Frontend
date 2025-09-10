import { Contato, Permissao } from "../geral";

export default class Usuario implements Shared.IEntity{
    public id: number = 0;
    public assinanteId!: number;

    public login: string ="";
    public senha: string ="";
 
    public complementar: Contato = new Contato();
    public dataHoraCriacao = new Date();
    public foto: any = null; 
    public ativo:boolean = true;
    public temaEscuro: boolean = false;
    public permissoes:Permissao[] = [];

    constructor(model?: Usuario) {
        Object.assign(this, model);
    }
}  
