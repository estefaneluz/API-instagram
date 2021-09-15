const knex = require('../../connection');

const createPost = async (req, res) => {
    const { id } = req.user;
    const { texto, fotos } = req.body;

    if(!fotos || !fotos.length === 0) 
        return res.status(404).json("Você precisa informar ao menos uma foto.");

    try {
        const post = await knex('postagens').insert({
            usuario_id: id,
            texto,
        }).returning('*');

        if(!post) return res.status(400).json("Não foi possível concluir a postagem.");

        for(const foto of fotos){
            foto.postagem_id = post[0].id; 
        }

        const registeredPhotos = await knex('postagem_fotos').insert(fotos);

        if(!registeredPhotos) {
            await knex('postagens').where({id: post[0].id}).del();
            return res.status(400).json("Nao foi possível concluir a postagem.");
        }

        return res.status(200).json("Postagem realizada com sucesso.");
    } catch(error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { createPost }