module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('cargo_packings', 'intermediary_id', {
      type: Sequelize.INTEGER,
      references: { model: 'intermediary_customers', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('cargo_packings', 'intermediary_id');
  },
};
