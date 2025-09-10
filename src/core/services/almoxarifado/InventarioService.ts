import { Service } from '../Service';
import {http, httpHeader} from '../../api';

export default class InventarioService extends Service{
    constructor(){
        super('inventario');
    }

    public async Executar(id: number){
        return await http.post(`${this.GetNomeControle()}/executar/${id}`, null, httpHeader);
    }
}