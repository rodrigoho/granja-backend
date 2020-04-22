module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('customers', 'address_id', {
      type: Sequelize.INTEGER,
      references: { model: 'addresses', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('customers', 'address_id');
  },
};
