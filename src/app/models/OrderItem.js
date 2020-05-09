import Sequelize, { Model } from 'sequelize';

class OrderItem extends Model {
  static init(sequelize) {
    super.init(
      {
        amount: Sequelize.INTEGER,
        cur_egg_price: Sequelize.DECIMAL,
        cargo_packing_id: Sequelize.INTEGER,
        egg_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.CargoPacking, {
      foreignKey: 'cargo_packing_id',
      as: 'cargo_packing',
    });
    this.belongsTo(models.Egg, {
      foreignKey: 'egg_id',
      as: 'egg_details',
    });
  }
}

export default OrderItem;
