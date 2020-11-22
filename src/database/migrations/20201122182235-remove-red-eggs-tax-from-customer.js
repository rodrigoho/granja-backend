module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('customers', 'red_egg_tax');
  },
};
