module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('egg_prices', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      egg_id: {
        type: Sequelize.INTEGER,
        references: { model: 'eggs', key: 'id' },
        onDelete: 'SET NULL',
        allowNull: true,
      },
      cur_egg_price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      price_date: {
        type: Sequelize.STRING,
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
    }),
  down: (queryInterface) => queryInterface.dropTable('egg_prices'),
};
