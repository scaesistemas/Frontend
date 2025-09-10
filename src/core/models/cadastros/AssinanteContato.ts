export default class AssinanteContato implements Shared.IEntity  {
    public id!:number;
    public assinanteId!: number;
    public nome:string ="";
    public celular:string ="";
    public telefone:string ="";
    public ramal:string ="";
    public email:string ="";
    public observacao:string="";
    public principal: boolean = false;

    
    constructor(model?: AssinanteContato) {
        Object.assign(this, model);
    }
}   