import Municipio from './../geral/Municipio';
import Estado from './../geral/Estado';
import { Empresa } from '../cadastros';

export default class Cartorio implements Shared.IEntity{

    public id:number = 0;
    public empresaId: number = 1;
    public empresa?: Empresa;
    public nome: string = '';
    public descricao: string = '';
    public municipioId: number = 0;
    public municipio?: Municipio;
    public estadoId: number = 0;
    public estado?: Estado;
}