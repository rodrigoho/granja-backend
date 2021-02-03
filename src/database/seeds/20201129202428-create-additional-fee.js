module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('additional_fees', [
      {
        current_fee_price: '10',
        online_fee: 'R$ 10 a R$ 20',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('additional_fees', null, {});
  },
};
