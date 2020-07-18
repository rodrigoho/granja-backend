module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('customers', 'additional_fee', {
      type: Sequelize.DECIMAL,
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('customers', 'additional_fee');
  },
};
