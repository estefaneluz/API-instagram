const knex = require('../../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordHash = require('../../passwordHash');

const login = async (req, res) => {
    const {username, senha} = req.body;
    if(!username || !senha) 
        return res.status(404).json("É obrigatório informar o username e a senha.");
    
    try {
        const user = await knex('usuarios').where({username}).first();
        if(!user) return res.status(404).json("Usuário não encontrado.");

        const correctPassword = await bcrypt.compare(senha, user.senha);
        if(!correctPassword) return res.status(400).json("Usuário ou senha não confere.");

        const tokenUser = {
            id: user.id,
            username: user.username
        }

        const token = jwt.sign(tokenUser, passwordHash, { expiresIn: '8h' });
        const { senha: _, ...userData } = user; 

        return res.status(200).json({
            usuario: userData,
            token
        })
    } catch(error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { login }