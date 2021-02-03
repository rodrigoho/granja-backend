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
        paranoid: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.CargoPacking, {
      foreignKey: 'intermediary_id',
      as: 'intermediary',
    });
  }
}

export default IntermediaryCustomer;
