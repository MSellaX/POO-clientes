export class Endereco {
    #id;
    #idCliente;
    #cep;
    #uf;
    #cidade;
    #bairro;
    #complemento;
    #logradouro;
    #numero;

    constructor(eId, eIdCliente, eCep, eUf, eCidade, eBairro, eComplemento, eLogradouro, eNumero) {
        this.id = eId;
        this.idCliente = eIdCliente;
        this.cep = eCep;
        this.uf = eUf;
        this.cidade = eCidade;
        this.bairro = eBairro;
        this.complemento = eComplemento;
        this.logradouro = eLogradouro;
        this.numero = eNumero;
    }
    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get idCliente() {
        return this.#idCliente;
    }

    set idCliente(value) {
        this.#idCliente = value;
    }

    get cep() {
        return this.#cep;
    }

    set cep(value) {
        this.#validarCep(value);
        this.#cep = value;
    }

    get uf() {
        return this.#uf;
    }

    set uf(value) {
        this.#uf = value;
    }

    get cidade() {
        return this.#cidade;
    }

    set cidade(value) {
        this.#cidade = value;
    }

    get bairro() {
        return this.#bairro;
    }

    set bairro(value) {
        this.#bairro = value;
    }

    get complemento() {
        return this.#complemento;
    }

    set complemento(value) {
        this.#complemento = value || "";
    }

    get logradouro() {
        return this.#logradouro;
    }

    set logradouro(value) {
        this.#logradouro = value;
    }

    get numero() {
        return this.#numero;
    }

    set numero(value) {
        this.#numero = value;
    }


    #validarCep(value) {
        const cep = String(value).replace(/\D/g, '');
        if (!cep || cep.length !== 8) {
            throw new Error('Verifique o CEP informado');
        }
    }

    static criar(dados){
        return new Endereco(
            null,
            dados.idCliente || null,
            dados.cep,
            dados.uf,
            dados.cidade,
            dados.bairro,
            dados.complemento,
            dados.logradouro,
            dados.numero
        );
    }
    static alterar(dados, id){
        return new Endereco(
            id,
            dados.idCliente,
            dados.cep,
            dados.uf,
            dados.cidade,
            dados.bairro,
            dados.complemento,
            dados.logradouro,
            dados.numero
        );
    }
}