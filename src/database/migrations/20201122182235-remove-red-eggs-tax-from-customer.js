module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('customers', 'red_egg_tax');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('customers', 'red_egg_tax', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
