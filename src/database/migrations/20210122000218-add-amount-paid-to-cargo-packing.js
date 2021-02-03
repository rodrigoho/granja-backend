module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cargo_packings', 'paid_amount', {
      type: Sequelize.DECIMAL,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('cargo_packings', 'paid_amount');
  },
};
