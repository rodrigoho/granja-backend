import Sequelize, { Model } from 'sequelize';

class EggPrice extends Model {
  static init(sequelize) {
    super.init(
      {
        egg_id_price: Sequelize.INTEGER,
        price: Sequelize.DECIMAL,
        last_edited_by_user_id: Sequelize.INTEGER,
        price_date: Sequelize.DATEONLY,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'last_edited_by_user_id',
      as: 'user_id',
    });
    this.belongsTo(models.Egg, {
      foreignKey: 'egg_id_price',
      as: 'egg',
    });
  }
}

export default EggPrice;
