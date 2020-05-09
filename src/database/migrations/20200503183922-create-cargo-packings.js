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
      is_paid: {
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
      eligible_for_analysis: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      receipt_value: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      receipt_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_by_user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      updated_by_user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
