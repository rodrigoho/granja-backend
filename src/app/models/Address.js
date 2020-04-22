import Sequelize, { Model } from 'sequelize';

class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        complement: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Address;
