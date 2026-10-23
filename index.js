const express = require('express');
const pool = require('./db');
const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Bem-vindo!'});
});

app.get('/livros', async (req, res) => {
    try{
        const [rows] = await pool.query('select * from livros');
        res.json(rows);
    }catch(error){
        console.error(error);
    }
});

app.get('/livros/:id', async (req,res) => {
    try {
        const id = Number(req.params.id);

        if(isNaN(id)){
            return res.status(400).json({error: 'ID inválido'});
        }

        const [livros] = await pool.query('select * from livros where id = ?', [id]);
        if(livros.length === 0){
            return res.status(404).json({error: 'Livro não encontrado'});
        }

        res.json(livros[0]);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
}); 

app.post('/livros', async (req, res) => {
    try{
        const {titulo, descricao, dataPublicacao, quantidade, preco, editora_id} = req.body;

        if(!titulo || !dataPublicacao || quantidade === undefined || preco === undefined || editora_id === undefined){
            return res.status(400).json({error: 'Dados incompletos'});
        }

        const [resultado] = await pool.query('insert into livros (titulo, descricao, dataPublicacao, quantidade, preco, editora_id) values (?, ?, ?, ?, ?, ?)', [titulo, descricao, dataPublicacao, quantidade, preco, editora_id]);

        res.status(202).json({message: 'Livro criado com sucesso', id: resultado.insertId, titulo, descricao, dataPublicacao, quantidade, preco, editora_id});

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
});

app.put('/livros/:id', async (req, res) => {
    try{
        const id = Number(req.params.id);
        const {titulo, descricao, dataPublicacao, quantidade, preco, editora_id} = req.body;

        if(isNaN(Number(id))){
            return res.status(400).json({error: 'ID inválido'});
        }

        if(!titulo || !dataPublicacao || quantidade === undefined || preco === undefined || editora_id === undefined){
            return res.status(400).json({error: 'Dados incompletos'});
        }

        const [resultado] = await pool.query('update livros set titulo = ?, descricao = ?, dataPublicacao = ?, quantidade = ?, preco = ?, editora_id = ? where id = ?', [titulo, descricao, dataPublicacao, quantidade, preco, editora_id, id]);

        if(resultado.affectedRows === 0){
            return res.status(404).json({error: 'Livro nao econtrado'});
        }

        res.status(202).json({message: 'Livro atualizado com sucesso', id, titulo, descricao, dataPublicacao, quantidade, preco, editora_id});

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
});

app.delete('/livros/:id', async (req, res) => {
    try{
        const {id} = req.params;

        if(isNaN(Number(id))){
            return res.status(400).json({error: 'ID inválido'});
        }

        const [resultado] = await pool.query('delete from livros where id = ?', [id]);

         if(resultado.affectedRows === 0){
            return res.status(404).json({error: 'Livro nao econtrado'});
        }

        res.status(202).json({message: 'Livro eliminado com sucesso', id});
    } catch(error){
        console.error(error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
});

app.get('/editoras', async (req, res) => {
    try{
        const [rows2] = await pool.query('select * from editoras');
        res.json(rows2);
    }catch(error){
        console.error(error);
    }
});

app.get('/editoras/:id', async (req,res) => {
    try {
        const id2 = Number(req.params.id);

        if(isNaN(id2)){
            return res.status(400).json({error: 'ID inválido'});
        }

        const [editoras] = await pool.query('select * from editoras where id = ?', [id2]);
        if(editoras.length === 0){
            return res.status(404).json({error: 'Editora não encontrada'});
        }

        res.json(editoras[0]);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
}); 

app.post('/editoras', async (req, res) => {
    try{
        const {nome} = req.body;

        if(!nome){
            return res.status(400).json({error: 'Nome da editora é obrigatório'});
        }

        const [resultado2] = await pool.query('insert into editoras (nome) values (?)', [nome]);

        res.status(202).json({message: 'Editora criada com sucesso', id: resultado2.insertId, nome});

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
});

app.put('/editoras/:id', async (req, res) => {
    try{
        const id2 = Number(req.params.id);
        const {nome, estado} = req.body;

        if(isNaN(Number(id2))){
            return res.status(400).json({error: 'ID inválido'});
        }

        if(!nome){
            return res.status(400).json({error: 'Nome da editora é obrigatório'});
        }

        const [resultado2] = await pool.query('update editoras set nome = ?, estado = ? where id = ?', [nome, estado, id2]);

        if(resultado2.affectedRows === 0){
            return res.status(404).json({error: 'Editora não encontrada'});
        }

        res.status(202).json({message: 'Editora atualizada com sucesso', id: id2, nome, estado});

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
});

app.delete('/editoras/:id', async (req, res) => {
    try{
        const {id} = req.params;

        if(isNaN(Number(id))){
            return res.status(400).json({error: 'ID inválido'});
        }

        const [resultado] = await pool.query('delete from livros where id = ?', [id]);

         if(resultado.affectedRows === 0){
            return res.status(404).json({error: 'Livro nao econtrado'});
        }

        res.status(202).json({message: 'Livro eliminado com sucesso', id});
    } catch(error){
        console.error(error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
});

app.get('/editoras/:id/livros', async (req,res) => {
    try {
        const id2 = Number(req.params.id);

        if(isNaN(id2)){
            return res.status(400).json({error: 'ID inválido'});
        }

        const [editoras] = await pool.query('select editoras.nome, livros.id, livros.titulo from editoras inner join livros on editoras.id = livros.editora_id where editoras.id = ?', [id2]);
        if(editoras.length === 0){
            return res.status(404).json({error: 'Livros da editora nao encontrados'});
        }

        res.json(editoras[0]);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
}); 

app.get('/livros/estado/:estado', async (req,res) => {
    try {
        const estado = req.params.estado;

        if(estado != 'ativo'  && estado != 'inativo'){
            return res.status(400).json({error: 'Estado inválido'});
        }

        const [editoras] = await pool.query('select editoras.nome, editoras.estado, livros.id, livros.titulo, livros.descricao, livros.dataPublicacao, livros.quantidade, livros.preco from editoras inner join livros on editoras.id = livros.editora_id where editoras.estado = ?', [estado]);
        if(editoras.length === 0){
            return res.status(404).json({error: 'Livros da editoras com o estado indicado nao encontrados'});
        }

        res.json(editoras[0]);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
}); 

app.get('/editoras/com-livros', async (req,res) => {
    try {
        const [editoras] = await pool.query('select editoras.nome, livros.id, livros.quantidade from editoras inner join livros on editoras.id = livros.editora_id where livros.quantidade >= 0');
        if(editoras.length === 0){
            return res.status(404).json({error: 'Editoras com o numero de livros acossiados nao encontradas'});
        }

        res.json(editoras[0]);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Erro interno do servidor'});
    }
}); 

app.use((req, res) => {
    res.status(404).json({error: 'Endpoint nao encontrado'});
});

app.listen(PORT, () => {
    console.log(`Servidor a correr na porta http://localhost:${PORT}`);
});
