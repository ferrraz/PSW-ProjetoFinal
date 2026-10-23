const mysql = require('mysql2/promise');

async function setupDatabase(){
    let connection;

    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        console.log('Conexão feita.');

        await connection.query('create database if not exists Livraria');
        console.log('Base de dados feita.');

        await connection.query('use Livraria');

        await connection.query(`
            create table if not exists editoras (
                id int auto_increment primary key,
                nome varchar(255) not null,
                estado enum('ativo', 'inativo') not null default 'ativo'
            )
        `);
        console.log('Tabela editoras criada.');

        await connection.query(`
            create table if not exists livros (
                id int auto_increment primary key,
                titulo varchar(255) not null,
                descricao text,
                dataPublicacao date,
                quantidade int,
                preco decimal(10,2),
                editora_id int,
                foreign key (editora_id) references editoras(id)
            )
        `);
        console.log('Tabela livros criada.');

        const [rows] = await connection.query('select count(*) as total from livros');
        console.log(`Total de livros na tabela: ${rows[0].total}`);

        if(rows[0].total === 0){
            await connection.query(`
                insert into livros (titulo, descricao, dataPublicacao, quantidade, preco, editora_id) values
                    ('Livro 1', 'Descrição 1', '2023-06-11', 10, 19.99, 1),
                    ('Livro 2', 'Descrição 2', '2023-06-10', 5, 29.99, 2),
                    ('Livro 3', 'Descrição 3', '2023-06-09', 20, 39.99, 1)
            `);
            console.log('Livros de exemplo inseridos.');
        }

        const [rows2] = await connection.query('select count(*) as total from editoras');
        console.log(`Total de editoras na tabela: ${rows2[0].total}`);

        if(rows2[0].total === 0){
            await connection.query(`
                insert into editoras (nome) values
                    ('Editora 1'),
                    ('Editora 2')
            `);
            console.log('Editoras de exemplo inseridas.');
        }

    } catch(error){
        console.error(error);
    }finally{
        if(connection){
            await connection.end();
            console.log('Conexão ao MySQL encerrada.');
        }
    }
}

setupDatabase(); 