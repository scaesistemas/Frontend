import {
  EnumTipoAnoInicioReajuste,
  EnumTipoMesReajuste,
} from "@/core/models/contratos";
import {
  EnumTipoIntervaloParcelas,
  ReceitaParcela,
} from "@/core/models/financeiro";
import { Permissao } from "@/core/models/geral";
import Swal from "sweetalert2"; // Import the Swal library

function TableToExcel(table: any, worksheet?: string) {
  const uri = "data:application/vnd.ms-excel;base64,",
    template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body>{table}</body></html>',
    base64 = function (s: string) {
      return window.btoa(unescape(encodeURIComponent(s)));
    },
    format = function (s: string, c: any) {
      return s.replace(/{(\w+)}/g, function (m, p) {
        return c[p];
      });
    };

  if (!table.nodeType) {
    table = document.getElementById(table)!.querySelectorAll("div")[0];
  }
  const ctx = { worksheet: worksheet || "Resultado", table: table.innerHTML };

  return (window.location.href = uri + base64(format(template, ctx)));
}

function TratarErroApi(error) {
  if (!error.response) {
    return Swal.fire("Aviso", "Não foi possível acessar a API", "error");
  } else if (error.response.status == 403) {
    return Swal.fire("Aviso", error.response.data.message, "warning");
  } else {
    return Swal.fire(
      "Aviso",
      error.response.data,
      error.response.status == 400 ? "warning" : "error"
    );
  }
}

function ConstruirQueryParams(parametros: Record<string, unknown>) {
  return Object.entries(parametros)
    .map(([key, value]) => [key, value ? (value as string).toString() : ""])
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
}

function TableToExcel2(table: any, sizecols: any) {
  if (!table.nodeType) {
    table = document.getElementById(table)!.querySelectorAll("div")[0];
  }

  var data: any = [];
  var headers: any = [];
  let child = table.getElementsByTagName("tr");

  let th: any = child[0].children;

  for (var d = 0; d < th.length; d++) {
    headers.push(th[d].textContent);
  }

  for (var i = 1; i < child.length; i++) {
    // th = headers// td == dados// tr = linhas
    var td = child[i].children;
    let innerJSON = {};

    for (var j = 0; j < td.length; j++) {
      innerJSON[th[j].textContent] = td[j].textContent;
    }
    data.push(innerJSON);
  }

  /* Gera o Excel*/
  const XLSX = require("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });
  let cols: any = [];

  for (let i = 0; i < sizecols.tamanhos.length; i++) {
    cols.push({ wch: sizecols.tamanhos[i] });
  }
  worksheet["!cols"] = cols;
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, "download.xls");
}

function FormatarNumeroTelefone(telefone) {
  telefone = telefone.replace("-", "");
  telefone = telefone.replace("(", "");
  telefone = telefone.replace(")", "");
  telefone = telefone.replace(" ", "");
  telefone = telefone.trim();

  return telefone;
}

function hasPermissao(permissoes: number[], permissao: Permissao): boolean {
  return permissoes?.some(x => x === permissao) ?? false;
}

function MoedaFormatada(
  n: any,
  c: any,
  d: any,
  t: any,
  s: any,
  j: any,
  i: any,
  moneySign: any
) {
  (c = isNaN((c = Math.abs(c))) ? 2 : c),
    (d = d == undefined ? "," : d),
    (t = t == undefined ? "." : t),
    (s = n < 0 ? "-" : ""),
    (i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + ""),
    (j = (j = i.length) > 3 ? j % 3 : 0);
  return (
    " R$ " +
    s +
    (j ? i.substr(0, j) + t : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : "")
  );
}

function SituacaoColor(item) {
  if (item.agrupadorId > 0 || (item.receita ? item.receita.agrupadorId > 0 : 0))
    return "deep-purple lighten-3";
  else if (item.isAgrupador == true) return "deep-purple";
  else if (item.situacaoId == 3) return "teal lighten-1";
  else if (item.situacaoId == 2) return "grey lighten-1";
  else if (item.situacaoId == 4) return "lime lighten-3";
  else if (item.situacaoId == 5) return "yellow lighten-1";
  else if (
    new Date(item.dataVencimento).yyyymmdd() < new Date().yyyymmdd() &&
    new Date(item.dataVencimentoParcela).yyyymmdd() < new Date().yyyymmdd()
  )
    return "red lighten-3";
  else if (item.situacaoId == 1) return "blue lighten-3";
}

function JSONToCSVConvertor(
  JSONData: JSON,
  ReportTitle: string,
  ShowLabel: boolean
) {
  let arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;

  let CSV = "";

  //CSV += ReportTitle + '\r\n\n';

  if (ShowLabel) {
    let row = "";

    for (let index in arrData[0]) {
      row += index + ";";
    }

    row = row.slice(0, -1);

    CSV += row + "\r\n";
  }

  //1st loop is to extract each row
  for (let i = 0; i < arrData.length; i++) {
    let row = "";

    //2nd loop will extract each column and convert it in string comma-seprated
    for (let index in arrData[i]) {
      row += arrData[i][index] + ";";
    }

    row.slice(0, row.length - 1);

    CSV += row + "\r\n";
  }

  if (CSV == "") {
    alert("Invalid data");
    return;
  }

  var fileName = "Excel_";

  fileName += ReportTitle.replace(/ /g, "_");

  //csv or xls
  var uri = "data:text/csv;charset=utf-8," + escape(CSV);

  var link = document.createElement("a");
  link.href = uri;

  //link.style = "visibility:hidden";
  link.download = fileName + ".csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function TrataDateTime(data: String): string {
  return data.replace(/-/g, "/").replace("T", " ");
}

function AnoMesDia(data: Date): string {
  const mm = data.getMonth() + 1;
  const dd = data.getDate();

  return isNaN(mm)
    ? ""
    : [
        data.getFullYear(),
        (mm > 9 ? "" : "0") + mm,
        (dd > 9 ? "" : "0") + dd,
      ].join("-");
}
function createDate(days, months, years) {
  var date = new Date();
  date.setDate(days);
  date.setMonth(date.getMonth() + months);
  date.setFullYear(date.getFullYear() + years);
  return date;
}
function DiaMesAno(data: Date): string {
  const mm = data.getMonth() + 1;
  const dd = data.getDate();

  return isNaN(mm)
    ? ""
    : [
        (dd > 9 ? "" : "0") + dd,
        (mm > 9 ? "" : "0") + mm,
        data.getFullYear(),
      ].join("/");
}

function DiaMesAnoHora(data: Date) {
  const mm = data.getMonth() + 1;
  const dd = data.getDate();

  const novaData = isNaN(mm)
    ? ""
    : [
        (dd > 9 ? "" : "0") + dd,
        (mm > 9 ? "" : "0") + mm,
        data.getFullYear(),
      ].join("/");

  const novaHora = data.toLocaleTimeString().substring(0, 5);

  return `${novaData} ${novaHora}`;
}

function formatDate(date: Date, format: string): string {
  if (!date) {
    return "";
  }

  // Garante que `date` seja um objeto Date válido
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) {
    return ""; // Retorna vazio se a data for inválida
  }

  const year = parsedDate.getFullYear();
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
  const day = parsedDate.getDate().toString().padStart(2, "0");

  if (format === "yyyy-MM-dd") {
    return `${year}-${month}-${day}`;
  }

  if (format === "dd-MM-yyyy") {
    return `${day}-${month}-${year}`;
  }

  return "";
}

function ObterTipoAno(ano) {
  switch (ano) {
    case EnumTipoAnoInicioReajuste.UmAnoAposContrato:
      return 1;

    case EnumTipoAnoInicioReajuste.DoisAnosAposContrato:
      return 2;

    case EnumTipoAnoInicioReajuste.TresAnosAposContrato:
      return 3;

    default:
      return 0;
  }
}

function ObterTipoMes(mes) {
  switch (mes) {
    // case EnumTipoMesReajuste.UmaParcelaEntrada:
    // break;

    //case EnumTipoMesReajuste.UmaParcelaFinanciamento:
    /* Implemente a lógica para este caso */
    //  break // this.ObservarFinanciamento();

    case EnumTipoMesReajuste.UmMesAntesContrato:
      return -1;

    case EnumTipoMesReajuste.DoisMesesAntesContrato:
      return -2;

    case EnumTipoMesReajuste.TresMesesAntesContrato:
      return -3;

    case EnumTipoMesReajuste.UmMesDepoisContrato:
      return 1;

    case EnumTipoMesReajuste.DoisMesesDepoisContrato:
      return 2;

    case EnumTipoMesReajuste.TresMesesDepoisContrato:
      return 3;

    default:
      return 0;
  }
}
function GenerateYearOptions() {
  var currentYear = new Date().getFullYear();
  var min = currentYear - 10;
  var max = currentYear + 5;

  const anos: any = [];

  for (let i = min; i <= max; i++) {
    anos.push(i);
  }

  return anos;
}

function ObterMelhorDia(dataInicial, melhorDia, i) {
  const dia =
    melhorDia > 0
      ? i === 1
        ? dataInicial.getDate()
        : melhorDia
      : dataInicial.getDate();
  return dia;
}

function CalcularDataParcela(
  dataInicial: Date,
  tipoIntervaloParcela: any,
  parcelaNumero: number,
  dia: number,
  mes?: any
): Date {
  switch (tipoIntervaloParcela) {
    case EnumTipoIntervaloParcelas.Quinzenal:
      if (parcelaNumero === 1) {
        return new Date(dataInicial.getFullYear(), dataInicial.getMonth(), dia);
      } else {
        const dataParcelaAnterior = CalcularDataParcela(
          dataInicial,
          tipoIntervaloParcela,
          parcelaNumero - 1,
          dia
        );
        const novaData = new Date(dataParcelaAnterior);
        novaData.setDate(dataParcelaAnterior.getDate() + 15);
        return novaData;
      }
    case EnumTipoIntervaloParcelas.Bimestral:
      return new Date(
        dataInicial.getFullYear(),
        dataInicial.getMonth() + (parcelaNumero - 1) * 2,
        dia
      );

    case EnumTipoIntervaloParcelas.Trimestral:
      return new Date(
        dataInicial.getFullYear(),
        dataInicial.getMonth() + (parcelaNumero - 1) * 3,
        dia
      );

    case EnumTipoIntervaloParcelas.Quadrimestral:
      return new Date(
        dataInicial.getFullYear(),
        dataInicial.getMonth() + (parcelaNumero - 1) * 4,
        dia
      );

    case EnumTipoIntervaloParcelas.Semestral:
      return new Date(
        dataInicial.getFullYear(),
        dataInicial.getMonth() + (parcelaNumero - 1) * 6,
        dia
      );

    case EnumTipoIntervaloParcelas.Anual:
      return new Date(
        dataInicial.getFullYear() + (parcelaNumero - 1),
        dataInicial.getMonth(),
        dia
      );

    default:
      return new Date(
        dataInicial.getFullYear(),
        dataInicial.getMonth() + parcelaNumero - 1,
        dia
      );
  }
}

function CalcularDataParcela2(
  dataInicial,
  tipoIntervaloParcela,
  i,
  dia,
  mes?: any
) {
  switch (tipoIntervaloParcela) {
    case EnumTipoIntervaloParcelas.Quinzenal:
      if (i === 1) {
        return new Date(dataInicial.getFullYear(), dataInicial.getMonth(), dia);
      } else {
        const dataParcelaAnterior = CalcularDataParcela(
          dataInicial,
          tipoIntervaloParcela,
          i - 1,
          dia
        );
        const novaData = new Date(dataParcelaAnterior);
        novaData.setDate(dataParcelaAnterior.getDate() + 15);
        return novaData;
      }
    case EnumTipoIntervaloParcelas.Bimestral:
      return new Date(
        dataInicial.getFullYear(),
        dataInicial.getMonth() + (i - 1) * 2,
        dia
      );

    case EnumTipoIntervaloParcelas.Trimestral:
      return new Date(
        dataInicial.getFullYear(),
        dataInicial.getMonth() + (i - 1) * 3,
        dia
      );

    case EnumTipoIntervaloParcelas.Quadrimestral:
      return new Date(
        dataInicial.getFullYear(),
        dataInicial.getMonth() + (i - 1) * 4,
        dia
      );

    case EnumTipoIntervaloParcelas.Semestral:
      return new Date(
        dataInicial.getFullYear(),
        dataInicial.getMonth() + (i - 1) * 6,
        dia
      );

    case EnumTipoIntervaloParcelas.Anual:
      return new Date(dataInicial.getFullYear() + i - 1, mes, dia);

    default:
      return new Date(
        dataInicial.getFullYear(),
        dataInicial.getMonth() + i - 1,
        dia
      );
  }
}

export {
  formatDate,
  GenerateYearOptions,
  ConstruirQueryParams,
  ObterMelhorDia,
  CalcularDataParcela,
  ObterTipoMes,
  ObterTipoAno,
  SituacaoColor,
  MoedaFormatada,
  FormatarNumeroTelefone,
  TableToExcel,
  TratarErroApi,
  TableToExcel2,
  TrataDateTime,
  AnoMesDia,
  DiaMesAno,
  DiaMesAnoHora,
  JSONToCSVConvertor,
  createDate,
  hasPermissao
};
