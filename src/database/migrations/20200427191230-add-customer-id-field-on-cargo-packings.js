module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cargo_packings', 'customer_id', {
      type: Sequelize.INTEGER,
      references: { model: 'customers', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('cargo_packings', 'customer_id');
  },
};
