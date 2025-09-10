import { Endereco } from '../shared';
import Cliente from './Cliente';
import Financiamento from '../shared/Financiamento';
import Pessoa from '../cadastros/Pessoa';

export default class Locacao implements Shared.IEntity{

    public id:number = 0; 
    public empresaId:number =1;
    public endereco: Endereco = new Endereco();
    public proprietarios: Pessoa[] = [];
    public locadores: Cliente[]=[];
    public financiamentos: Financiamento[] = [];

    public DataContrato = new Date().toISOString().substr(0, 10);
    public vencimento= new Date().toISOString().substr(0, 10);

    public imgDoc: any;
    public imgDoc2: any;
    public imgDoc3: any;
} 