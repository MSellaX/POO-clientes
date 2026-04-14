import { Cliente } from "../models/Cliente.js";
import { Endereco } from "../models/Endereco.js";
import { Telefone } from "../models/Telefone.js";
import clienteRepository from "../repositories/clienteRepository.js";
import axios from "axios";

const clienteController = {

    criar: async (req, res) => {
        try {
            const { nome, cpf, telefone, cep, numero, complemento } = req.body;
            const cepLimpo = cep.replace(/\D/g, "");

            if (cepLimpo.length !== 8) {
                return res.status(400).json({ message: "CEP inválido" });
            }

            const respApi = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);


            const {bairro, localidade, uf, logradouro} = respApi.data;

            const clientes = Cliente.criar({ nome, cpf });

            const telefoneObj = Telefone.criar({ telefone });

            const enderecos = Endereco.criar({
                cep,
                numero,
                complemento,
                logradouro,
                uf,
                cidade: localidade,
                bairro
            })
            
            const result = await clienteRepository.criar(clientes, telefoneObj, enderecos);
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erro ao criar cliente",
                errorMessage: error.message
            });
        }
        console.log (req.body)
    },


    editar: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, cpf, telefones, cep, numero, complemento } = req.body;

            const cepLimpo = cep.replace(/\D/g, "");
            if (cepLimpo.length !== 8) {
                return res.status(400).json({ message: "CEP inválido" });
            }

            const cepData = await consultaCep(cepLimpo);

            const dados = {
                nome,
                cpf,
                telefones,
                cep: cepLimpo,
                uf: cepData.uf,
                cidade: cepData.localidade,
                bairro: cepData.bairro,
                logradouro: cepData.logradouro,
                numero,
                complemento
            };

            const result = await clienteRepository.editar(id, dados);
            res.status(200).json(result);

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
            const id = req.params.id;
            const result = await clienteRepository.deletar(id);
            res.status(200).json({result});
            
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Ocorreu um erro no servidor', errorMessage: error.message})
        }
    },

    selecionar: async (req, res) => {
        try {
            const { id } = req.params;

            const result = await clienteRepository.selecionar(id);

            res.status(200).json(result);

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erro ao buscar cliente",
                errorMessage: error.message
            });
        }
    }
};

async function consultaCep(cep) {
    try {
        const respApi = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        if (respApi.data.erro) {
            throw new Error("CEP não encontrado");
        }

        return respApi.data;
    } catch (error) {
        console.error(error);
        throw new Error(`Erro ao buscar CEP: ${error.message}`);
    }
}

export default clienteController;