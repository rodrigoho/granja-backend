module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('additional_fees', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      current_fee_price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      online_fee: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      min_fee: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      max_fee: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      last_edited_by_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
  down: (queryInterface) => queryInterface.dropTable('additional_fees'),
};
