const helper = require('./helper');

interface Date {
    yyyymmdd(): string;
    ddmmyyyy(): string;
}

interface Number {
    toMoeda(comCifra: Boolean): String;
}


interface Boolean {
    toSimNao(): String;
}

interface String {
    normalizado(): string;
    cpfCnpjRg(): string;
    toDateTimeDDMMYYYY() : string;
    toDateDDMMYYYY() : string;
}

Date.prototype.yyyymmdd = function () {
    var mm = this.getUTCMonth() + 1;
    var dd = this.getUTCDate();

    return isNaN(mm) ? '' : [this.getUTCFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('-');
};

Date.prototype.ddmmyyyy = function () {
    var mm = this.getUTCMonth() + 1;
    var dd = this.getUTCDate();

    return isNaN(mm) ? '' : [(dd > 9 ? '' : '0') + dd,
    (mm > 9 ? '' : '0') + mm,
    this.getUTCFullYear()
    ].join('/');
}; 


String.prototype.toDateDDMMYYYY = function() {

    if (!this) {
        return '';
    }

    return helper.DiaMesAno(new Date(helper.TrataDateTime(this)));
}

Number.prototype.toMoeda = function (comCifra: Boolean = false) {
    var numero = this.toFixed(2).split('.');
    var cifra = comCifra ? "R$ " : "";
    numero[0] = cifra + numero[0].split(/(?=(?:...)*$)/).join('.');

    return numero.join(',');
    //return isNaN(this) ? 0 : numero.join(',');
};

Boolean.prototype.toSimNao = function () {
    return this == false ? 'Não' : 'Sim';
}

String.prototype.normalizado = function () {
    return this.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

String.prototype.cpfCnpjRg = function (): string {
    //CNPJ  59.066.550/0001-56(14) - 59066550000156 - 2, 6, 10, 15
    //CPF   446.317.920-35(11) - 44631792035 - 3, 7, 11
    //RG    48.932.747-3(9) - 489327473 - 2, 6, 10
    
    //Limpa a string
    let str = this.replace(/[./-]/g, '').split('');

    if (this.length == 14) {
        //CNPJ
        str.splice(2, 0, '.');
        str.splice(6, 0, '.');
        str.splice(10, 0, '/');
        str.splice(15, 0, '-');
        return str.join('');
    }else if(this.length == 11){
        //CPF
        str.splice(3, 0, '.')
        str.splice(7, 0, '.')
        str.splice(11, 0, '-')
        return str.join('');
    } else if(this.length == 9){
        //RG
        str.splice(2, 0, '.')
        str.splice(6, 0, '.')
        str.splice(10, 0, '-')
        return str.join('');
    }else{
        return `${this}`;
    }
}

String.prototype.toDateTimeDDMMYYYY = function() {

    if (!this) {
        return '';
    }

    return helper.DiaMesAnoHora(new Date(helper.TrataDateTime(this)));
}