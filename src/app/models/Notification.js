import Sequelize, { Model } from 'sequelize';

class Notifications extends Model {
  static init(sequelize) {
    super.init(
      {
        cargo_packing_id: Sequelize.INTEGER,
        customer_id: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
        message: Sequelize.STRING,
        users_to_notify: Sequelize.ARRAY(Sequelize.INTEGER),
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
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    this.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
    });
  }
}

export default Notifications;
