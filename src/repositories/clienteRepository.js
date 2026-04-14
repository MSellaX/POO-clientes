import { Connection } from "mysql2";
import { connection } from "../config/Database.js";

const clienteRepository = {

    criar: async (cliente, telefone, endereco) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            // Cliente
            const sqlCli = "INSERT INTO clientes(nome, cpf) VALUES (?,?)";
            const valuesCli = [cliente.nome, cliente.cpf];
            const [rowsCli] = await conn.execute(sqlCli, valuesCli);

            // Telefone
            const sqlTel = "INSERT INTO telefones(idCliente, Telefone) VALUES (?,?)";
            const valuesTel = [rowsCli.insertId, telefone.telefone];
            const [rowsTel] = await conn.execute(sqlTel, valuesTel);

            // Endereço
            const sqlEnd = `
            INSERT INTO enderecos(idCliente, complemento, bairro, cidade, uf, cep, numero, logradouro)
            VALUES (?,?,?,?,?,?,?,?)
            `;
            const valuesEnd = [
                rowsCli.insertId,
                endereco.complemento,
                endereco.bairro,
                endereco.cidade,
                endereco.uf,
                endereco.cep,
                endereco.numero,
                endereco.logradouro
            ];
            const [rowsEnd] = await conn.execute(sqlEnd, valuesEnd);

            await conn.commit(); 

            return { rowsCli, rowsTel, rowsEnd };

        } catch (error) {
            await conn.rollback();
            console.error("Erro ao criar cliente", error);
            throw error;
        } finally {
            conn.release();
        }
    },


    editar: async (id, dados) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            await connection.execute(
                'UPDATE clientes SET nome = ?, cpf = ? WHERE id = ?',
                [dados.nome, dados.cpf, id]
            );

            await conn.execute(
                `UPDATE enderecos 
                 SET Cep=?, Uf=?, Cidade=?, Bairro=?, Logradouro=?, Numero=?, Complemento=? 
                 WHERE IdCliente=?`,
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

            await conn.execute(
                'DELETE FROM telefones WHERE IdCliente = ?',
                [id]
            );

            if (dados.telefones && dados.telefones.length > 0) {
                for (const telefone of dados.telefones) {
                    await conn.execute(
                        `INSERT INTO telefones (IdCliente, Telefone) VALUES (?, ?)`,
                        [id, telefone]
                    );
                }
            }

            await conn.commit();
            conn.release();

            return { message: "Cliente atualizado com sucesso" };

        } catch (error) {
            await conn.rollback();
            conn.release();
            console.error("Erro ao editar cliente:", error);
            throw error;
        } finally{
            conn.release();
        }
    },

    deletar: async (id) => {
        const conn = await connection.getConnection();

        try {

            await conn.execute(
                'DELETE FROM clientes WHERE id = ?',
                [id]
            );

            await conn.commit();
            conn.release();

            return { message: "Cliente deletado com sucesso" };

        } catch (error) {
            await conn.rollback();
            conn.release();
            console.error("Erro ao deletar cliente:", error);
            throw error;
        }
    },

    selecionar: async () => {
    try {
        const [rows] = await connection.execute(`
            SELECT 
                c.id,
                c.nome,
                c.cpf,
                e.cep,
                e.uf,
                e.cidade,
                e.bairro,
                e.complemento,
                e.logradouro,
                e.numero,
                t.telefone
            FROM clientes c
            LEFT JOIN enderecos e ON e.idCliente = c.id
            LEFT JOIN telefones t ON t.idCliente = c.id
            ORDER BY c.id DESC
        `);

        return rows;

    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        throw error;
    }
}

}

export default clienteRepository;