# Mini Insta API

## O que o usuário pode fazer

- Fazer login
- Fazer cadastro
- Obter dados do perfil
- Editar perfil
- Ver postagens de outras pessoas
- Curtir postagens
- Ver quantidade de curtidas em uma postagem
- Ver os comentários de uma postagem

## O que o usuário não pode fazer

- Descurtir uma postagem
- Ver a localização de uma postage
- Curtir umm comentário
- Responder outros comentários

## Endpoints 

### POST - Login

### Dados enviados
- username
- senha

### Dados retornados
- sucesso / erro
- token

### POST - Cadastro

### Dados enviados
- username
- senha

### Dados retornados
- sucesso / erro

### GET - Perfil 

### Dados enviados 
- token 

### Dados retornados
- nome, email, username, imagem, site, bio, telefone, genero

### PUT - Perfil

### Dados enviados
- token
- opcional: 
    - nome, email, username, imagem, site, bio, telefone, genero

### Dados Retornados
- sucesso / erro

### POST - Postagem

### Dados enviados
- token
- texto
- fotos

### Dados Retornados
- sucesso / erro

### Post - Curtir postagem 

### Dados enviados
- token
- id da postagem

### Dados Retornados
- sucesso / erro

### POST - Comentar 

### Dados enviados
- token
- id da postagem
- texto

### Dados Retornados
- sucesso / erro

### GET - Feed

### Dados enviados
- offset

### Dados Retornados
- postagens de outros usuarios