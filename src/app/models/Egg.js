import Sequelize, { Model } from 'sequelize';

class Egg extends Model {
  static init(sequelize) {
    super.init(
      {
        color: Sequelize.STRING,
        size: Sequelize.STRING,
        price: Sequelize.DECIMAL,
        // last_edited_by_user_id: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // static associate(models) {
  //   this.hasMany(models.EggPrice, {
  //     foreignKey: 'egg_id_price',
  //     as: 'egg',
  //   });
  // }
}

export default Egg;
