export default class InfraestruturaLazerImovel {
    public academia: boolean = false;
    public piscina: boolean = false;
    public salaMassagem: boolean = false;
    public churrasqueira: boolean = false;
    public homeCinema: boolean = false;
    public quadraTenis: boolean = false;
    public sauna: boolean = false;
    public hidromassagem: boolean = false;
    public quadraPoliesportiva: boolean = false;
    public salaoJogos: boolean = false;
    public salaoFesta: boolean = false;
    public wifi: boolean = false;
    public playground: boolean = false;


    constructor(model?: InfraestruturaLazerImovel){
        if(!model)
        return;

        this.academia = model.academia;
        this.piscina = model.piscina;
        this.salaMassagem = model.salaMassagem;
        this.churrasqueira = model.churrasqueira;
        this.homeCinema = model.homeCinema;
        this.quadraTenis = model.quadraTenis;
        this.sauna = model.sauna;
        this.hidromassagem = model.hidromassagem;
        this.quadraPoliesportiva = model.quadraPoliesportiva;
        this.salaoJogos = model.salaoJogos;
        this.salaoFesta = model.salaoFesta;
        this.wifi = model.wifi;
        this.playground = model.playground;

    }

}