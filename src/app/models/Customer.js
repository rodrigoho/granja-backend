import Sequelize, { Model } from 'sequelize';

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        discount: Sequelize.INTEGER,
        cnpj: Sequelize.STRING,
        phone: Sequelize.STRING,
        icms_tax: Sequelize.DECIMAL,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Address, {
      foreignKey: 'address_id',
      as: 'customer',
    });
  }
}

export default Customer;
