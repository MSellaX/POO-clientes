import { connection } from "../config/Database.js";

const clienteRepository = {

    criar: async (cliente, telefones, endereco) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            // Cliente
            const [resCli] = await conn.execute(
                "INSERT INTO clientes(nome, cpf) VALUES (?, ?)",
                [cliente.nome, cliente.cpf]
            );

            const idCliente = resCli.insertId;

            // Telefones (vários)
            for (const tel of telefones) {
                await conn.execute(
                    "INSERT INTO telefones(idCliente, telefone) VALUES (?, ?)",
                    [idCliente, tel]
                );
            }

            // Endereço
            await conn.execute(
                `INSERT INTO enderecos(idCliente, complemento, bairro, cidade, uf, cep, numero, logradouro)
                 VALUES (?,?,?,?,?,?,?,?)`,
                [
                    idCliente,
                    endereco.complemento,
                    endereco.bairro,
                    endereco.cidade,
                    endereco.uf,
                    endereco.cep,
                    endereco.numero,
                    endereco.logradouro
                ]
            );

            await conn.commit();

            return { idCliente };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    editar: async (id, dados) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            // Cliente
            await conn.execute(
                "UPDATE clientes SET nome = ?, cpf = ? WHERE id = ?",
                [dados.nome, dados.cpf, id]
            );

            // Endereço
            await conn.execute(
                `UPDATE enderecos 
                 SET cep=?, uf=?, cidade=?, bairro=?, logradouro=?, numero=?, complemento=? 
                 WHERE idCliente=?`,
                [
                    dados.cep,
                    dados.uf,
                    dados.cidade,
                    dados.bairro,
                    dados.logradouro,
                    dados.numero,
                    dados.complemento,
                    id
                ]
            );

            // Telefones (remove e recria)
            await conn.execute(
                "DELETE FROM telefones WHERE idCliente = ?",
                [id]
            );

            for (const tel of dados.telefones) {
                await conn.execute(
                    "INSERT INTO telefones(idCliente, telefone) VALUES (?, ?)",
                    [id, tel]
                );
            }

            await conn.commit();

            return { id };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    deletar: async (id) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            await conn.execute("DELETE FROM telefones WHERE idCliente = ?", [id]);
            await conn.execute("DELETE FROM enderecos WHERE idCliente = ?", [id]);
            await conn.execute("DELETE FROM clientes WHERE id = ?", [id]);

            await conn.commit();

            return { id };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    selecionar: async () => {
        try {
            const [rows] = await connection.execute(`
                SELECT 
                    *
                FROM clientes c
                INNER JOIN enderecos e ON e.idCliente = c.id
                INNER JOIN telefones t ON t.idCliente = c.id
                ORDER BY c.id DESC
            `);

            return rows;

        } catch (error) {
            throw error;
        }
    }
};

export default clienteRepository;