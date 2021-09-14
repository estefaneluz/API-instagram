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

}

const updateProfile = async (req, res) => {

}

module.exports = { registerUser, getProfile, updateProfile }