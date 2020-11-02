import Sequelize, { Model } from 'sequelize';

class CargoPacking extends Model {
  static init(sequelize) {
    super.init(
      {
        // cargo_packing_number: Sequelize.INTEGER,
        is_paid: Sequelize.BOOLEAN,
        due_to: Sequelize.DATE,
        has_insurance_fee: Sequelize.BOOLEAN,
        customer_id: Sequelize.INTEGER,
        intermediary_id: Sequelize.INTEGER,
        discount: Sequelize.INTEGER,
        rural_fund_tax: Sequelize.DECIMAL,
        icms_tax: Sequelize.DECIMAL,
        egg_tray_amount: Sequelize.INTEGER,
        egg_tray_price: Sequelize.DECIMAL,
        egg_retail_box_amount: Sequelize.INTEGER,
        egg_retail_box_price: Sequelize.DECIMAL,
        created_by_user_id: Sequelize.INTEGER,
        updated_by_user_id: Sequelize.INTEGER,
        receipt_number: Sequelize.INTEGER,
        eligible_for_analysis: Sequelize.BOOLEAN,
        receipt_value: Sequelize.DECIMAL,
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
    this.belongsTo(models.IntermediaryCustomer, {
      foreignKey: 'intermediary_id',
      as: 'intermediary',
    });
    this.belongsTo(models.User, {
      foreignKey: 'created_by_user_id',
      as: 'created_by_user',
    });
    this.belongsTo(models.User, {
      foreignKey: 'updated_by_user_id',
      as: 'updated_by_user',
    });
    this.hasMany(models.OrderItem, {
      foreignKey: 'cargo_packing_id',
      as: 'order_items',
    });
  }
}

export default CargoPacking;
