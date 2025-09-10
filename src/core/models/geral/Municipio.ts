import Estado from './Estado';

export default class Municipio implements Shared.IEntity {
    public id: number = 0;
    public nome: string = ''; 
    
    public estadoId: number = 0;
    public estado: Estado = new Estado();
}