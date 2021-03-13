import Sequelize, { Model } from 'sequelize';

class EggPrices extends Model {
  static init(sequelize) {
    super.init(
      {
        egg_id: Sequelize.INTEGER,
        cur_egg_price: Sequelize.DECIMAL,
        price_date: Sequelize.STRING,
        additional_fee: Sequelize.DECIMAL,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Egg, {
      foreignKey: 'egg_id',
      as: 'egg',
    });
  }
}

export default EggPrices;
