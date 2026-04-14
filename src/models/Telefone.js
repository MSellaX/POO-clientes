export class Telefone {
    #id;
    #telefone;
    #idCliente;

    constructor(telefone, idCliente, id) {
        this.id = id;
        this.telefone = telefone;
        this.idCliente = idCliente;
    }

   

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    get telefone() {
        return this.#telefone;
    }

    set telefone(value) {
        this.#validarTelefone(value);
        this.#telefone = value;
    }

    get idCliente() {
        return this.#idCliente;
    }

    set idCliente(value) {
        this.#validarIdCliente(value);
        this.#idCliente = value;
    }

   

    #validarId(value) {
        if (value && value <= 0) {
            throw new Error('Verifique o ID informado');
        }
    }

    #validarTelefone(value) {
        const tel = value?.trim();

        if (!tel || tel.length < 10 || tel.length > 11) {
            throw new Error('Telefone invalido');
        }

    }

    #validarIdCliente(value) {
        if (value && value <= 0) {
            throw new Error('Verifique o idCliente informado');
        }
    }

    

    static criar(dados) {
        return new Telefone( dados.telefone, dados.idCliente,null);
    }

    static alterar(dados, id) {
        return new Telefone(dados.telefone, dados.idCliente, id);
    }
}
