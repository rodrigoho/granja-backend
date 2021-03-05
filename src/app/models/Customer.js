import Sequelize, { Model } from 'sequelize';

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        fantasy_name: Sequelize.STRING,
        cnpj: Sequelize.STRING,
        phone: Sequelize.STRING,
        email: Sequelize.STRING,
        discount: Sequelize.DECIMAL,
        rural_fund_tax: Sequelize.DECIMAL,
        icms_tax: Sequelize.DECIMAL,
        zip_code: Sequelize.STRING,
        address: Sequelize.JSON,
      },
      {
        sequelize,
        paranoid: true,
      }
    );

    return this;
  }
}

export default Customer;
