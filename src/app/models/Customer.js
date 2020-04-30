import Sequelize, { Model } from 'sequelize';

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        cnpj: Sequelize.STRING,
        phone: Sequelize.STRING,
        email: Sequelize.STRING,
        discount: Sequelize.INTEGER,
        has_fundo_rural: Sequelize.BOOLEAN,
        icms_tax: Sequelize.DECIMAL,
        zip_code: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Customer;
