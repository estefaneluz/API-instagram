const jwt = require('jsonwebtoken');
const knex = require("../../connection");
const passwordHash = require('../../passwordHash');

const auth = async (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) return res.status(401).json("Não autorizado.")

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, passwordHash);

        const exits = await knex('usuarios').where({id}).first();
        
        if(!exits) return res.status(404).json("Usuário não encontrado.");

        const { password, ...user } = exits;
        req.users = user;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = auth;