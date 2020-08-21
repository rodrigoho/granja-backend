module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('customers', 'intermediary_id', {
      type: Sequelize.INTEGER,
      references: { model: 'intermediary_customers', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('customers', 'intermediary_id');
  },
};
