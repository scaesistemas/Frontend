import { Contrato } from '.';
import { Cliente } from '../imobiliaria';

export default class ContratoCliente implements Shared.IEntity{
    public id!: number;
    public contratoId: number = 0;
    public contrato?: Contrato;
    public clienteId: number = 0;
    public cliente?: Cliente;
}