const express = require('express');
const users = require('./controllers/users');
const { login } = require('./controllers/login');
const auth = require('./filters/Auth');

const routes = express();

routes.post('/cadastro', users.registerUser);
routes.post('/login', login);
routes.use(auth);
routes.get('/perfil', uusers.getProfile);
routes.get('/perfil', users.updateProfile);

module.exports = routes;