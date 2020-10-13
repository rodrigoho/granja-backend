import Sequelize, { Model } from 'sequelize';

class IntermediaryCustomer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        phone: Sequelize.STRING,
        email: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Customer, {
      foreignKey: 'intermediary_id',
      as: 'customers',
    });
  }
}

export default IntermediaryCustomer;
