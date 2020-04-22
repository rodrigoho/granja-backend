module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('customers', 'icms_tax', {
      type: Sequelize.DECIMAL,
      allowNull: false,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('customers', 'icms_tax');
  },
};
