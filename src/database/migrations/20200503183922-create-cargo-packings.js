module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('cargo_packings', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      has_insurance_fee: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      eligible_for_analysis: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      egg_tray_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      egg_tray_price: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        defaultValue: 0,
      },
      egg_retail_box_amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      egg_retail_box_price: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        defaultValue: 0,
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
