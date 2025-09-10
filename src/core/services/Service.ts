import { http } from '../api'
import { AnoMesDia } from '@/assets/scripts/helper';

export class Service {
 
  private _nomeControle: string = '';

  constructor(nomeControle: string) { 
    this._nomeControle = nomeControle;
  }

  protected GetHeader(include?: string){
    
    let header = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "include": "" 
      }
    };

    if (include) {
      header.headers.include = include;
    }

    return header;
  }
  protected GetParamentroPaginacaoOrdenacao1(page: number, pageSize: number, sortBy: string, desc: any[], expand: string, filter: string) {
    let strParameters = '';

    if (pageSize > 0) {
      strParameters = '?$Top=' + pageSize;

      if (page) {
        strParameters += '&$Skip=' + (page - 1) * pageSize;
      }
    }

    if (sortBy.length === 1) {
      strParameters += strParameters ? "&" : "?";
      strParameters += "$OrderBy=" + sortBy;

      if (desc.length === 1) {
        if (desc[0] === true) {
          strParameters += " desc";
        }
      }
    }

    if (expand) {
      strParameters += strParameters ? "&" : "?";
      strParameters += "$Expand=" + expand;
    }

    if (filter) {
      strParameters += strParameters ? "&" : "?";

      strParameters += "$Filter=" + filter;
    }

    return strParameters;
  }

  protected GetParamentroPaginacaoOrdenacao(page: number, pageSize: number, sortBy: any[], desc: any[], search: any, columns?: any[], filter?: string,expand?:string, select?:string){
    let strParameters = '';

    if (pageSize){
      if (pageSize > -1) {
        strParameters = '?$Top=' + pageSize;

        if (page){
          strParameters += '&$Skip=' + (page - 1) * pageSize;
        }
      }
    }

    if (sortBy){

      if (sortBy.length > 0){
      
        strParameters += strParameters ? '&' : '?';
        strParameters += '$OrderBy=';

        sortBy.forEach(function (item: any, index: number){

          strParameters += item.replace('.', '/');

          if (desc.length > 0) {
            if (desc[index] === true) {
              strParameters += ' desc';
            }
          }

          if (index < sortBy.length - 1) {
            strParameters += ', ';
          }

        });
  
      }
    }

    if (search){

      strParameters += strParameters ? '&' : '?';

      let newColumns: any[] = [];

      columns!.forEach(column => {
      
        if (column.value && column.value != 'actions') {

          if (column.type) {
            if (column.type === 'number' && !isNaN(search)){
              newColumns.push(`${column.value} eq ${search}`);
            }
            else if (column.type === 'date' && search.length === 10){
              if (search.indexOf('/') == 2 && search.indexOf('/', 3) == 5){
                const [day, month, year] = search.split("/");

                if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {

                  const data = AnoMesDia(new Date(year, month-1, day));
                  newColumns.push(`${column.value} eq ${data}`);
                }
              }
            }
            else if (column.type === 'boolean' && typeof search === "boolean"){
              newColumns.push(`Contains(tolower(${column.value}), tolower('${search}'))`);
            }
          }
         else {          
          column.value != null &&
          search != null &&
          typeof column.value === 'string' &&
          column.value.toString().toLocaleLowerCase().indexOf(search) !== -1

            newColumns.push(`Contains(tolower(${column.value}), tolower('${search}'))`);
          }
        }
  
      });

      strParameters += '$filter=' + newColumns.join(' or ');
    }

    
  if (expand) {
    strParameters += strParameters ? "&" : "?";
    const ids = expand.split(',') 

    for(let i = 0; i < ids.length; i++){

      if(i > 0){
        strParameters += "&";
      }

      if(ids[i].indexOf("/") != -1){         
        let formatarExpands = '';
        let resultado2 = ids[i].split("/")[0];
        formatarExpands += resultado2;
 
        let expandsColluns  = '';
        let resultado = ids[i].substring(ids[i].indexOf("/") + 1);
        expandsColluns += `(${"$select=" + resultado})`;

        strParameters += "$expand=" + formatarExpands + expandsColluns;
      }else{
        strParameters += "$expand=" + ids[i];
      }
    }
  }
     
   

    if (select){
      strParameters += strParameters ? "&" : "?";

      strParameters += '$select=' + select;
    }
     

    return strParameters;
  }
  protected concatIds = (lista, paramName) => {
    if (typeof lista !== 'string') {
      return '';  
    }

    const ids = lista.split(',').map(Number).filter(x => x !== 0).map(x => `${paramName}=${x}`).join('&');
    return ids !== '' ? `${ids}&` : ''; 
  };

  public Listar(page: number, pageSize: number, sortBy: any[], desc: any[]) : Promise<any>;
  public Listar(page: number, pageSize: number, sortBy: any[], desc: any[], search: any, columns: any[]) : Promise<any>;
  public Listar(page: number, pageSize: number, sortBy: any[], desc: any[], search: any, columns: any[], filtro?: any, include?: string) : Promise<any>;
  public Listar(page: number, pageSize: number, sortBy: any[], desc: any[], search: any, columns: any[], filtro?: any, include?: string) : Promise<any>;
  public Listar(page: number, pageSize: number, sortBy: any[], desc: any[], search: any, columns: any[], filtro: any, include?: string) : Promise<any>;
  public Listar(page: number, pageSize: number, sortBy: any[], desc: any[], search: any, columns: any[], filtro: any, expand?:string, select?:string,   include?: string) : Promise<any>;
  public Listar(page: number, pageSize: number, sortBy: any[], desc: any[], search?: any, columns?: any[], filtro?: any,expand?:string, select?:string, include?: string) : Promise<any> {
   
    let parametros = this.GetParamentroPaginacaoOrdenacao(page, pageSize, sortBy, desc, search, columns, filtro, expand, select);
    parametros = this.GetFiltro(parametros, filtro);
    
    return http.get(`${this._nomeControle}${parametros}`, this.GetHeader(include)); 
  }

  private GetFiltro(parametros: string, filtro: any){

    if (filtro) {
        let paramTemp = '';

        if(filtro.id){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `id eq ${filtro.id}`;
        } 

        
        if(filtro.nome){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `nome eq '${filtro.nome}'`;
        } 
        
        if(filtro.cnpjCpf){
            if(paramTemp){paramTemp += ' and '; }
            paramTemp += `cnpjCpf eq '${filtro.cnpjCpf}'`;
        } 

        if(filtro.rg){
            if(paramTemp){paramTemp += ' and '; }
            paramTemp += `rg eq '${filtro.rg}'`;
        }
        
        if(filtro.email){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `email eq '${filtro.email}'`;
         }

        if(filtro.dataNascimento){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `dataNascimento eq ${filtro.dataNascimento}`;
        }

        if(filtro.tipoId){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `tipoId eq ${filtro.tipoId}`;
        }

        if(filtro.isFornecedor){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `isFornecedor eq ${filtro.isFornecedor}`;
        }

        if(filtro.aprovado == false){
          if(paramTemp){paramTemp += ' and '; }
          paramTemp += `aprovacao/aprovado eq ${filtro.aprovado}`;
        }

        if (filtro.classeId > 0){
          if(paramTemp) { paramTemp += ' and '; }
          paramTemp += `classeId eq ${filtro.classeId}`
        }

        if (filtro.origemId > 0){
          if(paramTemp) { paramTemp += ' and '; }
          paramTemp += `origemId eq ${filtro.origemId}`
        }

        if (filtro.unidadeId > 0){
            if(paramTemp) { paramTemp += ' and '; }
            paramTemp += `unidadeId eq ${filtro.unidadeId}`
        }

        if (filtro.empresaId > 0){
          if(paramTemp) { paramTemp += ' and '; }
          paramTemp += `empresaId eq ${filtro.empresaId}`
       }

      if (filtro.codigo){
        if(paramTemp) { paramTemp += ' and '; }
        paramTemp += `codigo eq '${filtro.codigo}'`
      }

      if (filtro.descricao){
        if(paramTemp) { paramTemp += ' and '; }
      //   paramTemp += `descricao eq '${filtro.descricao}'`
        paramTemp += `Contains(tolower(descricao), tolower('${filtro.descricao}'))`
      }

      if (filtro.tipoIndiceId > 0){
        if(paramTemp) { paramTemp += ' and '; }
        paramTemp += `tipoIndiceId eq ${filtro.tipoIndiceId}`
     }

     if (filtro.mes > 0){
      if(paramTemp) { paramTemp += ' and '; }
      paramTemp += `mes eq ${filtro.mes}`
   }

   if (filtro.ano > 0){
    if(paramTemp) { paramTemp += ' and '; }
    paramTemp += `ano eq ${filtro.ano}`
 }
 
       if (filtro.selectedOptions) {
        let conditions = '';
      
        if (filtro.selectedOptions) {
          let isCliente = filtro.selectedOptions.includes('isCliente');
          let isProprietario = filtro.selectedOptions.includes('isProprietario');
          let isFornecedor = filtro.selectedOptions.includes('isFornecedor');
          let isCorretor = filtro.selectedOptions.includes('isCorretor');
          let isSeguradora = filtro.selectedOptions.includes('isSeguradora');
      
          if (isCliente) {
            conditions += `isCliente eq ${isCliente}`;
          }
      
          if (isProprietario) {
            if (conditions) conditions += ' or ';
            conditions += `isProprietario eq ${isProprietario}`;
          }
      
          if (isFornecedor) {
            if (conditions) conditions += ' or ';
            conditions += `isFornecedor eq ${isFornecedor}`;
          }
      
          if (isCorretor) {
            if (conditions) conditions += ' or ';
            conditions += `isCorretor eq ${isCorretor}`;
          }
      
          if (isSeguradora) {
            if (conditions) conditions += ' or ';
            conditions += `isSeguradora eq ${isSeguradora}`;
          }
        }
      
        if (conditions) {
          if (paramTemp) {
            paramTemp += ' and ';
          }
          paramTemp += conditions;
        }
      }

        if (paramTemp) {

          if(parametros){
            parametros += '&';
          }
          else {
            parametros += '?';
          }

          parametros += `$filter=${paramTemp}`;
        }
    }
 
    return parametros;  
  } 

  public ListarTudo(sortBy?: string) : Promise<any>{
    let strParameters = this._nomeControle;

    if (sortBy){
      strParameters += `?$orderby=${sortBy}`;
    }

    return http.get(strParameters, this.GetHeader());
  }

  public ListarTudoFiltro(filter: string,include?: string) {
    return http.get(`${this._nomeControle}${this.GetParamentroPaginacaoOrdenacao1(0, 0, '', [],'', filter)}`, this.GetHeader(include));
  }

  public ObterPorId(id: number) : Promise<any>;
  public ObterPorId(id: number, include: string) : Promise<any>;
  public ObterPorId(id: number, include?: string) : Promise<any> {
      return http.get(`${this._nomeControle}/${id}`, this.GetHeader(include))
  }
    
  public Excluir(id: number){
    return http.delete(`${this._nomeControle}/${id}`, this.GetHeader());
  }
 

  public async Salvar(modelo: Shared.IEntity) {
    return modelo.id > 0 ? await http.put(`${this._nomeControle}/${modelo.id}`, modelo, this.GetHeader()) : await http.post(this._nomeControle, modelo, this.GetHeader());
  }
 
  public async Patch(modelo: any, id: number, include?:string) {
    return await http.patch(`${this._nomeControle}/${id}`, modelo, this.GetHeader(include));
  }

  // public Salvar(modelo: Shared.IEntity) : Promise<any>;
  // public Salvar(modelo: any, id: number) : Promise<any>;
  // public async Salvar(modelo: any, id?: number) : Promise<any> {
  //   if (id){
  //     if (id > 0){
  //       return await http.patch(`${this._nomeControle}/${id}`, modelo, this.GetHeader())    
  //     }else{
  //      return await http.post(this._nomeControle, modelo, this.GetHeader()) 
  //     }
  //   } 
  // }
 
  public GetNomeControle(): string {
    return this._nomeControle;
  } 

  AutoComplete(q: string, isCliente?: boolean, isFornecedor?: boolean, isCorretor?: boolean, isProprietario?: boolean, isSeguradora?: boolean, 
    isAdministradora?: boolean, isConstrutora?: boolean, isTransportadora?: boolean) {
    
      let cliente = isCliente;
      let fornecedor = isFornecedor;
      let corretor = isCorretor;
      let proprietario = isProprietario;
      let seguradora = isSeguradora;
      let administradora = isAdministradora;
      let construtora = isConstrutora; 
      let transportadora = isTransportadora;

      return http.get(`${this._nomeControle}/AutoComplete?q=${q}&isCliente=${cliente}&isFornecedor=${fornecedor}&isCorretor=${corretor}&isProprietario=${proprietario}&isSeguradora=${seguradora}&isAdministradora=${administradora}&isConstrutora=${construtora}&isTransportadora=${transportadora}`);
  }

}  