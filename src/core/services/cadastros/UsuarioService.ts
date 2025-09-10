import { http } from '@/core/api';
import { Service } from '../Service';

export class UsuarioService extends Service {

    constructor() {
        super('usuario');
    }
 
    TreeView(){
        return http.get(`${this.GetNomeControle()}/treeview`);
    }

    AlterarSenha(modelo:any){
        return http.post(`${this.GetNomeControle()}/AlterarSenha`, modelo)
    }
 
    ResetarSenha(id:number){
        return http.post(`${this.GetNomeControle()}/${id}/ResetarSenha`)
    }

    CarregarFoto(id:number){
        return http.get(`${this.GetNomeControle()}/${id}/CarregarFoto`);
    }

    getUsuario(id:number){
        return http.get(`${this.GetNomeControle()}/${id}`);
    }

    PostPermissoes(id:number, modelo:any){
        return http.post(`${this.GetNomeControle()}/${id}/SalvarPermissoes`, modelo);
    }

    public MudarTema(id: number){
        return http.put(`${this.GetNomeControle()}/${id}/MudarTema`, null);
    }
}   