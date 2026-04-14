export class Cliente {
    #id;
    #nome;
    #cpf;
    #dataCad;



    constructor(cId, cNome, cCpf) {
        this.id = cId;
        this.nome = cNome;
        this.cpf = cCpf;
    }
    get id() {
        return this.#id;
    }
    set id(value) {
        if (value !== null && value !== undefined) {
            this.#validarId(value);
        }
        this.#id = value;
    }
    get nome() {
        return this.#nome;
    }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }
    get cpf() {
        return this.#cpf;
    }
    set cpf(value) {
        this.#validarCpf(value);
        this.#cpf = String(value).replace(/\D/g, '');
    }

    #validarId(value) {
        const id = Number(value);
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Verifique o ID informado');
        }
    }
    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 45 ) {
            throw new Error('O campo nome é obrigatório e deve ter entre 3 a 45 caracteres');
        }
    }
    #validarCpf(value) {
    value = value.replace(/[^\d]+/g, '');

    if (value.length !== 11 || /^(\d)\1+$/.test(value)) {
        return false; //limpa o cpf removendo pontos virgulas e outras coisas
    }

    let soma = 0;
    let resto; //acumula e calcula o resultado final 

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(value.substring(i - 1, i)) * (11 - i);
    } //pega cada numero do cpf, multiplica decescente de 10 a 2 e soma tudo

    resto = (soma * 10) / 11;
    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== parseInt(value.substring(9, 10))) {
        return false; //pega o 10 digito do cpf, se for diferente do calculado retorna falso
    }

    soma = 0; //segundo numero

    for (let i = 1; i <= 10; i++) {
        soma += parseInt(value.substring(i - 1, i)) * (12 - i);
    } //agora usa 10 numeros e multiplica de 11 ao 2

    resto = (soma * 10) / 11;
    if (resto === 10 || resto === 11) resto = 0;

    if (resto !== parseInt(value.substring(10, 11))) {
        return false;
    } //compara com o ultimo digito do cpf

    return true;
}

    static criar(dados) {
        return new Cliente(null, dados.nome, dados.cpf);
    }
    static alterar(dados, id) {
        return new Cliente(id, dados.nome, dados.cpf);
    }

}