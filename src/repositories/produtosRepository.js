import { connection } from "../config/Database.js";

const produtosRepository = {
    criar:async (dados) => {
        const sql = 'INSERT INTO Produtos (idCategoria, Nome, Valor, vinculoImagem) VALUES (?, ?, ?, ?)'
        const values = [dados.idCategoria, dados.nome, dados.valor, dados.vinculoImagem];
        const [rows] = await connection.execute(sql, values);
        return rows
    },
    editar:async (dados) => {
        const sql = 'UPDATE Produtos SET idCategoria=?, Nome=?, Valor=?, vinculoImagem=? WHERE idProduto = ?;'
        const values = [dados.idCategoria, dados.nome, dados.valor, dados.vinculoImagem, dados.idProduto];
        const [rows] = await connection.execute(sql, values);
        return rows
    },
    deletar:async (id) => {
        const sql = 'DELETE FROM Produtos WHERE idProduto = ?;'
        const values = [id];
        const [rows] = await connection.execute(sql, values);
        return rows
    },
    selecionar:async () => {
        const sql = 'SELECT * FROM Produtos;'
        const [rows] = await connection.execute(sql);
        return rows
    }
}

export default produtosRepository