import { Cliente } from "../models/Cliente.js";
import { Endereco } from "../models/Endereco.js";
import { Telefone } from "../models/Telefone.js";
import clienteRepository from "../repositories/clienteRepository.js";
import axios from "axios";

const clienteController = {

    criar: async (req, res) => {
        try {
            const { nome, cpf, telefones, cep, numero, complemento } = req.body;

            if (!nome || !cpf) {
                return res.status(400).json({ message: "Nome e CPF são obrigatórios" });
            }

            if (!telefones || !Array.isArray(telefones) || telefones.length === 0) {
                return res.status(400).json({ message: "Informe ao menos um telefone" });
            }

            const cepLimpo = cep.replace(/\D/g, "");
            if (cepLimpo.length !== 8) {
                return res.status(400).json({ message: "CEP inválido" });
            }

            const respApi = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);

            if (respApi.data.erro) {
                return res.status(400).json({ message: "CEP não encontrado" });
            }

            const { bairro, localidade, uf, logradouro } = respApi.data;

            const cliente = Cliente.criar({ nome, cpf });

            const endereco = Endereco.criar({
                cep: cepLimpo,
                numero,
                complemento,
                logradouro,
                uf,
                cidade: localidade,
                bairro
            });

            const result = await clienteRepository.criar(cliente, telefones, endereco);

            res.status(201).json({
                message: "Cliente criado com sucesso",
                
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erro ao criar cliente",
                errorMessage: error.message
            });
        }
    },

    editar: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, cpf, telefones, cep, numero, complemento } = req.body;

            const cepLimpo = cep.replace(/\D/g, "");
            if (cepLimpo.length !== 8) {
                return res.status(400).json({ message: "CEP inválido" });
            }

            const respApi = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);

            if (respApi.data.erro) {
                return res.status(400).json({ message: "CEP não encontrado" });
            }

            const { bairro, localidade, uf, logradouro } = respApi.data;

            const dados = {
                nome,
                cpf,
                telefones,
                cep: cepLimpo,
                uf,
                cidade: localidade,
                bairro,
                logradouro,
                numero,
                complemento
            };

            const result = await clienteRepository.editar(id, dados);

            res.status(200).json({
                message: "Cliente atualizado com sucesso",
                data: result
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erro ao editar cliente",
                errorMessage: error.message
            });
        }
    },

    deletar: async (req, res) => {
        try {
            const { id } = req.params;

            const result = await clienteRepository.deletar(id);

            res.status(200).json({
                message: "Cliente deletado com sucesso",
                data: result
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erro ao deletar cliente",
                errorMessage: error.message
            });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await clienteRepository.selecionar();

            res.status(200).json(result);

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erro ao buscar clientes",
                errorMessage: error.message
            });
        }
    }
};

export default clienteController;