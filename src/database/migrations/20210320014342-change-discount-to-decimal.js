module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('cargo_packings', 'discount', {
        type: Sequelize.DECIMAL,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.changeColumn('cargo_packings', 'discount'),
    ]);
  },
};
