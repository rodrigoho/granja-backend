import Sequelize, { Model } from 'sequelize';

class CargoPacking extends Model {
  static init(sequelize) {
    super.init(
      {
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        address: Sequelize.STRING,
        eggs_cargo: Sequelize.JSON,
        cargo_packing_number: Sequelize.INTEGER,
        customer_id: Sequelize.INTEGER,
        // icms_tax: Sequelize.DECIMAL,
        // icms_value: Sequelize.DECIMAL,
        // insurance_fee: Sequelize.DECIMAL,
        // name: Sequelize.STRING,
        // discount_price: Sequelize.INTEGER,
        // rural_fund_discount: Sequelize.DECIMAL,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer',
    });
  }
}

export default CargoPacking;
