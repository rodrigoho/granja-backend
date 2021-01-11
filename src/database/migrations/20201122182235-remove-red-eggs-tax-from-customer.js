module.exports = {
  up: async (queryInterface) => {
    return queryInterface.removeColumn('customers', 'red_egg_tax');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('customers', 'red_egg_tax', {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });
  },
};
