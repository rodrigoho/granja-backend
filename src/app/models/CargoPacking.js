import Sequelize, { Model } from 'sequelize';

class CargoPacking extends Model {
  static init(sequelize) {
    super.init(
      {
        cargo_packing_number: Sequelize.INTEGER,
        cargo_packing_status: Sequelize.BOOLEAN,
        due_to: Sequelize.DATE,
        customer_id: Sequelize.INTEGER,
        created_by: Sequelize.STRING,
        updated_by: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
    });
  }
}

export default CargoPacking;
