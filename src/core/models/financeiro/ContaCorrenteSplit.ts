 
export default class ContaCorrenteSplit implements Shared.IEntity {
    id: number = 0;
    parametroGatewayId:number = 0;
    contaCorrenteId:number = 0;
    isPercentual:number = 0;
    valor:number = 0;
    
    constructor(model?: ContaCorrenteSplit){
        if(!model)
        return;
    
        this.id = model.id;
        this.parametroGatewayId = model.parametroGatewayId;
        this.contaCorrenteId = model.contaCorrenteId;
        this.isPercentual = model.isPercentual;
        this.valor = model.valor;   
    }
} 
 