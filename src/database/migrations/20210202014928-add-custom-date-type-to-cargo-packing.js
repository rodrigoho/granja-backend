module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cargo_packings', 'custom_date_timestamp', {
      type: Sequelize.DATE,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn(
      'cargo_packings',
      'custom_date_timestamp'
    );
  },
};
