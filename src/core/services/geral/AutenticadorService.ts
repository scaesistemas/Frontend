import {http} from '../../api';
   
export class AutenticadorService {

    private _nomeControle = 'autenticador';

    public async AutenticarCliente(usuario: any){
        return await http.post(`${this._nomeControle}/cliente`, usuario);
    }

    public async AutenticarUsuario(usuario: any){
        return await http.post(`${this._nomeControle}/usuario`, usuario);
    }

    public ResetarSenha(usuario:any){
        return http.post(`${this._nomeControle}/resetarsenha`, usuario);
    }
    public async ConfirmarEmail(token: string){
        return await http.post(`${this._nomeControle}/confirmaremail`, null, {
            params: {
                token
            }
        });
    }

    public async ObterImagemEmpresa(){
        return await http.get(`${this._nomeControle}/assinante/logo`);
    }
}