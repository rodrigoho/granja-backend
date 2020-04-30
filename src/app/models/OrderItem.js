import Sequelize, { Model } from 'sequelize';

class OrderItem extends Model {
  static init(sequelize) {
    super.init(
      {
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        address: Sequelize.STRING,
        eggs_cargo: Sequelize.JSON,
        cargo_packing_id: Sequelize.INTEGER,
        customer_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'customer_id', as: 'customer' });
    this.belongsTo(models.User, {
      foreignKey: 'cargo_packing_id',
      as: 'cargo_packing',
    });
  }
}

export default OrderItem;
