module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Cria uma tabela chamada users.
    */
    return queryInterface.createTable('users', {
      /*
        Aqui são definidas todas as colunas da tabela criada
       */
      id: {
        type: Sequelize.INTEGER,
        /*
          Não permite que o valor da coluna seja null
         */
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        /*
          O valor desta coluna dever único na tabela
         */
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provider: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  /*
    Caso ocorra um rollback, será excluida a tabela users.
   */
  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};
