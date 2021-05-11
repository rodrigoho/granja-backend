module.exports = {
  up: async (queryInterface) => {
    return queryInterface.removeConstraint(
      'cargo_packings',
      'cargo_packings_receipt_number_key'
    );
  },
};
