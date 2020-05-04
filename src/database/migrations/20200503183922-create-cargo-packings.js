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
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
      },
      cargo_packing_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      due_to: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      insurance_fee: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      updated_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: { model: 'customers', key: 'id' },
        onDelete: 'SET NULL',
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
  down: (queryInterface) => queryInterface.dropTable('cargo_packings'),
};
