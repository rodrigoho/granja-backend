module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('cargo_packings', 'label_price', {
        type: Sequelize.DECIMAL,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.addColumn('cargo_packings', 'label_price'),
    ]);
  },
};
