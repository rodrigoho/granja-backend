import Sequelize, { Model } from 'sequelize';

class AdditionalFee extends Model {
  static init(sequelize) {
    super.init(
      {
        current_fee_price: Sequelize.DECIMAL,
        online_fee: Sequelize.STRING,
        last_edited_by_user_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default AdditionalFee;
