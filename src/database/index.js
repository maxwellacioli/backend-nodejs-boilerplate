import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import User from '../app/models/User';
import databaseConfig from '../config/database';

/*
  Array com todos os models da aplicação
 */
const models = [User];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  /*
    Inicializa a conexão com o banco de dados
   */
  init() {
    this.connection = new Sequelize(databaseConfig);

    /*
      Para cada model indica qual é a conexão com o banco
     */
    models
      .map(model => model.init(this.connection))
      /*
        caso exista um método chamado associate, este deve conter
        todos os models da aplicação para fazer as respectivas relações
        entre entidades
       */
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
