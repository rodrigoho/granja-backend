import Sequelize, { Model } from 'sequelize';

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        cnpj: Sequelize.STRING,
        phone: Sequelize.STRING,
        email: Sequelize.STRING,
        discount: Sequelize.DECIMAL,
        red_egg_tax: Sequelize.DECIMAL,
        rural_fund_tax: Sequelize.DECIMAL,
        intermediary_id: Sequelize.INTEGER,
        icms_tax: Sequelize.DECIMAL,
        zip_code: Sequelize.STRING,
        address: Sequelize.JSON,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Customer;
