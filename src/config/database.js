require('dotenv/config');

/*
  Contém todas as informações para a aplicação se conectar ao banco de dados.
  A porta definida é 5433, porque ao criarmos um container no docker, foi
  definido que a porta do banco seria 5433 no SO acima, e que ao fazer a conexão
  será feito um redirecionamento para a porta 5432 no container.
*/
module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    // TODO cria duas colunas em cada tabela (created_at e updated_at) no banco
    timestamps: true,
    /*
      toda vez que uma variável for, por exemplo, userId, ao criar
      a tabela será substituida a conversão camelcase por um underscore
      e a variável se tornará user_id.
     */
    underscored: true,
    underscoredAll: true,
  },
};
