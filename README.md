# Movies Application

Esta é uma aplicação para gerenciar filmes e produtores, incluindo a relação entre eles.

## Instalação

1. Clone o repositório:

   ```sh
   git clone https://github.com/simeialves/movies-application

   ```

2. Instale as dependências:

   ```sh
   npm install

   ```

3. Execução da aplicação:

   ```sh
   npm run server

   ```

4. Execução dos testes de aplicação:

   ```sh
   npm test

   ```

## Estrutura de Diretórios

- **`config/`**: Contém a configuração do banco de dados.
- **`controllers/`**: Contém os controladores para filmes, produtores e relações entre eles.
- **`includes/`**: Contém constantes e mensagens utilizadas na aplicação.
- **`routes/`**: Contém as rotas da API.
- **`src/data/`**: Contém os arquivos de dados para popular o banco de dados temporário.
- **`tests/`**: Contém os testes de integração.

## Endpoints da API

### Movies

- **`POST /api/movies`**  
  Cria um novo filme.
- **`GET /api/movies`**  
  Retorna uma lista de todos os filmes.
- **`GET /api/movies/:id`**  
  Retorna um filme pelo id.
- **`PUT /api/movies/:id`**  
  Atualiza um filme pelo id.
- **`DEL /api/movies/:id`**  
  Apaga um filme pelo id.

### Producers

- **`POST /api/producers`**  
  Cria um novo produtor.
- **`GET /api/producers`**  
  Retorna uma lista de todos os produtores.
- **`GET /api/producers/:id`**  
  Retorna um produtor pelo id.
- **`GET /api/producers/intervals`**  
  Retorna os produtores vencedores com o menor e maior intervalo de tempo na categoria "Pior Filme do Golden Raspberry Awards".
- **`PUT /api/producers/:id`**  
  Atualiza um produtor pelo id.
- **`DEL /api/producers/:id`**  
  Apaga um produtor pelo id.

### Movies-Producers

- **`POST /api/movies-producers`**  
  Cria uma nova relação entre filme e produtor.
- **`GET /api/movies-producers`**  
  Retorna todas as relações entre filmes e produtores.
- **`GET /api/movies-producers/:id`**  
  Retorna uma relação entre filme e produtor pelo id.
- **`PUT /api/movies-producers/:id`**  
  Atualiza uma relação entre filme e produtor pelo id.
- **`DEL /api/movies-producers/:id`**  
  Apaga uma relação entre filme e produtor pelo id.
