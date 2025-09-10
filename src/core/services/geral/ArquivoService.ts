export class ArquivoService {

    async Ler(arquivo: any): Promise<string> {
        return new Promise((resolve, reject) => {
          let fr = new FileReader();
    
          fr.onload = (arquivo: any) => {
            resolve(arquivo!.target!.result);
          };
    
          fr.readAsDataURL(arquivo);
        });
    }

    async Download(arquivo) {        
      const link = document.createElement("a");
      link.href = `data:${arquivo.tipo};base64,${arquivo.dados}`;
      link.type = arquivo.tipo;
      link.download = `${new Date().toLocaleString().replace('','_')}`;
      link.click();
      link.remove();
    }

    base64ToBlob(base64: string, contentType: string = '', sliceSize: number = 512): Blob {
      const byteCharacters = atob(base64);
      const byteArrays: Uint8Array[] = [];
    
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
    
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
    
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
      }
    
      return new Blob(byteArrays, { type: contentType });
    }

  extrairExtensao(tipoArquivo: string): string | null {
    const regex = /(?<=\/)[a-zA-Z0-9]+$/;
    const match = tipoArquivo.match(regex);
    return match ? match[0] : null;
  }

  async Compartilhar(item){
    let extensao =  new ArquivoService().extrairExtensao(item.tipo);
    const blob = this.base64ToBlob(item.dados,  item.tipo);
    const file = new File([blob], `${item.nome}.${extensao}`, { type:  item.tipo });

      const shareData = {
        title: item.nome,
        text: item.nome,
        files: [file]
      };

   return await navigator.share(shareData);
  }
  
}