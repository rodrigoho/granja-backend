module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('eggs', [
      {
        id: 1,
        color: 'Branco',
        size: 'Jumbo',
        price: 100.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        color: 'Branco',
        size: 'Extra',
        price: 90.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        color: 'Branco',
        size: 'Grande',
        price: 80.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        color: 'Branco',
        size: 'Médio',
        price: 70.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        color: 'Branco',
        size: 'Pequeno',
        price: 60.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        color: 'Branco',
        size: 'Industrial',
        price: 50.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        color: 'Vermelho',
        size: 'Jumbo',
        price: 110.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        color: 'Vermelho',
        size: 'Extra',
        price: 100.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
        color: 'Vermelho',
        size: 'Grande',
        price: 90.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        color: 'Vermelho',
        size: 'Médio',
        price: 80.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 11,
        color: 'Vermelho',
        size: 'Pequeno',
        price: 70.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 12,
        color: 'Vermelho',
        size: 'Industrial',
        price: 60.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('eggs', null, {});
  },
};