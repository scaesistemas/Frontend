import ReguaCobrancaEtapa from "./ReguaCobrancaEtapa";

export default class ReguaCobranca implements Shared.IEntity{
    id: number = 0;
    nome: string = ""; 
    etapas: ReguaCobrancaEtapa[] = [];      
} 