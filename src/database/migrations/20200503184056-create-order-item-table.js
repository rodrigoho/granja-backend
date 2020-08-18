module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      cargo_packing_id: {
        type: Sequelize.INTEGER,
        references: { model: 'cargo_packings', key: 'id' },
        onDelete: 'SET NULL',
        allowNull: true,
      },
      egg_id: {
        type: Sequelize.INTEGER,
        references: { model: 'eggs', key: 'id' },
        onDelete: 'SET NULL',
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cur_egg_price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      discount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
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
  down: (queryInterface) => queryInterface.dropTable('order_items'),
};
