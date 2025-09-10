export default class AssinanteDominio implements Shared.IEntity{
    public id!:number
    public assinanteId!:number;
    public nome:string = "";
    public principal: boolean = false;

    constructor(model?: AssinanteDominio) {
        Object.assign(this, model);
    }
} 