module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cargo_packings', 'custom_date', {
      type: Sequelize.STRING,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('cargo_packings', 'custom_date');
  },
};
