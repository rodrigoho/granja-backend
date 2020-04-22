module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('cargo_packings', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      cargo_packing_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      eggs_cargo: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      eggs_cargo_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      // icms_tax: {
      //   type: Sequelize.DECIMAL,
      //   allowNull: false,
      // },
      // icms_value: {
      //   type: Sequelize.DECIMAL,
      //   allowNull: false,
      // },
      // insurance_fee: {
      //   type: Sequelize.DECIMAL,
      //   allowNull: false,
      // },
      // name: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      // },
      // discount_price: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      // },
      // rural_fund_discount: {
      //   type: Sequelize.DECIMAL,
      //   allowNull: false,
      // },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),
  down: (queryInterface) => queryInterface.dropTable('cargo_packings'),
};
