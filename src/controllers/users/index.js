const knex = require("../../connection");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
    const { username, senha: password } = req.body;

    if(!username) return res.status(404).json("O campo username é obrigatório.");
    if(!password) return res.status(404).json("É preciso informar a senha.");

    try {
        const usernameExists = await knex('usuarios').where({username}).first();

        if(usernameExists) return res.status(400).json("O username informado já existe.");

        const hash = await bcrypt.hash(password, 10);

        const user = await knex('usuarios').insert({
            username,
            senha: hash
        })

        if(!user) return res.status(400).json("Não foi possível cadastrar o usuário");

        return res.status(200).json("Usuário cadastrado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const getProfile = async (req, res) => {
    return res.status(200).json(req.user);
}

const updateProfile = async (req, res) => {
    const { nome, email, imagem, username, site, bio, telefone, genero } = req.body;
    let { senha } = req.body;
    const { id } = req.user;

    if(!nome && !email && !senha && !imagem && !username && !site && !bio && !telefone && !genero) {
        return res.status(404).json("É obrigatório informar pelo menos um campo a ser atualizado.");
    }

    try {
        if(senha) {
            senha = await bcrypt.hash(senha, 10);
        }

        if(email && email !== req.user.email) {
            const emailExists = await knex('usuarios').where({email}).first();
            if(emailExists) {
                return res.status(404).json("Esse email já está em uso.");
            }
        }

        if(username && username !== req.user.username) {
            const usernameExists = await knex('usuarios').where({username}).first();

            if(usernameExists) {
                return res.status(400).json("Esse usuário já está em uso.");
            }
        }

        const updateUser = await knex('usuarios').where({ id }).update({
            nome,
            email,
            senha, 
            imagem,
            username,
            site,
            bio,
            telefone,
            genero
        });

        if(!updateUser) return res.status(400).json("O usuário não foi atualizado.");

        return res.status(200).json("Usuário atualizado com sucesso.");
    } catch(error) {    
        return res.status(400).json(error.message);
    }
}

module.exports = { registerUser, getProfile, updateProfile }