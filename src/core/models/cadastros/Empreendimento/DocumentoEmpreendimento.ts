import { Empreendimento } from '..';
import { Documento } from '../../geral';

export default class DocumentoEmpreendimento extends Documento{
    public empreendimentoId: number = 0;
    public empreendimento?: Empreendimento;
}