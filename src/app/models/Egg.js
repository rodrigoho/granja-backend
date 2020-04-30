import Sequelize, { Model } from 'sequelize';

class Egg extends Model {
  static init(sequelize) {
    super.init(
      {
        color: Sequelize.STRING,
        size: Sequelize.STRING,
        price: Sequelize.DECIMAL,
        last_edited_by: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Egg;
