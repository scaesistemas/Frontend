import { DimensaoInfraestruturaImovel, InfraestruturaInternaImovel, InfraestruturaExternaImovel, InfraestruturaLazerImovel } from '.';

export default class InfraestruturaImovel{
    public dimensao?: DimensaoInfraestruturaImovel = new DimensaoInfraestruturaImovel();
    public interna?: InfraestruturaInternaImovel = new InfraestruturaInternaImovel();
    public externa?: InfraestruturaExternaImovel = new InfraestruturaExternaImovel();
    public lazer?: InfraestruturaLazerImovel = new InfraestruturaLazerImovel();
}