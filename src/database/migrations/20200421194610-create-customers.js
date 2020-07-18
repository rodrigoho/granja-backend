module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('customers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cnpj: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      discount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      is_enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      red_egg_tax: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      rural_fund_tax: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      icms_tax: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      zip_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.JSON,
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
  down: (queryInterface) => queryInterface.dropTable('customers'),
};
