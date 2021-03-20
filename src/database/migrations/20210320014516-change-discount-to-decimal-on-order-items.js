module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('order_items', 'discount', {
        type: Sequelize.DECIMAL,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.changeColumn('order_items', 'discount'),
    ]);
  },
};
