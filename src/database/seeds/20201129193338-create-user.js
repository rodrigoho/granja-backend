module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('users', [
      {
        name: 'satie',
        email: 'satie@ovosikeda.com',
        password_hash:
          '$2a$08$0Hhq3BNsFu5gmy94jjwE1OCu7J0SgQoK7CioJEc.Ksh9BubDGsxX6',
        is_admin: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
