export default class Regras {

    //CNPJ  59.066.550/0001-56(14) - 59066550000156 - 2, 6, 10, 15
    //CPF   446.317.920-35(11) - 44631792035 - 4, 8, 12
    //RG    48.932.747-3(9) - 489327473 - 3, 7, 11

    static Rg(rg: string) { 
        rg = `${rg}`;

        if(rg.split('').some(s => s != '.' && s != '-' && isNaN(+s)))
            return ['Caracteres Inválidos.'];
        
        let valor = rg.replace(/[.-]/g, '');

        if (valor.length == 0)
            return 'Campo Obrigatório';

        if (valor.length != 9)
            return 'Tamanho Inválido';

        return true;
    }

    static cpfCnpj(cpfCnpj: string) {
        cpfCnpj = `${cpfCnpj}`;
        
        //Verificar se existe caracteres inválidos
        if(cpfCnpj.split('').some(s => s != '.' && s != '-' && s != '/' && isNaN(+s)))
            return 'Caracteres Inválidos.';

        let valor = cpfCnpj.replace(/[/.-]/g, '');

        if (valor.length == 0)
            return 'Campo Obrigatório';

        if(valor.length < 11)
        return 'Tamanho Inválido';

        if (valor.length == 11)
        {
         cpfCnpj = cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3\-\$4")
         
        }else if(valor.length == 14){
            cpfCnpj = cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5")
        }else{
            return 'Formato Inválido';
        }
    }

    static Numeros(Numeros:string){
        Numeros = `${Numeros}`;

        if(Numeros.split('').some(s => s != '.' && s != '-' && s != '/' && isNaN(+s)))
        return 'Caracteres Inválidos.';  
    }
}