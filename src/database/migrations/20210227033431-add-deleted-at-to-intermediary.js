module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('intermediary_customers', 'deleted_at', {
      type: Sequelize.DATE,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('intermediary_customers', 'deleted_at');
  },
};
