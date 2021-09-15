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

const like = async (req, res) => {
    const { id } = req.user;
    const { postagemId } = req.params;

    try {
        const post = await knex('postagens').where({id: postagemId}).first();

        if(!post) return res.status(404).json("Postagem não encontrada.");

        const likedVerify = await knex('postagem_curtidas')
        .where({usuario_id: id, postagem_id: postagemId})
        .first();

        if(likedVerify) return res.status(400).json("O usuário já curtiu essa postagem.");

        const like = await knex('postagem_curtidas')
        .insert({
            usuario_id: id,
            postagem_id: postagemId
        })

        if(!like) return res.status(404).json("Não foi possível curtir essa postagem.");

        return res.status(200).json("Postagem curtida com sucesso.");
    } catch(error) {
        return res.status(400).json(error.message);
    }
}

const addComment = async (req, res) => {
    const { id } = req.user;
    const { postagemId } = req.params;
    const { texto } = req.body;

    if(!texto) return res.status(400).json("O comentário não pode ser vazio.");

    try {
        const post = await knex('postagens').where({id: postagemId}).first();

        if(!post) return res.status(404).json("Postagem não encontrada.");

        const comment = await knex('postagem_comentarios')
        .insert({
            usuario_id: id,
            postagem_id: postagemId,
            texto
        });

        if(!comment) return res.status(404).json("Não foi possível comentar nessa postagem.");

        return res.status(200).json("Comentário enviado com sucesso.");
    } catch(error) {
        return res.status(400).json(error.message);
    }
}

const feed = async (req, res) => {
    const { id } = req.user;
    const { offset } = req.query;

    const o = offset ? offset : 0;

    try {
        const posts = await knex('postagens')
        .where('usuario_id', '!=', id)
        .limit(10).offset(o);

        if(posts.length === 0) return res.status(200).json(posts);

        for(const post of posts) {
            const user = await knex('usuarios')
                .where({id: post.usuario_id})
                .select('imagem', 'username', 'verificado').first();
            post.user = user;

            const photos = await knex('postagem_fotos')
                .where({postagem_id: post.id})
                .select('imagem');
            post.photos = photos;

            const likes = await knex('postagem_curtidas')
                .where({postagem_id: post.id})
                .select('usuario_id');
            post.likes = likes.length;

            post.likedByMe = likes.find(like => like.usuario_id === id) ? true : false;

            const comments = await knex('postagem_comentarios')
                .leftJoin('usuarios', 'usuarios.id', 'postagem_comentarios.usuario_id')
                .where({postagem_id: post.id})
                .select('usuarios.username', 'postagem_comentarios.texto');
            post.comments = comments;
        }

        return res.status(200).json(posts);
    } catch(error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { createPost, like, addComment, feed }