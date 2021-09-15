const express = require('express');
const users = require('./controllers/users');
const { login } = require('./controllers/login');
const auth = require('./filters/Auth');
const posts = require('./controllers/posts');

const routes = express();

routes.post('/cadastro', users.registerUser);
routes.post('/login', login);
routes.use(auth);
routes.get('/perfil', users.getProfile);
routes.put('/perfil', users.updateProfile);
routes.post('/postagens', posts.createPost);

module.exports = routes;