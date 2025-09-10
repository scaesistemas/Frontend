import EmpresaDocumentoItem from "./EmpresaDocumentoItem";

export default class EmpresaDocumento  {
    public comprovanteResidencial: EmpresaDocumentoItem = new EmpresaDocumentoItem();
    public comprovanteAtividade: EmpresaDocumentoItem = new EmpresaDocumentoItem();
    public identificacao: EmpresaDocumentoItem = new EmpresaDocumentoItem();
    public identificacaoCnpj: EmpresaDocumentoItem = new EmpresaDocumentoItem();
}